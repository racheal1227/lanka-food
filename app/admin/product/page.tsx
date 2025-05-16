'use client'

import { PaginationState, SortingState, Updater, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import * as React from 'react'

import { useRouter } from 'next/navigation'

import { Product } from '@/types/database.models'
import { createProductColumns } from '@components/admin/product/product-columns'
import { DataTable } from '@components/table/data-table'
import TableToolbar from '@components/table/table-toolbar'
import { useDeleteProduct, useProducts, useSetProductRecommendation } from '@hooks/use-product'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog'
import { Button } from '@ui/button'

export default function ProductsPage() {
  const router = useRouter()

  const [pageIndex, setPageIndex] = React.useState<number>(0)
  const [pageSize, setPageSize] = React.useState<number>(10)
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'created_at', desc: true }])
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null)

  const { data: productsData } = useProducts({ pageIndex, pageSize, sorting, searchTerm })
  const deleteProductMutation = useDeleteProduct()
  const setProductRecommendation = useSetProductRecommendation()

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    const newPagination = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater

    if (newPagination.pageIndex !== pageIndex) {
      setPageIndex(newPagination.pageIndex)
    }

    if (newPagination.pageSize !== pageSize) {
      setPageSize(newPagination.pageSize)
      setPageIndex(0)
    }
  }

  const handleSortingChange = (updater: Updater<SortingState>) => {
    let newSorting: SortingState
    if (typeof updater === 'function') {
      newSorting = updater(sorting)
    } else {
      newSorting = updater
    }
    setSorting(newSorting)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setPageIndex(0)
  }

  const actionButton = (
    <Button onClick={() => router.push('/admin/product/create')}>
      <Plus className="mr-2 h-4 w-4" />새 상품 추가
    </Button>
  )

  const columns = createProductColumns({
    onEdit: (product) => router.push(`/admin/product/${product.id}`),
    onDelete: (product) => setProductToDelete(product),
    onRecommend: (product: Product, isRecommended: boolean) => {
      setProductRecommendation.mutate({ id: product.id, isRecommended })
    },
  })

  const table = useReactTable({
    data: productsData?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualSorting: true,
    pageCount: productsData?.pagination.totalPages || 0,
    state: { sorting, pagination: { pageIndex, pageSize } },
    onPaginationChange: handlePaginationChange,
    enableColumnResizing: false,
  })

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProductMutation.mutate({
        id: productToDelete.id,
        featuredImages: productToDelete.featured_images,
        detailImages: productToDelete.detail_images,
      })
      setProductToDelete(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">상품 관리</h1>
      </div>

      <div>
        <TableToolbar
          table={table}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder="상품명 검색..."
          showColumnToggle
          showSearch
          actionButtons={actionButton}
        />
        <DataTable table={table} data={productsData} />
      </div>

      {/* 상품 삭제 확인 대화상자 */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>상품 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
