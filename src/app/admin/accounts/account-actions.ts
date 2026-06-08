'use server';

import { fetchWithAdminAuth, getApiUrl, ResponseState } from '../admin-utils';

export async function getUsersAction(
  status: string = 'all',
  page: number = 1,
  search: string = '',
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  users: any[];
  message?: string;
}> {
  try {
    const query = new URLSearchParams({
      status,
      page: page.toString(),
      limit: '8',
      search,
    });

    const response = await fetchWithAdminAuth(`${getApiUrl()}/accounts/admin/get-all-users?${query}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        users: [],
        message: data.message || 'Không thể tải danh sách người dùng.',
      };
    }

    return {
      success: true,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 1,
      totalUsers: data.totalUsers || 0,
      users: data.users || [],
    };
  } catch (error) {
    console.error('getUsersAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalUsers: 0,
      users: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function createUserByAdminAction(
  prevState: any,
  formData: FormData,
): Promise<ResponseState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as string;

  if (!name || !email || !password || !phone || !role) {
    return { success: false, message: 'Vui lòng điền đầy đủ tất cả các trường.' };
  }

  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/accounts/admin/create`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, role }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo tài khoản thất bại.' };
    }

    return { success: true, message: data.message || 'Đã tạo tài khoản và gửi OTP thành công!' };
  } catch (error) {
    console.error('createUserByAdminAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateUserByAdminAction(
  id: string,
  userData: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    role: string;
    isDeleted?: boolean;
  },
): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/accounts/admin/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật tài khoản thất bại.' };
    }

    return { success: true, message: data.message || 'Đã cập nhật tài khoản thành công!' };
  } catch (error) {
    console.error('updateUserByAdminAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function softDeleteUserAction(id: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/accounts/admin/soft-delete/${id}`, {
      method: 'PATCH',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Khóa tài khoản thất bại.' };
    }

    return { success: true, message: data.message || 'Đã khóa tài khoản thành công!' };
  } catch (error) {
    console.error('softDeleteUserAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function hardDeleteUserAction(id: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/accounts/admin/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa vĩnh viễn tài khoản thất bại.' };
    }

    return { success: true, message: data.message || 'Đã xóa vĩnh viễn tài khoản thành công!' };
  } catch (error) {
    console.error('hardDeleteUserAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
