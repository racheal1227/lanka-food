'use client'

import * as React from 'react'

import { useRouter } from 'next/navigation'

import ProductForm, { SubmitValues } from '@components/admin/product/product-form'
import { useProductQuery, useUpdateProduct } from '@hooks/use-product'

function EditProductForm({ id }: { id: string }) {
  const router = useRouter()
  const { data: product } = useProductQuery(id)
  const updateProduct = useUpdateProduct()

  const handleSubmit = (data: SubmitValues) => {
    updateProduct.mutate({ id, product: data })
  }

  const handleCancel = () => {
    router.push('/admin/product')
  }

  return <ProductForm product={product} onSubmit={handleSubmit} onCancel={handleCancel} />
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">상품 수정</h1>
      <React.Suspense fallback={<div>데이터 로딩 중...</div>}>
        <EditProductForm id={resolvedParams.id} />
      </React.Suspense>
    </div>
  )
}
