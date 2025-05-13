'use client'

import { Suspense } from 'react'
import { z } from 'zod'

import { notFound, useRouter } from 'next/navigation'

import { ProductForm } from '@components/admin/product/product-form'
import { useCategoriesQuery } from '@hooks/use-category'
import { useProductQuery, useUpdateProduct } from '@hooks/use-product'

// 상품 수정 폼에서 사용할 데이터 타입
const productFormSchema = z.object({
  name_ko: z.string(),
  name_en: z.string().optional(),
  name_si: z.string().optional(),
  description: z.string().optional(),
  price_krw: z.number(),
  stock_quantity: z.number(),
  category_id: z.string(),
  is_available: z.boolean(),
  is_recommended: z.boolean(),
  featured_image: z.string().nullable(),
  detail_images: z.array(z.string()).nullable(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

function EditProductForm({ id }: { id: string }) {
  const router = useRouter()
  const { data: categories = [] } = useCategoriesQuery()
  const { data: product } = useProductQuery(id)
  const updateProduct = useUpdateProduct()

  if (!product) {
    return notFound()
  }

  const handleSubmit = (data: ProductFormValues) => {
    updateProduct.mutate(
      { id, product: data },
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

  return <ProductForm product={product} categories={categories} onSubmit={handleSubmit} onCancel={handleCancel} />
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
