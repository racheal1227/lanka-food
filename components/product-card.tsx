'use client'

import { ImageOff } from 'lucide-react'
import * as React from 'react'

import { CldImage } from 'next-cloudinary'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
              className="w-full h-full object-cover"
            />
          ) : (
            placeholder
          )
        ) : (
          placeholder
        )}
      </div>

      <CardContent className={cn(size === 'small' ? 'p-2' : 'p-4')}>
        <h3 className={cn('font-semibold truncate', size === 'small' ? 'text-xs' : '')}>{product.name_en}</h3>
        {size === 'small' ? (
          <p lang="ko" className="text-xs text-gray-500 truncate">
            {product.name_ko}
          </p>
        ) : (
          <>
            <p lang="ko" className="text-sm text-gray-500">
              {product.name_ko}
            </p>
            <p lang="si" className="text-sm text-gray-500">
              {product.name_si}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
