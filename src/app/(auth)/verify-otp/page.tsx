import { VerifyOtpForm } from '@/service/Auth/components/verify-otp/verify-otp-form';
import { Suspense } from 'react';

export const metadata = {
  title: 'Xác thực tài khoản - Di Động Việt',
  description:
    'Xác thực tài khoản của bạn bằng mã OTP nhận từ email để kích hoạt tài khoản.',
};

export default function VerifyOtpPage() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        {/* Bọc trong Suspense vì Component con gọi useSearchParams() */}
        <Suspense
          fallback={
            <div className='flex items-center justify-center p-8 bg-card border border-border rounded-lg shadow-md'>
              <span className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
              <span className='ml-3 text-sm text-muted-foreground'>
                Đang tải thông tin...
              </span>
            </div>
          }
        >
          <VerifyOtpForm />
        </Suspense>
      </div>
    </div>
  );
}
