import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/shared/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();
        const period = searchParams.get('period');
        const branchId = searchParams.get('branchId');
        const limit = searchParams.get('limit');
        const sortBy = searchParams.get('sortBy');

        if (period) params.append('period', period);
        if (branchId) params.append('branchId', branchId);
        if (limit) params.append('limit', limit);
        if (sortBy) params.append('sortBy', sortBy);

        const res = await fetchWithAuth(`${API_URL}/analytics/best-selling?${params.toString()}`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('BFF best-selling error:', err);
        return NextResponse.json(
            { success: false, data: [] },
            { status: 500 }
        );
    }
}