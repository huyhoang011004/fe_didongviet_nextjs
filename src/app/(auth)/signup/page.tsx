import { SignupForm } from '@/service/Auth/components/signup/signup-form';

export const metadata = {
  title: 'Đăng ký tài khoản - Di Động Việt',
  description:
    'Tạo tài khoản mới để trải nghiệm mua sắm thiết bị di động chính hãng.',
};

export default function SignupPage() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <SignupForm />
      </div>
    </div>
  );
}
