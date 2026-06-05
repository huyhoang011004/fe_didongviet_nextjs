'use server';

import { getAuthHeaders, getApiUrl, ResponseState } from '../admin-utils';

export async function getLowStockProductsAction(
  threshold?: number,
  page: number = 1,
  limit: number = 10,
  category?: string,
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  products: any[];
  currentThreshold: number;
  message?: string;
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (threshold !== undefined && threshold !== null) {
      params.append('threshold', threshold.toString());
    }
    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${getApiUrl()}/inventory/low-stock?${params}`, {
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
        totalItems: 0,
        products: [],
        currentThreshold: 5,
        message: data.message || 'Không thể tải danh sách tồn kho.',
      };
    }

    return {
      success: true,
      currentPage: data.pagination?.page || page,
      totalPages: data.pagination?.totalPages || 1,
      totalItems: data.pagination?.totalItems || 0,
      products: data.data || [],
      currentThreshold: data.currentThreshold || 5,
    };
  } catch (error) {
    console.error('getLowStockProductsAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      products: [],
      currentThreshold: 5,
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function getOutOfStockProductsAction(
  page: number = 1,
  limit: number = 10,
  category?: string,
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  products: any[];
  message?: string;
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${getApiUrl()}/inventory/out-of-stock?${params}`, {
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
        totalItems: 0,
        products: [],
        message: data.message || 'Không thể tải danh sách sản phẩm hết hàng.',
      };
    }

    return {
      success: true,
      currentPage: data.pagination?.page || page,
      totalPages: data.pagination?.totalPages || 1,
      totalItems: data.pagination?.totalItems || 0,
      products: data.data || [],
    };
  } catch (error) {
    console.error('getOutOfStockProductsAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      products: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function getThresholdAction(): Promise<{
  success: boolean;
  threshold: number;
  message?: string;
}> {
  try {
    const response = await fetch(`${getApiUrl()}/inventory/threshold`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        threshold: 5,
        message: data.message || 'Không thể tải ngưỡng cảnh báo.',
      };
    }

    return {
      success: true,
      threshold: data.data?.lowStockThreshold || 5,
    };
  } catch (error) {
    console.error('getThresholdAction error:', error);
    return {
      success: false,
      threshold: 5,
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function updateThresholdAction(threshold: number): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/inventory/threshold`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ threshold }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật ngưỡng thất bại.' };
    }

    return { success: true, message: 'Đã cập nhật ngưỡng cảnh báo tồn kho thành công!', data: data.data };
  } catch (error) {
    console.error('updateThresholdAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function updateProductStockAction(
  productId: string,
  variantIndex: number,
  branchId: string,
  newStock: number,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/inventory/update-stock`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ productId, variantIndex, branchId, newStock }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Cập nhật số lượng tồn kho thất bại.' };
    }

    return { success: true, message: 'Cập nhật tồn kho chi nhánh thành công!', data: data.data };
  } catch (error) {
    console.error('updateProductStockAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function getStockReceiptsAction(
  page: number = 1,
  limit: number = 10,
  branch?: string,
  product?: string,
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  receipts: any[];
  message?: string;
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (branch) params.append('branch', branch);
    if (product) params.append('product', product);

    const response = await fetch(`${getApiUrl()}/inventory/stock-receipts?${params}`, {
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
        totalItems: 0,
        receipts: [],
        message: data.message || 'Không thể tải lịch sử nhập kho.',
      };
    }

    return {
      success: true,
      currentPage: data.pagination?.page || page,
      totalPages: data.pagination?.totalPages || 1,
      totalItems: data.pagination?.totalItems || 0,
      receipts: data.data || [],
    };
  } catch (error) {
    console.error('getStockReceiptsAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      receipts: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function createStockReceiptAction(
  productId: string,
  variantIndex: number,
  branchId: string,
  quantity: number,
  notes?: string,
): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/inventory/stock-receipts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId, variantIndex, branchId, quantity, notes }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Tạo phiếu nhập kho thất bại.' };
    }

    return { success: true, message: 'Đã tạo phiếu nhập kho thành công!', data: data.data };
  } catch (error) {
    console.error('createStockReceiptAction error:', error);
    return { success: false, message: 'Lỗi hệ thống. Vui lòng thử lại sau.' };
  }
}

export async function cancelStockReceiptAction(receiptId: string): Promise<ResponseState> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getApiUrl()}/inventory/stock-receipts/${receiptId}/cancel`, {
      method: 'PUT',
      headers,
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Hủy phiếu nhập kho thất bại.' };
    }

    return { success: true, message: 'Đã hủy phiếu nhập kho thành công!', data: data.data };
  } catch (error) {
    console.error('cancelStockReceiptAction error:', error);
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
      return {
        success: false,
        branches: [],
        message: data.message || 'Không thể tải danh sách chi nhánh.',
      };
    }

    return {
      success: true,
      branches: data.data || [],
    };
  } catch (error) {
    console.error('getBranchesAction error:', error);
    return {
      success: false,
      branches: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

export async function getProductBySkuAction(sku: string): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await fetch(`${getApiUrl()}/products/sku/${sku}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Không tìm thấy SKU' };
    return { success: true, data: data.data };
  } catch (error) {
    console.error('getProductBySkuAction error:', error);
    return { success: false, message: 'Lỗi kết nối tới hệ thống.' };
  }
}

export async function getProductByIdAction(id: string): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await fetch(`${getApiUrl()}/products/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Không tìm thấy sản phẩm' };
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error('getProductByIdAction error:', error);
    return { success: false, message: 'Lỗi kết nối tới hệ thống.' };
  }
}

export async function searchProductsAction(q: string): Promise<{ success: boolean; data?: any[]; message?: string }> {
  try {
    const response = await fetch(`${getApiUrl()}/products/search?q=${q}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: data.message || 'Lỗi tìm kiếm' };
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error('searchProductsAction error:', error);
    return { success: false, message: 'Lỗi kết nối tới hệ thống.' };
  }
}

export async function getProductsByBranchAction(
  branchId: string,
  page: number = 1,
  limit: number = 10,
  category?: string,
  stockFilter: 'all' | 'low-stock' | 'out-of-stock' = 'all',
): Promise<{
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  products: any[];
  message?: string;
}> {
  try {
    const params = new URLSearchParams({
      branchId: branchId,
      page: page.toString(),
      limit: limit.toString(),
      stockFilter: stockFilter,
    });
    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${getApiUrl()}/inventory/by-branch?${params}`, {
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
        totalItems: 0,
        products: [],
        message: data.message || 'Không thể tải danh sách sản phẩm chi nhánh.',
      };
    }

    return {
      success: true,
      currentPage: data.pagination?.page || page,
      totalPages: data.pagination?.totalPages || 1,
      totalItems: data.pagination?.totalItems || 0,
      products: data.data || [],
    };
  } catch (error) {
    console.error('getProductsByBranchAction error:', error);
    return {
      success: false,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      products: [],
      message: 'Mất kết nối tới hệ thống.',
    };
  }
}

