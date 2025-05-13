'use client'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { toast } from '@/hooks/use-toast'
import * as categoryService from '@/services/category.service'
import { CategoryInsert, CategoryUpdate } from '@/types/database.models'
import showErrorToast from '@/utils/show-error-toast'

// Read
export const useCategoriesQuery = () =>
  useSuspenseQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
    staleTime: Infinity,
  })

// Create
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (category: CategoryInsert) => categoryService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '성공',
        description: '카테고리가 추가되었습니다.',
      })
    },
    onError: (error) => {
      showErrorToast(error, '카테고리 추가 중 오류가 발생했습니다.')
    },
  })
}

// Update
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: string; category: CategoryUpdate }) => categoryService.updateCategory(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '성공',
        description: '카테고리가 수정되었습니다.',
      })
    },
    onError: (error) => {
      showErrorToast(error, '카테고리 수정 중 오류가 발생했습니다.')
    },
  })
}

// Delete
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '성공',
        description: '카테고리가 삭제되었습니다.',
      })
    },
    onError: (error) => {
      showErrorToast(error, '카테고리 삭제 중 오류가 발생했습니다.')
    },
  })
}

// Update Order
export const useUpdateCategoryOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categories: { id: string; sort_order: number }[]) => categoryService.updateCategoryOrder(categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '성공',
        description: '카테고리 순서가 변경되었습니다.',
      })
    },
    onError: (error) => {
      showErrorToast(error, '카테고리 순서 변경 중 오류가 발생했습니다.')
    },
  })
}
