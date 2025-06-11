'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import { Separator } from '@ui/separator'

export default function HeroSection() {
  const searchParams = useSearchParams()

  // 카테고리나 검색어가 있으면 히어로 섹션을 숨김
  const selectedCategory = searchParams.get('category')
  const searchTerm = searchParams.get('searchTerm')

  // 카테고리 정렬이나 검색 시에는 히어로 섹션을 보이지 않음
  if (selectedCategory || searchTerm) {
    return null
  }

  return (
    <div className="w-full mb-6 sm:mb-8 md:mb-10">
      <div className="relative w-full aspect-[2/1]">
        <Image src="/hero.jpg" alt="Lanka Food Hero" fill className="object-cover" priority sizes="100vw" />
      </div>
      <div className="mt-6 sm:mt-8 md:mt-10">
        <Separator />
      </div>
    </div>
  )
}
