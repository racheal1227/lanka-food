import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

export type Category = Tables<'categories'>
export type CategoryInsert = Omit<TablesInsert<'categories'>, 'id' | 'created_at' | 'updated_at' | 'sort_order'>
export type CategoryUpdate = TablesUpdate<'categories'>

export type Product = Tables<'products'> & {
  categories?: Category
}
export type ProductInsert = Omit<TablesInsert<'products'>, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = TablesUpdate<'products'>
