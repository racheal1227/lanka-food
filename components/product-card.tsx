'use client'

import { ImageIcon } from 'lucide-react'
import * as React from 'react'

import { CldImage } from 'next-cloudinary'

import { Product } from '@/types/database.models'

export default function ProductCard({ product }: { product: Product }) {
  const cardRef = React.useRef<HTMLDivElement>(null)

  const [isVisible, setIsVisible] = React.useState(false)

  const placeholder = (
    <div className="bg-gray-200 h-full w-full flex items-center justify-center">
      <ImageIcon className="w-12 h-12 text-gray-300" />
    </div>
  )

  React.useEffect(() => {
    // IntersectionObserver를 사용하여 요소가 화면에 보이는지 감지
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // 한 번 보이면 관찰 중단
          if (cardRef.current) observer.unobserve(cardRef.current)
        }
      },
      {
        root: null,
        rootMargin: '100px', // 화면에 보이기 전 미리 로드 시작
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

  return (
    <div ref={cardRef} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square w-full">
        {product.featured_image ? (
          isVisible ? (
            <CldImage
              width="400"
              height="400"
              src={product.featured_image}
              alt={product.name_ko}
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

      <div className="p-4">
        <h3 className="font-semibold">{product.name_ko}</h3>
        <p className="text-gray-600 mt-1 text-sm line-clamp-2">{product.description}</p>
        <div className="mt-2 text-right font-semibold">{product.price_krw.toLocaleString()} 원</div>
      </div>
    </div>
  )
}
