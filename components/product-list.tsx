'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { Product } from '@/types/database.models'
import ProductCard from '@components/product-card'
import { getProducts } from '@services/product.service'

export default function ProductList() {
  const { data: products } = useSuspenseQuery<Product[]>({ queryKey: ['products'], queryFn: getProducts })

  if (products.length === 0) {
    return <div>상품이 없습니다.</div>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
