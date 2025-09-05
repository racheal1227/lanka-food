'use client'

import { ImageOff } from 'lucide-react'
import * as React from 'react'

import { CldImage } from 'next-cloudinary'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

interface GalleryProps {
  images: string[]
  nameKo?: string | null
}

export default function Gallery({ images, nameKo }: GalleryProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return undefined
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on('select', onSelect)
    onSelect()
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  const hasImages = images && images.length > 0

  return (
    <div className="w-full">
      <div className="relative">
        {hasImages ? (
          <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {images.map((publicId) => (
                <CarouselItem key={publicId}>
                  <div className="aspect-square w-full overflow-hidden rounded-md bg-muted">
                    <CldImage
                      width="800"
                      height="800"
                      src={publicId}
                      alt={(nameKo || '상품 이미지') as string}
                      crop="fill"
                      gravity="center"
                      loading={publicId === images[0] ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        ) : (
          <div className="aspect-square w-full rounded-md bg-gray-100 flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-gray-400" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {hasImages ? (
          images.map((publicId, index) => (
            <button
              key={publicId}
              type="button"
              aria-label={`슬라이드 ${index + 1}로 이동`}
              className={cn(
                'relative w-16 h-16 rounded-md overflow-hidden border',
                current === index ? 'border-2 border-primary' : 'border-transparent',
              )}
              onMouseEnter={() => api?.scrollTo(index)}
            >
              <CldImage
                width="120"
                height="120"
                src={publicId}
                alt={(nameKo || '상품 썸네일') as string}
                crop="fill"
                gravity="center"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))
        ) : (
          <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
            <ImageOff className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  )
}
