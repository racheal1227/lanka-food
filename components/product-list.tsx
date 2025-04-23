'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { ImageIcon } from 'lucide-react'

import { CldImage } from 'next-cloudinary'

import { Product } from '@/types/database.models'
import { getProducts } from '@services/product.service'

export default function ProductList() {
  const { data: products } = useSuspenseQuery<Product[]>({ queryKey: ['products'], queryFn: getProducts })

  if (products.length === 0) {
    return <div>상품이 없습니다.</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="relative aspect-square w-full">
            {product.featured_image ? (
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
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{product.name_ko}</h3>
            <p className="text-gray-600 mt-1 text-sm line-clamp-2">{product.description}</p>
            <div className="mt-2 text-right font-semibold">{product.price_krw.toLocaleString()} 원</div>
          </div>
        </div>
      ))}
    </div>
  )
}
