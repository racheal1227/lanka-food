'use client'

import { Table as ReactTable, flexRender } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

import { PageResponse } from '@/types/query.type'
import { Button } from '@ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table'

// 컬럼 정의 확장 타입 - 타이틀 속성 추가
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    title?: string
  }
}

interface DataTableProps<T> {
  table: ReactTable<T>
  data: PageResponse<T>
}

export function DataTable<T>({ table, data }: DataTableProps<T>) {
  const {
    getHeaderGroups,
    getRowModel,
    getAllColumns,
    getCanPreviousPage,
    getCanNextPage,
    getPageCount,
    getState,
    setPageIndex,
    setPageSize,
  } = table

  const renderPageNumbers = () => {
    const totalPages = getPageCount()
    const currentPageIndex = getState().pagination.pageIndex

    // 현재 페이지 기준으로 최대 5개의 페이지 번호 표시
    const showPages = 5 // 표시할 페이지 수
    let startPage = Math.max(0, currentPageIndex - Math.floor(showPages / 2))
    const endPage = Math.min(totalPages - 1, startPage + showPages - 1)

    // endPage에 맞춰서 startPage 조정
    startPage = Math.max(0, endPage - showPages + 1)

    // Array.from을 사용하여 페이지 범위 배열 생성 후 매핑
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => {
      const pageIndex = startPage + index
      return (
        <Button
          key={pageIndex}
          variant={pageIndex === currentPageIndex ? 'default' : 'outline'}
          className="h-8 w-8"
          onClick={() => setPageIndex(pageIndex)}
        >
          {pageIndex + 1}
        </Button>
      )
    })

    return <div className="flex items-center gap-1">{pageNumbers}</div>
  }

  return (
    <>
      <div className="mb-2">
        <p className="text-xs text-muted-foreground">
          총 <b>{data.pagination.count}</b>개 항목
        </p>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            {getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      minWidth: header.getSize(),
                      maxWidth: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {getRowModel().rows?.length ? (
              getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={row.getIsSelected() ? 'bg-muted' : ''}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={getAllColumns().length} className="h-24 text-center">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between py-4">
        <div className="flex-1" />

        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPageIndex(0)}
              disabled={!getCanPreviousPage()}
            >
              <span className="sr-only">첫 페이지로</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setPageIndex(getState().pagination.pageIndex - 1)}
              disabled={!getCanPreviousPage()}
            >
              <span className="sr-only">이전 페이지</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* 페이지 번호 표시 */}
            {renderPageNumbers()}

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setPageIndex(getState().pagination.pageIndex + 1)}
              disabled={!getCanNextPage()}
            >
              <span className="sr-only">다음 페이지</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPageIndex(getPageCount() - 1)}
              disabled={!getCanNextPage()}
            >
              <span className="sr-only">마지막 페이지로</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1 justify-end">
          <p className="text-sm font-medium">페이지 당 행 수</p>
          <Select
            value={`${getState().pagination.pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((pageSizeOption) => (
                <SelectItem key={pageSizeOption} value={`${pageSizeOption}`}>
                  {pageSizeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
