'use server';

import { cookies } from 'next/headers';

type FormState = {
  success: boolean;
  error: string | null;
};

export async function googleLoginAction(
  email: string,
  name: string,
  googleId: string
): Promise<FormState> {
  if (!email || !name || !googleId) {
    return { success: false, error: 'Thiếu thông tin tài khoản Google.' };
  }

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${apiUrl}/auth/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, googleId }), // Gửi đúng 3 trường backend cần
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Đăng nhập Google thất bại trên hệ thống.',
      };
    }

    // Lưu session token vào cookie HttpOnly
    const cookieStore = await cookies();
    cookieStore.set('session_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 tuần
      path: '/',
    });

    if (data.refreshToken) {
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 14, // 14 ngày
        path: '/',
      });
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Google Login action error:', error);
    return {
      success: false,
      error: 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau.',
    };
  }
}
