'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'

import { AuthProvider } from '@components/auth/auth-provider'
import Loader from '@ui/loader'
import { Toaster } from '@ui/toaster'

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false, throwOnError: true } },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <React.Suspense fallback={<Loader />}>
          {children}
          <Toaster />
        </React.Suspense>
      </AuthProvider>
    </QueryClientProvider>
  )
}
