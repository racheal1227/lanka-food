'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Category } from '@/types/database.models'
import { ThemeSwitcher } from '@components/theme-switcher'
import { getCategories } from '@services/product.service'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@ui/navigation-menu'

export default function MainNavigation() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  const { data: categories } = useSuspenseQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
  })

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="w-26 flex-shrink-0">
            <Link href="/" className="font-bold text-lg">
              Lanka Food
            </Link>
          </div>

          <div className="flex-grow mx-4 overflow-x-auto scrollbar-hide">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex justify-center">
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={selectedCategory === null}>
                      전체
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {categories.map((category) => (
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

          <div className="w-2 flex justify-end flex-shrink-0">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}
