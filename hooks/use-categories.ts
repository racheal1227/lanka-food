'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@/hooks/use-toast'
import * as categoryService from '@/services/category.service'
import { Category } from '@/types/database.models'

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  })

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'sort_order'>) =>
      categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '성공',
        description: '카테고리가 추가되었습니다.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '카테고리 추가 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'sort_order'>
    }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '성공',
        description: '카테고리가 수정되었습니다.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '카테고리 수정 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}

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
      toast({
        variant: 'destructive',
        title: '오류',
        description: '카테고리 삭제 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}

export const useUpdateCategoryOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categories: Pick<Category, 'id' | 'sort_order'>[]) => categoryService.updateCategoryOrder(categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({
        title: '성공',
        description: '카테고리 순서가 변경되었습니다.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '카테고리 순서 변경 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}
