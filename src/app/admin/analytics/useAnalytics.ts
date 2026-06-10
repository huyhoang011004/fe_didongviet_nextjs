import { useState, useEffect, useCallback } from 'react';
import {
  getAnalyticsData,
  getBranches,
  getBestSellingProducts,
  getChartData,
  getOrderStatusSummary,
  getLowStockProducts,
  getOldStockProducts,
  getBranchRanking,
} from './analytics-actions';

export type QuickRange = 'today' | 'yesterday' | 'last7' | 'last30' | 'custom';

export function useAnalytics() {
  const [period, setPeriod] = useState('day');
  const [dateType, setDateType] = useState<'preset' | 'custom'>('preset');
  const [quickRange, setQuickRange] = useState<QuickRange>('today');
  const [customDate, setCustomDate] = useState<string>('');
  const [customYear, setCustomYear] = useState<number>(new Date().getFullYear());
  const [customMonth, setCustomMonth] = useState<number>(new Date().getMonth() + 1);
  const [branchId, setBranchId] = useState('');
  const [sortBy, setSortBy] = useState('qty');
  const todayStr = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [branches, setBranches] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartGranularity, setChartGranularity] = useState<string>('day');
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [oldStockProducts, setOldStockProducts] = useState<any[]>([]);
  const [branchRanking, setBranchRanking] = useState<any[]>([]);

  const [visibleMetrics, setVisibleMetrics] = useState<string[]>([
    'totalRevenue',
    'totalProfit',
    'totalOrders',
    'totalProductsSold',
    'avgOrderValue',
  ]);

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
      if (data.success) {
        const branchList = data.branches || [];
        setBranches(branchList);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  // Format YYYY-MM-DD (theo giờ địa phương, không phải UTC)
  const formatDateStr = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Tính startDate/endDate từ ngày được chọn
  const getDayRange = useCallback((dateStr: string) => {
    if (!dateStr) return { startDate: '', endDate: '' };
    return { startDate: dateStr, endDate: dateStr };
  }, []);

  // Tính startDate/endDate từ tháng + năm được chọn
  const getMonthRange = useCallback((year: number, month: number) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return {
      startDate: formatDateStr(start),
      endDate: formatDateStr(end),
    };
  }, []);

  // Tính startDate/endDate từ năm được chọn
  const getYearRange = useCallback((year: number) => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    return {
      startDate: formatDateStr(start),
      endDate: formatDateStr(end),
    };
  }, []);

  // Tính startDate/endDate từ quickRange
  const getQuickRangeDates = useCallback((range: QuickRange) => {
    const today = new Date();
    const todayStr = formatDateStr(today);

    switch (range) {
      case 'today':
        return { startDate: todayStr, endDate: todayStr };
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const str = formatDateStr(yesterday);
        return { startDate: str, endDate: str };
      }
      case 'last7': {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return { startDate: formatDateStr(start), endDate: todayStr };
      }
      case 'last30': {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return { startDate: formatDateStr(start), endDate: todayStr };
      }
      default:
        return { startDate: todayStr, endDate: todayStr };
    }
  }, []);

  // Effect: tính startDate/endDate dựa trên dateType
  useEffect(() => {
    if (dateType === 'custom') {
      setPeriod('custom'); // Giữ nguyên logic custom của bạn
      if (customDate) {
        const range = getDayRange(customDate);
        setStartDate(range.startDate); setEndDate(range.endDate);
      } else if (customMonth && customYear) {
        const range = getMonthRange(customYear, customMonth);
        setStartDate(range.startDate); setEndDate(range.endDate);
      } else {
        const range = getYearRange(customYear);
        setStartDate(range.startDate); setEndDate(range.endDate);
      }
    } else {
      // Preset: Cập nhật period đồng bộ với quickRange để backend xử lý chính xác
      if (quickRange === 'today' || quickRange === 'yesterday') {
        setPeriod('day');
      } else if (quickRange === 'last7') {
        setPeriod('week');
      } else if (quickRange === 'last30') {
        setPeriod('month');
      }

      const range = getQuickRangeDates(quickRange);
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    }
  }, [dateType, quickRange, customDate, customMonth, customYear, getDayRange, getMonthRange, getYearRange, getQuickRangeDates]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const actualPeriod = dateType === 'custom' ? 'custom' : period;
      const sd = startDate || undefined;
      const ed = endDate || undefined;

      const [
        analyticsRes,
        productsRes,
        chartRes,
        orderStatusRes,
        lowStockRes,
        oldStockRes,
        branchRankRes,
      ] = await Promise.all([
        getAnalyticsData(actualPeriod, branchId || undefined, sd, ed),
        getBestSellingProducts(actualPeriod, branchId || undefined, 10, sortBy, sd, ed),
        getChartData(actualPeriod, branchId || undefined, sd, ed),
        getOrderStatusSummary(branchId || undefined),
        getLowStockProducts(5, 5),
        getOldStockProducts(60, 5),
        getBranchRanking(actualPeriod, 10, sd, ed),
      ]);

      if (analyticsRes.success && analyticsRes.data) {
        setAnalyticsData(analyticsRes.data);
      }

      if (productsRes.success && productsRes.data) {
        setBestSellingProducts(productsRes.data);
      }

      if (chartRes.success && chartRes.data) {
        setChartData(chartRes.data.chartData || []);
        setChartGranularity(chartRes.data.granularity || 'day');
      }

      if (orderStatusRes.success && orderStatusRes.data) {
        setOrderStatus(orderStatusRes.data);
      }

      if (lowStockRes.success && lowStockRes.data) {
        setLowStockProducts(lowStockRes.data);
      }

      if (oldStockRes.success && oldStockRes.data) {
        setOldStockProducts(oldStockRes.data);
      }

      if (branchRankRes.success && branchRankRes.data) {
        setBranchRanking(branchRankRes.data);
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
  }, [period, branchId, sortBy, startDate, endDate, dateType]);

  const toggleMetric = (metric: string) => {
    setVisibleMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  const periodOptions = [
    { value: 'day', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' },
  ];

  const sortByOptions = [
    { value: 'qty', label: 'Số lượng' },
    { value: 'revenue', label: 'Doanh thu' },
    { value: 'profit', label: 'Lợi nhuận' },
  ];

  const metricConfig: Record<string, { label: string; color: string; unit: string }> = {
    totalRevenue: { label: 'Doanh thu', color: '#2563eb', unit: 'vnd' }, // Blue
    totalProfit: { label: 'Lợi nhuận', color: '#10b981', unit: 'vnd' }, // Emerald
    totalOrders: { label: 'Đơn hàng', color: '#f59e0b', unit: 'number' }, // Amber
    totalProductsSold: { label: 'SP bán ra', color: '#ef4444', unit: 'number' }, // Red
    avgOrderValue: { label: 'Giá trị TB', color: '#8b5cf6', unit: 'vnd' }, // Violet
  };

  return {
    period,
    setPeriod,
    dateType,
    setDateType,
    quickRange,
    setQuickRange,
    customDate,
    setCustomDate,
    customYear,
    setCustomYear,
    customMonth,
    setCustomMonth,
    branchId,
    setBranchId,
    sortBy,
    setSortBy,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    branches,
    analyticsData,
    bestSellingProducts,
    chartData,
    chartGranularity,
    orderStatus,
    lowStockProducts,
    oldStockProducts,
    branchRanking,
    visibleMetrics,
    toggleMetric,
    loading,
    alert,
    setAlert,
    formatVND,
    periodOptions,
    sortByOptions,
    metricConfig,
    refetch: fetchAnalyticsData,
  };
}