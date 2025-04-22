import supabase from '@/lib/supabaseClient'
import { Product, ProductInsert } from '@/types/database.models'

// Create
export const createProduct = async (product: Omit<ProductInsert, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('products').insert([product]).select()

  if (error) throw error
  return data[0]
}

// Read
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })

  if (error) throw error
  return data
}
export const getProduct = async (id: string): Promise<Product> => {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

  if (error) throw error
  return data
}

// Update
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()

  if (error) throw error
  return data
}

// Delete
export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) throw error
  return true
}
