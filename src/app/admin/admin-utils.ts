import { fetchWithAuth } from '@/shared/lib/api';

export type ResponseState = {
  success: boolean;
  message: string;
  data?: any;
};

// Wrapper cho fetchWithAuth dùng trong các Admin Server Action
// Tự động gắn token và refresh khi hết hạn
export const fetchWithAdminAuth = fetchWithAuth;

export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
};
