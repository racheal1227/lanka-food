'use client'

import { Loader2 } from 'lucide-react'
import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { useSearchParams } from 'next/navigation'

import { Product } from '@/types/database.models'
import ProductCard from '@components/product-card'
import { useProductsByCategory } from '@hooks/use-product'

export default function ProductList() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category') || undefined

  // 인피니티 스크롤 구현을 위한 상태 설정
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 300px 0px', // 하단에서 300px 전에 로드 시작
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useProductsByCategory({
    categoryName: selectedCategory,
    sorting: [{ id: 'created_at', desc: true }],
    pageIndex: 0,
    pageSize: 8,
  })

  // 뷰포트에 로더가 보이면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 로딩 상태 처리
  if (status === 'pending') {
    return <Loader2 className="w-4 h-4 animate-spin" />
  }

  // 에러 상태 처리
  if (status === 'error') {
    return <div>오류가 발생했습니다.</div>
  }

  // 데이터가 없는 경우 처리
  if (!data || data.pages[0].content.length === 0) {
    return <div>상품이 없습니다.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {data.pages.map((page) => (
        // 각 페이지의 고유 식별자로 pagination.currentPageIndex 사용
        <Fragment key={`page-${page.pagination.currentPageIndex}`}>
          {page.content.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Fragment>
      ))}

      {/* 로더 엘리먼트 */}
      {hasNextPage && (
        <div ref={ref} className="col-span-full flex justify-center p-4">
          {isFetchingNextPage ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        </div>
      )}
    </div>
  )
}
