'use client'

import { useState, useEffect } from 'react'

import DesktopNavigation from '@components/DesktopNavigation'
import MobileHeader from '@components/MobileHeader'
import MobileNavigation from '@components/MobileNavigation'
import useIsMobile from '@hooks/use-mobile'

export default function MainNavigation() {
  const isMobile = useIsMobile()
  const [isClient, setIsClient] = useState(false)

  // 클라이언트 사이드 렌더링 감지
  useEffect(() => {
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
