import { fetchWithAuth } from '@/shared/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET() {
  try {
    const response = await fetchWithAuth(`${apiUrl}/accounts/profile`, { method: 'GET' });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in GET /api/auth/me:', error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetchWithAuth(`${apiUrl}/accounts/profile`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in PUT /api/auth/me:', error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống.' }, { status: 500 });
  }
}
