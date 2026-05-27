'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

// Import thêm hooks và action
import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();

  // Khởi tạo state lắng nghe Server Action
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    error: null,
  });

  // Điều hướng người dùng khi đăng nhập thành công
  useEffect(() => {
    if (state.success) {
      router.push('/shop'); // Hoặc trang quản lý/trang chủ mong muốn
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          {/* Ráp formAction vào thuộc tính action */}
          <form action={formAction} className='p-6 md:p-8'>
            <FieldGroup>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Chào mừng trở lại</h1>
                <p className='text-balance text-muted-foreground'>
                  Đăng nhập vào tài khoản Di Động Việt của bạn
                </p>
              </div>

              {/* KHU VỰC IN THÔNG BÁO LỖI NẾU CÓ */}
              {state.error && (
                <div className='p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-center font-medium animate-in fade-in-50 duration-200'>
                  {state.error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  name='email' // THÊM THUỘC TÍNH NAME
                  type='email'
                  placeholder='name@example.com'
                  disabled={isPending}
                  required
                />
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <a
                    href='#'
                    className='ml-auto text-sm underline-offset-2 hover:underline'
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input
                  id='password'
                  name='password' // THÊM THUỘC TÍNH NAME
                  type='password'
                  disabled={isPending}
                  required
                />
              </Field>
              <Field>
                {/* THAY ĐỔI UI NÚT SUBMIT THEO TRẠNG THÁI PENDING */}
                <Button type='submit' className='w-full' disabled={isPending}>
                  {isPending ? (
                    <div className='flex items-center gap-2'>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      Đang xác thực...
                    </div>
                  ) : (
                    'Đăng nhập'
                  )}
                </Button>
              </Field>
              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
                Hoặc
              </FieldSeparator>
              <Field className='flex justify-center'>
                <Button
                  variant='outline'
                  type='button'
                  disabled={isPending}
                  className='w-full flex items-center justify-center gap-2'
                >
                  <img
                    src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
                    alt='Google'
                    className='h-5 w-5'
                  />
                  <span>Đăng nhập với Google</span>
                </Button>
              </Field>
              <FieldDescription className='text-center'>
                Bạn không có tài khoản? <a href='/signup'>Đăng ký</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className='relative hidden bg-muted md:flex items-center justify-center p-4'>
            <img
              src='/auth-image.webp'
              alt='Image'
              className='max-h-[80%] max-w-[80%] object-contain dark:brightness-[0.8]'
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className='px-6 text-center'>
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với{' '}
        <a href='#'>Điều khoản dịch vụ</a> và <a href='#'>Chính sách bảo mật</a>{' '}
        của chúng tôi.
      </FieldDescription>
    </div>
  );
}
