import nodemailer from 'nodemailer'

// 이메일 설정 타입
interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// 문의 이메일 데이터 타입
interface ContactEmailData {
  name: string
  phone: string
  message: string
  email?: string
  selectedProducts: {
    name: string
    quantity: number
  }[]
}

// 이메일 transporter 생성
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '', // Gmail 앱 비밀번호
    },
  }

  return nodemailer.createTransport(config)
}

// 문의 이메일 발송
export const sendContactEmail = async (data: ContactEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    // 제목 자동 생성
    const subject = `[Lanka Food 상품 문의] - ${data.name}`

    // 선택된 상품 목록을 HTML로 변환
    const selectedProductsHtml = `
      <h3 style="color: #555; margin-top: 0; margin-bottom: 15px;">선택된 상품 (총 ${data.selectedProducts.length}종)</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: 600; color: #555;">상품명</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: 600; color: #555; width: 100px;">수량</th>
          </tr>
        </thead>
        <tbody>
          ${data.selectedProducts
            .map(
              (product) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; color: #333; line-height: 1.5;">${product.name}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: #333; font-weight: 600;">${product.quantity}개</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `

    // 이메일 내용 구성
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #cccccc; padding-bottom: 10px;">Lanka Food 상품 문의</h2>
        <div style="padding: 20px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0; margin-bottom: 15px;">문의자 정보</h3>
          <p style="margin: 0 0 8px 0; line-height: 1.5;">
            <strong>이름:</strong> ${data.name}
          </p>
          <p style="margin: 0 0 8px 0; line-height: 1.5;">
            <strong>연락처:</strong> ${data.phone}
          </p>
          ${data.email ? `<p style="margin: 0; line-height: 1.5;"><strong>이메일:</strong> ${data.email}</p>` : ''}
        </div>

        <div style="padding: 20px; margin: 20px 0;">
          ${selectedProductsHtml}
        </div>
        
        <div style="padding: 20px; margin: 20px 0;">
          <h3 style="color: #555; margin-top: 0; margin-bottom: 15px;">문의 내용</h3>
          <p style="line-height: 1.6; white-space: pre-wrap; color: #333; margin: 0;">${data.message}</p>
        </div>

        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #666;">
          <p style="margin: 0;">이 이메일은 Lanka Food 웹사이트에서 자동으로 발송되었습니다.</p>
          <p style="margin: 5px 0 0 0;">발송 시간: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
      </div>
    `

    // 메일 옵션 설정
    const mailOptions = {
      from: `"Lanka Food" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: 'racheal1227@gmail.com',
      subject,
      html: htmlContent,
      replyTo: data.email, // 답장 시 문의자 이메일로 전송
    }

    // 이메일 발송
    const info = await transporter.sendMail(mailOptions)
    console.log('이메일 발송 성공:', info.messageId)

    return true
  } catch (error) {
    console.error('이메일 발송 실패:', error)
    return false
  }
}

// 이메일 설정 테스트
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('이메일 연결 테스트 성공')
    return true
  } catch (error) {
    console.error('이메일 연결 테스트 실패:', error)
    return false
  }
}
