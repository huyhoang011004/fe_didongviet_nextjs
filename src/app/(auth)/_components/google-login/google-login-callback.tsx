'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/shared/components/ui/card';
import { googleLoginAction } from './actions';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

// Hàm giải mã JWT Token (Google ID Token) ở phía Client
const decodeGoogleToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding Google token:', error);
    return null;
  }
};

export function GoogleLoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCalled = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Ngăn chặn gọi trùng lặp trong React 18 StrictMode
    if (hasCalled.current) return;

    const token = searchParams.get('token') || searchParams.get('credential') || searchParams.get('code');
    
    if (!token) {
      setError('Không tìm thấy thông tin xác thực Google.');
      setLoading(false);
      return;
    }

    // Giải mã Google ID Token lấy Profile người dùng
    const profile = decodeGoogleToken(token);
    if (!profile) {
      setError('Mã xác thực Google (ID Token) không hợp lệ.');
      setLoading(false);
      return;
    }

    const { email, name, sub: googleId } = profile;

    if (!email || !name || !googleId) {
      setError('Tài khoản Google thiếu các thông tin bắt buộc (Email, Tên hoặc Google ID).');
      setLoading(false);
      return;
    }

    hasCalled.current = true;

    const performLogin = async () => {
      try {
        const result = await googleLoginAction(email, name, googleId);
        if (result.success) {
          setSuccess(true);
          setLoading(false);
          const timer = setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 1500);
          return () => clearTimeout(timer);
        } else {
          setError(result.error);
          setLoading(false);
        }
      } catch (err) {
        console.error('Perform Google Login error:', err);
        setError('Lỗi kết nối hệ thống trong quá trình đăng nhập.');
        setLoading(false);
      }
    };

    performLogin();
  }, [searchParams, router]);

  return (
    <Card className='overflow-hidden border border-border shadow-lg'>
      <CardContent className='p-8 flex flex-col items-center justify-center min-h-[300px] text-center gap-4'>
        {loading && (
          <>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
            <h2 className='text-xl font-bold text-slate-800 dark:text-slate-200'>
              Đang đăng nhập bằng Google
            </h2>
            <p className='text-sm text-muted-foreground font-medium'>
              Hệ thống đang xác thực tài khoản Google của bạn, vui lòng đợi trong giây lát...
            </p>
          </>
        )}

        {error && (
          <>
            <div className='p-3 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-full'>
              <AlertCircle size={36} />
            </div>
            <h2 className='text-xl font-bold text-slate-850 dark:text-slate-250'>
              Đăng nhập thất bại
            </h2>
            <p className='text-sm text-destructive max-w-md font-medium px-4'>
              {error}
            </p>
            <a
              href='/login'
              className='inline-flex items-center gap-1.5 text-sm underline underline-offset-4 hover:text-didongviet-red transition-all mt-2 font-semibold'
            >
              <ArrowLeft size={14} />
              <span>Quay lại trang Đăng nhập</span>
            </a>
          </>
        )}

        {success && (
          <>
            <div className='p-3 bg-green-100 dark:bg-green-950/30 text-green-600 rounded-full animate-bounce'>
              <CheckCircle2 size={36} />
            </div>
            <h2 className='text-xl font-bold text-slate-850 dark:text-slate-250'>
              Đăng nhập thành công!
            </h2>
            <p className='text-sm text-green-600 font-semibold'>
              Đang đưa bạn trở lại Trang chủ Di Động Việt...
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
