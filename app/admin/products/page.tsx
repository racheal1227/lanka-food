'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { DataTable } from '@/components/admin/data-table'
import { createProductColumns } from '@/components/admin/product-columns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useProductsQuery, useDeleteProduct, useSetProductRecommendation } from '@/hooks/use-products'
import { useToast } from '@/hooks/use-toast'
import { getCategories } from '@/services/product.service'
import { Product } from '@/types/database.models'

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: products = [], isLoading } = useProductsQuery()

  // 제품 삭제 관련 상태 및 mutation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const deleteProductMutation = useDeleteProduct()

  // 제품 추천 설정 관련 mutation
  const setProductRecommendation = useSetProductRecommendation()

  // 제품 삭제 핸들러
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product)
  }

  // 제품 삭제 확인 핸들러
  const confirmDeleteProduct = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.id)
      setProductToDelete(null)
    }
  }

  // 제품 편집 페이지로 이동
  const handleEditProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}`)
  }

  // 제품 추천 설정/해제
  const handleSetRecommendation = (product: Product, isRecommended: boolean) => {
    setProductRecommendation.mutate({
      id: product.id,
      isRecommended,
    })
  }

  // 새 제품 추가 페이지로 이동
  const handleAddProduct = () => {
    router.push('/admin/products/new')
  }

  // 컬럼 정의
  const columns = createProductColumns({
    onEdit: handleEditProduct,
    onDelete: handleDeleteProduct,
    onRecommend: handleSetRecommendation,
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">제품 관리</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />새 제품 추가
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchKey="name_ko"
        searchPlaceholder="제품명 검색..."
        showColumnToggle
        enableRowSelection
      />

      {/* 제품 삭제 확인 대화상자 */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>제품 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 제품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
    </div>
  )
}
