'use server';

import { cookies } from 'next/headers';

type FormState = {
  success: boolean;
  error: string | null;
  unverified?: boolean;
  email?: string;
};

export async function loginAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Vui lòng điền đầy đủ thông tin!' };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      },
    );

    const data = await response.json();

    if (response.status === 403) {
      return {
        success: false,
        error: data.message || 'Tài khoản chưa được kích hoạt qua OTP.',
        unverified: true,
        email,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Tài khoản hoặc mật khẩu không đúng.',
      };
    }

    // Đăng nhập thành công -> Lưu JWT token vào HttpOnly Cookie phía server
    const cookieStore = await cookies();
    cookieStore.set('session_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 tuần
      path: '/',
    });

    return { success: true, error: null };
  } catch (err) {
    console.error('Login action error:', err);
    return { success: false, error: 'Mất kết nối tới hệ thống. Thử lại sau!' };
  }
}
