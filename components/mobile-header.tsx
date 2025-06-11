'use client'

import Link from 'next/link'

export default function MobileHeader() {
  // 로고 클릭 시 스크롤 맨 위로 이동
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="w-full bg-gray-50 border-b py-4 px-6 flex items-center">
      <Link href="/" className="inline-block" onClick={handleLogoClick}>
        <b>Lanka Food</b>
      </Link>
    </div>
  )
}
