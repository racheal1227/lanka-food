'use client'

import { Suspense } from 'react'
import { z } from 'zod'

import { notFound, useRouter } from 'next/navigation'

import ProductForm, { FormValues } from '@components/admin/product/product-form'
import { useProductQuery, useUpdateProduct } from '@hooks/use-product'

// 상품 수정 폼에서 사용할 데이터 타입 - FormValues를 직접 사용
function EditProductForm({ id }: { id: string }) {
  const router = useRouter()
  const { data: product } = useProductQuery(id)
  const updateProduct = useUpdateProduct()

  if (!product) {
    return notFound()
  }

  const handleSubmit = (data: FormValues) => {
    // Convert form data to the correct format before submitting
    const formattedData = {
      ...data,
      // Make sure database gets the first image as featured_image for backwards compatibility
      featured_image: data.featured_images?.length ? data.featured_images[0] : null,
    }

    updateProduct.mutate(
      { id, product: formattedData },
      {
        onSuccess: () => {
          router.push('/admin/product')
        },
      },
    )
  }

  const handleCancel = () => {
    router.push('/admin/product')
  }

  return <ProductForm product={product} onSubmit={handleSubmit} onCancel={handleCancel} />
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">상품 수정</h1>
      <Suspense fallback={<div>데이터 로딩 중...</div>}>
        <EditProductForm id={params.id} />
      </Suspense>
    </div>
  )
}
