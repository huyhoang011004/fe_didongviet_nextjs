import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/shared/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
    try {
        const res = await fetchWithAuth(`${API_URL}/analytics/dashboard-overview`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('BFF admin dashboard-overview error:', err);
        return NextResponse.json(
            { success: false, message: 'Lỗi kết nối đến máy chủ dữ liệu.', data: null },
            { status: 500 }
        );
    }
}