'use client'

import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'

import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'

interface ImageUploadProps {
  value: string | null
  onChange: (value: string) => void
  onRemove: () => void
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false)

  // hydration 이슈 방지
  useState(() => {
    setIsMounted(true)
  })

  if (!isMounted) {
    return null
  }

  return (
    <div className="mb-4 space-y-4">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative h-40 w-40 overflow-hidden rounded-md">
            <div className="absolute right-2 top-2 z-10">
              <button
                onClick={onRemove}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 p-1 text-white shadow-sm"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Image
              src={value}
              alt="Product image"
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset="lanka-food"
            options={{
              maxFiles: 1,
              resourceType: 'image',
            }}
            onSuccess={(result: any) => {
              onChange(result.info.secure_url)
            }}
          >
            {({ open }) => (
              <button
                onClick={() => open()}
                type="button"
                className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed p-4 text-center transition hover:bg-muted"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-sm text-muted-foreground">이미지 업로드하기</span>
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    </div>
  )
}
