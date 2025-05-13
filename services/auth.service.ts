'use server'

import { User } from '@/types/database.models'
import { createClient } from '@/utils/supabase/server'

export const login = async ({ email, password }: { email: string; password: string }) => {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error

  const { data: userData, error: userError } = await supabase.from('users').select('*').eq('id', data.user.id).single()
  if (userError) throw userError

  return userData
}

export const logout = async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) return null

  const { data: userData, error } = await supabase.from('users').select('*').eq('id', session.user.id).single()
  if (error) return null

  return userData
}
