'use server';

import { fetchWithAdminAuth, getApiUrl, ResponseState } from '../admin-utils';

export async function getContactsAction(
  status?: string,
  subject?: string,
  page: number = 1,
  limit: number = 8,
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  contacts: any[];
  message?: string;
}> {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status ? { status } : {}),
      ...(subject ? { subject } : {}),
    });

    const response = await fetchWithAdminAuth(`${getApiUrl()}/contacts/all?${query}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, currentPage: 1, totalPages: 1, totalContacts: 0, contacts: [], message: data.message || 'Không thể tải danh sách liên hệ.' };
    }

    return {
      success: true,
      currentPage: data.pagination?.currentPage || page,
      totalPages: data.pagination?.totalPages || 1,
      totalContacts: data.pagination?.totalItems || 0,
      contacts: data.data || [],
    };
  } catch (error) {
    console.error('getContactsAction error:', error);
    return { success: false, currentPage: 1, totalPages: 1, totalContacts: 0, contacts: [], message: 'Mất kết nối tới hệ thống.' };
  }
}

export async function updateContactStatusAction(
  id: string,
  statusData: { status?: string; notes?: string },
): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/contacts/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật liên hệ thất bại.' };
    }

    return { success: true, message: 'Đã cập nhật trạng thái liên hệ thành công!', data: data.data };
  } catch (error) {
    console.error('updateContactStatusAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function softDeleteContactAction(id: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/contacts/soft-delete/${id}`, {
      method: 'PATCH',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Hủy phiếu liên hệ thất bại.' };
    }

    return { success: true, message: 'Đã hủy phiếu liên hệ thành công!', data: data.data };
  } catch (error) {
    console.error('softDeleteContactAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteContactAction(id: string): Promise<ResponseState> {
  try {
    const response = await fetchWithAdminAuth(`${getApiUrl()}/contacts/delete/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa phiếu liên hệ thất bại.' };
    }

    return { success: true, message: data.message || 'Đã xóa vĩnh viễn liên hệ thành công!' };
  } catch (error) {
    console.error('deleteContactAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
