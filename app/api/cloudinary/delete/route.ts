import { v2 as cloudinary } from 'cloudinary'

import { NextRequest, NextResponse } from 'next/server'

// Cloudinary 설정
cloudinary.config({
  cloud_name: 'docccqe8x',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
})

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ success: false, message: 'Public ID가 필요합니다.' }, { status: 400 })
    }

    // Cloudinary SDK를 사용하여 이미지 삭제
    const deleteResult = await new Promise<{ result: string }>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: any, callbackResult: any) => {
        if (error) reject(error)
        else resolve(callbackResult)
      })
    })

    if (deleteResult.result === 'ok') {
      return NextResponse.json({ success: true, message: '이미지가 성공적으로 삭제되었습니다.' })
    }
    return NextResponse.json({ success: false, message: `이미지 삭제 실패: ${deleteResult.result}` }, { status: 500 })
  } catch (error) {
    console.error('Cloudinary 이미지 삭제 오류:', error)
    return NextResponse.json(
      {
        success: false,
        message: '이미지 삭제 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 },
    )
  }
}
