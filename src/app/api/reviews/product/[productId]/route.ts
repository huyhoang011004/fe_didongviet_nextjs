import { fetchWithAuth } from '@/shared/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    const { productId } = await params;

    let body: any;
    if (isMultipart) {
      body = await request.formData();
    } else {
      body = JSON.stringify(await request.json());
    }

    const res = await fetchWithAuth(`${API_URL}/reviews/product/${productId}`, {
      method: 'POST',
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
