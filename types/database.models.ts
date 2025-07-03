import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'

// User
export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

// Category
export type Category = Tables<'categories'>
export type CategoryInsert = Omit<TablesInsert<'categories'>, 'id' | 'created_at' | 'updated_at' | 'sort_order'>
export type CategoryUpdate = TablesUpdate<'categories'>

// Product
export type Product = Tables<'products'> & { categories?: Category }
export type ProductInsert = Omit<TablesInsert<'products'>, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = TablesUpdate<'products'>

// Email Log
export type EmailLogStatus = 'pending' | 'sent' | 'failed'
export type EmailLogProduct = { name: string; quantity: number }

export type EmailLog = Tables<'email_logs'>
export type EmailLogInsert = Omit<TablesInsert<'email_logs'>, 'id' | 'created_at' | 'created_date'>
export type EmailLogUpdate = TablesUpdate<'email_logs'>
