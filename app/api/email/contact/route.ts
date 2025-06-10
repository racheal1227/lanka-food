import { z } from 'zod'

import { NextRequest, NextResponse } from 'next/server'

import { sendContactEmail } from '@/services/email.service'

// 문의 데이터 유효성 검사 스키마
const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이하로 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  phone: z.string().optional(),
  message: z.string().max(1000, '문의 내용은 1000자 이하로 입력해주세요').optional(),
  selectedProducts: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number(),
      }),
    )
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 요청 데이터 유효성 검사
    const validatedData = contactSchema.parse(body)

    // 이메일 발송
    const success = await sendContactEmail(validatedData)

    if (success) {
      return NextResponse.json(
        {
          message: '문의가 성공적으로 전송되었습니다.',
          success: true,
        },
        { status: 200 },
      )
    }
    return NextResponse.json(
      {
        message: '이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
        success: false,
      },
      { status: 500 },
    )
  } catch (error) {
    console.error('문의 이메일 API 오류:', error)

    // Zod 유효성 검사 오류 처리
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: '입력 데이터가 올바르지 않습니다.',
          errors: error.errors,
          success: false,
        },
        { status: 400 },
      )
    }

    // 기타 오류 처리
    return NextResponse.json(
      {
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        success: false,
      },
      { status: 500 },
    )
  }
}

// 헬스 체크용 GET 메서드
export async function GET() {
  return NextResponse.json(
    {
      message: 'Contact API is working',
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  )
}
