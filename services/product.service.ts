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
