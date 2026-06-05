'use server';

import { getAuthHeaders, getApiUrl, ResponseState } from '../admin-utils';

// Lấy tất cả chi nhánh
export async function getBranchesAction(): Promise<{
  success: boolean;
  branches: any[];
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/branches?all=true`, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, branches: [], message: data.message || 'Không thể tải danh sách chi nhánh.' };
    }
    return { success: true, branches: data.data || [] };
  } catch (error) {
    console.error('getBranchesAction error:', error);
    return { success: false, branches: [], message: 'Mất kết nối tới hệ thống.' };
  }
}

// Tạo chi nhánh mới
export async function createBranchAction(formData: {
  name: string;
  address: string;
  phone: string;
  managerName?: string;
  isActive?: boolean;
}): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/branches`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo chi nhánh thất bại.' };
    }
    return { success: true, message: 'Tạo chi nhánh thành công!', data };
  } catch (error) {
    console.error('createBranchAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

// Cập nhật chi nhánh
export async function updateBranchAction(id: string, formData: {
  name?: string;
  address?: string;
  phone?: string;
  managerName?: string;
  isActive?: boolean;
}): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/branches/${id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật chi nhánh thất bại.' };
    }
    return { success: true, message: 'Cập nhật chi nhánh thành công!', data };
  } catch (error) {
    console.error('updateBranchAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

// Xóa chi nhánh
export async function deleteBranchAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/branches/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa chi nhánh thất bại.' };
    }
    return { success: true, message: data.message || 'Đã xóa chi nhánh thành công!' };
  } catch (error) {
    console.error('deleteBranchAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
