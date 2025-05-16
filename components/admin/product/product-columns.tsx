'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Edit, ImageOff, Star, Trash2 } from 'lucide-react'

import { CldImage } from 'next-cloudinary'

import { Product } from '@/types/database.models'
import DataTableColumnHeader from '@components/table/data-table-column-header'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'

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
  // 생성일자 컬럼
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="생성일자" />,
    size: 140,
    meta: {
      title: '생성일자',
    },
    cell: ({ row: { original } }) => {
      const date = new Date(original.created_at)

      const formatted = date
        ? new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(date)
        : '-'

      return (
        <div className="truncate" title={formatted}>
          {formatted}
        </div>
      )
    },
  },
  // 이미지 컬럼
  {
    accessorKey: 'featured_images',
    header: '이미지',
    size: 80,
    meta: {
      title: '이미지',
    },
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
  // 상품명(한국어) 컬럼
  {
    accessorKey: 'name_ko',
    header: ({ column }) => <DataTableColumnHeader column={column} title="상품명(한국어)" />,
    size: 180,
    meta: {
      title: '상품명(한국어)',
    },
    cell: ({ row: { original } }) => (
      <div className="font-medium truncate" title={original.name_ko || '-'}>
        {original.name_ko || '-'}
      </div>
    ),
  },
  // 상품명(영어) 컬럼
  {
    accessorKey: 'name_en',
    header: ({ column }) => <DataTableColumnHeader column={column} title="상품명(영어)" />,
    size: 180,
    meta: {
      title: '상품명(영어)',
    },
    cell: ({ row: { original } }) => (
      <div className="truncate" title={original.name_en}>
        {original.name_en}
      </div>
    ),
  },
  // 가격 컬럼
  {
    accessorKey: 'price_krw',
    header: ({ column }) => <DataTableColumnHeader column={column} title="가격" />,
    size: 60,
    meta: {
      title: '가격',
    },
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
    size: 60,
    meta: {
      title: '재고',
    },
    cell: ({ row: { original } }) => <div className="text-center">{original.stock_quantity}</div>,
  },
  // 카테고리명 컬럼
  {
    accessorKey: 'categories.name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="카테고리" />,
    size: 120,
    meta: {
      title: '카테고리',
    },
    cell: ({ row: { original } }) => (
      <div className="truncate" title={original.categories?.name || '-'}>
        {original.categories?.name || '-'}
      </div>
    ),
  },
  // 상태 컬럼
  {
    accessorKey: 'is_available',
    header: ({ column }) => <DataTableColumnHeader column={column} title="판매상태" />,
    size: 100,
    meta: {
      title: '판매상태',
    },
    cell: ({ row: { original } }) => (
      <div className="flex items-center justify-center h-full">
        <Badge
          variant={original.is_available ? 'default' : 'outline'}
          className={original.is_available ? 'hover:bg-primary' : ''}
        >
          {original.is_available ? '판매중' : '판매중지'}
        </Badge>
      </div>
    ),
  },
  // 추천 상품 컬럼
  {
    accessorKey: 'is_recommended',
    header: ({ column }) => <DataTableColumnHeader column={column} title="추천" />,
    size: 80,
    meta: {
      title: '추천',
    },
    cell: ({ row: { original } }) => (
      <div className="flex items-center justify-center h-full">
        <Badge
          variant={original.is_recommended ? 'default' : 'outline'}
          className={original.is_recommended ? 'bg-amber-500 hover:bg-amber-500' : ''}
        >
          {original.is_recommended ? '추천' : '-'}
        </Badge>
      </div>
    ),
  },
  // 액션 컬럼 (관리 버튼)
  {
    id: 'actions',
    header: '관리',
    size: 100,
    meta: {
      title: '관리',
    },
    enableSorting: false,
    cell: ({ row }) => {
      const product = row.original
      return (
        <div className="flex items-center justify-start gap-2">
          {onRecommend && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRecommend(product, !product.is_recommended)}
              title={product.is_recommended ? '추천 해제' : '추천으로 설정'}
              className="hover:bg-transparent group"
            >
              <Star
                className={`h-4 w-4 text-amber-500 ${
                  product.is_recommended ? 'fill-amber-500' : 'group-hover:fill-amber-500'
                }`}
              />
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(product)} title="수정">
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(product)}
              title="삭제"
              className="text-red-600 hover:text-red-600 hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    },
  },
]
