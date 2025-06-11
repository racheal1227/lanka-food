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

// 주문 이메일 데이터 타입
interface ContactEmailData {
  name: string
  phone: string
  email?: string
  message?: string
  selectedProducts?: { name: string; quantity: number }[]
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

// 주문 이메일 발송
export const sendContactEmail = async (data: ContactEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    // 제목 자동 생성
    const subject = `[Lanka Food 상품 주문] - ${data.name}`

    // 선택된 상품 목록을 HTML로 변환
    const selectedProductsHtml = data.selectedProducts?.length
      ? `
      <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">상품 목록 (총 ${data.selectedProducts.length}종)</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: 600; color: #333;">상품명</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: 600; color: #333; width: 100px;">수량</th>
          </tr>
        </thead>
        <tbody>
          ${data.selectedProducts
            .map(
              (product) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; color: #333; line-height: 1.5;">${product.name}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: #333; font-weight: 600;">${product.quantity} 박스</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `
      : ''

    // 이메일 내용 구성
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="border-bottom: 2px solid #cccccc; padding-bottom: 10px; color: #333;">Lanka Food 상품 주문</h2>
        <div style="padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">주문자 정보</h3>
          <p style="margin: 0 0 8px 0; line-height: 1.5; color: #333;">
            • 이름: ${data.name}
          </p>
          <p style="margin: 0 0 8px 0; line-height: 1.5; color: #333;">
            • 연락처: ${data.phone}
          </p>
          ${data.email ? `<p style="margin: 0; line-height: 1.5; color: #333;">• 이메일: ${data.email}</p>` : ''}
        </div>

        ${
          selectedProductsHtml
            ? `
        <div style="padding: 20px; margin: 20px 0;">
          ${selectedProductsHtml}
        </div>
        `
            : ''
        }
        
        ${
          data.message
            ? `
        <div style="padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">주문 내용</h3>
          <p style="line-height: 1.6; white-space: pre-wrap; color: #333; margin: 0;">${data.message}</p>
        </div>
        `
            : ''
        }

        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #333;">
          <p style="margin: 0;">이 이메일은 Lanka Food 웹사이트에서 자동으로 발송되었습니다.</p>
          <p style="margin: 5px 0 0 0;">발송 시간: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
      </div>
    `

    // 메일 옵션 설정
    const mailOptions = {
      from: `"Lanka Food" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      // to: process.env.EMAIL_ADMIN,
      to: 'racheal1227@gmail.com',
      subject,
      html: htmlContent,
      replyTo: data.email, // 답장 시 주문자 이메일로 전송
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

// 사용자에게 주문서 복사본 발송
export const sendOrderCopyToUser = async (data: ContactEmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    // 선택된 상품 목록을 HTML로 변환 (사용자용)
    const selectedProductsHtml = data.selectedProducts?.length
      ? `
      <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">상품 목록 (총 ${data.selectedProducts.length}종)</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 0;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: 600; color: #333;">상품명</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: 600; color: #333; width: 100px;">수량</th>
          </tr>
        </thead>
        <tbody>
          ${data.selectedProducts
            .map(
              (product) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 12px; color: #333; line-height: 1.5;">${product.name}</td>
              <td style="border: 1px solid #ddd; padding: 12px; text-align: center; color: #333; font-weight: 600;">${product.quantity} 박스</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `
      : ''

    // 사용자용 이메일 내용 구성
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Lanka Food 주문 접수 확인</h2>
        
        <div style="padding: 20px; margin: 20px 0; background-color: #f0f8ff; border-radius: 8px;">
          <h3 style="color: #2e7d32; margin-top: 0; margin-bottom: 10px;">✅ 주문이 성공적으로 접수되었습니다</h3>
          <p style="margin: 0; color: #333; line-height: 1.5;">
            안녕하세요 <strong>${data.name}</strong> 님,<br/>
            Lanka Food에 주문해 주셔서 감사합니다. <br/>
            보내주신 주문 내용을 확인했으며,<br/>
            담당자가 신속히 검토하여 빠른 시일 내에 답변드리겠습니다.<br/>
          </p>
        </div>

        <div style="padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">주문자 정보</h3>
          <p style="margin: 0 0 8px 0; line-height: 1.5; color: #333;">
            • 이름: ${data.name}
          </p>
          <p style="margin: 0 0 8px 0; line-height: 1.5; color: #333;">
            • 연락처: ${data.phone}
          </p>
          ${data.email ? `<p style="margin: 0; line-height: 1.5; color: #333;">• 이메일: ${data.email}</p>` : ''}
        </div>

        ${
          selectedProductsHtml
            ? `
        <div style="padding: 20px; margin: 20px 0;">
          ${selectedProductsHtml}
        </div>
        `
            : ''
        }
        
        ${
          data.message
            ? `
        <div style="padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; margin-bottom: 15px; color: #333;">주문 내용</h3>
          <p style="line-height: 1.6; white-space: pre-wrap; color: #333; margin: 0;">${data.message}</p>
        </div>
        `
            : ''
        }

        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #333; margin: 0 0 10px 0;">📞 빠른 연락</h4>
          <p style="color: #333; margin: 0; line-height: 1.5;">
            급하신 경우 전화로 연락해 주세요: <strong>010-4123-2931</strong> / <strong>010-7338-0028</strong><br/>
          </p>
        </div>

        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 12px; color: #333;">
          <p style="margin: 0;">이 이메일은 Lanka Food 웹사이트에서 자동으로 발송되었습니다.</p>
          <p style="margin: 5px 0 0 0;">발송 시간: ${new Date().toLocaleString('ko-KR')}</p>
        </div>
      </div>
    `

    // 사용자용 메일 옵션 설정
    const mailOptions = {
      from: `"Lanka Food" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: data.email,
      subject: `[Lanka Food] 주문 접수 확인 - ${data.name}님`,
      html: htmlContent,
    }

    // 이메일 발송
    const info = await transporter.sendMail(mailOptions)
    console.log('사용자 복사본 이메일 발송 성공:', info.messageId)

    return true
  } catch (error) {
    console.error('사용자 복사본 이메일 발송 실패:', error)
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
