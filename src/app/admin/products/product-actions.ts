'use server';

import { getAuthHeaders, getApiUrl, ResponseState } from '../admin-utils';

export async function getProductsAction(
  page: number = 1,
  limit: number = 8,
  search: string = '',
  branchId: string = '',
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  products: any[];
  message?: string;
}> {
  try {
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: limit.toString(),
      search,
    };
    if (branchId) queryParams.branchId = branchId;
    const query = new URLSearchParams(queryParams);

    const response = await fetch(`${getApiUrl()}/products?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
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

export async function getProductsByCategoryAction(
  categorySlug: string,
  page: number = 1,
  limit: number = 8,
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
    });

    const response = await fetch(`${getApiUrl()}/products/category/${categorySlug}?${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        products: [],
        message: data.message || 'Không thể tải danh sách sản phẩm theo danh mục.',
      };
    }

    return {
      success: true,
      currentPage: data.currentPage || page,
      totalPages: data.totalPages || 1,
      totalProducts: data.totalProducts || data.totalCount || 0,
      products: data.products || data.data || [],
    };
  } catch (error) {
    console.error('getProductsByCategoryAction error:', error);
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
    const response = await fetch(`${getApiUrl()}/products/${id}`, {
      method: 'PATCH',
      headers,
      cache: 'no-store',
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
    const response = await fetch(`${getApiUrl()}/products/${id}`, {
      method: 'DELETE',
      headers,
      cache: 'no-store',
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

export async function createProductAction(formData: FormData): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const authHeaders: Record<string, string> = { ...headers };
    delete authHeaders['Content-Type'];

    const response = await fetch(`${getApiUrl()}/products`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
      cache: 'no-store',
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
      cache: 'no-store',
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

export async function replaceProductImageAction(
  productId: string,
  imageId: string,
  formData: FormData,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const authHeaders: Record<string, string> = { ...headers };
    delete authHeaders['Content-Type'];

    const response = await fetch(`${getApiUrl()}/products/${productId}/images/${imageId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: formData,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Thay thế ảnh thất bại.' };
    }

    return { success: true, message: 'Thay thế ảnh thành công!', data: data };
  } catch (error) {
    console.error('replaceProductImageAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function deleteProductImageAction(
  productId: string,
  imageId: string,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Xóa ảnh thất bại.' };
    }

    return { success: true, message: 'Xóa ảnh thành công!', data: data };
  } catch (error) {
    console.error('deleteProductImageAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function reorderProductImagesAction(
  productId: string,
  orders: Array<{ imageId: string; order: number }>,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/products/${productId}/images/reorder`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(orders),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Sắp xếp thứ tự ảnh thất bại.' };
    }

    return { success: true, message: 'Sắp xếp thứ tự ảnh thành công!', data: data };
  } catch (error) {
    console.error('reorderProductImagesAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function setProductThumbnailAction(
  productId: string,
  imageId: string,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/products/${productId}/images/${imageId}/thumbnail`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ imageId }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Đặt ảnh đại diện thất bại.' };
    }

    return { success: true, message: 'Đặt ảnh đại diện thành công!', data: data };
  } catch (error) {
    console.error('setProductThumbnailAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}
