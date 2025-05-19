'use client'

import { Table } from '@tanstack/react-table'

import { Button } from '@ui/button'
import { Input } from '@ui/input'

import ColumnToggle from './column-toggle'

interface TableToolbarProps<T> {
  table: Table<T>
  searchTerm?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showColumnToggle?: boolean
  showSearch?: boolean
  actionButtons?: React.ReactNode
}

export default function TableToolbar<T>({
  table,
  searchTerm,
  onSearchChange,
  searchPlaceholder = '검색...',
  showColumnToggle = true,
  showSearch = true,
  actionButtons,
}: TableToolbarProps<T>) {
  return (
    <div className="flex items-center justify-between py-4">
      {/* 왼쪽: 검색 필드 */}
      <div className="flex-1 mr-4">
        {showSearch && onSearchChange && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const searchInput = formData.get('search') as string
              onSearchChange(searchInput)
            }}
            className="flex items-center gap-2"
          >
            <Input name="search" placeholder={searchPlaceholder} defaultValue={searchTerm} className="h-9" />
            <Button type="submit" size="default" className="h-9">
              검색
            </Button>
          </form>
        )}
      </div>

      {/* 오른쪽: 액션 버튼과 컬럼 토글 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* 액션 버튼 */}
        {actionButtons && <div className="flex items-center gap-2">{actionButtons}</div>}

        {/* 열 토글 메뉴 */}
        {showColumnToggle && <ColumnToggle table={table} />}
      </div>
    </div>
  )
}
