'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Product, Category } from '@/types/database.models'

import { ImageUpload } from './image-upload'
import { MultiImageUpload } from './multi-image-upload'

const productSchema = z.object({
  name_ko: z.string({ required_error: '상품명을 입력해주세요.' }).min(1, { message: '상품명을 입력해주세요.' }),
  name_en: z.string().optional(),
  name_si: z.string().optional(),
  description: z.string().optional(),
  price_krw: z.coerce
    .number({ required_error: '가격을 입력해주세요.' })
    .min(0, { message: '가격은 0 이상이어야 합니다.' }),
  stock_quantity: z.coerce
    .number({ required_error: '재고를 입력해주세요.' })
    .nonnegative({ message: '재고는 음수가 될 수 없습니다.' }),
  category_id: z.string({ required_error: '카테고리를 선택해주세요.' }).min(1, { message: '카테고리를 선택해주세요.' }),
  is_available: z.boolean(),
  is_recommended: z.boolean(),
  featured_image: z.string().nullable().optional(),
  detail_images: z.array(z.string()).nullable().optional(),
})

export type FormValues = z.infer<typeof productSchema>

export interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (data: FormValues) => void
  onCancel: () => void
}

export function ProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
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
      is_available: true,
      is_recommended: false,
      featured_image: undefined,
      detail_images: [],
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name_ko: product.name_ko,
        name_en: product.name_en || '',
        name_si: product.name_si || '',
        description: product.description || '',
        price_krw: product.price_krw,
        stock_quantity: product.stock_quantity,
        category_id: product.category_id,
        is_available: product.is_available,
        is_recommended: product.is_recommended,
        featured_image: product.featured_image || undefined,
        detail_images: product.detail_images || undefined,
      })
    }
  }, [product, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
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
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상품명 (영어)</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
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

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="price_krw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>가격 (KRW)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                  <FormLabel>재고 수량</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
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
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>판매 가능</FormLabel>
                    <FormDescription>상품을 판매 목록에 표시합니다.</FormDescription>
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
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>대표 이미지</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ?? null}
                  onChange={field.onChange}
                  onRemove={() => field.onChange(null)}
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
                <MultiImageUpload value={field.value ?? []} onChange={field.onChange} maxFiles={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
