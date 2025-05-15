'use client'

import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SortingTableState } from '@tanstack/react-table'

import { useRouter } from 'next/navigation'

import { Product, ProductInsert, ProductUpdate } from '@/types/database.models'
import showErrorToast from '@/utils/show-error-toast'
import { toast } from '@hooks/use-toast'
import * as productService from '@services/product.service'

// Read
// Admin Page
export const useProductsQuery = (params: SortingTableState & { categoryId?: string }) =>
  useSuspenseQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  })

// Main Page
export const useProductsByCategoryQuery = (params: SortingTableState & { categoryName?: string }) =>
  useSuspenseQuery({
    queryKey: ['products', 'category', params],
    queryFn: () => productService.getProductsByCategory(params),
  })

export const useProductQuery = (id: string) =>
  useSuspenseQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
  })

// Create
export const useCreateProduct = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: ProductInsert) => productService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: '성공',
        description: '상품이 추가되었습니다.',
      })
      router.push('/admin/product')
    },
    onError: (error) => {
      showErrorToast(error, '상품 추가 중 오류가 발생했습니다.')
    },
  })
}

// Update
export const useUpdateProduct = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: string; product: ProductUpdate }) => productService.updateProduct(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      toast({
        title: '성공',
        description: '상품이 수정되었습니다.',
      })
      router.push('/admin/product')
    },
    onError: (error) => {
      showErrorToast(error, '상품 수정 중 오류가 발생했습니다.')
    },
  })
}

// Delete
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      featuredImages,
      detailImages,
    }: {
      id: string
      featuredImages?: string[] | null
      detailImages?: string[] | null
    }) => productService.deleteProduct(id, featuredImages, detailImages),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: '성공',
        description: '상품이 삭제되었습니다.',
      })
    },
    onError: (error) => {
      showErrorToast(error, '상품 삭제 중 오류가 발생했습니다.')
    },
  })
}

// Set Product Recommendation
export const useSetProductRecommendation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: string; isRecommended: boolean; recommendationOrder?: number }) =>
      productService.setProductRecommendation(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: '성공',
        description: '상품 추천 설정이 변경되었습니다.',
      })
    },
    onError: (error) => {
      showErrorToast(error, '상품 추천 설정 변경 중 오류가 발생했습니다.')
    },
  })
}

// Update Product Recommendation Order
export const useUpdateProductRecommendationOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (products: Pick<Product, 'id' | 'recommendation_order'>[]) =>
      productService.updateProductRecommendationOrder(products),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: '성공',
        description: '상품 추천 순서가 변경되었습니다.',
      })
    },
    onError: (error) => {
      showErrorToast(error, '상품 추천 순서 변경 중 오류가 발생했습니다.')
    },
  })
}
