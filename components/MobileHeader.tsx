'use client'

import Link from 'next/link'

export default function MobileHeader() {
  return (
    <div className="w-full bg-background border-b py-4 px-6 flex items-center">
      <Link href="/" className="inline-block">
        <b>Lanka Food</b>
      </Link>
    </div>
  )
}
