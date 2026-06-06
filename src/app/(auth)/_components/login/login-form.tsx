'use client';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

// Import thêm hooks và action
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';
import Script from 'next/script';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Khởi tạo state lắng nghe Server Action
  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
    error: null,
  });

  // Điều hướng người dùng khi đăng nhập thành công hoặc chưa kích hoạt
  useEffect(() => {
    if (state.success) {
      router.push('/'); // Hoặc trang quản lý/trang chủ mong muốn
      router.refresh();
    } else if (state.unverified && state.email) {
      const email = encodeURIComponent(state.email);
      router.push(`/verify-otp?email=${email}&unverified=true`);
    }
  }, [state.success, state.unverified, state.email, router]);

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
                    href='/forgot-password'
                    onClick={(e) => {
                      e.preventDefault();
                      const emailInput = document.getElementById(
                        'email',
                      ) as HTMLInputElement;
                      const emailVal = emailInput ? emailInput.value : '';
                      if (emailVal) {
                        router.push(
                          `/forgot-password?email=${encodeURIComponent(emailVal)}`,
                        );
                      } else {
                        router.push('/forgot-password');
                      }
                    }}
                    className='ml-auto text-sm underline-offset-2 hover:underline'
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    name='password' // THÊM THUỘC TÍNH NAME
                    type={showPassword ? 'text' : 'password'}
                    disabled={isPending}
                    className='pr-10'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center'
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
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
              <Field className='flex justify-center w-full'>
                <div
                  id='google-signin-btn'
                  className='w-full flex justify-center min-h-[40px] overflow-hidden'
                />
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

      {/* Script khởi chạy nút Đăng nhập Google GIS */}
      <Script
        src='https://accounts.google.com/gsi/client'
        strategy='afterInteractive'
        onLoad={() => {
          const google = (window as any).google;
          if (google) {
            google.accounts.id.initialize({
              client_id:
                '598131166075-v3jd666hrb4ssmlh18qu313e5m0md18k.apps.googleusercontent.com',
              callback: (response: any) => {
                const token = response.credential;
                router.push(`/google-login?token=${encodeURIComponent(token)}`);
              },
            });

            google.accounts.id.renderButton(
              document.getElementById('google-signin-btn'),
              {
                theme: 'outline',
                size: 'large',
                width: 320,
                text: 'continue_with',
                shape: 'rectangular',
                logo_alignment: 'left',
              },
            );
          }
        }}
      />
    </div>
  );
}
