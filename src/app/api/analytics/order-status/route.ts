import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/shared/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();
        const branchId = searchParams.get('branchId');

        if (branchId) params.append('branchId', branchId);

        const res = await fetchWithAuth(`${API_URL}/analytics/order-status?${params.toString()}`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('BFF order-status error:', err);
        return NextResponse.json(
            { success: false, data: null },
            { status: 500 }
        );
    }
}