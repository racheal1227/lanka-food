'use client'

import { LayoutDashboard, Tag, ShoppingBag } from 'lucide-react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: '대시보드', href: '/admin', icon: LayoutDashboard },
  { label: '카테고리 관리', href: '/admin/category', icon: Tag },
  { label: '상품 관리', href: '/admin/product', icon: ShoppingBag },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full border-r bg-background md:w-64">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center font-semibold">
          Lanka Food Admin
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
