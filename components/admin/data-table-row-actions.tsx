'use client'

import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Star, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  actions: {
    edit?: {
      isVisible: boolean
      onClick: (row: TData) => void
    }
    delete?: {
      isVisible: boolean
      onClick: (row: TData) => void
    }
    recommend?: {
      isVisible: boolean
      onRecommend: (row: TData, isRecommended: boolean) => void
      isRecommended: boolean
    }
    custom?: Array<{
      label: string
      icon?: React.ReactNode
      onClick: (row: TData) => void
      className?: string
    }>
  }
}

export function DataTableRowActions<TData>({ row, actions }: DataTableRowActionsProps<TData>) {
  const item = row.original

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>작업</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {actions.edit?.isVisible && (
            <DropdownMenuItem onClick={() => actions.edit?.onClick(item)}>
              <Edit className="mr-2 h-4 w-4" />
              수정
            </DropdownMenuItem>
          )}

          {actions.recommend?.isVisible &&
            (actions.recommend.isRecommended ? (
              <DropdownMenuItem onClick={() => actions.recommend?.onRecommend(item, false)}>
                <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                추천 해제
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => actions.recommend?.onRecommend(item, true)}>
                <Star className="mr-2 h-4 w-4" />
                추천으로 설정
              </DropdownMenuItem>
            ))}

          {actions.custom &&
            actions.custom.map((action, index) => (
              <DropdownMenuItem
                key={`custom-action-${index}-${action.label}`}
                onClick={() => action.onClick(item)}
                className={action.className}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}

          {actions.delete?.isVisible && (
            <DropdownMenuItem onClick={() => actions.delete?.onClick(item)} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
