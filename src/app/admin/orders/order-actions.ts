'use server';

import { fetchWithAdminAuth, getApiUrl, ResponseState } from '../admin-utils';

export async function getOrdersAction(): Promise<{
  success: boolean;
  orders: any[];
  message?: string;
}> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/orders`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, orders: [], message: data.message || 'Không thể tải danh sách đơn hàng.' };
    }
    return { success: true, orders: data.data || [] };
  } catch (error) {
    console.error('getOrdersAction error:', error);
    return { success: false, orders: [], message: 'Mất kết nối tới hệ thống.' };
  }
}

export async function updateOrderToDeliveredAction(id: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/orders/${id}/deliver`, {
      method: 'PUT',
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật trạng thái giao hàng thất bại.' };
    }
    return { success: true, message: 'Đã cập nhật trạng thái giao hàng thành công!' };
  } catch (error) {
    console.error('updateOrderToDeliveredAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateOrderStatusAction(id: string, status: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật trạng thái đơn hàng thất bại.' };
    }
    return { success: true, message: 'Đã cập nhật trạng thái đơn hàng thành công!' };
  } catch (error) {
    console.error('updateOrderStatusAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteOrderAction(id: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/orders/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa đơn hàng thất bại.' };
    }
    return { success: true, message: data.message || 'Đã xóa đơn hàng thành công!' };
  } catch (error) {
    console.error('deleteOrderAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function getBranchesAction(): Promise<{
  success: boolean;
  branches: any[];
  message?: string;
}> {
  try {
    const response = await fetch(`${getApiUrl()}/branches`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, branches: [], message: data.message || 'Không thể tải chi nhánh.' };
    }
    return { success: true, branches: data.data || [] };
  } catch (error) {
    console.error('getBranchesAction error:', error);
    return { success: false, branches: [], message: 'Mất kết nối tới hệ thống.' };
  }
}
