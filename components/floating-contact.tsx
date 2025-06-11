'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

interface FloatingContactProps {
  contactUrl: string
}

export default function FloatingContact({ contactUrl }: FloatingContactProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    window.open(contactUrl, '_blank')
  }

  return (
    <Button
      variant="default"
      size="icon"
      className={`fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full shadow-lg transition-all ${
        isHovered ? 'scale-110' : ''
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="판매사 연락하기"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  )
}
