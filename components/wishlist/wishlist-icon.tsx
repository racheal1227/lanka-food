'use client'

import { ShoppingBag } from 'lucide-react'
import React, { useEffect } from 'react'

import Link from 'next/link'

import { cn } from '@lib/utils'
import { useWishlistStore } from '@stores/wishlist'
import { Button } from '@ui/button'

interface WishlistIconProps {
  className?: string
  variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export default function WishlistIcon({ className, variant = 'ghost', size = 'icon' }: WishlistIconProps) {
  const { loadItems } = useWishlistStore()

  // 컴포넌트 마운트 시 위시리스트 로드
  useEffect(() => {
    loadItems()
  }, [loadItems])

  return (
    <Link href="/wishlist">
      <Button variant={variant} size={size} className={cn('', className)} aria-label="장바구니">
        <ShoppingBag className="h-5 w-5" />
      </Button>
    </Link>
  )
}
