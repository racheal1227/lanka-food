'use client'

import { Home, Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react'
import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import ProductCard from '@components/product-card'
import { useCategoriesQuery } from '@hooks/use-category'
import { useRecommendedProducts } from '@hooks/use-product'
import { useWishlistStore } from '@stores/wishlist'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@ui/drawer'
import { Input } from '@ui/input'
import { Separator } from '@ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip'

export default function MobileNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  const { data: categories } = useCategoriesQuery()
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)
  const [searchSheetOpen, setSearchSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 추천 상품 가져오기
  const { data: recommendedProducts } = useRecommendedProducts()

  // 장바구니 스토어
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

  // 검색 핸들러
  const handleSearch = (query: string) => {
    if (query.trim()) {
      // 검색어를 URL에 추가하고 Next.js 라우터로 이동
      router.push(`/?searchTerm=${encodeURIComponent(query.trim())}`)
      setSearchSheetOpen(false) // 검색 창 닫기
      setSearchQuery('') // 검색어 초기화
    }
  }

  // 검색어 초기화 핸들러
  const clearSearchQuery = () => {
    setSearchQuery('')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-50 border-t shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-16">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="p-0 flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground bg-transparent"
                >
                  <Home className="!h-6 !w-6" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>홈</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Drawer open={categorySheetOpen} onOpenChange={setCategorySheetOpen}>
          <DrawerTrigger asChild>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground bg-transparent"
                    onClick={() => setCategorySheetOpen(true)}
                  >
                    <Menu className="!h-6 !w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>카테고리</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DrawerTrigger>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>카테고리</DrawerTitle>
            </DrawerHeader>
            <Separator className="mb-4" />
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  asChild
                  className="w-full"
                  onClick={() => setCategorySheetOpen(false)}
                >
                  <Link href="/">전체</Link>
                </Button>

                {categories?.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    asChild
                    className="w-full"
                    onClick={() => setCategorySheetOpen(false)}
                  >
                    <Link href={`/?category=${encodeURIComponent(category.name)}`}>{category.name}</Link>
                  </Button>
                ))}
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">닫기</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer open={searchSheetOpen} onOpenChange={setSearchSheetOpen}>
          <DrawerTrigger asChild>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground bg-transparent"
                    onClick={() => setSearchSheetOpen(true)}
                  >
                    <Search className="!h-6 !w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>검색</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DrawerTrigger>
          <DrawerContent className="h-[100vh]">
            <DrawerHeader>
              <DrawerTitle>검색</DrawerTitle>
            </DrawerHeader>
            <Separator className="mb-4" />
            <div className="px-4 pb-4">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  handleSearch(searchQuery)
                }}
                className="flex mb-4"
              >
                <div className="relative flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="상품 검색..."
                    className="w-full pr-8"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearchQuery}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button type="submit" className="ml-2">
                  검색
                </Button>
              </form>
              <Separator className="my-4" />
              <div>
                <div className="flex items-center mb-2">
                  <Badge variant="default">추천 상품</Badge>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {recommendedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} size="small" />
                  ))}
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">닫기</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  className="p-0 flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground bg-transparent relative"
                >
                  <ShoppingBag className="!h-6 !w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center min-w-[20px]">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>장바구니</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 flex items-center justify-center w-12 h-12 text-muted-foreground hover:text-foreground bg-transparent"
                onClick={handleContact}
              >
                <MessageCircle className="!h-6 !w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>판매사 연락하기</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>
    </div>
  )
}
