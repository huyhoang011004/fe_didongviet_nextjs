'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { forgotPasswordAction } from './actions';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(forgotPasswordAction, {
    success: false,
    error: null,
    message: null,
  });

  // Chuyển hướng sang trang Reset Password khi gửi OTP thành công
  useEffect(() => {
    if (state.success && state.email) {
      const timer = setTimeout(() => {
        const email = encodeURIComponent(state.email || '');
        router.push(`/reset-password?email=${email}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.email, router]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0 border border-border shadow-lg'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            action={formAction}
            className='p-6 md:p-8 flex flex-col justify-center'
          >
            <FieldGroup>
              <div className='flex flex-col items-center gap-2 text-center mb-6'>
                <h1 className='text-2xl font-bold text-didongviet-red'>
                  Quên mật khẩu?
                </h1>
                <p className='text-sm text-balance text-muted-foreground'>
                  Nhập email của bạn để nhận mã OTP khôi phục mật khẩu.
                </p>
              </div>

              {/* HIỂN THỊ THÔNG BÁO LỖI HOẶC THÀNH CÔNG */}
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
                      'Yêu cầu thành công! Đang chuyển hướng...'}
                  </span>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor='email'>Địa chỉ Email</FieldLabel>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='name@example.com'
                  disabled={isPending || state.success}
                  required
                  className='py-6'
                />
              </Field>

              <Field>
                <Button
                  type='submit'
                  className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white py-6 rounded-lg font-semibold transition-all'
                  disabled={isPending || state.success}
                >
                  {isPending ? (
                    <div className='flex items-center gap-2'>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      Đang xử lý...
                    </div>
                  ) : (
                    'Gửi mã xác thực'
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
              alt='Forgot Password'
              className='max-h-[80%] max-w-[80%] object-contain dark:brightness-[0.8]'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
