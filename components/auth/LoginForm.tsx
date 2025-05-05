'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import supabase from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const formSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string(),
})

export function LoginForm() {
  const { setUser, setRole } = useAuthStore()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Supabase 인증으로 로그인 시도
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) throw error

      if (data.user) {
        // 2. 인증 성공 후 사용자 DB 정보 조회
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        // 사용자 정보가 없는 경우 오류 발생
        if (userError) throw userError

        // 3. 사용자 정보 저장
        setUser(userData)
        setRole(userData.role as 'admin' | 'user')

        // 4. 역할에 따른 리다이렉트
        if (userData.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      console.error('로그인 에러:', error)
      form.setError('root', {
        message: error instanceof Error ? error.message : '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="이메일을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          로그인
        </Button>
        {form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}
      </form>
    </Form>
  )
}
