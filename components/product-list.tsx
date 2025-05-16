'use client'

import { useSearchParams } from 'next/navigation'

import ProductCard from '@components/product-card'
import { useProductsByCategory } from '@hooks/use-product'

export default function ProductList() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category') || undefined

  const { data: products } = useProductsByCategory({
    categoryName: selectedCategory,
    sorting: [{ id: 'created_at', desc: true }],
  })

  if (products.length === 0) {
    return <div>상품이 없습니다.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
