import { fetchWithAuth } from '@/shared/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// GET /api/cart → lấy giỏ hàng
export async function GET() {
  try {
    const res = await fetchWithAuth(`${API_URL}/cart`, { method: 'GET' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// POST /api/cart → thêm sản phẩm vào giỏ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetchWithAuth(`${API_URL}/cart`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// PUT /api/cart → cập nhật số lượng
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetchWithAuth(`${API_URL}/cart`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
