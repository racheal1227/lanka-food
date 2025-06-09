'use client'

import { MessageCircle, Send, ShoppingBag } from 'lucide-react'
import { useEffect } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useWishlistStore } from '@/stores/wishlist'
import { useCategoriesQuery } from '@hooks/use-category'
import { Button } from '@ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@ui/navigation-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip'

export default function DesktopNavigation() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')
  const { data: categories } = useCategoriesQuery()
  const { loadItems, getItemCount } = useWishlistStore()

  // 컴포넌트 마운트 시 위시리스트 로드
  useEffect(() => {
    loadItems()
  }, [loadItems])

  const itemCount = getItemCount()

  // 연락하기 핸들러
  const handleContact = () => {
    window.open('https://example.com/contact', '_blank')
  }

  // 로고 클릭 시 스크롤 맨 위로 이동
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center py-4">
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex-1" />
            <Link href="/" className="font-bold text-lg" onClick={handleLogoClick}>
              Lanka Food
            </Link>
            <div className="flex-1 flex justify-end">
              <Link href="/wishlist">
                <Button variant="ghost" size="default" aria-label="장바구니" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center min-w-[20px]">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full overflow-x-auto scrollbar-hide">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex flex-wrap justify-center gap-1">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={selectedCategory === null}>
                      전체
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {categories?.map((category) => (
                  <NavigationMenuItem key={category.id}>
                    <Link href={`/?category=${encodeURIComponent(category.name)}`} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        active={selectedCategory === category.name}
                      >
                        {category.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* <div className="w-2 flex justify-end flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 flex items-center justify-center w-12 h-12"
                    onClick={handleContact}
                    aria-label="판매사 연락하기"
                  >
                    <MessageCircle className="!h-5 !w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>판매사 연락하기</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div> */}
        </div>
      </div>
    </div>
  )
}
