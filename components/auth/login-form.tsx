'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { useRouter } from 'next/navigation'

import { Input } from '@components/ui/input'
import { login as loginService } from '@services/auth.service'
import { useAuthStore } from '@stores/auth'
import { Button } from '@ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/form'

const formSchema = z.object({
  email: z.string({ required_error: '이메일을 입력해주세요.' }).email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string({ required_error: '비밀번호를 입력해주세요.' }),
})

export function LoginForm() {
  const router = useRouter()
  const { setUser, setRole } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = form

  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }: z.infer<typeof formSchema>) => loginService({ email, password }),
    mutationKey: ['login'],
    onSuccess: (data) => {
      setUser(data)
      setRole(data.role as 'admin' | 'user')

      if (data.role === 'admin') {
        router.push('/admin')
        return
      }
      router.push('/')
    },
    onError: (error) => {
      let message = error.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      if (error.name === 'AuthApiError') {
        message = '이메일 또는 비밀번호가 일치하지 않습니다.'
      }
      setError('root', { message })
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit((data) => login(data))} className="space-y-6">
        <FormField
          control={control}
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
          control={control}
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
        <Button type="submit" className="w-full" disabled={isPending}>
          로그인
        </Button>
        {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      </form>
    </Form>
  )
}
