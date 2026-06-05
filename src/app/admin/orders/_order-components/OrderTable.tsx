'use client';

import { Eye, FolderOpen } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface OrderTableProps {
  orders: any[];
  loading: boolean;
  onViewOrder: (order: any) => void;
}

const formatVND = (num: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Chưa cập nhật';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ORDER_STATUS_STYLE: Record<string, string> = {
  'Đã hoàn thành': 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
  'Đang giao hàng': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
  'Đã hủy': 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-800',
};

export function OrderTable({ orders, loading, onViewOrder }: OrderTableProps) {
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-3'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
        <span className='text-xs text-slate-400 font-medium'>Đang tải danh sách đơn hàng...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-3'>
        <FolderOpen size={44} className='text-slate-200 dark:text-slate-700' />
        <p className='text-sm font-semibold text-slate-400'>Không có đơn hàng nào khớp bộ lọc</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left border-collapse min-w-[860px]'>
        <thead>
          <tr className='bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800'>
            {['Mã Đơn Hàng', 'Khách nhận hàng', 'Thời gian lập', 'Tổng tiền', 'Phương thức', 'Thanh toán', 'Vận chuyển', ''].map((h) => (
              <th key={h} className='py-3.5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-50 dark:divide-slate-800/50 text-sm text-slate-700 dark:text-slate-300'>
          {orders.map((o) => (
            <tr key={o._id} className='hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group'>
              {/* Mã đơn */}
              <td className='py-4 px-6 font-mono font-bold text-slate-800 dark:text-slate-100 truncate max-w-[130px]'>
                {o._id}
              </td>

              {/* Khách hàng */}
              <td className='py-4 px-6'>
                <div className='flex flex-col'>
                  <span className='font-bold text-slate-900 dark:text-white'>
                    {o.shippingAddress?.fullName || 'Khách vãng lai'}
                  </span>
                  <span className='text-xs text-slate-400'>{o.shippingAddress?.phone || 'Chưa có SĐT'}</span>
                </div>
              </td>

              {/* Ngày */}
              <td className='py-4 px-6 text-xs'>{formatDate(o.createdAt)}</td>

              {/* Tổng tiền */}
              <td className='py-4 px-6 font-extrabold text-didongviet-red'>{formatVND(o.totalPrice)}</td>

              {/* Phương thức thanh toán */}
              <td className='py-4 px-6'>
                <span className='px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400'>
                  {o.paymentMethod}
                </span>
              </td>

              {/* Trạng thái thanh toán */}
              <td className='py-4 px-6'>
                <span className={`flex items-center gap-1.5 text-xs font-semibold ${o.isPaid ? 'text-emerald-600' : 'text-amber-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${o.isPaid ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  {o.isPaid ? `Đã TT (${formatDate(o.paidAt)})` : 'Chờ TT'}
                </span>
              </td>

              {/* Trạng thái vận chuyển */}
              <td className='py-4 px-6'>
                <span
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase ${
                    ORDER_STATUS_STYLE[o.orderStatus] ?? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800'
                  }`}
                >
                  {o.orderStatus}
                </span>
              </td>

              {/* Nút xem */}
              <td className='py-4 px-6 text-right whitespace-nowrap'>
                <Button
                  onClick={() => onViewOrder(o)}
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1.5 hover:text-didongviet-red border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-semibold py-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <Eye size={12} />
                  <span>Mở hóa đơn</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
