import { fetchWithAuth } from '@/shared/lib/api';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        const response = await fetchWithAuth(`${API_URL}/accounts/profile/avatar`, {
            method: 'PUT',
            body: formData,
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error in PUT /api/auth/avatar:', error);
        return NextResponse.json({ success: false, message: 'Lỗi hệ thống.' }, { status: 500 });
    }
}