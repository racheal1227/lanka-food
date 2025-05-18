'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCategoriesQuery } from '@/hooks/use-category'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { uploadImageArray } from '@/services/product.service'
import { Product } from '@/types/database.models'
import { showErrorToast } from '@/utils/show-error-toast'
import MultiImageUpload, { ClientImage } from '@components/admin/product/multi-image-upload'
import { Button } from '@ui/button'
import { Calendar } from '@ui/calendar'
import { Checkbox } from '@ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@ui/form'
import { Input } from '@ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select'
import { Textarea } from '@ui/textarea'

const productSchema = z.object({
  category_id: z.string({ required_error: '카테고리를 선택해주세요.' }).min(1, { message: '카테고리를 선택해주세요.' }),
  name_en: z.string({ required_error: '상품명을 입력해주세요.' }).min(1, { message: '상품명을 입력해주세요.' }),
  name_ko: z.string().optional(),
  name_si: z.string().optional(),
  description: z.string().optional(),
  price_krw: z.coerce
    .number({ required_error: '가격을 입력해주세요.' })
    .positive({ message: '가격은 0보다 커야 합니다.' }),
  stock_quantity: z.coerce
    .number({ required_error: '재고를 입력해주세요.' })
    .nonnegative({ message: '재고는 음수가 될 수 없습니다.' }),
  is_available: z.boolean(),
  is_recommended: z.boolean(),
  featured_images: z.array(z.string()).nullable().optional(),
  detail_images: z.array(z.string()).nullable().optional(),
  published_at: z.date({ required_error: '상품 등록 일자를 선택해주세요.' }),
})

export type FormValues = z.infer<typeof productSchema>

export interface ProductFormProps {
  product?: Product
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

function ProductFormContent({ product, onSubmit, onCancel }: ProductFormProps) {
  const { data: categories } = useCategoriesQuery()

  const initialFeaturedImages: ClientImage[] =
    product?.featured_images
      ?.filter((url) => url && typeof url === 'string' && url.trim() !== '')
      .map((publicId) => ({
        id: `uploaded-${publicId}`,
        file: new File([], 'placeholder'),
        uploaded: true,
        publicId,
      })) || []

  const initialDetailImages: ClientImage[] =
    product?.detail_images
      ?.filter((url) => url && typeof url === 'string' && url.trim() !== '')
      .map((publicId) => ({
        id: `uploaded-${publicId}`,
        file: new File([], 'placeholder'),
        uploaded: true,
        publicId,
      })) || []

  const [featuredClientImages, setFeaturedClientImages] = React.useState<ClientImage[]>(initialFeaturedImages)
  const [detailClientImages, setDetailClientImages] = React.useState<ClientImage[]>(initialDetailImages)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedHour, setSelectedHour] = React.useState<number>(new Date().getHours())
  const [selectedMinute, setSelectedMinute] = React.useState<number>(new Date().getMinutes())
  const [tempDate, setTempDate] = React.useState<Date | undefined>(undefined)
  const [tempHour, setTempHour] = React.useState<number>(0)
  const [tempMinute, setTempMinute] = React.useState<number>(0)
  const [datePickerOpen, setDatePickerOpen] = React.useState(false)

  const defaultValues: FormValues = product
    ? {
        name_en: product.name_en,
        name_ko: product.name_ko || '',
        name_si: product.name_si || '',
        description: product.description || '',
        price_krw: product.price_krw,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id,
        is_available: product.is_available,
        is_recommended: product.is_recommended,
        featured_images: Array.isArray(product.featured_images)
          ? product.featured_images.filter((url) => url && typeof url === 'string' && url.trim() !== '')
          : [],
        detail_images: Array.isArray(product.detail_images)
          ? product.detail_images.filter((url) => url && typeof url === 'string' && url.trim() !== '')
          : [],
        published_at: product.published_at ? new Date(product.published_at) : new Date(),
      }
    : {
        name_ko: '',
        name_en: '',
        name_si: '',
        description: '',
        price_krw: 1,
        stock_quantity: 999,
        category_id: '',
        is_available: true,
        is_recommended: false,
        featured_images: [],
        detail_images: [],
        published_at: new Date(),
      }

  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const handleStockQuantityChange = (value: number) => {
    if (value === 0) {
      form.setValue('is_available', false)
    }
    return value
  }

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      // 이미지 업로드 진행
      let featuredImages: string[] = []
      let detailImages: string[] = []

      if (featuredClientImages.length > 0) {
        toast({
          title: '이미지 업로드 중',
          description: `대표 이미지 업로드 중입니다.`,
        })

        // 이전 이미지 ID 배열 추출
        const previousFeaturedPublicIds = product?.featured_images || []

        const { publicIds, updatedImages } = await uploadImageArray(featuredClientImages, previousFeaturedPublicIds)
        featuredImages = publicIds
        setFeaturedClientImages(updatedImages)
      }

      if (detailClientImages.length > 0) {
        toast({
          title: '이미지 업로드 중',
          description: `상세 이미지 업로드 중입니다.`,
        })

        // 이전 이미지 ID 배열 추출
        const previousDetailPublicIds = product?.detail_images || []

        const { publicIds, updatedImages } = await uploadImageArray(detailClientImages, previousDetailPublicIds)
        detailImages = publicIds
        setDetailClientImages(updatedImages)
      }

      // published_at 데이터 처리
      const publishedAt = new Date(data.published_at)
      // 시간과 분 설정
      publishedAt.setHours(selectedHour)
      publishedAt.setMinutes(selectedMinute)
      publishedAt.setSeconds(0)

      // 폼 데이터 업데이트 및 제출
      const formData = {
        ...data,
        published_at: publishedAt,
        featured_images: featuredImages.length > 0 ? featuredImages : null,
        detail_images: detailImages.length > 0 ? detailImages : null,
        is_available: data.stock_quantity === 0 ? false : data.is_available,
      }

