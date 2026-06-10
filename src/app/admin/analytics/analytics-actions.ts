'use server'; // Kích hoạt Next.js Server Actions

// Import các helper chuẩn của hệ thống giống như file voucher
import { fetchWithAdminAuth, getApiUrl } from '../admin-utils';

export async function getAnalyticsData(
  period: string = 'month',
  branchId?: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const params = new URLSearchParams();
    params.append('period', period);
    if (branchId) params.append('branchId', branchId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    // Sử dụng fetchWithAdminAuth chạy ở Server để tự động kèm Token
    const res = await fetchWithAdminAuth(`${getApiUrl()}/analytics?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, data: null, message: data.message || 'Không thể tải dữ liệu phân tích' };
    }
    return { success: true, data: data.data || data };
  } catch (err) {
    console.error('getAnalyticsData error:', err);
    return { success: false, data: null };
  }
}

export async function getBranches() {
  try {
    const res = await fetchWithAdminAuth(`${getApiUrl()}/branches`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, branches: [], message: data.message || 'Không thể tải danh sách chi nhánh' };
    }
    // Đồng bộ format response cũ của bạn
    return { success: true, branches: data.branches || data.data || [] };
  } catch (err) {
    console.error('getBranches error:', err);
    return { success: false, branches: [] };
  }
}

export async function getBestSellingProducts(
  period: string = 'month',
  branchId?: string,
  limit: number = 10,
  sortBy: string = 'qty',
  startDate?: string,
  endDate?: string
) {
  try {
    const params = new URLSearchParams();
    params.append('period', period);
    params.append('limit', limit.toString());
    params.append('sortBy', sortBy);
    if (branchId) params.append('branchId', branchId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const res = await fetchWithAdminAuth(`${getApiUrl()}/analytics/best-selling?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, data: [], message: data.message || 'Không thể tải sản phẩm bán chạy' };
    }
    return { success: true, data: data.data || data };
  } catch (err) {
    console.error('getBestSellingProducts error:', err);
    return { success: false, data: [] };
  }
}

export async function getChartData(
  period: string = 'month',
  branchId?: string,
  startDate?: string,
  endDate?: string
) {
  try {
    const params = new URLSearchParams();
    params.append('period', period);
    if (branchId) params.append('branchId', branchId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const res = await fetchWithAdminAuth(`${getApiUrl()}/analytics/chart-data?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, data: null, message: data.message || 'Không thể tải dữ liệu biểu đồ' };
    }
    return { success: true, data: data.data || data };
  } catch (err) {
    console.error('getChartData error:', err);
    return { success: false, data: null };
  }
}

export async function getOrderStatusSummary(branchId?: string) {
  try {
    const params = new URLSearchParams();
    if (branchId) params.append('branchId', branchId);

    const res = await fetchWithAdminAuth(`${getApiUrl()}/analytics/order-status?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, data: null, message: data.message || 'Không thể tải trạng thái đơn hàng' };
    }
    return { success: true, data: data.data || data };
  } catch (err) {
    console.error('getOrderStatusSummary error:', err);
    return { success: false, data: null };
  }
}

export async function getLowStockProducts(threshold: number = 5, limit: number = 5) {
  try {
    const params = new URLSearchParams();
    params.append('threshold', threshold.toString());
    params.append('limit', limit.toString());

    const res = await fetchWithAdminAuth(`${getApiUrl()}/analytics/low-stock?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, data: [], message: data.message || 'Không thể tải sản phẩm sắp hết hàng' };
    }
    return { success: true, data: data.data || data };
  } catch (err) {
    console.error('getLowStockProducts error:', err);
    return { success: false, data: [] };
  }
}

export async function getOldStockProducts(days: number = 60, limit: number = 5) {
  try {
    const params = new URLSearchParams();
    params.append('days', days.toString());
    params.append('limit', limit.toString());

    const res = await fetchWithAdminAuth(`${getApiUrl()}/analytics/old-stock?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, data: [], message: data.message || 'Không thể tải sản phẩm tồn lâu' };
    }
    return { success: true, data: data.data || data };
  } catch (err) {
    console.error('getOldStockProducts error:', err);
    return { success: false, data: [] };
  }
}

export async function getBranchRanking(
  period: string = 'month',
  limit: number = 10,
  startDate?: string,
  endDate?: string
) {
  try {
    const params = new URLSearchParams();
    params.append('period', period);
    params.append('limit', limit.toString());
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const res = await fetchWithAdminAuth(`${getApiUrl()}/analytics/branch-ranking?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, data: [], message: data.message || 'Không thể tải xếp hạng chi nhánh' };
    }
    return { success: true, data: data.data || data };
  } catch (err) {
    console.error('getBranchRanking error:', err);
    return { success: false, data: [] };
  }
}