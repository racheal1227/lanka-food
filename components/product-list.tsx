'use client'

import { Loader2, X } from 'lucide-react'
import * as React from 'react'
import { useInView } from 'react-intersection-observer'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Loading from '@/app/loading'
import { Product } from '@/types/database.models'
import { parseSearchTerms } from '@/utils/query.utils'
import ProductCard from '@components/product-card'
import useIsMobile from '@hooks/use-mobile'
import { useProductsByCategory } from '@hooks/use-product'
import { Badge } from '@ui/badge'

export default function ProductList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const selectedCategory = searchParams.get('category') || undefined
  const searchTerm = searchParams.get('searchTerm') || undefined

  // PC에서는 검색어 파라미터 제거
  React.useEffect(() => {
    // isMobile이 undefined가 아닐 때(확실히 감지되었을 때)만 실행
    if (isMobile === false && searchTerm) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('searchTerm')
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [isMobile, searchTerm, router, pathname, searchParams])

  // 인피니티 스크롤 구현을 위한 상태 설정
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 300px 0px', // 하단에서 300px 전에 로드 시작
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useProductsByCategory({
    categoryName: selectedCategory,
    searchTerm,
    sorting: [{ id: 'created_at', desc: true }],
    pageIndex: 0,
    pageSize: 8,
  })

  const handleRemoveSearchTerm = (termToRemove: string) => {
    if (!searchTerm) return

    const terms = parseSearchTerms(searchTerm)
    const filteredTerms = terms.filter((term) => term !== termToRemove).join(' ')

    const params = new URLSearchParams(searchParams.toString())
    if (filteredTerms) {
      params.set('searchTerm', filteredTerms)
    } else {
      params.delete('searchTerm')
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  // 뷰포트에 로더가 보이면 다음 페이지 로드
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 로딩 상태 처리
  if (status === 'pending') {
    return <Loading />
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
    <div>
      {/* 검색어 뱃지 */}
      {searchTerm && isMobile && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {parseSearchTerms(searchTerm).map((term) => (
            <Badge key={term} variant="outline" className="flex items-center py-1 px-2 text-xs">
              <span>{term}</span>
              <button
                type="button"
                onClick={() => handleRemoveSearchTerm(term)}
                className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full p-0 hover:bg-gray-200"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {data.pages.map((page) => (
          // 각 페이지의 고유 식별자로 pagination.currentPageIndex 사용
          <React.Fragment key={`page-${page.pagination.currentPageIndex}`}>
            {page.content.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </React.Fragment>
        ))}

        {/* 로더 엘리먼트 */}
        {hasNextPage && (
          <div ref={ref} className="col-span-full flex justify-center p-4">
            {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
        )}
      </div>
    </div>
  )
}
