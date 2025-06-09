import { Product } from './database.models'

// 관심상품 아이템 (localStorage에 저장될 간소화된 정보)
export interface WishlistItem {
  id: string
  name_en: string
  name_ko: string | null
  featured_images: string[] | null
  category_id: string
  addedAt: string // 추가된 시간 (30일 만료용)
  quantity: number // 수량
}

// 문의자 정보
export interface InquirerInfo {
  name: string // 개인명 또는 회사명
  phone: string // 전화번호 (필수)
  email?: string // 이메일 (선택사항, 복사본 받기용)
  message?: string // 선택적 문의 내용
}

// 문의 요청 데이터
export interface InquiryRequest {
  inquirer: InquirerInfo
  selectedProducts: WishlistItem[]
  timestamp: string
}

// 문의 템플릿 데이터
export interface InquiryTemplate {
  subject: string
  body: string
}

// 관심상품 스토어 상태
export interface WishlistState {
  items: WishlistItem[]
  selectedItems: Set<string> // 문의할 상품 ID들
  isLoading: boolean
}

// 관심상품 스토어 액션
export interface WishlistActions {
  // 관심상품 관리
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  removeSelectedItems: () => void
  clearItems: () => void
  loadItems: () => void

  // 수량 관리
  updateQuantity: (productId: string, quantity: number) => void
  incrementQuantity: (productId: string) => void
  decrementQuantity: (productId: string) => void

  // 문의 상품 선택
  toggleSelection: (productId: string) => void
  selectAll: () => void
  clearSelection: () => void

  // 유틸리티
  getItemCount: () => number
  getSelectedCount: () => number
  isItemSelected: (productId: string) => boolean
  isItemInWishlist: (productId: string) => boolean

  // 만료된 아이템 정리
  cleanExpiredItems: () => void
}

export type WishlistStore = WishlistState & WishlistActions
