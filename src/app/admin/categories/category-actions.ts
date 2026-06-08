'use server';

import { fetchWithAdminAuth, getApiUrl, ResponseState } from '../admin-utils';

export async function getCategoriesAction(): Promise<{
  success: boolean;
  categories: any[];
  message?: string;
}> {
  try {
    // Đây là API công khai, không cần token
    const response = await fetch(`${getApiUrl()}/categories/all`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, categories: [], message: data.message || 'Không thể tải danh mục.' };
    }
    return { success: true, categories: data.data || data || [] };
  } catch (error) {
    console.error('getCategoriesAction error:', error);
    return { success: false, categories: [], message: 'Mất kết nối tới hệ thống.' };
  }
}

export async function createCategoryAction(categoryData: {
  name: string;
  description?: string;
  parentCategory?: string | null;
  image?: string | null;
  brands?: string[];
  displayOrder?: number;
  isActive?: boolean;
}): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/categories`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo danh mục thất bại.' };
    }
    return { success: true, message: 'Đã tạo danh mục thành công!', data: data.data };
  } catch (error) {
    console.error('createCategoryAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateCategoryAction(
  id: string,
  categoryData: {
    name: string;
    description?: string;
    parentCategory?: string | null;
    image?: string | null;
    brands?: string[];
    displayOrder?: number;
    isActive?: boolean;
  },
): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật danh mục thất bại.' };
    }
    return { success: true, message: 'Đã cập nhật danh mục thành công!', data: data.data };
  } catch (error) {
    console.error('updateCategoryAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteCategoryAction(id: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/categories/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa danh mục thất bại.' };
    }
    return { success: true, message: data.message || 'Đã xóa danh mục thành công!' };
  } catch (error) {
    console.error('deleteCategoryAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
