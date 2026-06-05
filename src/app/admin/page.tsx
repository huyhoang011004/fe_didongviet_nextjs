'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  FolderTree,
  Ticket,
  DollarSign,
  TrendingUp,
  Newspaper,
  Mail,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { getUsersAction } from './accounts/account-actions';
import { getProductsAction } from './products/product-actions';
import { getCategoriesAction } from './categories/category-actions';
import { getVouchersAction } from './vouchers/voucher-actions';
import { getOrdersAction } from './orders/order-actions';
import { getBlogsAction } from './blogs/blog-actions';
import { getContactsAction } from './contacts/contact-actions';
import { User } from '@/types/auth';

function AdminContent() {
  const router = useRouter();
  const currentTab = 'overview';

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalVouchers: 0,
    totalOrders: 0,
    totalBlogs: 0,
    totalContacts: 0,
    totalRevenue: 0,
    recentOrders: [] as any[],
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    async function checkRole() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.user) {
            setCurrentUser(data.data.user);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkRole();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role === 'staff') {
      router.replace('/admin?tab=overview');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchOverviewStats = async () => {
    setStatsLoading(true);
    try {
      const [
        usersRes,
        productsRes,
        categoriesRes,
        vouchersRes,
        ordersRes,
        blogsRes,
        contactsRes,
      ] = await Promise.all([
        getUsersAction('all', 1, ''),
        getProductsAction(1, 1, ''),
        getCategoriesAction(),
        getVouchersAction(),
        getOrdersAction(),
        getBlogsAction('', '', 1, 1),
        getContactsAction('', '', 1, 1),
      ]);

      let totalRevenue = 0;
      let recentOrders: any[] = [];

      if (ordersRes.success && ordersRes.orders) {
        totalRevenue = ordersRes.orders
          .filter((o: any) => o.isPaid || o.orderStatus === 'Đã hoàn thành')
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        recentOrders = [...ordersRes.orders]
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);
      }

      setStats({
        totalUsers: usersRes.success ? usersRes.totalUsers : 0,
        totalProducts: productsRes.success ? productsRes.totalProducts : 0,
        totalCategories: categoriesRes.success
          ? categoriesRes.categories.length
          : 0,
        totalVouchers: vouchersRes.success ? vouchersRes.vouchers.length : 0,
        totalOrders: ordersRes.success ? ordersRes.orders.length : 0,
        totalBlogs: blogsRes.success ? blogsRes.totalBlogs : 0,
        totalContacts: contactsRes.success ? contactsRes.totalContacts : 0,
        totalRevenue,
        recentOrders,
      });
    } catch (err) {
      console.error('fetchOverviewStats error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
  }, []);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

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
            Chào mừng trở lại, Ban Quản Trị
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Quản lý toàn bộ hiệu suất bán hàng của hệ thống Di Động Việt.
          </p>
        </div>
      </div>

      <div className='space-y-6'>
        {statsLoading ? (
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
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                    Doanh thu (Thực tế)
                  </CardTitle>
                  <DollarSign className='text-emerald-500 h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-black text-slate-800 dark:text-white'>
                    {formatVND(stats.totalRevenue)}
                  </div>
                  <p className='text-[10px] text-emerald-600 mt-1 font-semibold flex items-center gap-1'>
                    <TrendingUp size={10} />
                    <span>Đơn hàng thanh toán thành công</span>
                  </p>
                </CardContent>
              </Card>

              <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                    Đơn hàng hệ thống
                  </CardTitle>
                  <ShoppingBag className='text-blue-500 h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-black text-slate-800 dark:text-white'>
                    {stats.totalOrders} đơn hàng
                  </div>
                  <p className='text-[10px] text-blue-600 mt-1 font-semibold'>
                    Bao gồm COD và cổng VNPAY
                  </p>
                </CardContent>
              </Card>

              <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                    Bài viết công nghệ
                  </CardTitle>
                  <Newspaper className='text-purple-500 h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-black text-slate-800 dark:text-white'>
                    {stats.totalBlogs} bài viết
                  </div>
                  <p className='text-[10px] text-purple-600 mt-1 font-semibold'>
                    Lưu nháp & đã xuất bản
                  </p>
                </CardContent>
              </Card>

              <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <CardTitle className='text-xs font-bold text-slate-400 uppercase'>
                    Yêu cầu hỗ trợ CSKH
                  </CardTitle>
                  <Mail className='text-didongviet-red h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-black text-slate-800 dark:text-white'>
                    {stats.totalContacts} phản hồi
                  </div>
                  <p className='text-[10px] text-red-600 mt-1 font-semibold'>
                    Tư vấn, khiếu nại, thu cũ đổi mới
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs'>
              <div className='flex items-center gap-2.5 px-3 py-1 border-r border-slate-100 dark:border-slate-850 last:border-none'>
                <Users size={16} className='text-slate-400' />
                <span>
                  Tổng số: <strong>{stats.totalUsers}</strong> Thành viên hệ
                  thống
                </span>
              </div>
              <div className='flex items-center gap-2.5 px-3 py-1 border-r border-slate-100 dark:border-slate-850 last:border-none'>
                <FolderTree size={16} className='text-slate-400' />
                <span>
                  Tổng số: <strong>{stats.totalCategories}</strong> Danh mục
                  ngành hàng
                </span>
              </div>
              <div className='flex items-center gap-2.5 px-3 py-1 border-r border-slate-100 dark:border-slate-850 last:border-none'>
                <Ticket size={16} className='text-slate-400' />
                <span>
                  Tổng số: <strong>{stats.totalVouchers}</strong> Voucher khuyến
                  mại
                </span>
              </div>
              <div className='flex items-center gap-2.5 px-3 py-1 last:border-none'>
                <Sparkles
                  size={16}
                  className='text-didongviet-red animate-pulse'
                />
                <span className='font-semibold text-slate-800 dark:text-slate-200'>
                  Vận hành Di Động Việt ổn định...
                </span>
              </div>
            </div>
          </>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 shadow-sm flex flex-col justify-start min-h-[350px]'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-base font-bold text-slate-800 dark:text-white'>
                Hóa đơn giao dịch mới nhất
              </h3>
              <Button
                onClick={() => router.push('/admin/orders')}
                variant='ghost'
                size='sm'
                className='text-xs text-didongviet-red font-semibold cursor-pointer'
              >
                Xem tất cả
              </Button>
            </div>

            {statsLoading ? (
              <div className='flex-1 flex items-center justify-center p-8'>
                <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
              </div>
            ) : stats.recentOrders.length === 0 ? (
              <div className='flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/20 text-slate-400 p-8 text-center'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>
                  Chưa có giao dịch nào được lưu.
                </p>
              </div>
            ) : (
              <div className='overflow-x-auto w-full'>
                <table className='w-full text-left border-collapse text-xs sm:text-sm'>
                  <thead>
                    <tr className='border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-2'>
                      <th className='py-2'>Mã Đơn</th>
                      <th className='py-2'>Khách hàng</th>
                      <th className='py-2'>Phương thức</th>
                      <th className='py-2'>Tổng tiền</th>
                      <th className='py-2'>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300'>
                    {stats.recentOrders.map((o: any) => (
                      <tr
                        key={o._id}
                        className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                      >
                        <td className='py-3 font-mono font-bold text-slate-900 dark:text-white truncate max-w-[100px]'>
                          {o._id}
                        </td>
                        <td className='py-3 font-semibold'>
                          {o.shippingAddress?.fullName || 'Khách vãng lai'}
                        </td>
                        <td className='py-3'>
                          <span className='px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold'>
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className='py-3 font-bold text-didongviet-red'>
                          {formatVND(o.totalPrice)}
                        </td>
                        <td className='py-3'>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase
                            ${
                              o.orderStatus === 'Đã hoàn thành'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : o.orderStatus === 'Đang giao hàng'
                                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                                  : o.orderStatus === 'Đã hủy'
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : 'bg-amber-50 text-amber-600 border-amber-200'
                            }
                          `}
                          >
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className='bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 shadow-sm flex flex-col justify-between'>
            <div>
              <h3 className='text-base font-bold text-slate-800 dark:text-white mb-4'>
                Lối tắt Quản trị
              </h3>
              <p className='text-xs text-slate-400 leading-relaxed mb-6'>
                Truy cập nhanh các phân khu nghiệp vụ để phê duyệt hóa đơn, viết
                tin công nghệ hoặc phản hồi ca hỗ trợ khiếu nại.
              </p>
            </div>
            <div className='space-y-3'>
              <Button
                onClick={() => router.push('/admin/orders')}
                className='w-full justify-start py-6 rounded-xl hover:text-didongviet-red cursor-pointer'
                variant='outline'
              >
                <ShoppingBag size={16} className='mr-2 text-didongviet-red' />
                Xử lý Đơn hàng ({stats.totalOrders})
              </Button>
              <Button
                onClick={() => router.push('/admin/blogs')}
                className='w-full justify-start py-6 rounded-xl hover:text-didongviet-red cursor-pointer'
                variant='outline'
              >
                <Newspaper size={16} className='mr-2 text-purple-600' />
                Viết bài công nghệ ({stats.totalBlogs})
              </Button>
              <Button
                onClick={() => router.push('/admin/contacts')}
                className='w-full justify-start py-6 rounded-xl hover:text-didongviet-red cursor-pointer'
                variant='outline'
              >
                <Mail size={16} className='mr-2 text-blue-500' />
                Hỗ trợ Khách hàng ({stats.totalContacts})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển...
          </span>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
