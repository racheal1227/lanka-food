import { createServerClient } from '@supabase/ssr'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { Database } from '@/types/database.types'

// 보호된 라우트 정의 - 접두사 기반 패턴으로 정의
const protectedRoutes = ['/admin']
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 서버 클라이언트 생성
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // 세션 가져오기
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 경로 패턴 확인
  const isProtectedRoute = protectedRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`),
  )

  const isAuthRoute = authRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(`${route}/`),
  )

  // 1. 보호된 라우트 접근 시 인증 체크
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 2. 이미 로그인된 사용자가 인증 페이지 접근 시
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. 세션 갱신을 위한 응답 반환
  return response
}

// 미들웨어가 실행될 경로 패턴 정의
export const config = {
  matcher: [
    /*
     * 다음으로 시작하는 경로를 제외한 모든 요청 경로와 일치:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (Next.js 이미지 최적화 API)
     * - favicon.ico (파비콘 파일)
     * - services (서비스 라우트)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|services).*)',
  ],
}
