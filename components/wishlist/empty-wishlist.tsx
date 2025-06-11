import { ShoppingBag, ShoppingCart } from 'lucide-react'

import Link from 'next/link'

import { Button } from '@ui/button'
import { Card, CardContent } from '@ui/card'

export default function EmptyWishlist() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장바구니</h1>
        <p className="text-muted-foreground">관심있는 상품들을 모아보고 판매자에게 주문해보세요.</p>
      </div>

      {/* 빈 장바구니 영역 - 물건이 있는 페이지와 동일한 여백 사용 */}
      <Card>
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">장바구니가 비어있습니다</h3>
            <p className="text-muted-foreground mb-8">마음에 드는 상품을 찾아 장바구니에 추가해보세요.</p>

            <Link href="/">
              <Button size="lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                상품 둘러보기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
