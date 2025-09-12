import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCldImageUrl } from 'next-cloudinary'

import AttributesTable from '@components/product-detail/attributes-table'
import Gallery from '@components/product-detail/gallery'
import { getProduct } from '@services/product.service'

interface PageProps {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: '상품을 찾을 수 없습니다 | Lanka Food' }

  const nameKo = product.name_ko || ''
  const nameEn = product.name_en || ''
  const title = `${nameKo || nameEn} | Lanka Food`
  const descriptionParts: string[] = []
  if (nameKo) descriptionParts.push(nameKo)
  if (nameEn) descriptionParts.push(nameEn)
  const description = descriptionParts.join(' / ')

  const ogImages: string[] = []
  const firstImage = product.featured_images?.[0]
  if (firstImage) {
    const url = getCldImageUrl({
      src: firstImage,
      width: 1200,
      height: 630,
      crop: 'fill',
      gravity: 'auto',
      format: 'jpg',
      quality: 'auto',
    })
    ogImages.push(url)
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
  const product = await getProduct(id)
  if (!product) return notFound()

  const images: string[] = []
  if (product.featured_images && product.featured_images.length > 0 && product.featured_images[0]) {
    images.push(product.featured_images[0])
  }
  if (product.detail_images && product.detail_images.length > 0) {
    images.push(...product.detail_images.filter(Boolean))
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
          <AttributesTable attributes={product.attributes || []} />
        </div>
      </div>
    </div>
  )
}
