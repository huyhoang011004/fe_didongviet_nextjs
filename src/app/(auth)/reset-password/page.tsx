import { ResetPasswordForm } from '@/components/auth/forgot-password/reset-password-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Đặt lại mật khẩu - Di Động Việt',
  description: 'Đặt lại mật khẩu mới bằng mã OTP xác thực nhận được từ Gmail.',
};

export default function ResetPasswordPage() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <Suspense fallback={
          <div className='flex items-center justify-center p-8 bg-card border border-border rounded-lg shadow-md'>
            <span className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
            <span className='ml-3 text-sm text-muted-foreground'>Đang tải thông tin...</span>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
