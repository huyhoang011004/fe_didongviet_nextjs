'use server';

type FormState = {
  success: boolean;
  error: string | null;
  message?: string | null;
  email?: string;
};

export async function resendOtpAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Vui lòng cung cấp địa chỉ email.' };
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Định dạng email không hợp lệ.' };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${apiUrl}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Gửi lại mã OTP thất bại.',
      };
    }

    return {
      success: true,
      error: null,
      message: data.message || 'Mã OTP mới đã được gửi thành công đến email của bạn.',
      email: email.trim().toLowerCase(),
    };
  } catch (error) {
    console.error('Resend OTP action error:', error);
    return {
      success: false,
      error: 'Mất kết nối tới hệ thống. Vui lòng thử lại sau.',
    };
  }
}
