import { Category, Product, ProductInsert } from '@/types/database.models'
import supabase from '@lib/supabase'

// Category
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*')

  if (error) throw error
  return data
}

// Product
export const createProduct = async (product: Omit<ProductInsert, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('products').insert([product]).select()

  if (error) throw error
  return data[0]
}

// 관리자 페이지에서 사용하는 제품 조회 함수 (카테고리 ID 기반)
export const getProducts = async (options?: {
  categoryId?: string
  sortBy?: 'created_at' | 'price_krw' | 'recommendation_order'
  sortOrder?: 'asc' | 'desc'
}) => {
  const { categoryId, sortBy = 'created_at', sortOrder = 'desc' } = options || {}

  let query = supabase.from('products').select('*')

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  // 정렬 적용
  if (sortBy === 'recommendation_order') {
    // Supabase 쿼리로 정렬 처리:
    // 1. 추천 상품 내에서는 recommendation_order로 정렬
    // 2. 일반 상품은 created_at으로 정렬
    query = query
      .order('recommendation_order', { ascending: sortOrder === 'asc', nullsFirst: false })
      .order('created_at', { ascending: sortOrder === 'asc' })
  } else {
    // 기존 정렬 방식
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

// 메인 페이지에서 사용하는 제품 조회 함수 (카테고리 이름 기반)
export const getProductsByCategory = async (
  categoryName?: string,
  options?: {
    sortBy?: 'created_at' | 'price_krw' | 'recommendation_order'
    sortOrder?: 'asc' | 'desc'
  },
) => {
  const { sortBy = 'created_at', sortOrder = 'desc' } = options || {}

  let query = supabase.from('products').select('*')

  if (categoryName) {
    // 카테고리 이름으로 카테고리 ID 찾기
    const { data: categoryByName } = await supabase.from('categories').select('id').eq('name_ko', categoryName).limit(1)

    if (categoryByName && categoryByName.length > 0) {
      query = query.eq('category_id', categoryByName[0].id)
    }
  }

  // 정렬 적용
  if (sortBy === 'recommendation_order') {
    // Supabase 쿼리로 정렬 처리:
    // 1. 추천 상품 내에서는 recommendation_order로 정렬
    // 2. 일반 상품은 created_at으로 정렬
    query = query
      .order('recommendation_order', { ascending: sortOrder === 'asc', nullsFirst: false })
      .order('created_at', { ascending: sortOrder === 'asc' })
  } else {
    // 기존 정렬 방식
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export const getRecommendedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .not('recommendation_order', 'is', null)
    .order('recommendation_order', { ascending: true })

  if (error) throw error
  return data
}

export const getProduct = async (id: string): Promise<Product> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) throw error
  return true
}

export const setProductRecommendation = async (id: string, isRecommended: boolean, recommendationOrder?: number) => {
  let updates: Partial<Product> = {}

  if (isRecommended) {
    // 추천 설정
    if (recommendationOrder) {
      updates = { is_recommended: true, recommendation_order: recommendationOrder }
    } else {
      // 마지막 순서를 조회하여 새 항목 추가
      const { data: maxOrderData } = await supabase
        .from('products')
        .select('recommendation_order')
        .not('recommendation_order', 'is', null)
        .order('recommendation_order', { ascending: false })
        .limit(1)

      // maxOrder가 null이 아닌지 확인
      const maxOrder =
        maxOrderData?.length && maxOrderData[0].recommendation_order !== null ? maxOrderData[0].recommendation_order : 0

      updates = { is_recommended: true, recommendation_order: maxOrder + 1 }
    }
  } else {
    // 추천 해제
    updates = { is_recommended: false, recommendation_order: null }
  }

  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data
}

export const updateProductRecommendationOrder = async (products: Pick<Product, 'id' | 'recommendation_order'>[]) => {
  // Promise.all을 사용하여 병렬로 업데이트
  await Promise.all(
    products.map((product) =>
      supabase.from('products').update({ recommendation_order: product.recommendation_order }).eq('id', product.id),
    ),
  )
}
