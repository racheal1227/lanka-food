'use client'

import { MessageCircle, Send } from 'lucide-react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

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
          <div className="w-full text-center mb-2">
            <Link href="/" className="font-bold text-lg inline-block" onClick={handleLogoClick}>
              Lanka Food
            </Link>
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
