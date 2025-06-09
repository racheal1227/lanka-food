import { WishlistItem } from '@/types/wishlist.type'

const WISHLIST_STORAGE_KEY = 'lanka-food-wishlist'
const EXPIRY_DAYS = 30

/**
 * 만료되지 않은 아이템인지 확인합니다 (30일)
 */
function isNotExpired(item: WishlistItem): boolean {
  const addedDate = new Date(item.addedAt)
  const now = new Date()
  const diffInDays = (now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)

  return diffInDays <= EXPIRY_DAYS
}

/**
 * localStorage에서 장바구니 목록을 가져옵니다
 */
export function getWishlistFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
    if (!stored) return []

    const items: any[] = JSON.parse(stored)

    // 기존 데이터에 quantity 필드가 없을 수 있으므로 기본값 설정
    const itemsWithQuantity: WishlistItem[] = items.map((item) => ({
      ...item,
      quantity: item.quantity || 1, // 기존 아이템에 quantity가 없으면 1로 설정
    }))

    return itemsWithQuantity.filter(isNotExpired)
  } catch (error) {
    console.error('위시리스트 로딩 중 오류:', error)
    return []
  }
}

/**
 * localStorage에 장바구니 목록을 저장합니다
 */
export function saveWishlistToStorage(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return

  try {
    const validItems = items.filter(isNotExpired)
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(validItems))
  } catch (error) {
    console.error('위시리스트 저장 중 오류:', error)
  }
}

/**
 * 장바구니에 상품을 추가합니다
 */
export function addItemToStorage(item: WishlistItem): WishlistItem[] {
  const currentItems = getWishlistFromStorage()

  // 이미 존재하는 아이템인지 확인
  const existingIndex = currentItems.findIndex((existing) => existing.id === item.id)

  if (existingIndex !== -1) {
    // 이미 존재하면 수량 증가 및 시간 업데이트
    currentItems[existingIndex].quantity += 1
    currentItems[existingIndex].addedAt = new Date().toISOString()
  } else {
    // 새 아이템 추가
    currentItems.push(item)
  }

  saveWishlistToStorage(currentItems)
  return currentItems
}

/**
 * localStorage에서 관심상품을 제거합니다
 */
export function removeItemFromStorage(productId: string): WishlistItem[] {
  const currentItems = getWishlistFromStorage()
  const filteredItems = currentItems.filter((item) => item.id !== productId)

  saveWishlistToStorage(filteredItems)
  return filteredItems
}

/**
 * localStorage의 관심상품을 모두 삭제합니다
 */
export function clearWishlistStorage(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY)
  } catch (error) {
    console.error('위시리스트 삭제 중 오류:', error)
  }
}

/**
 * 만료된 아이템들을 정리합니다
 */
export function cleanExpiredItems(): WishlistItem[] {
  const currentItems = getWishlistFromStorage()
  const validItems = currentItems.filter(isNotExpired)

  if (validItems.length !== currentItems.length) {
    saveWishlistToStorage(validItems)
  }

  return validItems
}

/**
 * 특정 상품이 관심목록에 있는지 확인합니다
 */
export function isItemInWishlist(productId: string): boolean {
  const items = getWishlistFromStorage()
  return items.some((item) => item.id === productId)
}
