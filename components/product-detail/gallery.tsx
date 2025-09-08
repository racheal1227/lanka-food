'use client'

import { ImageOff } from 'lucide-react'
import * as React from 'react'

import { CldImage, getCldImageUrl } from 'next-cloudinary'

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
  const [isHovering, setIsHovering] = React.useState(false)
  const [hoverRatio, setHoverRatio] = React.useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 })
  const currentBoxRef = React.useRef<HTMLDivElement | null>(null)
  const [previewSize, setPreviewSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 0 })
  const zoom = 2.5

  const loadImageSize = (src: string) =>
    new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
      img.onerror = () => resolve({ width: 1600, height: 1200 })
      img.src = src
    })

  const openMobileLightbox = async (startIndex: number) => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    if (!isMobile) return

    // eslint-disable-next-line import/no-extraneous-dependencies
    const { default: PhotoSwipe } = await import('photoswipe')

    const urls = images.map((id) =>
      getCldImageUrl({ src: id, width: 1600, format: 'auto', quality: 'auto', dpr: 'auto' }),
    )

    const sizes = await Promise.all(urls.map((u) => loadImageSize(u)))

    const dataSource = urls.map((src, i) => ({ src, width: sizes[i].width, height: sizes[i].height }))

    const pswp = new PhotoSwipe({
      dataSource,
      index: startIndex,
      bgOpacity: 1,
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,
      zoom: false,
    })
    pswp.init()
  }

  React.useEffect(() => {
    const el = currentBoxRef.current
    if (!el) return undefined
    const update = () => setPreviewSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [current])

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
    <div className="relative w-full">
      <div className="relative">
        {hasImages ? (
          <Carousel setApi={setApi} className="w-full cursor-default" opts={{ loop: true }}>
            <CarouselContent>
              {images.map((publicId) => (
                <CarouselItem key={publicId}>
                  <div
                    className="relative aspect-square w-full overflow-hidden rounded-md bg-muted cursor-default"
                    ref={images[current] === publicId ? currentBoxRef : null}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onMouseMove={(e) => {
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
                      const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
                      const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1)
                      setHoverRatio({ x, y })
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openMobileLightbox(images.indexOf(publicId))
                      }
                    }}
                    onClick={() => {
                      // 모바일(coarse pointer)에서는 전체화면 뷰어 진입
                      openMobileLightbox(images.indexOf(publicId))
                    }}
                  >
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
                    {isHovering &&
                      typeof window !== 'undefined' &&
                      window.matchMedia('(pointer: fine)').matches &&
                      (() => {
                        const lensW = previewSize.w / zoom
                        const lensH = previewSize.h / zoom
                        const rawLeft = hoverRatio.x * previewSize.w - lensW / 2
                        const rawTop = hoverRatio.y * previewSize.h - lensH / 2
                        const left = Math.min(Math.max(rawLeft, 0), Math.max(previewSize.w - lensW, 0))
                        const top = Math.min(Math.max(rawTop, 0), Math.max(previewSize.h - lensH, 0))
                        return (
                          <div
                            className="pointer-events-none absolute border-2 border-primary/80 shadow-[0_0_0_1px_rgba(255,255,255,0.9)_inset] rounded-sm"
                            style={{ width: `${lensW}px`, height: `${lensH}px`, left: `${left}px`, top: `${top}px` }}
                          />
                        )
                      })()}
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

      {/* Desktop side preview overlay (covers right info column) */}
      {images.length > 0 && (
        <div
          className="hidden md:block absolute top-0 z-20 rounded-md border bg-background overflow-hidden"
          style={{
            left: 'calc(100% + 0.5rem)',
            width: `${previewSize.w}px`,
            height: `${previewSize.h}px`,
            visibility:
              isHovering && typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
                ? 'visible'
                : 'hidden',
          }}
        >
          {(() => {
            const lensW = previewSize.w / zoom
            const lensH = previewSize.h / zoom
            const rawLeft = hoverRatio.x * previewSize.w - lensW / 2
            const rawTop = hoverRatio.y * previewSize.h - lensH / 2
            const left = Math.min(Math.max(rawLeft, 0), Math.max(previewSize.w - lensW, 0))
            const top = Math.min(Math.max(rawTop, 0), Math.max(previewSize.h - lensH, 0))
            const translateX = -left * zoom
            const translateY = -top * zoom
            return (
              <CldImage
                width="2000"
                height="2000"
                src={images[current]}
                alt={(nameKo || '상품 확대 미리보기') as string}
                crop="fill"
                gravity="center"
                className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none"
                style={{
                  transform: `translate(${translateX}px, ${translateY}px) scale(${zoom})`,
                  transformOrigin: 'top left',
                }}
              />
            )
          })()}
        </div>
      )}

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {hasImages ? (
          images.map((publicId, index) => (
            <button
              key={publicId}
              type="button"
              aria-label={`슬라이드 ${index + 1}로 이동`}
              className={cn(
                'relative w-16 h-16 rounded-md overflow-hidden border cursor-pointer',
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
