import { fetchWithAuth } from '@/shared/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * POST /api/payments/momo — Tạo thanh toán MoMo
 * Body: { orderId: string }
 * Trả về: { success, data: { payUrl, deeplink?, qrCodeUrl? } }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: 'Thiếu orderId' },
                { status: 400 }
            );
        }

        const res = await fetchWithAuth(`${API_URL}/payment/momo`, {
            method: 'POST',
            body: JSON.stringify({ orderId }),
        });

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