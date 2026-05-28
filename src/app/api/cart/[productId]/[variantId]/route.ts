import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// DELETE /api/cart/[productId]/[variantId] → xóa item khỏi giỏ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string; variantId: string }> }
) {
  try {
    const { productId, variantId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Chưa đăng nhập.' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/cart/${productId}/${variantId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
