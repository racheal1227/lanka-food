'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from '@hooks/use-toast'
import { Button } from '@ui/button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    toast({
      variant: 'destructive',
      title: '요청을 처리할 수 없습니다',
      description: `${error.message || '서비스 이용 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'}`,
    })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-xl font-semibold">서비스 이용에 불편을 드려 죄송합니다</h2>
      <p className="text-muted-foreground">
        {error.message || '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
      </p>
      <div className="flex space-x-4">
        <Button onClick={reset} variant="default">
          다시 시도
        </Button>
        <Button onClick={() => router.push('/')} variant="outline">
          홈으로 이동
        </Button>
      </div>
    </div>
  )
}
