'use server';

import { cookies } from 'next/headers';

type ResponseState = {
  success: boolean;
  message: string;
  data?: any;
};

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
};

// ==========================================
// 👥 USER MANAGEMENT ACTIONS (QUẢN LÝ USER)
// ==========================================

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
    const headers = await getAuthHeaders();
    const query = new URLSearchParams({
      status,
      page: page.toString(),
      limit: '8',
      search,
    });

    const response = await fetch(`${getApiUrl()}/accounts/admin/get-all-users?${query}`, {
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/accounts/admin/create`, {
      method: 'POST',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/accounts/admin/update/${id}`, {
      method: 'PUT',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/accounts/admin/soft-delete/${id}`, {
      method: 'PATCH',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/accounts/admin/delete/${id}`, {
      method: 'DELETE',
      headers,
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

// ==========================================
// 📦 PRODUCT MANAGEMENT ACTIONS (QUẢN LÝ SẢN PHẨM)
// ==========================================

export async function getProductsAction(
  page: number = 1,
  limit: number = 8,
  search: string = '',
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  products: any[];
  message?: string;
}> {
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });

    // API lấy sản phẩm công khai của Di Động Việt
    const response = await fetch(`${getApiUrl()}/products?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        products: [],
        message: data.message || 'Không thể tải danh sách sản phẩm.',
      };
    }

    // Định dạng cấu trúc trả về từ backend của bạn
    return {
      success: true,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 1,
      totalProducts: data.totalProducts || data.totalCount || 0,
      products: data.products || data.data || [],
    };
  } catch (error) {
    console.error('getProductsAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      products: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function softDeleteProductAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    // PATCH /api/v1/products/:id (deleteSoftProduct)
    const response = await fetch(`${getApiUrl()}/products/${id}`, {
      method: 'PATCH',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Thay đổi trạng thái sản phẩm thất bại.' };
    }

    return { success: true, message: data.message || 'Đã thay đổi trạng thái sản phẩm thành công!' };
  } catch (error) {
    console.error('softDeleteProductAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function hardDeleteProductAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    // DELETE /api/v1/products/:id (deleteProduct)
    const response = await fetch(`${getApiUrl()}/products/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa vĩnh viễn sản phẩm thất bại.' };
    }

    return { success: true, message: data.message || 'Đã xóa vĩnh viễn sản phẩm khỏi kho hàng thành công!' };
  } catch (error) {
    console.error('hardDeleteProductAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

// ==========================================
// 📂 CATEGORY MANAGEMENT ACTIONS (QUẢN LÝ DANH MỤC)
// ==========================================

export async function getCategoriesAction(): Promise<{
  success: boolean;
  categories: any[];
  message?: string;
}> {
  try {
    const response = await fetch(`${getApiUrl()}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 0 },
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
  brands?: string[];
  displayOrder?: number;
}): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/categories`, {
      method: 'POST',
      headers,
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
    brands?: string[];
    displayOrder?: number;
  },
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/categories/${id}`, {
      method: 'PUT',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/categories/${id}`, {
      method: 'DELETE',
      headers,
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

// ==========================================
// 🎫 VOUCHER MANAGEMENT ACTIONS (QUẢN LÝ MÃ GIẢM GIÁ)
// ==========================================

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

// ==========================================
// 📋 ORDER MANAGEMENT ACTIONS (QUẢN LÝ ĐƠN HÀNG)
// ==========================================

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

// ==========================================
// 📰 BLOG/NEWS MANAGEMENT ACTIONS (QUẢN LÝ TIN TỨC)
// ==========================================

export async function getBlogsAction(
  category?: string,
  keyword?: string,
  page: number = 1,
  limit: number = 8,
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  blogs: any[];
  message?: string;
}> {
  try {
    const headers = await getAuthHeaders();
    const query = new URLSearchParams({
      showAll: 'true',
      page: page.toString(),
      limit: limit.toString(),
      ...(category ? { category } : {}),
      ...(keyword ? { keyword } : {}),
    });

    const response = await fetch(`${getApiUrl()}/blogs?${query}`, {
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
        totalBlogs: 0,
        blogs: [],
        message: data.message || 'Không thể tải danh sách bài viết.',
      };
    }

    return {
      success: true,
      currentPage: data.currentPage || page,
      totalPages: data.pages || 1,
      totalBlogs: data.total || 0,
      blogs: data.data || [],
    };
  } catch (error) {
    console.error('getBlogsAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalBlogs: 0,
      blogs: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function createBlogAction(blogData: {
  title: string;
  content: string;
  summary: string;
  category: string;
  featuredImage: string;
  status: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs`, {
      method: 'POST',
      headers,
      body: JSON.stringify(blogData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo bài viết thất bại.' };
    }

    return { success: true, message: 'Đã tạo bài viết thành công!', data: data.data };
  } catch (error) {
    console.error('createBlogAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateBlogAction(
  id: string,
  blogData: Record<string, any>,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(blogData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật bài viết thất bại.' };
    }

    return { success: true, message: 'Đã cập nhật bài viết thành công!', data: data.data };
  } catch (error) {
    console.error('updateBlogAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function toggleBlogStatusAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs/${id}`, {
      method: 'PATCH',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Thay đổi trạng thái bài viết thất bại.' };
    }

    return { success: true, message: data.message || 'Đã thay đổi trạng thái bài viết thành công!' };
  } catch (error) {
    console.error('toggleBlogStatusAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteBlogAction(id: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/blogs/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa bài viết thất bại.' };
    }

    return { success: true, message: data.message || 'Đã xóa bài viết thành công!' };
  } catch (error) {
    console.error('deleteBlogAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

// ==========================================
// 📞 CONTACT REQUEST MANAGEMENT ACTIONS (QUẢN LÝ LIÊN HỆ)
// ==========================================

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
    const headers = await getAuthHeaders();
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status ? { status } : {}),
      ...(subject ? { subject } : {}),
    });

    const response = await fetch(`${getApiUrl()}/contacts/all?${query}`, {
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
        totalContacts: 0,
        contacts: [],
        message: data.message || 'Không thể tải danh sách liên hệ.',
      };
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
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalContacts: 0,
      contacts: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function updateContactStatusAction(
  id: string,
  statusData: { status?: string; notes?: string },
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/contacts/update/${id}`, {
      method: 'PUT',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/contacts/soft-delete/${id}`, {
      method: 'PATCH',
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/contacts/delete/${id}`, {
      method: 'DELETE',
      headers,
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

// ==========================================
// 🏢 BRANCH MANAGEMENT ACTIONS (QUẢN LÝ CHI NHÁNH)
// ==========================================

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

// ==========================================
// 📦 PRODUCT WRITE ACTIONS (THÊM / SỬA SẢN PHẨM)
// ==========================================

export async function createProductAction(formData: FormData): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const authHeaders: Record<string, string> = { ...headers };
    delete authHeaders['Content-Type']; // Multipart form-data requires fetch to generate boundary

    const response = await fetch(`${getApiUrl()}/products`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo sản phẩm thất bại.' };
    }

    return { success: true, message: 'Đã tạo sản phẩm thành công!', data: data.data };
  } catch (error) {
    console.error('createProductAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateProductAction(
  id: string,
  formData: FormData,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const authHeaders: Record<string, string> = { ...headers };
    delete authHeaders['Content-Type'];

    const response = await fetch(`${getApiUrl()}/products/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật sản phẩm thất bại.' };
    }

    return { success: true, message: 'Đã cập nhật sản phẩm thành công!', data: data.data };
  } catch (error) {
    console.error('updateProductAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
