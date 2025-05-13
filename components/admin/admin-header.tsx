'use client'

import { LogOut, User as UserIcon } from 'lucide-react'

import LogoutButton from '@/components/auth/logout-button'
import { Button } from '@/components/ui/button'
import { User } from '@/types/database.models'

interface AdminHeaderProps {
  user: User
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <UserIcon className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        <LogoutButton>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">로그아웃</span>
          </Button>
        </LogoutButton>
      </div>
    </header>
  )
}
