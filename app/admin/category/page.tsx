'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { CategoryForm } from '@/components/admin/category/category-form'
import { SortableCategoryList } from '@/components/admin/category/sortable-category-list'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  useCategoriesQuery,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useUpdateCategoryOrder,
} from '@/hooks/use-category'
import { Category } from '@/types/database.models'

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategoriesQuery()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const updateCategoryOrder = useUpdateCategoryOrder()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const handleCreateCategory = (data: { name: string; is_active: boolean }) => {
    createCategory.mutate(data)
    setIsCreateDialogOpen(false)
  }

  const handleUpdateCategory = (category: { name: string; is_active: boolean }) => {
    if (selectedCategory) {
      updateCategory.mutate({
        id: selectedCategory.id,
        category,
      })
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      deleteCategory.mutate(selectedCategory.id)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    const category = categories?.find((c) => c.id === id)
    if (category) {
      setSelectedCategory(category)
      setIsDeleteDialogOpen(true)
    }
  }

  const handleReorder = (reorderedCategories: Category[]) => {
    // ID와 sort_order만 추출
    const categoriesWithOrder = reorderedCategories.map((cat) => ({
      id: cat.id,
      sort_order: cat.sort_order,
    }))

    updateCategoryOrder.mutate(categoriesWithOrder)
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">카테고리 관리</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              카테고리 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>카테고리 추가</DialogTitle>
              <DialogDescription>새 카테고리를 추가합니다. 이름과 활성화 여부를 설정하세요.</DialogDescription>
            </DialogHeader>
            <CategoryForm onSubmit={handleCreateCategory} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {categories?.length === 0 ? (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">등록된 카테고리가 없습니다. 새 카테고리를 추가해주세요.</p>
        </div>
      ) : (
        <SortableCategoryList
          categories={categories || []}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onReorder={handleReorder}
        />
      )}

      {/* 카테고리 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 수정</DialogTitle>
            <DialogDescription>카테고리 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              category={selectedCategory}
              onSubmit={handleUpdateCategory}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 카테고리 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{selectedCategory?.name}' 카테고리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 해당 카테고리에 포함된
              상품들은 카테고리가 없는 상태가 됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
