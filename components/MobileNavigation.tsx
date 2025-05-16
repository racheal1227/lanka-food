'use client'

import { Home, Menu, MessageCircle, Search, Send } from 'lucide-react'
import { useState } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CldImage } from 'next-cloudinary'

import { useCategoriesQuery } from '@hooks/use-category'
import { useProductsByCategory } from '@hooks/use-product'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Card, CardContent } from '@ui/card'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@ui/drawer'
import { Input } from '@ui/input'
import { Separator } from '@ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip'

export default function MobileNavigation() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  const { data: categories } = useCategoriesQuery()
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)
  const [searchSheetOpen, setSearchSheetOpen] = useState(false)

  // 추천 상품 가져오기
  const { data: products } = useProductsByCategory({
    sorting: [{ id: 'recommendation_order', desc: false }],
  })

  // 추천 상품 필터링
  const recommendedProducts = products?.filter((product) => product.is_recommended).slice(0, 4) || []

  // 연락하기 핸들러
  const handleContact = () => {
    window.open('https://example.com/contact', '_blank')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-sm">
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
              <div className="flex mb-4">
                <Input placeholder="상품 검색..." className="w-full" />
                <Button className="ml-2">검색</Button>
              </div>
              <Separator className="my-4" />
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="font-medium text-md">추천 상품</h3>
                  <Badge variant="outline" className="ml-2">
                    추천
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {recommendedProducts.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} onClick={() => setSearchSheetOpen(false)}>
                      <Card className="overflow-hidden">
                        <div className="h-32 w-full overflow-hidden">
                          {product.featured_images && product.featured_images[0] && (
                            <CldImage
                              width={300}
                              height={300}
                              src={product.featured_images[0]}
                              alt={product.name_ko || ''}
                              crop="fill"
                              gravity="center"
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <CardContent className="p-2">
                          <p className="text-sm font-medium truncate">{product.name_ko || ''}</p>
                          <p className="text-xs text-muted-foreground">{product.price_krw?.toLocaleString()}원</p>
                        </CardContent>
                      </Card>
                    </Link>
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
        </TooltipProvider>
      </div>
    </div>
  )
}
