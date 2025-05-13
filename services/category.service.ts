import supabase from '@/lib/supabase'
import { Category, CategoryInsert, CategoryUpdate } from '@/types/database.models'

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export const getCategoryById = async (id: string): Promise<Category> => {
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

export const createCategory = async (category: Omit<CategoryInsert, 'id' | 'created_at'>): Promise<Category> => {
  // 최대 sort_order 값 조회
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  const maxOrder = maxOrderData?.length ? maxOrderData[0].sort_order : 0
  const newOrder = maxOrder + 1

  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...category, sort_order: newOrder }])
    .select()

  if (error) throw error
  return data[0]
}

export const updateCategory = async (id: string, category: CategoryUpdate): Promise<Category> => {
  const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single()

  if (error) throw error
  return data
}

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) throw error
}

export const updateCategoryOrder = async (categories: Pick<Category, 'id' | 'sort_order'>[]): Promise<void> => {
  // Promise.all을 사용하여 병렬로 업데이트
  await Promise.all(
    categories.map((category) =>
      supabase.from('categories').update({ sort_order: category.sort_order }).eq('id', category.id),
    ),
  )
}
