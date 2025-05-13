'use client'

import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@/hooks/use-toast'
import * as productService from '@/services/product.service'
import { Product } from '@/types/database.models'

// 관리자 페이지용 상품 목록 조회 (카테고리 ID 기반)
export const useProductsQuery = (options?: {
  categoryId?: string
  sortBy?: 'created_at' | 'price_krw' | 'recommendation_order'
  sortOrder?: 'asc' | 'desc'
}) =>
  useSuspenseQuery({
    queryKey: ['products', options],
    queryFn: () => productService.getProducts(options),
  })

// 메인 페이지용 상품 목록 조회 (카테고리 이름 기반)
export const useProductsByCategoryQuery = (
  categoryName?: string,
  options?: {
    sortBy?: 'created_at' | 'price_krw' | 'recommendation_order'
    sortOrder?: 'asc' | 'desc'
  },
) =>
  useSuspenseQuery({
    queryKey: ['products', 'category', categoryName, options],
    queryFn: () => productService.getProductsByCategory(categoryName, options),
  })

// 추천 상품 목록 조회
export const useRecommendedProductsQuery = () =>
  useSuspenseQuery({
    queryKey: ['products', 'recommended'],
    queryFn: productService.getRecommendedProducts,
  })

// 단일 상품 조회
export const useProductQuery = (id: string) =>
  useSuspenseQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
  })

// 상품 생성
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: '성공',
        description: '상품이 추가되었습니다.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '상품 추가 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}

// 상품 수정
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      toast({
        title: '성공',
        description: '상품이 수정되었습니다.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '상품 수정 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}

// 상품 삭제
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: '성공',
        description: '상품이 삭제되었습니다.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '상품 삭제 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}

// 상품 추천 설정/해제
export const useSetProductRecommendation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      isRecommended,
      recommendationOrder,
    }: {
      id: string
      isRecommended: boolean
      recommendationOrder?: number
    }) => productService.setProductRecommendation(id, isRecommended, recommendationOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast({
        title: '성공',
        description: '상품 추천 설정이 변경되었습니다.',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '상품 추천 설정 변경 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}

// 상품 추천 순서 변경
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
      toast({
        variant: 'destructive',
        title: '오류',
        description: '상품 추천 순서 변경 중 오류가 발생했습니다.',
      })
      console.error(error)
    },
  })
}
