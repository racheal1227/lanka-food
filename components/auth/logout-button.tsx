'use client'

import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'

import { useRouter } from 'next/navigation'

import { toast } from '@hooks/use-toast'
import { logout as logoutService } from '@services/auth.service'
import { useAuthStore } from '@stores/auth'
import { Button } from '@ui/button'

export default function LogoutButton() {
  const router = useRouter()
  const { logout: logoutStore } = useAuthStore()

  const { mutate: logout } = useMutation({
    mutationFn: logoutService,
    mutationKey: ['logout'],
    onSuccess: () => {
      logoutStore()
      router.push('/')
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '로그아웃 실패',
        description: error?.message || '로그아웃 중 오류가 발생했습니다. 네트워크 연결을 확인하고 다시 시도해 주세요.',
      })
    },
  })

  return (
    <Button variant="ghost" size="sm" onClick={() => logout()}>
      <LogOut className="h-4 w-4 mr-2" />
      로그아웃
    </Button>
  )
}
