'use server';

import { getAuthHeaders, getApiUrl, ResponseState } from '../admin-utils';

export async function getOrdersAction(): Promise<{
  success: boolean;
  orders: any[];
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/orders`, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/orders/${id}/deliver`, {
      method: 'PUT',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/orders/${id}/status`, {
      method: 'PUT',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/orders/${id}`, {
      method: 'DELETE',
      headers,
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
      next: { revalidate: 0 },
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