      // 마지막 검증
      if (
        (featuredClientImages.length > 0 && (!formData.featured_images || formData.featured_images.length === 0)) ||
        (detailClientImages.length > 0 && (!formData.detail_images || formData.detail_images.length === 0))
      ) {
        throw new Error('이미지 정보가 올바르게 설정되지 않았습니다. 다시 시도해 주세요.')
      }

      onSubmit(formData)

      // 성공 토스트 표시
      const totalUploaded =
        featuredClientImages.filter((img) => !img.uploaded).length +
        detailClientImages.filter((img) => !img.uploaded).length

      if (totalUploaded > 0) {
        toast({
          title: '업로드 완료',
          description: `총 ${totalUploaded}개의 이미지가 성공적으로 업로드되었습니다.`,
        })
      }
    } catch (error) {
      showErrorToast(error as Error, '이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStockZero = form.watch('stock_quantity') === 0

  // 시간 선택 옵션 생성
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  // 날짜 시간 선택 시 폼 업데이트 함수
  const updateDateTime = (date: Date | undefined, hour?: number, minute?: number) => {
    if (!date) return

    setTempDate(date)
    setTempHour(hour !== undefined ? hour : tempHour)
    setTempMinute(minute !== undefined ? minute : tempMinute)
  }

  const applyDateTime = () => {
    if (!tempDate) return

    const newDate = new Date(tempDate)
    newDate.setHours(tempHour)
    newDate.setMinutes(tempMinute)
    newDate.setSeconds(0)

    form.setValue('published_at', newDate)
    setSelectedHour(tempHour)
    setSelectedMinute(tempMinute)
    setDatePickerOpen(false)
  }

  const cancelDateTime = () => {
    setDatePickerOpen(false)
  }

  const openDatePicker = () => {
    const currentDate = form.getValues('published_at')
    setTempDate(currentDate)
    setTempHour(currentDate.getHours())
    setTempMinute(currentDate.getMinutes())
    setDatePickerOpen(true)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    카테고리 <span className="text-red-600">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    상품명 (영어) <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_ko"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품명 (한국어)</FormLabel>
                  <FormControl>
                    <Input placeholder="상품명" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_si"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품명 (싱할라어)</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name in Sinhala" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품 설명</FormLabel>
                  <FormControl>
                    <Textarea placeholder="상품에 대한 설명을 작성해주세요" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="published_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    상품 등록 일자 <span className="text-red-600">*</span>
                  </FormLabel>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen} modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          onClick={openDatePicker}
                        >
                          {field.value ? (
                            format(field.value, 'yyyy-MM-dd HH:mm')
                          ) : (
                            <span>날짜와 시간을 선택하세요</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <Calendar
                          mode="single"
                          selected={tempDate}
                          onSelect={(date) => updateDateTime(date)}
                          initialFocus
                        />
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span className="text-sm font-medium">시간</span>
                            </div>
                            <Select
                              value={tempHour.toString()}
                              onValueChange={(value) => updateDateTime(tempDate, parseInt(value, 10))}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="시간 선택" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {hours.map((hour) => (
                                  <SelectItem key={`hour-${hour}`} value={hour.toString()}>
                                    {hour.toString().padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium">분</span>
                            </div>
                            <Select
                              value={tempMinute.toString()}
                              onValueChange={(value) => updateDateTime(tempDate, undefined, parseInt(value, 10))}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="분 선택" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px]">
                                {minutes.map((minute) => (
                                  <SelectItem key={`minute-${minute}`} value={minute.toString()}>
                                    {minute.toString().padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <Button type="button" variant="outline" size="sm" onClick={cancelDateTime}>
                            취소
                          </Button>
                          <Button type="button" size="sm" onClick={applyDateTime}>
                            확인
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_krw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    가격 (KRW) <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="가격"
                      {...field}
                      onChange={(event) => field.onChange(parseFloat(event.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    재고 수량 <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="재고 수량"
                      {...field}
                      onChange={(event) =>
                        field.onChange(handleStockQuantityChange(parseInt(event.target.value, 10) || 0))
                      }
                    />
                  </FormControl>
                  <FormDescription>재고가 0이면 판매 불가능 상태로 자동 설정됩니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                      disabled={isStockZero}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>판매 가능</FormLabel>
                    <FormDescription>
                      {isStockZero ? '재고가 0인 상품은 판매할 수 없습니다.' : '상품을 판매 목록에 표시합니다.'}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_recommended"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>추천 상품</FormLabel>
                    <FormDescription>이 상품을 추천 상품으로 표시합니다.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="featured_images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>대표 이미지</FormLabel>
              <FormDescription>최대 5장까지 업로드 가능합니다. 드래그하여 순서를 변경할 수 있습니다.</FormDescription>
              <FormControl>
                <MultiImageUpload
                  value={field.value ?? []}
                  onChange={field.onChange}
                  maxFiles={5}
                  placeholder="대표 이미지 추가하기"
                  onImagesChange={setFeaturedClientImages}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="detail_images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>상세 이미지</FormLabel>
              <FormDescription>최대 5장까지 업로드 가능합니다. 드래그하여 순서를 변경할 수 있습니다.</FormDescription>
              <FormControl>
                <MultiImageUpload
                  value={field.value ?? []}
                  onChange={field.onChange}
                  maxFiles={5}
                  placeholder="상세 이미지 추가하기"
                  onImagesChange={setDetailClientImages}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default function ProductForm(props: ProductFormProps) {
  return (
    <React.Suspense fallback={<div>카테고리 로딩 중...</div>}>
      <ProductFormContent {...props} />
    </React.Suspense>
  )
}
