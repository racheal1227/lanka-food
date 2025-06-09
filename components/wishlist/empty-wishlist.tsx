import { ShoppingBag, ShoppingCart } from 'lucide-react'

import Link from 'next/link'

import { Button } from '@ui/button'
import { Card, CardContent } from '@ui/card'

export default function EmptyWishlist() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장바구니</h1>
        <p className="text-muted-foreground">관심있는 상품들을 모아보고 판매자에게 문의해보세요.</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">장바구니가 비어있습니다</h3>
            <p className="text-muted-foreground text-sm">마음에 드는 상품을 찾아 장바구니에 추가해보세요.</p>
          </div>

          <Link href="/">
            <Button className="w-full">
              <ShoppingBag className="h-4 w-4 mr-2" />
              상품 둘러보기
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
