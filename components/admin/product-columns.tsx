'use client'

import { ColumnDef } from '@tanstack/react-table'

import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Product } from '@/types/database.models'

import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

// 컬럼 생성 함수
export const createProductColumns = ({
  onEdit,
  onDelete,
  onRecommend,
}: {
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onRecommend?: (product: Product, isRecommended: boolean) => void
}): ColumnDef<Product, any>[] => [
  // 체크박스 컬럼
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="전체 선택"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // 이미지 컬럼
  {
    accessorKey: 'featured_image',
    header: '이미지',
    cell: ({ row }) => {
      const image = row.getValue('featured_image') as string | null
      return image ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-md">
          <Image src={image} alt={row.getValue('name_ko') as string} fill sizes="40px" className="object-cover" />
        </div>
      ) : (
        <div className="h-10 w-10 rounded-md bg-muted" />
      )
    },
    enableSorting: false,
  },
  // 제품명 컬럼
  {
    accessorKey: 'name_ko',
    header: ({ column }) => <DataTableColumnHeader column={column} title="제품명" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('name_ko')}</div>,
  },
  // 가격 컬럼
  {
    accessorKey: 'price_krw',
    header: ({ column }) => <DataTableColumnHeader column={column} title="가격" />,
    cell: ({ row }) => {
      const price = row.getValue('price_krw') as number
      const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(price)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  // 재고 수량 컬럼
  {
    accessorKey: 'stock_quantity',
    header: ({ column }) => <DataTableColumnHeader column={column} title="재고" />,
    cell: ({ row }) => {
      const quantity = row.getValue('stock_quantity') as number
      return <div className="text-center">{quantity}</div>
    },
  },
  // 카테고리 컬럼 (나중에 category 정보를 가져오는 로직이 필요함)
  {
    accessorKey: 'category_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="카테고리" />,
    cell: ({ row }) => <div>{row.getValue('category_id')}</div>,
  },
  // 상태 컬럼
  {
    accessorKey: 'is_available',
    header: ({ column }) => <DataTableColumnHeader column={column} title="상태" />,
    cell: ({ row }) => {
      const isAvailable = row.getValue('is_available') as boolean
      return <Badge variant={isAvailable ? 'default' : 'outline'}>{isAvailable ? '판매중' : '판매중지'}</Badge>
    },
  },
  // 추천 상품 컬럼
  {
    accessorKey: 'is_recommended',
    header: ({ column }) => <DataTableColumnHeader column={column} title="추천" />,
    cell: ({ row }) => {
      const isRecommended = row.getValue('is_recommended') as boolean
      return (
        <Badge variant={isRecommended ? 'default' : 'outline'} className={isRecommended ? 'bg-amber-500' : ''}>
          {isRecommended ? '추천' : '-'}
        </Badge>
      )
    },
  },
  // 액션 컬럼
  {
    id: 'actions',
    header: '관리',
    cell: ({ row }) => {
      const product = row.original
      return (
        <DataTableRowActions
          row={row}
          actions={{
            edit: onEdit
              ? {
                  isVisible: true,
                  onClick: (data) => onEdit(data as Product),
                }
              : undefined,
            delete: onDelete
              ? {
                  isVisible: true,
                  onClick: (data) => onDelete(data as Product),
                }
              : undefined,
            recommend: onRecommend
              ? {
                  isVisible: true,
                  isRecommended: product.is_recommended,
                  onRecommend: (data, isRecommended) => onRecommend(data as Product, isRecommended),
                }
              : undefined,
          }}
        />
      )
    },
  },
]
