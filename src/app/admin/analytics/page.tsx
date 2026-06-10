'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Building2,
  BarChart3,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { BusinessCharts } from '@/app/admin/analytics/_components/business-charts';
import DateRangePicker from '@/app/admin/analytics/_components/date-range-picker';
import StatsCards from '@/app/admin/analytics/_components/stats-cards';
import OrderStockGrid from '@/app/admin/analytics/_components/order-stock-grid';
import { useAnalytics } from './useAnalytics';

function AnalyticsContent() {
  const {
    period,
    setPeriod,
    dateType,
    setDateType,
    quickRange,
    setQuickRange,
    customDate,
    setCustomDate,
    customMonth,
    setCustomMonth,
    customYear,
    setCustomYear,
    branchId,
    setBranchId,
    sortBy,
    setSortBy,
    branches,
    analyticsData,
    bestSellingProducts,
    chartData,
    orderStatus,
    lowStockProducts,
    oldStockProducts,
    branchRanking,
    visibleMetrics,
    toggleMetric,
    loading,
    alert,
    formatVND,
    sortByOptions,
    metricConfig,
    refetch,
  } = useAnalytics();

  return (
    <div className='space-y-6 relative'>
      {alert && (
        <div
          className={`
          fixed bottom-5 right-5 z-[9999] p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}
        >
          {alert.type === 'success' ? (
            <CheckCircle className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-sm font-semibold'>{alert.message}</span>
        </div>
      )}

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white'>
            Doanh thu & Phân tích
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Phân tích hiệu suất bán hàng của toàn hệ thống Di Động Việt
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-visible z-20 relative'>
        <CardContent className='p-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <CalendarDays size={16} className='text-slate-400' />
            <span className='text-xs text-slate-400 font-semibold'>Khung thời gian:</span>
            {/* Date Range Picker */}
            <DateRangePicker
              period={period}
              setPeriod={setPeriod}
              dateType={dateType}
              setDateType={setDateType}
              quickRange={quickRange}
              setQuickRange={setQuickRange}
              customDate={customDate}
              setCustomDate={setCustomDate}
              customMonth={customMonth}
              setCustomMonth={setCustomMonth}
              customYear={customYear}
              setCustomYear={setCustomYear}
            />

            {/* Branch Filter */}
            <div className='flex items-center gap-2'>
              <Building2 size={16} className='text-slate-400' />
              <span className='text-xs text-slate-400 font-semibold'>Chi nhánh:</span>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className='text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-didongviet-red cursor-pointer'
              >
                <option value=''>Tất cả chi nhánh</option>
                {branches.map((branch: any) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={refetch}
              variant='outline'
              size='sm'
              className='text-xs font-semibold cursor-pointer hover:text-didongviet-red'
            >
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <StatsCards
        analyticsData={analyticsData}
        visibleMetrics={visibleMetrics}
        toggleMetric={toggleMetric}
        formatVND={formatVND}
        loading={loading}
      />

      {/* Charts */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='text-sm font-bold text-slate-800 dark:text-white'>
            Biểu đồ
          </CardTitle>
          <p className='text-[10px] text-slate-400'>Click vào các thẻ phía trên để ẩn/hiện từng đường</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center h-[350px]'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
            </div>
          ) : (
            <BusinessCharts
              chartData={chartData}
              visibleMetrics={visibleMetrics}
              metricConfig={metricConfig}
              formatVND={formatVND}
            />
          )}
        </CardContent>
      </Card>

      {/* Order Status + Low Stock + Old Stock + Branch Ranking */}
      <OrderStockGrid
        orderStatus={orderStatus}
        lowStockProducts={lowStockProducts}
        oldStockProducts={oldStockProducts}
        branchRanking={branchRanking}
        loading={loading}
      />

      {/* Best Selling Products */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-base font-bold text-slate-800 dark:text-white'>
              Sản phẩm bán chạy
            </CardTitle>
          </div>
          {/* SortBy moved next to "Sản phẩm bán chạy" */}
          <div className='flex items-center gap-2'>
            <BarChart3 size={16} className='text-slate-400' />
            <span className='text-xs text-slate-400 font-semibold'>Xếp theo:</span>
            <div className='flex gap-2'>
              {sortByOptions.map((option: any) => (
                <Button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  variant={sortBy === option.value ? 'default' : 'outline'}
                  size='sm'
                  className={`text-xs font-semibold cursor-pointer ${sortBy === option.value
                    ? 'bg-didongviet-red hover:bg-red-700 text-white border-none'
                    : 'hover:text-didongviet-red'
                    }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
            </div>
          ) : bestSellingProducts.length === 0 ? (
            <div className='flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/20 text-slate-400 p-8 text-center'>
              <Package size={48} className='text-slate-300 mb-2' />
              <p className='text-sm font-semibold'>Chưa có dữ liệu sản phẩm bán chạy.</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse text-xs sm:text-sm'>
                <thead>
                  <tr className='border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-2'>
                    <th className='py-2'>STT</th>
                    <th className='py-2'>Sản phẩm</th>
                    <th className='py-2'>Đã bán</th>
                    <th className='py-2'>Doanh thu</th>
                    <th className='py-2'>Lợi nhuận</th>
                    <th className='py-2'>Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300'>
                  {bestSellingProducts.map((product: any, index: number) => (
                    <tr
                      key={product._id || index}
                      className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                    >
                      <td className='py-3 font-bold text-slate-900 dark:text-white'>#{index + 1}</td>
                      <td className='py-3'>
                        <div className='flex items-center gap-3'>
                          {product.image ? (
                            <Image
                              src={product.image[0]}
                              alt={product.productName || product.name}
                              width={48}
                              height={48}
                              className='rounded-lg object-cover border border-slate-200'
                              style={{ width: 48, height: 48 }}
                            />
                          ) : (
                            <div className='w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center'>
                              <Package size={20} className='text-slate-300' />
                            </div>
                          )}
                          <span className='font-semibold'>{product.productName || product.name}</span>
                        </div>
                      </td>
                      <td className='py-3 font-bold text-blue-600'>{product.totalSold || 0}</td>
                      <td className='py-3 font-bold text-didongviet-red'>{formatVND(product.totalRevenue || 0)}</td>
                      <td className='py-3 font-bold text-green-600'>{formatVND(product.totalProfit || 0)}</td>
                      <td className='py-3'>
                        <div className='flex items-center gap-2'>
                          <div className='flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-didongviet-red rounded-full'
                              style={{
                                width: `${Math.min(100, (product.totalRevenue / (analyticsData?.totalRevenue || 1)) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className='text-[10px] font-semibold text-slate-600 dark:text-slate-400'>
                            {analyticsData?.totalRevenue > 0
                              ? ((product.totalRevenue / analyticsData.totalRevenue) * 100).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>Đang tải dữ liệu phân tích...</span>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}