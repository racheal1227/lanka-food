'use client'

import { ArrowDown, ArrowUp, ChevronDown, Loader2, X } from 'lucide-react'
import * as React from 'react'
import { useInView } from 'react-intersection-observer'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Loading from '@/app/loading'
import { Product } from '@/types/database.models'
import { parseSearchTerms } from '@/utils/query.utils'
import ProductCard from '@components/product-card'
import { useIsMobile } from '@hooks/use-mobile'
import { useProductsByCategory } from '@hooks/use-product'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@ui/dropdown-menu'

export default function ProductList() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const selectedCategory = searchParams.get('category') || undefined
  const searchTerm = searchParams.get('searchTerm') || undefined
  const sortBy = searchParams.get('sortBy') || 'published_at'
  const sortDir = searchParams.get('sortDir') || 'desc'

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

  // 정렬 옵션 설정
  const getSortingOptions = () => [{ id: sortBy, desc: sortDir === 'desc' }]

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useProductsByCategory({
    categoryName: selectedCategory,
    searchTerm,
    sorting: getSortingOptions(),
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

  // 정렬 변경 처리
  const handleSortChange = (field: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // 같은 필드를 클릭한 경우 정렬 방향 토글
    if (sortBy === field) {
      const newDirection = sortDir === 'asc' ? 'desc' : 'asc'
      params.set('sortDir', newDirection)
    } else {
      // 다른 필드를 클릭한 경우, 필드에 따라 기본 정렬 방향 설정
      params.set('sortBy', field)
      // 최신순은 기본적으로 내림차순, 이름순은 기본적으로 오름차순
      if (field === 'published_at') {
        params.set('sortDir', 'desc')
      } else {
        params.set('sortDir', 'asc')
      }
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

  // 정렬 옵션 UI에 사용할 도우미 함수
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  // 정렬 옵션 라벨 가져오기
  const getSortLabel = () => {
    switch (sortBy) {
      case 'published_at':
        return '최신순'
      case 'name_en':
        return '이름순(영어)'
      case 'name_ko':
        return '이름순(한국어)'
      case 'name_si':
        return '이름순(싱할라어)'
      default:
        return '정렬'
    }
  }

  return (
    <>
      {/* 상단 영역: 검색어 뱃지와 정렬 버튼 */}
      {data && data.pages[0].content.length !== 0 && (
        <div className="mb-4">
          {/* 정렬 버튼 - 모바일에서는 드롭다운, PC에서는 일반 버튼 */}
          {isMobile ? (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs gap-1">
                    {getSortLabel()}
                    {getSortIcon(sortBy)}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleSortChange('published_at')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>최신순</span>
                    {sortBy === 'published_at' &&
                      (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange('name_en')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>이름순(영어)</span>
                    {sortBy === 'name_en' &&
                      (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange('name_ko')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>이름순(한국어)</span>
                    {sortBy === 'name_ko' &&
                      (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange('name_si')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>이름순(싱할라어)</span>
                    {sortBy === 'name_si' &&
                      (sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <Button
                variant={sortBy === 'published_at' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('published_at')}
                className="text-xs gap-1"
              >
                최신순{getSortIcon('published_at')}
              </Button>
              <Button
                variant={sortBy === 'name_en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('name_en')}
                className="text-xs gap-1"
              >
                이름순(영어){getSortIcon('name_en')}
              </Button>
              <Button
                variant={sortBy === 'name_ko' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('name_ko')}
                className="text-xs gap-1"
              >
                이름순(한국어){getSortIcon('name_ko')}
              </Button>
              <Button
                variant={sortBy === 'name_si' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSortChange('name_si')}
                className="text-xs gap-1"
              >
                이름순(싱할라어){getSortIcon('name_si')}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 검색어 뱃지 */}
      {searchTerm && isMobile && (
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
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

      {data && data.pages[0].content.length !== 0 ? (
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
            <div ref={ref} className="col-span-full flex justify-center gap-2 p-4">
              {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">상품이 없습니다.</div>
      )}
    </>
  )
}
