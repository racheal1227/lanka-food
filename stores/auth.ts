import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { User } from '@/types/database.models'

interface AuthState {
  user: User | null
  role: 'admin' | 'user' | null
  setUser: (user: User | null) => void
  setRole: (role: 'admin' | 'user' | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      logout: () => set({ user: null, role: null }),
    }),
    { name: 'auth-storage' },
  ),
)
