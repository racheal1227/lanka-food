'use client'

import DesktopNavigation from '@components/DesktopNavigation'
import MobileHeader from '@components/MobileHeader'
import MobileNavigation from '@components/MobileNavigation'
import useIsMobile from '@hooks/use-mobile'

export default function MainNavigation() {
  const isMobile = useIsMobile()

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
