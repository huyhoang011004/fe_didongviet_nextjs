'use server';

import { getAuthHeaders, getApiUrl, ResponseState } from '../admin-utils';

export async function getVouchersAction(): Promise<{
  success: boolean;
  vouchers: any[];
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/vouchers/admin`, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, vouchers: [], message: data.message || 'Không thể tải danh sách voucher.' };
    }
    return { success: true, vouchers: data.data || [] };
  } catch (error) {
    console.error('getVouchersAction error:', error);
    return { success: false, vouchers: [], message: 'Mất kết nối tới hệ thống.' };
  }
}

export async function createVoucherAction(voucherData: {
  code: string;
  description?: string;
  discountType: string;
  discountValue?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit: number;
  maxUsagePerUser?: number;
  startDate: string;
  expiryDate: string;
  isHSSVOnly?: boolean;
}): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/vouchers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(voucherData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo voucher thất bại.' };
    }
    return { success: true, message: 'Đã tạo voucher thành công!', data: data.data };
  } catch (error) {
    console.error('createVoucherAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateVoucherAction(
  id: string,
  voucherData: Record<string, any>,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/vouchers/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(voucherData),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật voucher thất bại.' };
    }
    return { success: true, message: 'Đã cập nhật voucher thành công!', data: data.data };
  } catch (error) {
    console.error('updateVoucherAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteVoucherAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/vouchers/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa voucher thất bại.' };
    }
    return { success: true, message: data.message || 'Đã xóa voucher thành công!' };
  } catch (error) {
    console.error('deleteVoucherAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function getVoucherByCodeAction(code: string): Promise<{
  success: boolean;
  voucher?: any;
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/vouchers/${code}`, {
      method: 'GET',
      headers,
      next: { revalidate: 0 },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || 'Không tìm thấy mã giảm giá này.' };
    }
    return { success: true, voucher: data.data || data };
  } catch (error) {
    console.error('getVoucherByCodeAction error:', error);
    return { success: false, message: 'Mất kết nối tới hệ thống.' };
  }
}
