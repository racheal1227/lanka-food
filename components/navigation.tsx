'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import { ThemeSwitcher } from './theme-switcher'

export default function MainNavigation() {
  const pathname = usePathname()

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
                  <Link href="/category1" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={pathname === '/category1'}>
                      카테고리1
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/category2" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={pathname === '/category2'}>
                      카테고리2
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/category3" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} active={pathname === '/category3'}>
                      카테고리2
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
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
