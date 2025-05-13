'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Product, Category } from '@/types/database.models'

import { ImageUpload } from './image-upload'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const productSchema = z.object({
  name_ko: z.string().min(1, '제품명을 입력해주세요.'),
  name_en: z.string().optional(),
  name_si: z.string().optional(),
  description: z.string().optional(),
  price_krw: z.coerce.number().min(0, '가격은 0 이상이어야 합니다.'),
  stock_quantity: z.coerce.number().min(0, '재고는 0 이상이어야 합니다.'),
  category_id: z.string().min(1, '카테고리를 선택해주세요.'),
  is_available: z.boolean().default(true),
  is_recommended: z.boolean().default(false),
  featured_image: z.string().nullable(),
})

type FormValues = z.infer<typeof productSchema>

interface ProductFormProps {
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
      featured_image: null,
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
        featured_image: product.featured_image,
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
                  <FormLabel>제품명 (한국어)</FormLabel>
                  <FormControl>
                    <Input placeholder="제품명" {...field} />
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
                  <FormLabel>제품명 (영어)</FormLabel>
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
                  <FormLabel>제품명 (싱할라어)</FormLabel>
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
                  <FormLabel>제품 설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="제품에 대한 설명을 입력하세요."
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
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
                  <FormLabel>가격 (KRW)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                    <Input type="number" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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

            <div className="flex items-start space-x-6 pt-4">
              <FormField
                control={form.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>판매 가능</FormLabel>
                      <FormDescription>제품을 판매 가능 상태로 설정합니다.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_recommended"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>추천 상품</FormLabel>
                      <FormDescription>메인 페이지에 추천 상품으로 표시됩니다.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="featured_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>대표 이미지</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange(null)} />
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
