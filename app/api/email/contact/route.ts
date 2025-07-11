import { z } from 'zod'

import { NextRequest, NextResponse } from 'next/server'

import { createEmailLog, updateEmailLogSuccess, updateEmailLogFailure } from '@/services/email-log.service'
import { sendContactEmail, sendOrderCopyToUser } from '@/services/email.service'

// 주문 데이터 유효성 검사 스키마
const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(50, '이름은 50자 이하로 입력해주세요'),
  phone: z.string().min(1, '연락처를 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요').optional(),
  message: z.string().max(1000, '주문 내용은 1000자 이하로 입력해주세요').optional(),
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

    // 메타데이터 수집
    const userAgent = request.headers.get('user-agent') || undefined
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIP || undefined

    // 이메일 로그 생성
    const emailLog = await createEmailLog({
      senderName: validatedData.name,
      senderPhone: validatedData.phone,
      senderEmail: validatedData.email,
      subject: `[Lanka Food 상품 주문] - ${validatedData.name}`,
      message: validatedData.message,
      selectedProducts: validatedData.selectedProducts,
      userAgent,
      ipAddress,
    })

    if (!emailLog) {
      console.error('이메일 로그 생성 실패')
    }

    // 관리자에게 이메일 발송
    const adminEmailResult = await sendContactEmail(validatedData)

    let userEmailResult: { success: boolean; messageId?: string } = { success: true }
    // 사용자가 이메일을 제공했다면 복사본 발송
    if (validatedData.email && validatedData.email.trim()) {
      userEmailResult = await sendOrderCopyToUser(validatedData)
    }

    // 로그 업데이트
    if (emailLog) {
      if (adminEmailResult.success) {
        await updateEmailLogSuccess(emailLog.id, {
          messageId: adminEmailResult.messageId,
          adminEmailSent: true,
          userEmailSent: userEmailResult.success,
        })
      } else {
        await updateEmailLogFailure(emailLog.id, '이메일 발송 실패')
      }
    }

    if (adminEmailResult.success) {
      if (validatedData.email && !userEmailResult.success) {
        return NextResponse.json(
          {
            message: '주문은 접수되었으나, 복사본 발송에 실패했습니다.',
            success: true,
            warning: '복사본 이메일 발송 실패',
          },
          { status: 200 },
        )
      }

      return NextResponse.json(
        {
          message: validatedData.email
            ? '주문이 성공적으로 전송되었습니다. 입력하신 이메일로 복사본을 발송했습니다.'
            : '주문이 성공적으로 전송되었습니다.',
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
    console.error('주문 이메일 API 오류:', error)

    // Zod 유효성 검사 오류 처리
    if (error instanceof z.ZodError) {
      console.error('유효성 검사 오류:', error.errors)
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
        error: error instanceof Error ? error.message : '알 수 없는 오류',
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
