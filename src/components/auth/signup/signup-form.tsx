'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signupAction } from './actions';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(signupAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      router.push('/login?registered=true');
    }
  }, [state.success, router]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form action={formAction} className='p-6 md:p-8'>
            <FieldGroup>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Tạo tài khoản mới</h1>
                <p className='text-sm text-balance text-muted-foreground'>
                  Điền đầy đủ thông tin bên dưới để đăng ký tài khoản
                </p>
              </div>

              {state.error && (
                <div className='p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-md text-center font-medium animate-in fade-in-50 duration-200'>
                  {state.error}
                </div>
              )}

              {/* TRƯỜNG 1: HỌ VÀ TÊN */}
              <Field>
                <FieldLabel htmlFor='name'>Họ và tên</FieldLabel>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  placeholder='Nguyễn Văn A'
                  disabled={isPending}
                  required
                />
              </Field>

              {/* Hàng ngang chứa Email và Số điện thoại */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {/* TRƯỜNG 2: EMAIL */}
                <Field>
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='name@example.com'
                    disabled={isPending}
                    required
                  />
                </Field>

                {/* TRƯỜNG 3: SỐ ĐIỆN THOẠI */}
                <Field>
                  <FieldLabel htmlFor='phone'>Số điện thoại</FieldLabel>
                  <Input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='0987654321'
                    disabled={isPending}
                    required
                  />
                </Field>
              </div>

              {/* Hàng ngang chứa Mật khẩu và Xác nhận mật khẩu */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Field>
                  <FieldLabel htmlFor='password'>Mật khẩu</FieldLabel>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    disabled={isPending}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor='confirm-password'>
                    Xác nhận mật khẩu
                  </FieldLabel>
                  <Input
                    id='confirm-password'
                    name='confirmPassword'
                    type='password'
                    disabled={isPending}
                    required
                  />
                </Field>
              </div>
              <FieldDescription>
                Mật khẩu phải có độ dài ít nhất 6 ký tự.
              </FieldDescription>

              <Field>
                <Button type='submit' className='w-full' disabled={isPending}>
                  {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                </Button>
              </Field>

              <FieldDescription className='text-center'>
                Bạn đã có tài khoản? <a href='/login'>Đăng nhập</a>
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
