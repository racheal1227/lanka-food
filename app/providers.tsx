'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'

import { ThemeProvider } from 'next-themes'

import { Database } from '@/types/database.types'
import { useAuthStore } from '@stores/auth'
import Loader from '@ui/loader'
import { Toaster } from '@ui/toaster'

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = createClientComponentClient<Database>()
  const { user, setUser, logout } = useAuthStore()

  const syncAuth = React.useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      if (user) logout()
      return
    }

    const { data, error } = await supabase.from('users').select('*').eq('id', session.user.id).single()

    if (error) throw error

    setUser(data)
  }, [logout, setUser, supabase, user])

  React.useEffect(() => {
    syncAuth().catch((error) => {
      console.error(error)
      logout()
    })
  }, [syncAuth, logout])

  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data, error } = await supabase.from('users').select('*').eq('id', session.user.id).single()

        if (error) throw error

        setUser(data)
      } else if (event === 'SIGNED_OUT') {
        logout()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase, setUser, logout])

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false, throwOnError: true } },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <React.Suspense fallback={<Loader />}>
          {children}
          <Toaster />
        </React.Suspense>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
