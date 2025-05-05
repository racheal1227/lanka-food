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

export const getProducts = async (categoryName?: string): Promise<Product[]> => {
  if (categoryName) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .single()

    if (categoryError) throw categoryError

    // 해당 category_id로 products 필터링
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

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
