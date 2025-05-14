'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">404</h2>
        <p className="mt-2 text-lg text-gray-600">페이지를 찾을 수 없습니다</p>
        <p className="text-sm text-gray-500">접근 권한이 없거나 존재하지 않는 페이지입니다</p>
        <Link href="/">
          <Button className="mt-4">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  )
}
