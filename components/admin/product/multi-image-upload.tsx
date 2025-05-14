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
import * as React from 'react'

import Image from 'next/image'
import { CldImage } from 'next-cloudinary'

// 클라이언트 이미지 타입 정의
export interface ClientImage {
  id: string
  file: File
  uploaded?: boolean
  publicId?: string // Cloudinary public ID
}

// 정렬 가능한 이미지 아이템 컴포넌트
interface SortableImageItemProps {
  id: string
  image: ClientImage
  onRemove: (id: string) => void
}

function SortableImageItem({ id, image, onRemove }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null)

  // 로컬 파일이 있을 경우 객체 URL 생성 및 정리
  React.useEffect(() => {
    if (image.file && !image.uploaded) {
      const url = URL.createObjectURL(image.file)
      setObjectUrl(url)

      // 컴포넌트 언마운트 시 객체 URL 해제
      return () => {
        URL.revokeObjectURL(url)
      }
    }

    return undefined
  }, [image.file, image.uploaded])

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
        {image.uploaded && image.publicId ? (
          <CldImage
            src={image.publicId}
            width={64}
            height={64}
            alt="Product image"
            crop="fill"
            gravity="center"
            className="object-cover"
          />
        ) : objectUrl ? (
          <Image
            src={objectUrl}
            alt="Product image preview"
            className="object-cover"
            fill
            sizes="64px"
            onError={(e) => {
              console.error('Image load error')
              // fallback 이미지나 아이콘 표시
              e.currentTarget.src = '/placeholder-image.jpg'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImagePlus className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 truncate text-sm">{id && typeof id === 'string' ? id.split('-').pop() || id : ''}</div>
      <button
        onClick={() => onRemove(id)}
        className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 p-1 text-white shadow-sm"
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
  onImagesChange: (images: ClientImage[]) => void
  maxFiles?: number
  placeholder?: string
}

export default function MultiImageUpload({
  value,
  onChange,
  maxFiles = 5,
  placeholder = '이미지 추가하기',
  onImagesChange,
}: MultiImageUploadProps) {
  // 클라이언트 이미지 상태 관리
  const [clientImages, setClientImages] = React.useState<ClientImage[]>([])
  const [isMounted, setIsMounted] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const initialRenderRef = React.useRef(true)

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
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // 클라이언트 이미지가 변경될 때마다 부모 컴포넌트에 알림
  React.useEffect(() => {
    if (!isMounted) return

    onImagesChange(clientImages)

    // 값이 변경된 경우에만 onChange 호출
    // value와 현재 업로드된 publicIds가 다를 때만 호출
    const uploadedPublicIds = clientImages
      .filter((img) => img.uploaded && img.publicId)
      .map((img) => img.publicId as string)

    // 깊은 비교를 통해 배열이 실제로 변경되었는지 확인
    const isEqual =
      uploadedPublicIds.length === value.length && uploadedPublicIds.every((id, index) => id === value[index])

    if (!isEqual) {
      onChange(uploadedPublicIds)
    }
  }, [clientImages, isMounted, onChange, value, onImagesChange])

  // value prop이 변경될 때 처리 (외부에서 값이 변경된 경우)
  // 최초 마운트 시에만 value에서 clientImages를 설정하도록 함
  React.useEffect(() => {
    if (!isMounted) return

    // 처음 마운트될 때만 value에서 clientImages 초기화
    if (initialRenderRef.current) {
      initialRenderRef.current = false

      // value가 없거나 빈 배열인 경우 빈 배열로 초기화
      if (!value || value.length === 0) {
        setClientImages([])
        return
      }

      // 이미 업로드된 이미지는 clientImages에 추가
      // 여기서 value는 publicId 배열입니다
      const uploadedImages: ClientImage[] = value.map((publicId) => ({
        id: `uploaded-${publicId || Date.now()}`,
        uploaded: true,
        publicId,
        file: new File([], 'placeholder'), // 파일 객체는 의미 없음
      }))

      setClientImages(uploadedImages)
    }
  }, [value, isMounted])

  // 드래그 종료 시 호출되는 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = clientImages.findIndex((img) => img.id === active.id)
      const newIndex = clientImages.findIndex((img) => img.id === over.id)

      const newOrder = arrayMove(clientImages, oldIndex, newIndex)
      setClientImages(newOrder)
    }
  }

  // 이미지 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files || files.length === 0) return

    // 현재 이미지 수와 새로 추가할 이미지 수를 계산하여 maxFiles 제한 적용
    const remainingSlots = maxFiles - clientImages.length
    if (remainingSlots <= 0) return // 더 이상 추가할 수 없음

    // maxFiles 제한을 초과하지 않는 범위 내에서만 이미지 추가
    const filesToAdd = Array.from(files).slice(0, remainingSlots)

    const newImages: ClientImage[] = filesToAdd.map((file) => {
      const id = `local-${Date.now()}-${file.name}`
      return {
        id,
        file,
        uploaded: false,
        // publicId는 업로드 후에 설정됩니다
      }
    })

    setClientImages((prev) => [...prev, ...newImages])

    // 파일 인풋 초기화 (동일 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 이미지 제거 핸들러
  const handleRemoveImage = (id: string) => {
    setClientImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id)

      // 로컬 URL 메모리 해제 (필요 없음 - URL.createObjectURL을 사용할 때만 필요)
      return newImages
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={clientImages.map((img) => img.id)} strategy={verticalListSortingStrategy}>
          {clientImages.length > 0 && (
            <div className="mb-4">
              {clientImages.map((img) => (
                <SortableImageItem key={img.id} id={img.id} image={img} onRemove={handleRemoveImage} />
              ))}
            </div>
          )}
        </SortableContext>
      </DndContext>

      {clientImages.length < maxFiles && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            max={maxFiles}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex h-20 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed p-4 text-center transition hover:bg-muted"
          >
            <ImagePlus className="h-6 w-6" />
            <span className="text-sm text-muted-foreground">
              {placeholder} ({clientImages.length}/{maxFiles})
            </span>
          </label>
        </>
      )}
    </div>
  )
}
