'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCategoriesQuery } from '@/hooks/use-category'
import { Product } from '@/types/database.models'
import MultiImageUpload from '@components/admin/product/multi-image-upload'
import { Button } from '@ui/button'
import { Checkbox } from '@ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@ui/form'
import { Input } from '@ui/input'
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
})

export type FormValues = z.infer<typeof productSchema>

export interface ProductFormProps {
  product?: Product
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

function ProductFormContent({ product, onSubmit, onCancel }: ProductFormProps) {
  const { data: categories } = useCategoriesQuery()
  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_ko: '',
      name_en: '',
      name_si: '',
      description: '',
      price_krw: 0,
      stock_quantity: 0,
      category_id: '',
      is_available: false,
      is_recommended: false,
      featured_images: [],
      detail_images: [],
    },
  })

  const stockQuantity = form.watch('stock_quantity')

  useEffect(() => {
    if (stockQuantity === 0) {
      form.setValue('is_available', false)
      return
    }
    if (stockQuantity > 0 && form.getValues('stock_quantity') === 0) {
      form.setValue('is_available', true)
    }
  }, [stockQuantity, form])

  useEffect(() => {
    if (product) {
      form.reset({
        name_en: product.name_en,
        name_ko: product.name_ko || '',
        name_si: product.name_si || '',
        description: product.description || '',
        price_krw: product.price_krw,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id,
        is_available: product.is_available,
        is_recommended: product.is_recommended,
        featured_images: product.featured_images || [],
        detail_images: product.detail_images || [],
      })
    }
  }, [product, form])

  const handleSubmit = (data: FormValues) => {
    const formData = {
      ...data,
      is_available: data.stock_quantity === 0 ? false : data.is_available,
    }
    onSubmit(formData)
  }

  const isStockZero = form.watch('stock_quantity') === 0

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
                      onChange={(event) => field.onChange(event.target.value || 0)}
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
              <FormDescription>최대 10장까지 업로드 가능합니다. 드래그하여 순서를 변경할 수 있습니다.</FormDescription>
              <FormControl>
                <MultiImageUpload
                  value={field.value ?? []}
                  onChange={field.onChange}
                  maxFiles={10}
                  placeholder="상세 이미지 추가하기"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm text-muted-foreground mb-4">
          <span className="text-red-600">*</span> 표시는 필수 입력 항목입니다.
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </Form>
  )
}

export default function ProductForm(props: ProductFormProps) {
  return (
    <Suspense fallback={<div>카테고리 로딩 중...</div>}>
      <ProductFormContent {...props} />
    </Suspense>
  )
}
