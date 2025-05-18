import * as React from 'react'

const MOBILE_BREAKPOINT = 768

// 서버사이드에서 User-Agent 기반으로 기본값을 설정할 수도 있음
// 현재는 클라이언트 사이드에서만 동작

export default function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isInitialized, setIsInitialized] = React.useState(false)

  React.useEffect(() => {
    // 서버사이드 렌더링 시 window 객체가 없을 수 있으므로 체크
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }

      // 초기 상태 설정
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setIsInitialized(true)

      // 이벤트 리스너 등록
      mql.addEventListener('change', onChange)

      return () => mql.removeEventListener('change', onChange)
    }

    // 기본적으로 모바일로 간주 (SSR 시)
    return () => {}
  }, [])

  // 처음 마운트되기 전에는 undefined 반환
  if (!isInitialized && typeof window === 'undefined') {
    return undefined
  }

  // SSR에서는 undefined를 반환하지만,
  // 클라이언트에서는 window 객체가 있으면 즉시 계산된 값을 반환
  if (typeof window !== 'undefined' && isMobile === undefined) {
    return window.innerWidth < MOBILE_BREAKPOINT
  }

  return isMobile
}
