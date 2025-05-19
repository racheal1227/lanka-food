'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from '@/hooks/use-toast'
import supabase from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { User } from '@/types/database.models'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser, setRole, logout } = useAuthStore()

  // 인증된 사용자 정보 가져오기
  const { data: userData } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) return null

      const { data, error } = await supabase.from('users').select('*').eq('id', authUser.id).single()

      if (error) throw error

      return data
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
  })

  // 사용자 데이터 처리
  useEffect(() => {
    if (userData) {
      setUser(userData)
      setRole(userData.role as 'admin' | 'user')
    }
  }, [userData, setUser, setRole])

  useEffect(() => {
    // 인증 상태 변경 리스너 설정
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // 로그아웃 처리
        logout()
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })

        // 현재 관리자 페이지에 있다면 로그인 페이지로 리디렉션
        if (window.location.pathname.startsWith('/admin')) {
          router.push('/login')
          toast({
            title: '세션 만료',
            description: '다시 로그인해주세요.',
            variant: 'destructive',
          })
        }
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // 사용자 정보 쿼리 무효화 - 자동으로 새로운 정보를 가져옴
        queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, queryClient, logout])

  return children
}
