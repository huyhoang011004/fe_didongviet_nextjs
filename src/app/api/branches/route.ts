import { NextRequest, NextResponse } from 'next/server';
import { fetchWithAuth } from '@/shared/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all') || 'true';

        const res = await fetchWithAuth(`${API_URL}/branches?all=${all}`);

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('BFF branches error:', err);
        return NextResponse.json(
            { success: false, branches: [] },
            { status: 500 }
        );
    }
}