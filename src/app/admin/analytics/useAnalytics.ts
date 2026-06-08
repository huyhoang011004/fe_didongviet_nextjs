import { useState, useEffect } from 'react';
import { getAnalyticsData, getBranches, getBestSellingProducts } from './analytics-actions';

export function useAnalytics() {
  const [period, setPeriod] = useState('month');
  const [branchId, setBranchId] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchBranches = async () => {
    try {
      const data = await getBranches();
      if (data.success && (data.branches || data.data)) {
        const branchList = data.branches || data.data || [];
        setBranches(branchList);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, productsRes] = await Promise.all([
        getAnalyticsData(period, branchId || undefined),
        getBestSellingProducts(period, branchId || undefined, 10),
      ]);

      if (analyticsRes.success && analyticsRes.data) {
        setAnalyticsData(analyticsRes.data);
      }

      if (productsRes.success && productsRes.data) {
        setBestSellingProducts(productsRes.data);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setAlert({ type: 'error', message: 'Không thể tải dữ liệu phân tích' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [period, branchId]);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  const periodOptions = [
    { value: 'day', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'year', label: 'Năm nay' },
  ];

  return {
    period,
    setPeriod,
    branchId,
    setBranchId,
    branches,
    analyticsData,
    bestSellingProducts,
    loading,
    alert,
    setAlert,
    formatVND,
    periodOptions,
    refetch: fetchAnalyticsData,
  };
}
