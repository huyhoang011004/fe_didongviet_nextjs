import { ForgotPasswordForm } from '@/components/auth/forgot-password/forgot-password-form';

export const metadata = {
  title: 'Quên mật khẩu - Di Động Việt',
  description:
    'Yêu cầu cấp mã xác thực OTP khôi phục mật khẩu thông qua địa chỉ email đăng ký.',
};

export default function ForgotPasswordPage() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
