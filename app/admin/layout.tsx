import { Home, Folder, Package } from 'lucide-react'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { useAuthStore } from '@/stores/auth'

export const metadata: Metadata = {
  title: '관리자 대시보드 | Lanka Food',
  description: 'Lanka Food 관리자 대시보드입니다.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = useAuthStore()

  // 로그인하지 않았거나 관리자가 아닌 경우 로그인 페이지로 리다이렉트
  if (!user || role !== 'admin') {
    redirect('/login')
  }

  const sidebarItems = [
    { href: '/admin', label: '대시보드', icon: Home },
    { href: '/admin/categories', label: '카테고리 관리', icon: Folder },
    { href: '/admin/products', label: '상품 관리', icon: Package },
  ]

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
