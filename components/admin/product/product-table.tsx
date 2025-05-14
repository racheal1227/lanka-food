'use client'

import { ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@components/table/data-table'

interface ProductTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  onEdit?: (item: TData) => void
  onDelete?: (item: TData) => void
  onRecommend?: (item: TData, recommended: boolean) => void
}

export function ProductTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onEdit,
  onDelete,
  onRecommend,
}: ProductTableProps<TData, TValue>) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey={searchKey}
      searchPlaceholder="상품 검색..."
      enableRowSelection={false}
    />
  )
}
