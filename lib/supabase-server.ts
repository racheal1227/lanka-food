import { createClient } from '@supabase/supabase-js'

import { Database } from '@/types/database.types'

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
}

if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined')
}

// 서버 전용 Supabase 클라이언트 (RLS 우회)
const supabaseServer = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export default supabaseServer
