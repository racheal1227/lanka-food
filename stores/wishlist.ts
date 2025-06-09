import React from 'react'
import { create } from 'zustand'

import {
  getWishlistFromStorage,
  addItemToStorage,
  removeItemFromStorage,
  clearWishlistStorage,
  cleanExpiredItems,
} from '@/lib/wishlist-storage'
import { Product } from '@/types/database.models'
import { WishlistStore, WishlistItem } from '@/types/wishlist.type'

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  // 초기 상태
  items: [],
  selectedItems: new Set(),
  isLoading: false,

  // 장바구니 관리
  addItem: (product: Product) => {
    const wishlistItem: WishlistItem = {
      id: product.id,
      name_en: product.name_en,
      name_ko: product.name_ko,
      featured_images: product.featured_images,
      category_id: product.category_id,
      addedAt: new Date().toISOString(),
      quantity: 1, // 기본 수량
    }

    const updatedItems = addItemToStorage(wishlistItem)
    set({ items: updatedItems })
  },

  removeItem: (productId: string) => {
    const updatedItems = removeItemFromStorage(productId)
    set((state) => {
      const newSelected = new Set(state.selectedItems)
      newSelected.delete(productId)
      return {
        items: updatedItems,
        selectedItems: newSelected,
      }
    })
  },

  clearItems: () => {
    clearWishlistStorage()
    set({ items: [], selectedItems: new Set() })
  },

  loadItems: () => {
    set({ isLoading: true })
    try {
      const items = cleanExpiredItems()
      set({ items, isLoading: false })
    } catch (error) {
      console.error('장바구니 로딩 중 오류:', error)
      set({ items: [], isLoading: false })
    }
  },

  // 수량 관리
  updateQuantity: (productId: string, quantity: number) => {
    if (quantity < 1) return // 최소 수량 1개

    set((state) => ({
      items: state.items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    }))

    // localStorage 업데이트
    const updatedItems = get().items
    localStorage.setItem('lanka-food-wishlist', JSON.stringify(updatedItems))
  },

  incrementQuantity: (productId: string) => {
    const { updateQuantity, items } = get()
    const item = items.find((item) => item.id === productId)
    if (item) {
      updateQuantity(productId, item.quantity + 1)
    }
  },

  decrementQuantity: (productId: string) => {
    const { updateQuantity, items } = get()
    const item = items.find((item) => item.id === productId)
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1)
    }
  },

  // 문의 상품 선택
  toggleSelection: (productId: string) => {
    set((state) => {
      const newSelected = new Set(state.selectedItems)
      if (newSelected.has(productId)) {
        newSelected.delete(productId)
      } else {
        newSelected.add(productId)
      }
      return { selectedItems: newSelected }
    })
  },

  selectAll: () => {
    set((state) => ({
      selectedItems: new Set(state.items.map((item) => item.id)),
    }))
  },

  clearSelection: () => {
    set({ selectedItems: new Set() })
  },

  // 유틸리티
  getItemCount: () => get().items.length,

  getSelectedCount: () => get().selectedItems.size,

  isItemSelected: (productId: string) => get().selectedItems.has(productId),

  isItemInWishlist: (productId: string) => get().items.some((item) => item.id === productId),

  cleanExpiredItems: () => {
    const validItems = cleanExpiredItems()
    set((state) => {
      const newSelected = new Set<string>()
      state.selectedItems.forEach((id) => {
        if (validItems.some((item) => item.id === id)) {
          newSelected.add(id)
        }
      })
      return {
        items: validItems,
        selectedItems: newSelected,
      }
    })
  },
}))

// 자동으로 만료된 아이템 정리 (컴포넌트 마운트 시)
export const useWishlistAutoCleanup = () => {
  const { loadItems } = useWishlistStore()

  // 컴포넌트가 마운트될 때 자동으로 로드 및 정리
  React.useEffect(() => {
    loadItems()
  }, [loadItems])
}
