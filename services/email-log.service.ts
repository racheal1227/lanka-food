import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import supabase from '@/lib/supabase'
import supabaseServer from '@/lib/supabase-server'

import type { EmailLog, EmailLogInsert, EmailLogUpdate, EmailLogProduct } from '@/types/database.models'

// 한국 시간으로 포맷팅하는 유틸리티 함수
export const formatToKoreanTime = (utcDateString: string): string => {
  const date = new Date(utcDateString)
  // UTC 시간을 한국 시간(+9시간)으로 변환
  const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return format(koreanTime, 'yyyy-MM-dd HH:mm:ss', { locale: ko })
}

// 현재 UTC 시간을 ISO 문자열로 반환
export const getCurrentUTCTime = (): string => new Date().toISOString()

// 이메일 로그 생성
export const createEmailLog = async (data: {
  senderName: string
  senderPhone: string
  senderEmail?: string
  subject: string
  message?: string
  selectedProducts?: EmailLogProduct[]
  userAgent?: string
  ipAddress?: string
}): Promise<EmailLog | null> => {
  try {
    const logData: EmailLogInsert = {
      sender_name: data.senderName,
      sender_phone: data.senderPhone,
      sender_email: data.senderEmail || null,
      subject: data.subject,
      message: data.message || null,
      selected_products: data.selectedProducts || null,
      status: 'pending',
      admin_email_sent: false,
      user_email_sent: false,
      error_message: null,
      message_id: null,
      sent_at: null,
      failed_at: null,
      user_agent: data.userAgent || null,
      ip_address: data.ipAddress || null,
    }

    const { data: result, error } = await supabaseServer.from('email_logs').insert(logData).select().single()

    if (error) {
      console.error('이메일 로그 생성 실패:', error)
      return null
    }
    return result as unknown as EmailLog
  } catch (error) {
    console.error('이메일 로그 생성 중 오류:', error)
    return null
  }
}

// 이메일 로그 업데이트 (발송 성공)
export const updateEmailLogSuccess = async (
  logId: string,
  data: {
    messageId?: string
    adminEmailSent?: boolean
    userEmailSent?: boolean
  },
): Promise<boolean> => {
  try {
    const updateData: EmailLogUpdate = {
      status: 'sent',
      sent_at: getCurrentUTCTime(),
      message_id: data.messageId || null,
      admin_email_sent: data.adminEmailSent || false,
      user_email_sent: data.userEmailSent || false,
    }

    const { error } = await supabaseServer.from('email_logs').update(updateData).eq('id', logId)

    if (error) {
      console.error('이메일 로그 업데이트 실패:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('이메일 로그 업데이트 중 오류:', error)
    return false
  }
}

// 이메일 로그 업데이트 (발송 실패)
export const updateEmailLogFailure = async (logId: string, errorMessage: string): Promise<boolean> => {
  try {
    const updateData: EmailLogUpdate = {
      status: 'failed',
      failed_at: getCurrentUTCTime(),
      error_message: errorMessage,
    }

    const { error } = await supabaseServer.from('email_logs').update(updateData).eq('id', logId)

    if (error) {
      console.error('이메일 로그 실패 업데이트 실패:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('이메일 로그 실패 업데이트 중 오류:', error)
    return false
  }
}

// 이메일 로그 조회 (관리자용)
export const getEmailLogs = async (params: {
  page?: number
  limit?: number
  status?: string
  startDate?: string
  endDate?: string
}): Promise<{
  data: EmailLog[]
  total: number
  hasMore: boolean
}> => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate } = params
    const offset = (page - 1) * limit

    let query = supabase.from('email_logs').select('*', { count: 'exact' }).order('created_at', { ascending: false })

    // 상태 필터
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // 날짜 필터 (한국 시간을 UTC로 변환하여 검색)
    if (startDate) {
      const utcStartDate = new Date(`${startDate}T00:00:00+09:00`).toISOString()
      query = query.gte('created_at', utcStartDate)
    }

    if (endDate) {
      const utcEndDate = new Date(`${endDate}T23:59:59+09:00`).toISOString()
      query = query.lte('created_at', utcEndDate)
    }

    // 페이지네이션
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('이메일 로그 조회 실패:', error)
      return { data: [], total: 0, hasMore: false }
    }

    const total = count || 0
    const hasMore = offset + limit < total

    return {
      data: (data as unknown as EmailLog[]) || [],
      total,
      hasMore,
    }
  } catch (error) {
    console.error('이메일 로그 조회 중 오류:', error)
    return { data: [], total: 0, hasMore: false }
  }
}

// 단일 이메일 로그 조회
export const getEmailLogById = async (logId: string): Promise<EmailLog | null> => {
  try {
    const { data, error } = await supabase.from('email_logs').select('*').eq('id', logId).single()

    if (error) {
      console.error('이메일 로그 단일 조회 실패:', error)
      return null
    }

    return data as unknown as EmailLog
  } catch (error) {
    console.error('이메일 로그 단일 조회 중 오류:', error)
    return null
  }
}

// 통계 정보 조회
export const getEmailLogStats = async (): Promise<{
  total: number
  sent: number
  failed: number
  pending: number
  todayTotal: number
}> => {
  try {
    // 전체 통계
    const { count: total } = await supabase.from('email_logs').select('*', { count: 'exact', head: true })

    const { count: sent } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')

    const { count: failed } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')

    const { count: pending } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // 오늘 통계 (한국 시간 기준)
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayStartUTC = new Date(todayStart.getTime() - 9 * 60 * 60 * 1000).toISOString() // 한국시간을 UTC로 변환

    const { count: todayTotal } = await supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStartUTC)

    return {
      total: total || 0,
      sent: sent || 0,
      failed: failed || 0,
      pending: pending || 0,
      todayTotal: todayTotal || 0,
    }
  } catch (error) {
    console.error('이메일 로그 통계 조회 중 오류:', error)
    return {
      total: 0,
      sent: 0,
      failed: 0,
      pending: 0,
      todayTotal: 0,
    }
  }
}
