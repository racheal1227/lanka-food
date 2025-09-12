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
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import * as React from 'react'

import { ProductAttribute } from '@/types/database.models'
import { Button } from '@ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@ui/dialog'
import { Input } from '@ui/input'

interface AttributeWithId extends ProductAttribute {
  id: string
}

interface SortableRowProps {
  row: AttributeWithId
  onChange: (row: AttributeWithId) => void
  onRemove: (id: string) => void
  errors?: { key?: string; value?: string }
}

function SortableRow({ row, onChange, onRemove, errors }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-1 py-2">
      <div className="flex items-center gap-2">
        <button type="button" className="cursor-grab text-muted-foreground" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-2 flex-1">
          <div className="w-36">
            <Input
              value={row.key}
              placeholder="항목 이름"
              onChange={(e) => onChange({ ...row, key: e.target.value })}
              className={errors?.key ? 'border-red-500' : ''}
            />
            {errors?.key ? <div className="text-red-500 text-xs mt-1">{errors.key}</div> : null}
          </div>
          <div className="flex-1">
            <Input
              value={row.value}
              placeholder="항목 값"
              onChange={(e) => onChange({ ...row, value: e.target.value })}
              className={errors?.value ? 'border-red-500' : ''}
            />
            {errors?.value ? <div className="text-red-500 text-xs mt-1">{errors.value}</div> : null}
          </div>
          <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface AttributeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: Array<AttributeWithId | ProductAttribute>
  onConfirm: (rows: ProductAttribute[]) => void
}

export default function AttributeDialog({ open, onOpenChange, value, onConfirm }: AttributeDialogProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const [draft, setDraft] = React.useState<AttributeWithId[]>([])
  const [errors, setErrors] = React.useState<Record<string, { key?: string; value?: string }>>({})
  const [generalError, setGeneralError] = React.useState<string>('')

  React.useEffect(() => {
    if (open) {
      const withIds: AttributeWithId[] = value.map((row, index) => ({
        id:
          (row as AttributeWithId).id ||
          (typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `attr-${Date.now()}-${index}`),
        key: row.key,
        value: row.value,
        order: typeof row.order === 'number' ? row.order : index,
      }))
      setDraft(withIds)
      setErrors({})
      setGeneralError('')
    }
  }, [open, value])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = draft.findIndex((row) => row.id === String(active.id))
    const newIndex = draft.findIndex((row) => row.id === String(over.id))
    const ordered = arrayMove(draft, oldIndex, newIndex).map((row, index) => ({ ...row, order: index }))
    setDraft(ordered)
  }

  const addRow = () => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `attr-${Date.now()}`
    const next = [...draft, { id, key: '', value: '', order: draft.length }]
    setDraft(next)
  }

  const updateRow = (row: AttributeWithId) => {
    const next = draft.map((draftRow) => (draftRow.id === row.id ? row : draftRow))
    setDraft(next)
    // clear field errors on change
    setErrors((prev) => ({
      ...prev,
      [row.id]: {
        key: row.key.trim() ? undefined : prev[row.id]?.key,
        value: row.value.trim() ? undefined : prev[row.id]?.value,
      },
    }))
  }

  const removeRow = (id: string) => {
    const next = draft.filter((row) => row.id !== id).map((row, index) => ({ ...row, order: index }))
    setDraft(next)
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  const validate = () => {
    if (draft.length === 0) {
      setGeneralError('최소 1개 이상의 상세 속성을 추가하세요.')
      return false
    }
    setGeneralError('')
    const newErrors: Record<string, { key?: string; value?: string }> = {}
    draft.forEach((row) => {
      const e: { key?: string; value?: string } = {}
      if (!row.key.trim()) {
        e.key = '항목을 입력하세요.'
      }
      if (!row.value.trim()) {
        e.value = '값을 입력하세요.'
      }
      if (e.key || e.value) {
        newErrors[row.id] = e
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>상세 속성 설정</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">항목을 추가하고 드래그로 순서를 변경하세요.</div>
            <Button type="button" variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-1" /> 항목 추가
            </Button>
          </div>
          {generalError ? <div className="text-red-500 text-sm">{generalError}</div> : null}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draft.map((row) => row.id)} strategy={verticalListSortingStrategy}>
              <div className="max-h-[50vh] overflow-auto pr-1">
                {draft.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-6 text-center">
                    항목이 없습니다. 항목 추가를 눌러주세요.
                  </div>
                ) : (
                  draft.map((row) => (
                    <SortableRow
                      key={row.id}
                      row={row}
                      onChange={updateRow}
                      onRemove={removeRow}
                      errors={errors[row.id]}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!validate()) return
                onConfirm(draft.map((row, index) => ({ key: row.key.trim(), value: row.value.trim(), order: index })))
                onOpenChange(false)
              }}
            >
              확인
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
