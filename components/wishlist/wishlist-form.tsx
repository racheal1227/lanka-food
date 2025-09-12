'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, Heart, Send } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { CldImage } from 'next-cloudinary'

import { toast } from '@hooks/use-toast'
import { useWishlistStore } from '@stores/wishlist'
import { Button } from '@ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card'
import { Input } from '@ui/input'
import { Label } from '@ui/label'
import { Textarea } from '@ui/textarea'
import { showErrorToast } from '@utils/show-error-toast'

const orderFormSchema = z.object({
  name: z.string().min(1, '이름 또는 회사명을 입력해주세요'),
  phone: z.string().min(1, '전화번호를 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요').optional().or(z.literal('')),
  message: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderFormSchema>

interface WishlistFormProps {
  onClose: () => void
  onSubmit: () => void
}

export default function WishlistForm({ onClose, onSubmit }: WishlistFormProps) {
  const { items, selectedItems } = useWishlistStore()
  const selectedProducts = items.filter((item) => selectedItems.has(item.id))

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/[^\d]/g, '')

    if (numbers.length <= 3) {
      return numbers
    }
    if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
  }

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  })

  // 주문 전송 함수
  const sendOrder = async (data: OrderFormData) => {
    try {
      // 선택된 상품 데이터 구성
      const selectedProductsData = selectedProducts.map((product) => ({
        name: `${product.name_ko || ''} / ${product.name_en}`.trim().replace(/^\/\s*/, ''),
        quantity: product.quantity,
      }))

      // 이메일 API 호출
      const response = await fetch('/api/email/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email?.trim() || undefined,
          phone: data.phone,
          message: data.message || '(특별한 주문사항 없음)',
          selectedProducts: selectedProductsData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || '이메일 발송에 실패했습니다.')
      }

      return data
    } catch (error) {
      console.error('주문 전송 오류:', error)
      throw error
    }
  }

  const mutation = useMutation({
    mutationFn: sendOrder,
    onSuccess: () => {
      toast({
        title: '성공',
        description: '주문이 성공적으로 전송되었습니다.담당자가 빠른 시일 내에 연락드리겠습니다.',
      })
      onSubmit()
    },
    onError: (error) => {
      showErrorToast(error, '주문 전송 중 오류가 발생했습니다.')
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onClose} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            장바구니로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold mb-2">상품 주문</h1>
          <p className="text-muted-foreground">선택하신 상품에 대해 판매자에게 주문하실 수 있습니다.</p>
        </div>

        {/* 선택된 상품 목록 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">선택된 상품 ({selectedProducts.length}종)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {product.featured_images && product.featured_images[0] ? (
                      <CldImage
                        width="48"
                        height="48"
                        src={product.featured_images[0]}
                        alt={product.name_en}
                        crop="fill"
                        gravity="center"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name_en}</p>
                    {product.name_ko && <p className="text-sm text-muted-foreground truncate">{product.name_ko}</p>}
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                    <span>수량: {product.quantity} 박스</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 주문 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">주문자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
              <div>
                <Label htmlFor="name">
                  이름 또는 회사명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="개인명 또는 회사명을 입력해주세요"
                  className="mt-1"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">
                  전화번호 <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="phone"
                      type="tel"
                      maxLength={15}
                      placeholder="전화번호를 입력해주세요"
                      className="mt-1"
                      value={field.value}
                      onChange={(event) => {
                        const formatted = formatPhoneNumber(event.target.value)
                        field.onChange(formatted)
                      }}
                    />
                  )}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">이메일 (선택사항)</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="주문 복사본을 받으시려면 이메일을 입력해주세요"
                  className="mt-1"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="message">주문 내용 (선택사항)</Label>
                <Textarea
                  id="message"
                  {...form.register('message')}
                  placeholder="구체적인 주문사항이 있으시면 적어주세요 (예: 수량, 배송, 가격 협의 등)"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  취소
                </Button>
                <Button type="submit" disabled={mutation.isPending} className="flex-1">
                  {mutation.isPending ? (
                    '전송 중...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      전송
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 안내 사항 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📧 주문 전송 안내</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 담당자가 신속히 검토하여 빠른 시일 내에 답변 드리겠습니다.</li>
            <li>
              • 답변이 지연될 경우 전화로 연락해 주세요:
              <br />
              &nbsp;&nbsp;<strong>010-4123-2931</strong> / <strong>010-7338-0028</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
