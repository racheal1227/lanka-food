import Link from 'next/link'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/category" className="block transition-transform hover:scale-105">
          <Card className="h-full hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle>카테고리 관리</CardTitle>
              <CardDescription>카테고리를 추가, 수정, 삭제하고 순서를 조정할 수 있습니다.</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/product" className="block transition-transform hover:scale-105">
          <Card className="h-full hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle>상품 관리</CardTitle>
              <CardDescription>상품을 관리하고 이미지를 업로드할 수 있습니다.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
