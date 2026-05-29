'use server';

type FormState = {
  success: boolean;
  error: string | null;
  message?: string | null;
  email?: string;
};

// Gửi yêu cầu quên mật khẩu
export async function forgotPasswordAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Vui lòng điền địa chỉ email.' };
  }

  // Regex kiểm tra email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Định dạng email không hợp lệ.' };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${apiUrl}/auth/forgot-password`, {
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
        error: data.message || 'Không tìm thấy người dùng với email này.',
      };
    }

    return {
      success: true,
      error: null,
      message: data.message || 'Mã xác thực đổi mật khẩu đã được gửi đến email của bạn.',
      email,
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    return {
      success: false,
      error: 'Mất kết nối tới hệ thống. Vui lòng thử lại sau.',
    };
  }
}

// Đặt lại mật khẩu mới
export async function resetPasswordAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email') as string;
  const otpCode = formData.get('otpCode') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !otpCode || !newPassword || !confirmPassword) {
    return { success: false, error: 'Vui lòng điền đầy đủ thông tin.' };
  }

  if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
    return { success: false, error: 'Mã OTP phải gồm 6 chữ số.' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'Mật khẩu xác nhận không khớp.' };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const response = await fetch(`${apiUrl}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otpCode,
        newPassword,
      }),
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
      message: data.message || 'Thay đổi mật khẩu thành công!',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau.',
    };
  }
}
