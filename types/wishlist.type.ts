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

// 주문자 정보
export interface OrdererInfo {
  name: string // 개인명 또는 회사명
  phone: string // 전화번호 (필수)
  email?: string // 이메일 (선택사항, 복사본 받기용)
  message?: string // 선택적 주문 내용
}

// 주문 요청 데이터
export interface OrderRequest {
  orderer: OrdererInfo
  selectedProducts: WishlistItem[]
  timestamp: string
}

// 주문 템플릿 데이터
export interface OrderTemplate {
  subject: string
  body: string
}

// 관심상품 스토어 상태
export interface WishlistState {
  items: WishlistItem[]
  selectedItems: Set<string> // 주문할 상품 ID들
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

  // 주문 상품 선택
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
