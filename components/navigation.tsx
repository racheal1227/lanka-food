'use client'

import * as React from 'react'

import DesktopNavigation from '@/components/desktop-navigation'
import MobileHeader from '@/components/mobile-header'
import MobileNavigation from '@/components/mobile-navigation'
import { useIsMobile } from '@hooks/use-mobile'

export default function MainNavigation() {
  const isMobile = useIsMobile()
  const [isClient, setIsClient] = React.useState(false)

  // 클라이언트 사이드 렌더링 감지
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // 서버 사이드에서는 아무것도 렌더링하지 않음
  if (!isClient) {
    return null
  }

  if (isMobile) {
    return (
      <>
        <MobileHeader />
        <MobileNavigation />
      </>
    )
  }

  return <DesktopNavigation />
}
