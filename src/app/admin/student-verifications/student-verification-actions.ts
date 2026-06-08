'use server';

// Thay đổi import: bỏ getAuthHeaders, thêm fetchWithAdminAuth
import { fetchWithAdminAuth, getApiUrl } from '../admin-utils';

export async function getPendingHSSVAction(): Promise<{
  success: boolean;
  data: any[];
  message?: string;
}> {
  try {
    // Sử dụng fetchWithAdminAuth thay thế cho fetch thông thường
    const response = await fetchWithAdminAuth(
      `${getApiUrl()}/student-profile/management/pending`,
      {
        method: 'GET',
        next: { revalidate: 0 },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: [],
        message: data.message || 'Không thể tải danh sách hồ sơ sinh viên.',
      };
    }

    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error('getPendingHSSVAction error:', error);
    return { success: false, data: [], message: 'Mất kết nối tới hệ thống.' };
  }
}

export async function verifyHSSVStatusAction(
  id: string,
  bodyData: {
    status: 'Đã xác thực' | 'Bị từ chối';
    studentIdCard?: string;
    schoolName?: string;
    rejectedReason?: string;
  },
): Promise<{
  success: boolean;
  message: string;
  voucherCode?: string | null;
  instruction?: string;
}> {
  try {
    // Sử dụng fetchWithAdminAuth thay thế cho fetch thông thường
    const response = await fetchWithAdminAuth(
      `${getApiUrl()}/student-profile/management/verify/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(bodyData),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Xử lý duyệt thẻ sinh viên thất bại.',
      };
    }

    return {
      success: true,
      message: data.message || 'Đã xử lý hồ sơ HSSV thành công!',
      voucherCode: data.voucherCode,
      instruction: data.instruction,
    };
  } catch (error) {
    console.error('verifyHSSVStatusAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
