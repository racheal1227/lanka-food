'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Edit, Trash2 } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Category } from '@/types/database.models'

interface SortableCategoryItemProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

function SortableCategoryItem({ category, onEdit, onDelete }: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between rounded-md border p-3 mb-2">
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{category.name}</span>
          {!category.is_active && (
            <Badge variant="outline" className="mt-1">
              비활성화
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(category)} title="수정">
          <Edit className="h-4 w-4" />
          <span className="sr-only">수정</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)} title="삭제" className="text-red-600">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">삭제</span>
        </Button>
      </div>
    </div>
  )
}

interface SortableCategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  onReorder: (categories: Category[]) => void
}

export function SortableCategoryList({ categories, onEdit, onDelete, onReorder }: SortableCategoryListProps) {
  const [items, setItems] = useState(categories)

  // categories prop이 변경될 때마다 내부 상태 업데이트
  useEffect(() => {
    setItems(categories)
  }, [categories])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id)
          const newIndex = items.findIndex((item) => item.id === over.id)

          const newItems = arrayMove(items, oldIndex, newIndex)

          // 변경된 순서 정보를 부모 컴포넌트로 전달
          onReorder(
            newItems.map((item, index) => ({
              ...item,
              sort_order: index + 1,
            })),
          )

          return newItems
        })
      }
    },
    [onReorder],
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div>
          {items.map((category) => (
            <SortableCategoryItem key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
