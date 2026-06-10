import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/shared/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();
        const period = searchParams.get('period');
        const branchId = searchParams.get('branchId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (period) params.append('period', period);
        if (branchId) params.append('branchId', branchId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const res = await fetchWithAuth(`${API_URL}/analytics/chart-data?${params.toString()}`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('BFF chart-data error:', err);
        return NextResponse.json(
            { success: false, data: null },
            { status: 500 }
        );
    }
}