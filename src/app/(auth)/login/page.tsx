import { LoginForm } from '@/app/(auth)/_components/login/login-form';

export const metadata = {
  title: 'Đăng nhập tài khoản - Di Động Việt',
  description:
    'Đăng nhập vào tài khoản của bạn để trải nghiệm mua sắm thiết bị di động chính hãng.',
};

export default function LoginPage() {
  return (
    <div className='flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </div>
  );
}
