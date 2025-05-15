'use client'

import Link from 'next/link'

export default function MobileHeader() {
  return (
    <div className="w-full bg-background border-b py-4 px-6">
      <Link href="/" className="flex items-center gap-2">
        <b>Lanka Food</b>
      </Link>
    </div>
  )
}
