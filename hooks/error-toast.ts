'use client'

import { toast } from '@/hooks/use-toast'

export const useErrorToast = () => {
  const showErrorToast = <E extends Error>(error: E, message?: string) => {
    toast({
      variant: 'destructive',
      title: '오류',
      description: `${message || '오류가 발생했습니다.'}\n${error.message}`,
    })
  }

  return showErrorToast
}

export default useErrorToast
