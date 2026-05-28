'use server';

type FormState = {
  success: boolean;
  error: string | null;
  message?: string | null;
};

// Action xác thực OTP
export async function verifyOtpAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email') as string;
  const otpCode = formData.get('otpCode') as string;

  if (!email || !otpCode) {
    return { success: false, error: 'Thiếu thông tin xác thực.' };
  }

  if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
    return { success: false, error: 'Mã OTP phải gồm 6 chữ số.' };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${apiUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otpCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Mã xác thực không chính xác hoặc đã hết hạn.',
      };
    }

    return {
      success: true,
      error: null,
      message: data.message || 'Xác thực tài khoản thành công!',
    };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau.',
    };
  }
}

// Action gửi lại mã OTP (gọi trực tiếp từ Client Component)
export async function resendOtpAction(email: string): Promise<{ success: boolean; message: string }> {
  if (!email) {
    return { success: false, message: 'Vui lòng cung cấp email.' };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${apiUrl}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Gửi lại mã OTP thất bại.',
      };
    }

    return {
      success: true,
      message: data.message || 'Mã OTP mới đã được gửi thành công.',
    };
  } catch (error) {
    console.error('Resend OTP error:', error);
    return {
      success: false,
      message: 'Mất kết nối tới hệ thống. Vui lòng thử lại sau.',
    };
  }
}
