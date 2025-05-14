'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ImageOff } from 'lucide-react'

import { CldImage } from 'next-cloudinary'

import { Product } from '@/types/database.models'
import { DataTableColumnHeader } from '@components/table/data-table-column-header'
import { DataTableRowActions } from '@components/table/data-table-row-actions'
import { Badge } from '@ui/badge'
import { Checkbox } from '@ui/checkbox'

// 컬럼 생성 함수
export const createProductColumns = ({
  onEdit,
  onDelete,
  onRecommend,
}: {
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onRecommend?: (product: Product, isRecommended: boolean) => void
}): ColumnDef<Product>[] => [
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
    accessorKey: 'featured_images',
    header: '이미지',
    cell: ({ row: { original } }) => {
      const publicId = original.featured_images?.[0]

      return publicId ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-md">
          <CldImage
            src={publicId}
            width={40}
            height={40}
            crop="fill"
            gravity="auto"
            alt={original.name_ko || '상품 이미지'}
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
          <ImageOff className="h-5 w-5 text-muted-foreground" />
        </div>
      )
    },
    enableSorting: false,
  },
  // 상품명 컬럼
  {
    accessorKey: 'name_ko',
    header: ({ column }) => <DataTableColumnHeader column={column} title="상품명" />,
    cell: ({ row: { original } }) => <div className="font-medium">{original.name_ko}</div>,
  },
  // 가격 컬럼
  {
    accessorKey: 'price_krw',
    header: ({ column }) => <DataTableColumnHeader column={column} title="가격" />,
    cell: ({ row: { original } }) => {
      const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(original.price_krw)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  // 재고 수량 컬럼
  {
    accessorKey: 'stock_quantity',
    header: ({ column }) => <DataTableColumnHeader column={column} title="재고" />,
    cell: ({ row: { original } }) => <div className="text-center">{original.stock_quantity}</div>,
  },
  // 카테고리 컬럼 (나중에 category 정보를 가져오는 로직이 필요함)
  {
    accessorKey: 'category_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="카테고리" />,
    cell: ({ row: { original } }) => <div>{original.category_id}</div>,
  },
  // 상태 컬럼
  {
    accessorKey: 'is_available',
    header: ({ column }) => <DataTableColumnHeader column={column} title="상태" />,
    cell: ({ row: { original } }) => (
      <Badge variant={original.is_available ? 'default' : 'outline'}>
        {original.is_available ? '판매중' : '판매중지'}
      </Badge>
    ),
  },
  // 추천 상품 컬럼
  {
    accessorKey: 'is_recommended',
    header: ({ column }) => <DataTableColumnHeader column={column} title="추천" />,
    cell: ({ row: { original } }) => (
      <Badge
        variant={original.is_recommended ? 'default' : 'outline'}
        className={original.is_recommended ? 'bg-amber-500' : ''}
      >
        {original.is_recommended ? '추천' : '-'}
      </Badge>
    ),
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
