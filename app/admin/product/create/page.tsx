'use client'

import { Suspense } from 'react'

import { useRouter } from 'next/navigation'

import ProductForm, { SubmitValues } from '@components/admin/product/product-form'
import { useCreateProduct } from '@hooks/use-product'

function CreateProductForm() {
  const router = useRouter()
  const createProduct = useCreateProduct()

  const handleSubmit = (data: SubmitValues) => {
    createProduct.mutate(data)
  }

  const handleCancel = () => {
    router.push('/admin/product')
  }

  return <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
}

export default function CreateProductPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">새 상품 등록</h1>
      <Suspense fallback={<div>데이터 로딩 중...</div>}>
        <CreateProductForm />
      </Suspense>
    </div>
  )
}
