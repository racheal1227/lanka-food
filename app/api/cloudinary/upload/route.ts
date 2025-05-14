import { v2 as cloudinary } from 'cloudinary'

import { NextRequest, NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, message: '파일이 필요합니다.' }, { status: 400 })
    }

    // 파일 데이터를 ArrayBuffer로 변환
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Base64로 인코딩
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

    // Cloudinary SDK를 사용하여 이미지 업로드
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          upload_preset: 'lanka-food',
          resource_type: 'auto',
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
    })

    return NextResponse.json({
      success: true,
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    })
  } catch (error) {
    console.error('Cloudinary 이미지 업로드 오류:', error)
    return NextResponse.json(
      {
        success: false,
        message: '이미지 업로드 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 },
    )
  }
}
