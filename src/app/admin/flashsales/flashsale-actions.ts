'use server';

import { getAuthHeaders, getApiUrl, ResponseState } from '../admin-utils';

export async function getFlashSalesAction(
  page: number = 1,
  limit: number = 10,
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  data: any[];
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/flash-sales/admin/all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        data: [],
        message: data.message || 'Không thể tải danh sách Flash Sale.',
      };
    }
    return {
      success: true,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 1,
      totalCount: data.totalCount || 0,
      data: data.data || [],
    };
  } catch (error) {
    console.error('getFlashSalesAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      data: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function getFlashSaleByIdAction(id: string): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/flash-sales/admin/${id}`, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Không thể lấy thông tin chi tiết Flash Sale.' };
    }
    return { success: true, data: data.data };
  } catch (error) {
    console.error('getFlashSaleByIdAction error:', error);
    return { success: false, message: 'Mất kết nối tới hệ thống.' };
  }
}

export async function createFlashSaleAction(flashSaleData: {
  name: string;
  startDate: string;
  endDate: string;
  timeSlots: number[];
  duration: number;
  products: Array<{
    product: string;
    flashSalePrice: number;
    flashSaleStock: number;
    userLimit: number;
  }>;
  isActive?: boolean;
}): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/flash-sales/admin`, {
      method: 'POST',
      headers,
      body: JSON.stringify(flashSaleData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo đợt Flash Sale thất bại.' };
    }
    return { success: true, message: 'Đã tạo đợt Flash Sale thành công!', data: data.data };
  } catch (error) {
    console.error('createFlashSaleAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateFlashSaleAction(
  id: string,
  flashSaleData: {
    name?: string;
    startDate?: string;
    endDate?: string;
    timeSlots?: number[];
    duration?: number;
    products?: Array<{
      product: string;
      flashSalePrice: number;
      flashSaleStock: number;
      userLimit: number;
    }>;
    isActive?: boolean;
  },
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/flash-sales/admin/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(flashSaleData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật Flash Sale thất bại.' };
    }
    return { success: true, message: 'Đã cập nhật Flash Sale thành công!', data: data.data };
  } catch (error) {
    console.error('updateFlashSaleAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteFlashSaleAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/flash-sales/admin/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa Flash Sale thất bại.' };
    }
    return { success: true, message: data.message || 'Đã xóa đợt Flash Sale thành công!' };
  } catch (error) {
    console.error('deleteFlashSaleAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function toggleFlashSaleStatusAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/flash-sales/admin/${id}/status`, {
      method: 'PATCH',
      headers,
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Thay đổi trạng thái thất bại.' };
    }
    return { success: true, message: data.message || 'Đã cập nhật trạng thái thành công!', data: data.data };
  } catch (error) {
    console.error('toggleFlashSaleStatusAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
