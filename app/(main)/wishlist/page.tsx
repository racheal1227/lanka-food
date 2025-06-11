'use client'

import { Trash2, MessageCircle, Heart, Plus, Minus } from 'lucide-react'
import * as React from 'react'

import { useRouter } from 'next/navigation'
import { CldImage } from 'next-cloudinary'

import EmptyWishlist from '@/components/wishlist/empty-wishlist'
import WishlistForm from '@/components/wishlist/wishlist-form'
import { useIsMobile } from '@/hooks/use-mobile'
import { useWishlistStore } from '@stores/wishlist'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Checkbox } from '@ui/checkbox'

export default function WishlistPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const {
    items,
    selectedItems,
    loadItems,
    removeItem,
    removeSelectedItems,
    clearItems,
    toggleSelection,
    selectAll,
    clearSelection,
    getSelectedCount,
    getItemCount,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
  } = useWishlistStore()

  const [showInquiryForm, setShowInquiryForm] = React.useState(false)

  // 페이지 로드 시 위시리스트 아이템 로드
  React.useEffect(() => {
    loadItems()
  }, [loadItems])

  const selectedCount = getSelectedCount()
  const totalCount = getItemCount()
  const allSelected = totalCount > 0 && selectedCount === totalCount

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection()
    } else {
      selectAll()
    }
  }

  const handleOrderSubmit = () => {
    selectedItems.forEach((productId) => {
      removeItem(productId)
    })

    clearSelection()
    setShowOrderForm(false)

    // 주문 제출 완료 후 루트 페이지로 이동
    router.push('/')
  }

  const handleRemoveSelected = () => {
    if (selectedCount !== 0) {
      removeSelectedItems()
    }
  }

  if (totalCount === 0) {
    return <EmptyWishlist />
  }

  if (showInquiryForm) {
    return <WishlistForm onClose={() => setShowInquiryForm(false)} onSubmit={handleInquirySubmit} />
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">장바구니</h1>
        <p className="text-muted-foreground">관심있는 상품들을 모아보고 판매자에게 문의해보세요.</p>
      </div>

      {/* 컨트롤 바 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="select-all" checked={allSelected} onCheckedChange={handleSelectAll} />
                <label htmlFor="select-all" className="text-sm font-medium">
                  전체 선택 ({selectedCount}/{totalCount})
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={selectedCount === 0}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                선택 삭제 ({selectedCount})
              </Button>
              <Button
                size="sm"
                onClick={() => setShowInquiryForm(true)}
                disabled={selectedCount === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                선택 상품 문의 ({selectedCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 장바구니 목록 */}
      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* 선택 체크박스 */}
                <Checkbox checked={selectedItems.has(item.id)} onCheckedChange={() => toggleSelection(item.id)} />

                {/* 상품 이미지 */}
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.featured_images && item.featured_images[0] ? (
                    <CldImage
                      width="80"
                      height="80"
                      src={item.featured_images[0]}
                      alt={item.name_en}
                      crop="fill"
                      gravity="center"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Heart className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* 상품 정보 */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-md">{item.name_en}</h5>
                  {item.name_ko && <p className="text-sm text-muted-foreground mb-1">{item.name_ko}</p>}

                  {/* 모바일용 수량 컨트롤 - 상품 정보 아래 배치 */}
                  {isMobile && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => decrementQuantity(item.id)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[32px] text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => incrementQuantity(item.id)}
                          className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* PC용 수량 컨트롤 */}
                {!isMobile && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => decrementQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="flex items-center justify-center w-12 h-8 text-sm font-medium">
                        {item.quantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => incrementQuantity(item.id)}
                        className="h-8 w-8 p-0 rounded-none hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
