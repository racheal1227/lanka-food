'use client'

import { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'

import { cn } from '@lib/utils'
import { Button } from '@ui/button'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export default function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('text-[14px]', className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => {
          if (column.getIsSorted() === 'asc') {
            column.toggleSorting(true) // 내림차순으로 변경
          } else {
            column.toggleSorting(false) // 오름차순으로 변경
          }
        }}
      >
        <span className="text-[14px]">{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className="h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ChevronsUpDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
