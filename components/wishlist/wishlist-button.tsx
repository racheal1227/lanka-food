'use client'

import { Check, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Product } from '@/types/database.models'
import { cn } from '@lib/utils'
import { useWishlistStore } from '@stores/wishlist'
import { Button } from '@ui/button'

interface WishlistButtonProps {
  product: Product
  variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showText?: boolean
}

export default function WishlistButton({
  product,
  variant = 'ghost',
  size = 'icon',
  className,
  showText = false,
}: WishlistButtonProps) {
  const { addItem, removeItem, isItemInWishlist, loadItems } = useWishlistStore()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 컴포넌트 마운트 시 위시리스트 로드 및 상태 확인
  useEffect(() => {
    loadItems()
  }, [loadItems])

  useEffect(() => {
    setIsInWishlist(isItemInWishlist(product.id))
  }, [product.id, isItemInWishlist])

  const handleToggleWishlist = async () => {
    setIsLoading(true)
    try {
      if (isInWishlist) {
        removeItem(product.id)
        setIsInWishlist(false)
      } else {
        addItem(product)
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('장바구니 처리 중 오류:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isInWishlist ? variant : 'default'}
      size={size}
      onClick={(event) => {
        event.stopPropagation()
        handleToggleWishlist()
      }}
      disabled={isLoading}
      className={className}
      aria-label={isInWishlist ? '장바구니에서 제거' : '장바구니에 추가'}
    >
      <div className={cn('relative', showText && 'flex items-center gap-2')}>
        <ShoppingBag className="h-4 w-4" />
        {isInWishlist && !showText && (
          <Check className="absolute -top-1.5 -right-2 h-3 w-3 text-white bg-green-600 rounded-full p-0.5" />
        )}
        {showText && (
          <span className="text-sm font-medium">{isInWishlist ? '장바구니에서 제거' : '장바구니에 담기'}</span>
        )}
      </div>
    </Button>
  )
}
