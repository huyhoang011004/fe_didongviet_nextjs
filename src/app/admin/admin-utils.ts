import { cookies } from 'next/headers';

export type ResponseState = {
  success: boolean;
  message: string;
  data?: any;
};

export const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
};
