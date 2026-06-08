import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Xóa cookie
    cookieStore.delete('session_token');
    cookieStore.delete('refreshToken');

    return NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công.',
    });
  } catch (error) {
    console.error('Logout handler error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống khi đăng xuất.' },
      { status: 500 },
    );
  }
}
