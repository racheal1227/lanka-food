import { SortingTableState } from '@tanstack/react-table'

import { Product, ProductInsert, ProductUpdate } from '@/types/database.models'
import { SetProductRecommendationParams } from '@/types/product.type'
import supabase from '@lib/supabase'

export const getProducts = async ({
  categoryId,
  sorting,
}: SortingTableState & { categoryId?: string }): Promise<Product[]> => {
  let query = supabase.from('products').select('*')

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  sorting.forEach(({ id, desc }) => {
    query = query.order(id, { ascending: !desc })
    if (id === 'recommendation_order') {
      query = query.order('created_at', { ascending: !desc })
    }
  })

  const { data, error } = await query

  if (error) throw error
  return data
}

export const getProductsByCategory = async ({
  categoryName,
  sorting,
}: SortingTableState & { categoryName?: string }): Promise<Product[]> => {
  let query = supabase.from('products').select('*').eq('is_available', true)

  // 카테고리 이름으로 카테고리 ID 찾기
  if (categoryName) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .single()

    if (categoryError) throw categoryError
    query = query.eq('category_id', category.id)
  }

  sorting.forEach(({ id, desc }) => {
    query = query.order(id, { ascending: !desc })
    if (id === 'recommendation_order') {
      query = query.order('created_at', { ascending: !desc })
    }
  })

  const { data, error } = await query

  if (error) throw error
  return data
}

export const getProduct = async (id: string): Promise<Product> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export const createProduct = async (product: ProductInsert): Promise<Product> => {
  const { data, error } = await supabase.from('products').insert([product]).select()

  if (error) throw error
  return data[0]
}

export const updateProduct = async ({ id, product }: { id: string; product: ProductUpdate }): Promise<Product> => {
  const { data, error } = await supabase.from('products').update(product).eq('id', id).select().single()

  if (error) throw error
  return data
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) throw error
  return true
}

export const setProductRecommendation = async ({
  id,
  isRecommended,
  recommendationOrder,
}: SetProductRecommendationParams) => {
  let updates: Partial<ProductUpdate> = {}

  if (isRecommended) {
    updates = { is_recommended: true, recommendation_order: recommendationOrder }
  } else {
    updates = { is_recommended: false, recommendation_order: null }
  }

  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select()

  if (error) throw error
  return data
}

export const updateProductRecommendationOrder = async (products: { id: string; recommendation_order: number }[]) => {
  const results = await Promise.all(
    products.map(async (product) => {
      const { data, error } = await supabase
        .from('products')
        .update({ recommendation_order: product.recommendation_order })
        .eq('id', product.id)
        .select()

      if (error) throw error
      return data
    }),
  )

  return results
}

// 파일을 Base64로 변환하는 헬퍼 함수
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

// Cloudinary 업로드 함수
export const uploadImageToCloudinary = async (file: File): Promise<{ publicId: string; url: string }> => {
  try {
    // 서버 API 엔드포인트 사용
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Cloudinary 업로드 실패: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(`Cloudinary 업로드 실패: ${data.message || '알 수 없는 오류'}`)
    }

    return {
      publicId: data.publicId,
      url: data.url,
    }
  } catch (error) {
    console.error('Cloudinary 업로드 오류:', error)
    throw new Error(`Cloudinary 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
  }
}

// Cloudinary에서 이미지 삭제 함수
export const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    // API 엔드포인트 사용 (Next.js 서버 API 라우트에서 구현 필요)
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      console.error(`이미지 삭제 응답 오류: ${response.statusText}`)
      return false
    }

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error(`이미지 삭제 실패 (${publicId}):`, error)
    return false
  }
}

// 이미지 배열 업로드 함수
interface ClientImage {
  id: string
  file: File
  uploaded?: boolean
  publicId?: string
}

export const uploadImageArray = async (
  images: ClientImage[],
  previousPublicIds: string[] = [],
): Promise<{ publicIds: string[]; updatedImages: ClientImage[] }> => {
  // 원본 배열을 복사하여 사용
  const imagesCopy = [...images]

  // 삭제할 이미지 찾기 (이전에 있었지만 현재 배열에 없는 이미지)
  const currentPublicIds = imagesCopy.filter((img) => img.uploaded && img.publicId).map((img) => img.publicId as string)

  const publicIdsToDelete = previousPublicIds.filter((prevId) => !currentPublicIds.includes(prevId))

  // 삭제가 필요한 이미지가 있으면 Cloudinary에서 삭제
  if (publicIdsToDelete.length > 0) {
    await Promise.all(
      publicIdsToDelete.map(async (publicId) => {
        try {
          const deleteResult = await deleteImageFromCloudinary(publicId)
          if (deleteResult) {
            console.log(`이미지 삭제 성공: ${publicId}`)
          } else {
            console.warn(`이미지 삭제 결과 불확실: ${publicId}`)
          }
        } catch (error) {
          console.error(`이미지 삭제 실패 (${publicId}):`, error)
          // 삭제 실패는 치명적이지 않으므로 프로세스를 계속 진행
        }
      }),
    )
  }

  // 업로드할 새 이미지 필터링
  const imagesNeedUpload = imagesCopy.filter((img) => !img.uploaded)

  if (imagesNeedUpload.length === 0) {
    // 업로드할 이미지가 없는 경우 기존 이미지의 public ID만 반환
    const publicIds = imagesCopy.filter((img) => img.uploaded && img.publicId).map((img) => img.publicId as string)

    return { publicIds, updatedImages: imagesCopy }
  }

  // Promise.all을 사용하여 동시에 업로드
  const uploadResults = await Promise.all(
    imagesNeedUpload.map(async (img) => {
      try {
        const result = await uploadImageToCloudinary(img.file)
        return {
          id: img.id,
          publicId: result.publicId,
        }
      } catch (error) {
        console.error(`이미지 업로드 실패 (${img.id}):`, error)
        throw new Error(`이미지 업로드 실패: ${img.file.name}`)
      }
    }),
  )

  // 업로드 결과를 바탕으로 새 배열 생성
  const updatedImages = imagesCopy.map((img) => {
    if (img.uploaded) return img

    const uploadResult = uploadResults.find((r) => r.id === img.id)
    if (!uploadResult) return img

    return {
      ...img,
      uploaded: true,
      publicId: uploadResult.publicId,
    }
  })

  // 모든 이미지의 publicId 반환
  const publicIds = updatedImages.filter((img) => img.publicId).map((img) => img.publicId as string)

  return { publicIds, updatedImages }
}
