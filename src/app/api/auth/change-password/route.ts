import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const getHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export async function PUT(request: NextRequest) {
  try {
    const headers = await getHeaders();
    if (!headers) {
      return NextResponse.json({ success: false, message: 'Chưa đăng nhập.' }, { status: 401 });
    }

    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    const response = await fetch(`${apiUrl}/accounts/change-password`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error in PUT /api/auth/change-password:', error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống.' }, { status: 500 });
  }
}
