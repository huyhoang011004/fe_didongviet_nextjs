import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  const headers = {
    ...options.headers,
  } as Record<string, string>;

  // Thêm Content-Type mặc định là application/json nếu chưa định nghĩa và body không phải là FormData
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 1. Thực hiện cuộc gọi API ban đầu
  let res = await fetch(url, { ...options, headers });

  // 2. Nếu trả về 401, kiểm tra lỗi hết hạn token và thực hiện refresh token
  if (res.status === 401) {
    const resClone = res.clone();
    let isTokenExpired = false;

    try {
      const data = await resClone.json();
      const msg = data.message || '';
      if (
        msg.includes('Token không hợp lệ hoặc đã hết hạn') ||
        msg.includes('jwt expired')
      ) {
        isTokenExpired = true;
      }
    } catch (e) {
      // Nếu không parse được JSON, có thể là lỗi 401 do token không hợp lệ mặc định
      isTokenExpired = true;
    }

    if (isTokenExpired) {
      const refreshToken = cookieStore.get('refreshToken')?.value;
      if (refreshToken) {
        try {
          // Thực hiện cuộc gọi refresh token đến backend
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData.accessToken;

            if (newToken) {
              // Lưu session token mới vào cookie
              cookieStore.set('session_token', newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 tuần
                path: '/',
              });

              // Ghi đè header Authorization với token mới
              headers['Authorization'] = `Bearer ${newToken}`;

              // Thực hiện lại yêu cầu ban đầu
              res = await fetch(url, { ...options, headers });
            }
          } else {
            // Refresh token hết hạn hoặc không hợp lệ -> Xóa các cookie liên quan
            cookieStore.delete('session_token');
            cookieStore.delete('refreshToken');
          }
        } catch (refreshError) {
          console.error('Lỗi khi tự động làm mới token:', refreshError);
        }
      }
    }
  }

  return res;
}
