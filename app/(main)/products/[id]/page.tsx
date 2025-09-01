import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Gallery from '@/components/product-detail/gallery'
import InfoTable, { ProductDetailViewModel } from '@/components/product-detail/info-table'
import { Product } from '@/types/database.models'
import { createClient } from '@/utils/supabase/server'

interface PageProps {
  params: Promise<{ id: string }>
}

const fetchProduct = async (id: string): Promise<Product | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
  if (error) return null
  return data as Product
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) return { title: '상품을 찾을 수 없습니다 | Lanka Food' }

  const nameKo = product.name_ko || ''
  const nameEn = product.name_en || ''
  const title = `${nameKo || nameEn} | Lanka Food`
  const descriptionParts: string[] = []
  if (nameKo) descriptionParts.push(nameKo)
  if (nameEn) descriptionParts.push(nameEn)
  const description = descriptionParts.join(' / ')

  const cloudName = process.env.NEXT_CLOUDINARY_CLOUD_NAME
  const ogImages: string[] = []
  const firstImage = product.featured_images?.[0]
  if (cloudName && firstImage) {
    ogImages.push(`https://res.cloudinary.com/${cloudName}/image/upload/${firstImage}`)
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImages.length ? ogImages : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params
  const product = await fetchProduct(id)
  if (!product) return notFound()

  const images: string[] = []
  if (product.featured_images && product.featured_images.length > 0 && product.featured_images[0]) {
    images.push(product.featured_images[0])
  }
  if (product.detail_images && product.detail_images.length > 0) {
    images.push(...product.detail_images.filter(Boolean))
  }

  const viewModel: ProductDetailViewModel = {
    origin: '정보 없음',
    weightGrams: 0,
    brand: '정보 없음',
    grade: '정보 없음',
    packageUnit: '정보 없음',
    ingredients: '정보 없음',
    shelfLife: '정보 없음',
    storage: '정보 없음',
    certifications: '정보 없음',
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Gallery images={images} nameKo={product.name_ko || product.name_en} />
        </div>
        <div>
          <div className="mb-4">
            {product.name_ko ? (
              <>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground" lang="ko">
                  {product.name_ko}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground" lang="en">
                  {product.name_en}
                </p>
              </>
            ) : (
              <h1 className="text-2xl md:text-3xl font-semibold text-foreground" lang="en">
                {product.name_en}
              </h1>
            )}
          </div>
          <InfoTable viewModel={viewModel} />
        </div>
      </div>
    </div>
  )
}
