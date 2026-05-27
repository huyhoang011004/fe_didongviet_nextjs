'use server';

type FormState = {
  success: boolean;
  error: string | null;
};

export async function signupAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // 1. Kiểm tra tất cả các trường bắt buộc
  if (!name || !email || !phone || !password || !confirmPassword) {
    return { success: false, error: 'Vui lòng điền đầy đủ tất cả các trường.' };
  }

  // 2. Validate số điện thoại cơ bản (ví dụ từ 10-11 số)
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.trim())) {
    return {
      success: false,
      error: 'Số điện thoại không hợp lệ (phải từ 10-11 chữ số).',
    };
  }

  // 3. Validate độ dài mật khẩu
  if (password.length < 6) {
    return { success: false, error: 'Mật khẩu phải chứa ít nhất 6 ký tự.' };
  }

  // 4. Kiểm tra mật khẩu trùng khớp
  if (password !== confirmPassword) {
    return { success: false, error: 'Mật khẩu xác nhận không trùng khớp.' };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Gửi đủ 4 trường lên Backend của bạn
        body: JSON.stringify({ name, email, phone, password }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Đăng ký thất bại. Vui lòng thử lại.',
      };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error('Signup error:', err);
    return {
      success: false,
      error: 'Không thể kết nối đến hệ thống. Vui lòng thử lại sau.',
    };
  }
}
