'use client'

import { ColumnDef, getCoreRowModel, SortingState, useReactTable } from '@tanstack/react-table'

import { PageResponse } from '@/types/query.type'
import { DataTable } from '@components/table/data-table'
import TableToolbar from '@components/table/table-toolbar'

interface ProductTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: PageResponse<TData>
  currentPage: number
  pageCount: number
  pageSize: number
  sorting: SortingState
  searchValue: string
  onSortingChange: (sorting: SortingState) => void
  onSearchChange: (value: string) => void
  actionButton?: React.ReactNode
}

export function ProductTable<TData, TValue>({
  columns,
  data,
  currentPage,
  pageCount,
  pageSize,
  sorting,
  searchValue,
  onSortingChange,
  onSearchChange,
  actionButton,
}: ProductTableProps<TData, TValue>) {
  // 테이블 객체 생성
  const table = useReactTable({
    data: data.content,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: (updater) => {
      // onSortingChange 핸들러에 변경된 정렬 상태를 전달
      let newSorting: SortingState
      if (typeof updater === 'function') {
        newSorting = updater(sorting)
      } else {
        newSorting = updater
      }
      onSortingChange(newSorting)
    },
    manualPagination: true,
    manualSorting: true,
    pageCount,
    state: {
      sorting,
      pagination: { pageIndex: currentPage, pageSize },
    },
    enableColumnResizing: false, // 사용자가 컬럼 크기를 변경하지 못하도록 설정
  })

  return (
    <div>
      {/* 테이블 툴바 */}
      <TableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="상품명 검색..."
        showColumnToggle
        showSearch
        actionButtons={actionButton}
      />

      {/* 데이터 테이블 */}
      <DataTable table={table} data={data} />
    </div>
  )
}
