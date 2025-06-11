'use client'

import { ImageOff } from 'lucide-react'
import * as React from 'react'

import { CldImage } from 'next-cloudinary'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import WishlistButton from '@/components/wishlist/wishlist-button'
import { cn } from '@/lib/utils'
import { Product } from '@/types/database.models'

interface ProductCardProps {
  product: Product
  size?: 'small' | 'large'
}

export default function ProductCard({ product, size = 'large' }: ProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  const placeholder = (
    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
      <ImageOff className={cn('text-gray-300', size === 'small' ? 'w-6 h-6' : 'w-12 h-12')} />
    </div>
  )

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (cardRef.current) observer.unobserve(cardRef.current)
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  const mainImage = product.featured_images?.[0]

  return (
    <Card
      ref={cardRef}
      className={cn('overflow-hidden hover:shadow-md transition-shadow', size === 'small' ? 'max-w-[150px]' : '')}
    >
      <div className={cn('relative w-full', size === 'small' ? 'aspect-[4/3]' : 'aspect-square')}>
        {mainImage ? (
          isVisible ? (
            <CldImage
              width={size === 'small' ? '150' : '400'}
              height={size === 'small' ? '120' : '400'}
              src={mainImage}
              alt={product.name_en}
              crop="fill"
              gravity="center"
              loading="lazy"
              className={cn('w-full h-full object-cover', !product.is_available && 'opacity-50')}
            />
          ) : (
            placeholder
          )
        ) : (
          placeholder
        )}

        {/* Sold Out 대각선 리본 */}
        {!product.is_available && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="transform rotate-12">
              <div
                className={cn(
                  'bg-white text-red-600 font-bold shadow-lg border-l-2 border-r-2 border-red-600',
                  size === 'small' ? 'px-2 py-0.5 text-[9px] tracking-wider' : 'px-3 py-1 text-[10px] tracking-wide',
                )}
              >
                SOLD OUT
              </div>
            </div>
          </div>
        )}

        {/* 장바구니 버튼 - sold out 상태일 때는 숨김 */}
        {product.is_available && (
          <div className="absolute bottom-2 right-2">
            <WishlistButton
              product={product}
              size={size === 'small' ? 'sm' : 'icon'}
              className="bg-white/90 hover:bg-white shadow-md hover:scale-110 transition-transform duration-200"
            />
          </div>
        )}
      </div>

      <CardContent className={cn(size === 'small' ? 'p-2' : 'p-4')}>
        <h3 className={cn('font-semibold', size === 'small' ? 'text-xs' : '', !product.is_available && 'opacity-60')}>
          {product.name_en}
        </h3>
        {size === 'small' ? (
          <p lang="ko" className={cn('text-xs text-gray-500', !product.is_available && 'opacity-60')}>
            {product.name_ko}
          </p>
        ) : (
          <>
            <p lang="ko" className={cn('text-sm text-gray-500', !product.is_available && 'opacity-60')}>
              {product.name_ko}
            </p>
            <p lang="si" className={cn('text-sm text-gray-500', !product.is_available && 'opacity-60')}>
              {product.name_si}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
