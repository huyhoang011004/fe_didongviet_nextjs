'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/shared/utils/utils';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { resetPasswordAction } from './actions';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [state, formAction, isPending] = useActionState(resetPasswordAction, {
    success: false,
    error: null,
    message: null,
  });

  // Chuyển hướng về trang đăng nhập khi reset mật khẩu thành công
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push('/login?reset_success=true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0 border border-border shadow-lg'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            action={formAction}
            className='p-6 md:p-8 flex flex-col justify-center'
          >
            <FieldGroup>
              <div className='flex flex-col items-center gap-2 text-center mb-4'>
                <h1 className='text-2xl font-bold text-didongviet-red'>
                  Đặt lại mật khẩu
                </h1>
                <p className='text-sm text-balance text-muted-foreground'>
                  Nhập mã OTP nhận được từ email và đặt lại mật khẩu mới.
                </p>
              </div>

              {/* THÔNG BÁO LỖI HOẶC THÀNH CÔNG */}
              {state.error && (
                <div className='p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center gap-2 font-medium animate-in fade-in-50 duration-200'>
                  <AlertCircle size={16} className='flex-shrink-0' />
                  <span>{state.error}</span>
                </div>
              )}

              {state.success && (
                <div className='p-3 text-sm bg-green-500/10 border border-green-500/20 text-green-600 rounded-md flex items-center gap-2 font-medium animate-in fade-in-50 duration-200'>
                  <CheckCircle2 size={16} className='flex-shrink-0' />
                  <span>
                    {state.message ||
                      'Thay đổi mật khẩu thành công! Đang chuyển hướng...'}
                  </span>
                </div>
              )}

              {/* EMAIL (Ẩn/Disabled nhưng gửi đi) */}
              <input type='hidden' name='email' value={email} />

              <Field>
                <FieldLabel>Địa chỉ Email</FieldLabel>
                <Input
                  type='email'
                  value={email}
                  disabled
                  className='bg-muted cursor-not-allowed opacity-80 py-6'
                />
              </Field>

              {/* MÃ OTP */}
              <Field>
                <FieldLabel htmlFor='otpCode'>
                  Mã xác thực OTP (6 số)
                </FieldLabel>
                <Input
                  id='otpCode'
                  name='otpCode'
                  type='text'
                  maxLength={6}
                  placeholder='000000'
                  pattern='[0-9]*'
                  inputMode='numeric'
                  disabled={isPending || state.success}
                  required
                  className='py-6 font-mono text-center tracking-[0.2em] text-lg'
                />
              </Field>

              {/* MẬT KHẨU MỚI & XÁC NHẬN */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Field>
                  <FieldLabel htmlFor='newPassword'>Mật khẩu mới</FieldLabel>
                  <Input
                    id='newPassword'
                    name='newPassword'
                    type='password'
                    disabled={isPending || state.success}
                    required
                    className='py-6'
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='confirmPassword'>Xác nhận</FieldLabel>
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    disabled={isPending || state.success}
                    required
                    className='py-6'
                  />
                </Field>
              </div>

              <FieldDescription>
                Mật khẩu phải có độ dài ít nhất 6 ký tự.
              </FieldDescription>

              <Field>
                <Button
                  type='submit'
                  className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white py-6 rounded-lg font-semibold transition-all'
                  disabled={isPending || state.success}
                >
                  {isPending ? (
                    <div className='flex items-center gap-2'>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      Đang cập nhật...
                    </div>
                  ) : (
                    'Thay đổi mật khẩu'
                  )}
                </Button>
              </Field>

              <FieldDescription className='text-center mt-4'>
                <a
                  href='/login'
                  className='inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline hover:text-didongviet-red transition-all'
                >
                  <ArrowLeft size={14} />
                  <span>Quay lại Đăng nhập</span>
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className='relative hidden bg-muted md:flex items-center justify-center p-4'>
            <img
              src='/auth-image.webp'
              alt='Reset Password'
              className='max-h-[80%] max-w-[80%] object-contain dark:brightness-[0.8]'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
