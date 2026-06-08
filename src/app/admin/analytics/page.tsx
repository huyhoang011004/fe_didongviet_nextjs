'use client';

import { Suspense } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Filter,
  Building2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useAnalytics } from './useAnalytics';

function AnalyticsContent() {
  const {
    period,
    setPeriod,
    branchId,
    setBranchId,
    branches,
    analyticsData,
    bestSellingProducts,
    loading,
    alert,
    formatVND,
    periodOptions,
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
      <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
        <CardContent className='p-4'>
          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Filter size={16} className='text-slate-400' />
              <span className='text-sm font-semibold text-slate-600'>Bộ lọc:</span>
            </div>

            {/* Period Filter */}
            <div className='flex items-center gap-2'>
              <span className='text-xs text-slate-400 font-semibold'>Thời gian:</span>
              <div className='flex gap-2'>
                {periodOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setPeriod(option.value)}
                    variant={period === option.value ? 'default' : 'outline'}
                    size='sm'
                    className={`text-xs font-semibold cursor-pointer ${
                      period === option.value
                        ? 'bg-didongviet-red hover:bg-red-700 text-white border-none'
                        : 'hover:text-didongviet-red'
                    }`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

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
                {branches.map((branch) => (
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
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='h-32 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 space-y-4'
            >
              <div className='h-4 bg-slate-200 rounded w-2/3'></div>
              <div className='h-8 bg-slate-200 rounded w-1/2'></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                Doanh thu
              </CardTitle>
              <DollarSign className='text-emerald-500 h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-slate-800 dark:text-white'>
                {formatVND(analyticsData?.totalRevenue || 0)}
              </div>
              <p className='text-[10px] text-emerald-600 mt-1 font-semibold flex items-center gap-1'>
                <TrendingUp size={10} />
                <span>Tổng doanh thu kỳ này</span>
              </p>
            </CardContent>
          </Card>

          <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                Số đơn hàng
              </CardTitle>
              <ShoppingBag className='text-blue-500 h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-slate-800 dark:text-white'>
                {analyticsData?.totalOrders || 0}
              </div>
              <p className='text-[10px] text-blue-600 mt-1 font-semibold'>
                Đơn hàng thành công
              </p>
            </CardContent>
          </Card>

          <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                Sản phẩm bán ra
              </CardTitle>
              <Package className='text-purple-500 h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-slate-800 dark:text-white'>
                {analyticsData?.totalProductsSold || 0}
              </div>
              <p className='text-[10px] text-purple-600 mt-1 font-semibold'>
                Tổng số lượng sản phẩm
              </p>
            </CardContent>
          </Card>

          <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                Giá trị trung bình
              </CardTitle>
              <TrendingUp className='text-orange-500 h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-black text-slate-800 dark:text-white'>
                {formatVND(
                  analyticsData?.totalOrders > 0
                    ? analyticsData.totalRevenue / analyticsData.totalOrders
                    : 0
                )}
              </div>
              <p className='text-[10px] text-orange-600 mt-1 font-semibold'>
                Giá trị trung bình/đơn
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Best Selling Products */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='text-base font-bold text-slate-800 dark:text-white'>
            Sản phẩm bán chạy
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center p-8'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
            </div>
          ) : bestSellingProducts.length === 0 ? (
            <div className='flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/20 text-slate-400 p-8 text-center'>
              <Package size={48} className='text-slate-300 mb-2' />
              <p className='text-sm font-semibold'>
                Chưa có dữ liệu sản phẩm bán chạy.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left border-collapse text-xs sm:text-sm'>
                <thead>
                  <tr className='border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-2'>
                    <th className='py-2'>STT</th>
                    <th className='py-2'>Tên sản phẩm</th>
                    <th className='py-2'>Số lượng bán</th>
                    <th className='py-2'>Doanh thu</th>
                    <th className='py-2'>Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300'>
                  {bestSellingProducts.map((product: any, index: number) => (
                    <tr
                      key={product._id || index}
                      className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                    >
                      <td className='py-3 font-bold text-slate-900 dark:text-white'>
                        #{index + 1}
                      </td>
                      <td className='py-3 font-semibold'>
                        {product.name || product.productName}
                      </td>
                      <td className='py-3 font-bold text-blue-600'>
                        {product.totalSold || product.quantitySold || 0}
                      </td>
                      <td className='py-3 font-bold text-didongviet-red'>
                        {formatVND(product.totalRevenue || 0)}
                      </td>
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
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang tải dữ liệu phân tích...
          </span>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}
