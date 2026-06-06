import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/vouchers`, { method: 'GET', cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Không thể tải danh sách voucher.' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
