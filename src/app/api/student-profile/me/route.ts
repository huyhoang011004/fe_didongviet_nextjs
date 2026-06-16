import { fetchWithAuth } from '@/shared/lib/api';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// GET /api/student-profile/me → lấy hồ sơ HSSV của user hiện tại
export async function GET() {
    try {
        const res = await fetchWithAuth(`${API_URL}/student-profile/me`, { method: 'GET' });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}