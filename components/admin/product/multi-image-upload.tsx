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
import { ImagePlus, X, GripVertical } from 'lucide-react'
import { useState, useEffect } from 'react'

import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'

// CldUploadWidget 결과 타입 정의
interface CldUploadWidgetResults {
  info: {
    secure_url: string
    [key: string]: any
  }
  [key: string]: any
}

// 정렬 가능한 이미지 아이템 컴포넌트
interface SortableImageItemProps {
  id: string
  url: string
  onRemove: (url: string) => void
}

function SortableImageItem({ id, url, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative flex items-center border rounded-md p-2 mb-2 bg-background">
      <button
        type="button"
        className="cursor-grab mr-2 text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="relative h-16 w-16 overflow-hidden rounded-md mr-3">
        <Image src={url} alt="Product detail image" className="object-cover" fill sizes="64px" />
      </div>
      <div className="flex-1 truncate text-sm">{url.split('/').pop()}</div>
      <button
        onClick={() => onRemove(url)}
        className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-white shadow-sm"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface MultiImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxFiles?: number
  placeholder?: string
}

export default function MultiImageUpload({
  value,
  onChange,
  maxFiles = 10,
  placeholder = '이미지 추가하기',
}: MultiImageUploadProps) {
  // 내부 상태로 이미지 배열 관리
  const [images, setImages] = useState<string[]>(value || [])
  const [isMounted, setIsMounted] = useState(false)

  // 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // hydration 이슈 방지
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 부모 컴포넌트에서 전달된 value가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setImages(value || [])
  }, [value])

  // 드래그 종료 시 호출되는 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((url) => url === active.id)
      const newIndex = images.findIndex((url) => url === over.id)

      const newOrder = arrayMove(images, oldIndex, newIndex)
      setImages(newOrder)
      onChange(newOrder)
    }
  }

  // 이미지 추가 핸들러
  const handleAddImage = (url: string) => {
    const newImages = [...images, url]
    setImages(newImages)
    onChange(newImages)
  }

  // 이미지 제거 핸들러
  const handleRemoveImage = (url: string) => {
    const newImages = images.filter((img) => img !== url)
    setImages(newImages)
    onChange(newImages)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images} strategy={verticalListSortingStrategy}>
          {images.length > 0 && (
            <div className="mb-4">
              {images.map((url) => (
                <SortableImageItem key={url} id={url} url={url} onRemove={handleRemoveImage} />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>

      {images.length < (maxFiles || 10) && (
        <CldUploadWidget
          uploadPreset="lanka-food"
          options={{
            maxFiles: 1,
            resourceType: 'image',
          }}
          onSuccess={(results, widget) => {
            // results가 배열이 아닐 경우 처리
            const result = Array.isArray(results) ? results[0] : results
            // CloudinaryUploadWidgetInfo 타입이 다양하게 있을 수 있으므로 타입 안전하게 처리
            if (result?.info && typeof result.info === 'object' && 'secure_url' in result.info) {
              handleAddImage(result.info.secure_url as string)
            }
          }}
        >
          {({ open }) => (
            <button
              onClick={() => open()}
              type="button"
              className="flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed p-4 text-center transition hover:bg-muted"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm text-muted-foreground">
                {placeholder} ({images.length}/{maxFiles || 10})
              </span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  )
}
