'use client'

import { Suspense } from 'react'

import { useRouter } from 'next/navigation'

import { ProductForm } from '@components/admin/product/product-form'
import { useCategoriesQuery } from '@hooks/use-category'
import { useCreateProduct } from '@hooks/use-product'

function CreateProductForm() {
  const router = useRouter()
  const { data: categories = [] } = useCategoriesQuery()
  const createProduct = useCreateProduct()

  const handleSubmit = (data: any) => {
    // recommendation_order는 자동으로 계산되므로 제외
    createProduct.mutate(data, {
      onSuccess: () => {
        router.push('/admin/product')
      },
    })
  }

  const handleCancel = () => {
    router.push('/admin/product')
  }

  return <ProductForm categories={categories} onSubmit={handleSubmit} onCancel={handleCancel} />
}

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">새 상품 등록</h1>
      <Suspense fallback={<div>카테고리 로딩 중...</div>}>
        <CreateProductForm />
      </Suspense>
    </div>
  )
}
