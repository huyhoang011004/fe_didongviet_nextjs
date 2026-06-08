const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function getAnalyticsData(period: string = 'month', branchId?: string) {
  try {
    const params = new URLSearchParams();
    params.append('period', period);
    if (branchId) {
      params.append('branchId', branchId);
    }

    const res = await fetch(`${API_URL}/analytics?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Không thể tải dữ liệu phân tích');
    }
    return res.json();
  } catch (err) {
    console.error('getAnalyticsData error:', err);
    return { success: false, data: null };
  }
}

export async function getBranches() {
  try {
    const res = await fetch(`${API_URL}/branches`);
    if (!res.ok) {
      throw new Error('Không thể tải danh sách chi nhánh');
    }
    return res.json();
  } catch (err) {
    console.error('getBranches error:', err);
    return { success: false, branches: [] };
  }
}

export async function getBestSellingProducts(period: string = 'month', branchId?: string, limit: number = 10) {
  try {
    const params = new URLSearchParams();
    params.append('period', period);
    params.append('limit', limit.toString());
    if (branchId) {
      params.append('branchId', branchId);
    }

    const res = await fetch(`${API_URL}/analytics/best-selling?${params.toString()}`);
    if (!res.ok) {
      throw new Error('Không thể tải sản phẩm bán chạy');
    }
    return res.json();
  } catch (err) {
    console.error('getBestSellingProducts error:', err);
    return { success: false, data: [] };
  }
}
