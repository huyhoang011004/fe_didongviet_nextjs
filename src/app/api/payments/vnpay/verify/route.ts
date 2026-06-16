import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * GET /api/payments/vnpay/verify?vnp_...=...
 * Gọi backend endpoint return để xác minh và cập nhật DB
 * (Fallback cho IPN callback không gọi được ở localhost)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        // Chuyển toàn bộ query params sang backend
        const backendUrl = `${API_URL}/payment/vnpay/return?${searchParams.toString()}`;

        const res = await fetch(backendUrl, { method: 'GET' });
        const data = await res.json();

        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
        return NextResponse.json(
            { success: false, message },
            { status: 500 }
        );
    }
}