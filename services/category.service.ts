import { Category, CategoryInsert, CategoryUpdate } from '@/types/database.models'
import supabase from '@lib/supabase'

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true })

  if (error) throw error
  return data
}

export const createCategory = async (category: CategoryInsert): Promise<Category> => {
  // 최대 sort_order 값 조회
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)

  if (maxOrderError) throw maxOrderError

  const maxOrder = maxOrderData[0].sort_order
  const newOrder = maxOrder + 1

  const { data, error } = await supabase
    .from('categories')
    .insert([{ ...category, sort_order: newOrder }])
    .select()

  if (error) throw error
  return data[0]
}

export const updateCategory = async ({ id, category }: { id: string; category: CategoryUpdate }): Promise<Category> => {
  const { data, error } = await supabase.from('categories').update(category).eq('id', id).select().single()

  if (error) throw error
  return data
}

export const deleteCategory = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) throw error
  return true
}

export const updateCategoryOrder = async (categories: { id: string; sort_order: number }[]): Promise<void> => {
  await Promise.all(
    categories.map((category) =>
      supabase.from('categories').update({ sort_order: category.sort_order }).eq('id', category.id),
    ),
  )
}
