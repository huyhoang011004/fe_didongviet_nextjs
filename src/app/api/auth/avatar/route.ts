import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    if (!token) return null;
    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function PUT(request: NextRequest) {
    try {
        const headers = await getAuthHeaders();
        if (!headers) {
            return NextResponse.json({ success: false, message: 'Chưa đăng nhập.' }, { status: 401 });
        }

        const formData = await request.formData();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

        const response = await fetch(`${apiUrl}/accounts/profile/avatar`, {
            method: 'PUT',
            headers: {
                Authorization: headers.Authorization,
            },
            body: formData,
        });
        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error in PUT /api/auth/avatar:', error);
        return NextResponse.json({ success: false, message: 'Lỗi hệ thống.' }, { status: 500 });
    }
}