import { ColumnSort } from '@tanstack/react-table'

import { PageResponse } from '@/types/query.type'

export const createPageResponse = <T>(
  data: T[],
  count: number,
  pageIndex: number,
  pageSize: number,
): PageResponse<T> => {
  const totalPages = Math.ceil(count / pageSize)

  return {
    content: data,
    pagination: {
      isEmpty: data.length === 0,
      isFirst: pageIndex === 0,
      isLast: pageIndex >= totalPages - 1,
      currentPageIndex: pageIndex,
      totalPages,
      count,
      pageSize,
    },
  }
}

export const formatToSupabaseSort = (sort: ColumnSort): [string, { ascending?: boolean; nullsLast?: boolean }] => {
  if (sort.id.includes('.')) {
    const [table, column] = sort.id.split('.')
    return [`${table}(${column})`, { ascending: !sort.desc }]
  }

  // 이름 필드에 대해서 NULL 값을 마지막에 오도록 설정
  const nameFields = ['name_ko', 'name_en', 'name_si']
  if (nameFields.includes(sort.id)) {
    return [sort.id, { ascending: !sort.desc, nullsLast: true }]
  }

  return [sort.id, { ascending: !sort.desc }]
}

export const parseSearchTerms = (searchTerm?: string): string[] => {
  if (!searchTerm) return []
  return searchTerm.split(/\s+/).filter(Boolean)
}

export const applySearchTermsFilter = (
  query: any,
  searchTerms: string[],
  columns: string[] = ['name_ko', 'name_en', 'name_si', 'description'],
) => {
  if (!searchTerms.length) return query

  return query.or(searchTerms.map((term) => columns.map((column) => `${column}.ilike.%${term}%`).join(',')).join(','))
}

export const convertEmptyToNull = (value: string | null | undefined): string | null | undefined =>
  value === '' ? null : value
