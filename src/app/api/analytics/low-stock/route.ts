import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/shared/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();
        const threshold = searchParams.get('threshold');
        const limit = searchParams.get('limit');

        if (threshold) params.append('threshold', threshold);
        if (limit) params.append('limit', limit);

        const res = await fetchWithAuth(`${API_URL}/analytics/low-stock?${params.toString()}`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('BFF low-stock error:', err);
        return NextResponse.json(
            { success: false, data: [] },
            { status: 500 }
        );
    }
}