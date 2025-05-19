import { ColumnSort } from '@tanstack/react-table'

export interface PageResponse<T> {
  content: T[]
  pagination: {
    isEmpty: boolean
    isFirst: boolean
    isLast: boolean
    currentPageIndex: number
    totalPages: number
    count: number
    pageSize: number
  }
}

export interface QueryParams {
  pageIndex: number
  pageSize: number
  sorting: ColumnSort[]
  searchTerm?: string
}

export interface QueryParamsWithDateRange extends QueryParams {
  startDate: string
  endDate: string
}
