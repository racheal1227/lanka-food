import { createServerClient } from '@supabase/ssr'

import { NextResponse, type NextRequest } from 'next/server'

import { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and supabase.auth.getUser()
  // A simple mistake could make it very hard to debug issues with users being randomly logged out.
  // !IMPORTANT: DO NOT REMOVE auth.getUser()

  // createServerClient와 supabase.auth.getUser() 사이에 코드를 실행하지 마세요.
  // 작은 실수가 사용자가 무작위로 로그아웃되는 문제를 디버깅하기 매우 어렵게 만들 수 있습니다.
  // !IMPORTANT: auth.getUser()를 제거하지 마세요

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const authRoutes = ['/login', '/auth']
  const protectedRoutes = ['/admin']
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname === route)
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname === route)

  if (!user && isProtectedRoute) {
    // no user, potentially respond by redirecting the user to the login page
    // 사용자가 없는 경우, 로그인 페이지로 사용자를 리다이렉트하여 응답
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // user is logged in, potentially respond by redirecting the user to the home page
    // 사용자가 로그인된 경우, 홈 페이지로 사용자를 리다이렉트하여 응답
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // !IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out of sync and terminate the user's session prematurely!

  // !IMPORTANT: supabaseResponse 객체를 반드시 그대로 반환해야 합니다.
  // NextResponse.next()로 새 응답 객체를 생성하는 경우 다음을 확인하세요:
  // 1. 다음과 같이 요청을 전달하세요:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. 다음과 같이 쿠키를 복사하세요:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. 쿠키는 변경하지 말고 필요에 맞게 myNewResponse 객체를 변경하세요!
  // 4. 마지막으로:
  //    return myNewResponse
  // 이렇게 하지 않으면 브라우저와 서버가 동기화되지 않아 사용자 세션이 조기에 종료될 수 있습니다!

  return supabaseResponse
}
