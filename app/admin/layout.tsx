import { Folder, Home, Package } from 'lucide-react'

import { Metadata } from 'next'

import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'

export const metadata: Metadata = {
  title: '관리자 대시보드 | Lanka Food',
  description: 'Lanka Food 관리자 대시보드입니다.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = [
    { href: '/admin', label: '대시보드', icon: Home },
    { href: '/admin/categories', label: '카테고리 관리', icon: Folder },
    { href: '/admin/products', label: '상품 관리', icon: Package },
  ]

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
