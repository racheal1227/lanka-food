'use client'

import { Trash2, MessageCircle, Heart } from 'lucide-react'
import React, { useEffect } from 'react'

import { CldImage } from 'next-cloudinary'

import EmptyWishlist from '@/components/wishlist/empty-wishlist'
import WishlistForm from '@/components/wishlist/wishlist-form'
import { useWishlistStore } from '@stores/wishlist'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Checkbox } from '@ui/checkbox'

export default function WishlistPage() {
  const {
    items,
    selectedItems,
    loadItems,
    removeItem,
    clearItems,
    toggleSelection,
    selectAll,
    clearSelection,
    getSelectedCount,
    getItemCount,
  } = useWishlistStore()

  const [showInquiryForm, setShowInquiryForm] = React.useState(false)

  // 페이지 로드 시 위시리스트 아이템 로드
  useEffect(() => {
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

  const handleInquirySubmit = () => {
    // 문의 전송 후 선택된 상품들을 위시리스트에서 제거할지 사용자에게 묻기
    const shouldRemove = window.confirm('문의가 전송되었습니다. 문의한 상품들을 장바구니에서 제거하시겠습니까?')

    if (shouldRemove) {
      selectedItems.forEach((productId) => {
        removeItem(productId)
      })
    }

    clearSelection()
    setShowInquiryForm(false)
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
              <Button variant="outline" size="sm" onClick={clearSelection} disabled={selectedCount === 0}>
                선택 해제
              </Button>
              <Button variant="outline" size="sm" onClick={clearItems} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-1" />
                전체 삭제
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
                      alt={item.name_ko || item.name_en}
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
                  <h3 className="font-semibold text-lg mb-1 truncate">{item.name_ko || item.name_en}</h3>
                  {item.name_ko && <p className="text-sm text-muted-foreground mb-2">{item.name_en}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.addedAt).toLocaleDateString('ko-KR')} 추가
                  </p>
                </div>

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
