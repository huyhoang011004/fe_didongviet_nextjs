'use client';

import { useState } from 'react';
import { Check, ChevronDown, Eye, FolderOpen, PackageCheck, Truck } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface OrderTableProps {
  orders: any[];
  loading: boolean;
  onViewOrder: (order: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
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

const ORDER_STATUS_LABEL: Record<string, string> = {
  'Chờ xác nhận': 'Chờ xác nhận',
  'Chờ lấy hàng': 'Chờ lấy hàng',
  'Đang giao': 'Đang giao',
  'Đã giao': 'Đã giao',
  'Đã hủy': 'Đã hủy',
  'Trả hàng/Hoàn tiền': 'Trả hàng/Hoàn tiền',
};

const ORDER_STATUS_STYLE: Record<string, string> = {
  'Chờ xác nhận': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
  'Chờ lấy hàng': 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800',
  'Đang giao': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
  'Đã giao': 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
  'Đã hủy': 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-800',
  'Trả hàng/Hoàn tiền': 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800',
};

const STATUS_ACTIONS: Record<string, { label: string; nextStatus: string; icon: typeof Check }> = {
  'Chờ xác nhận': { label: 'Duyệt', nextStatus: 'Chờ lấy hàng', icon: Check },
  'Chờ lấy hàng': { label: 'Chuẩn bị hàng', nextStatus: 'Đang giao', icon: PackageCheck },
  'Đang giao': { label: 'Đã giao', nextStatus: 'Đã giao', icon: Truck },
};

const getVariantLabel = (item: any) => {
  const variantId = String(item.variantId?._id || item.variantId || '');
  const variant = item.product?.variants?.find((v: any) => String(v._id) === variantId);
  const color = item.selectedColor || variant?.color || '';
  const ramRom = item.selectedStorage || (variant?.ram && variant?.rom ? `${variant.ram}/${variant.rom}` : '');
  const parts = [
    color ? ` ${color}` : '',
    ramRom ? `${ramRom}` : '',
  ].filter(Boolean);

  return parts.length ? parts.join(' | ') : 'Chưa có thông tin phân loại';
};

function ProductSummary({
  order,
  expanded,
  onToggle,
}: {
  order: any;
  expanded: boolean;
  onToggle: () => void;
}) {
  const items = order.orderItems || [];
  const firstItem = items[0];
  const visibleItems = expanded ? items : items.slice(0, 1);

  if (!firstItem) {
    return <span className='text-xs font-semibold text-slate-400'>Chưa có sản phẩm</span>;
  }

  return (
    <div className='space-y-2'>
      {visibleItems.map((item: any, idx: number) => (
        <div key={item._id || `${item.product}-${idx}`} className='flex items-center gap-3 min-w-0'>
          <div className='h-14 w-14 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 overflow-hidden flex items-center justify-center p-1 flex-shrink-0'>
            <img src={item.image || '/auth-image.webp'} alt={item.name} className='h-full w-full object-contain' />
          </div>
          <div className='min-w-0'>
            <span className='font-bold text-slate-900 dark:text-white block truncate text-sm'>{item.name}</span>
            <span className='text-xs text-slate-500 dark:text-slate-400 block truncate'>{getVariantLabel(item)}</span>
            <span className='text-[11px] text-slate-400 block'>SL: {item.qty}</span>
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <button
          type='button'
          onClick={onToggle}
          className='inline-flex items-center gap-1.5 text-xs font-bold text-didongviet-red hover:text-red-700 bg-transparent border-none cursor-pointer p-0'
        >
          <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Thu gọn phân loại' : `Mở ${items.length - 1} phân loại còn lại`}
        </button>
      )}
    </div>
  );
}

export function OrderTable({ orders, loading, onViewOrder, onUpdateStatus }: OrderTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

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
    <div className='divide-y divide-slate-100 dark:divide-slate-800'>
      <div className='hidden md:grid grid-cols-[minmax(320px,1.9fr)_minmax(120px,0.7fr)_minmax(120px,0.7fr)_minmax(130px,0.7fr)_minmax(150px,0.8fr)] gap-4 px-6 py-3 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
        <span>Sản phẩm</span>
        <span>Tổng tiền</span>
        <span>Phương thức</span>
        <span>Trạng thái đơn</span>
        <span className='text-right'>Thao tác</span>
      </div>

      {orders.map((order) => {
        const action = STATUS_ACTIONS[order.orderStatus];
        const ActionIcon = action?.icon;
        const isExpanded = Boolean(expandedOrders[order._id]);

        return (
          <div key={order._id} className='px-4 md:px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors'>
            <div className='flex items-start justify-between gap-4 pb-3'>
              <div className='min-w-0'>
                <div className='font-bold text-slate-900 dark:text-white truncate'>
                  {order.shippingAddress?.fullName || 'Khách vãng lai'}
                </div>
                <div className='text-xs font-medium text-slate-400'>{order.shippingAddress?.phone || 'Chưa có SĐT'}</div>
              </div>
              <div className='text-right flex-shrink-0 max-w-[48%]'>
                <div className='font-mono text-xs font-bold text-slate-800 dark:text-slate-100 truncate'>{order._id}</div>
                <div className='text-[11px] font-medium text-slate-400 mt-0.5'>{formatDate(order.createdAt)}</div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-[minmax(320px,1.9fr)_minmax(120px,0.7fr)_minmax(120px,0.7fr)_minmax(130px,0.7fr)_minmax(150px,0.8fr)] gap-4 items-start'>
              <ProductSummary
                order={order}
                expanded={isExpanded}
                onToggle={() => setExpandedOrders((prev) => ({ ...prev, [order._id]: !prev[order._id] }))}
              />

              <div>
                <div className='md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1'>Tổng tiền</div>
                <div className='font-extrabold text-didongviet-red'>{formatVND(order.totalPrice)}</div>
              </div>

              <div>
                <div className='md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1'>Phương thức</div>
                <span className='inline-flex px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400'>
                  {order.paymentMethod}
                </span>
              </div>

              <div>
                <div className='md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1'>Trạng thái đơn</div>
                <span
                  className={`inline-flex px-2.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase ${ORDER_STATUS_STYLE[order.orderStatus] ?? ORDER_STATUS_STYLE['Chờ xác nhận']
                    }`}
                >
                  {ORDER_STATUS_LABEL[order.orderStatus] || order.orderStatus}
                </span>
              </div>

              <div className='flex md:justify-end gap-2 flex-wrap'>
                <Button
                  onClick={() => onViewOrder(order)}
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1.5 hover:text-didongviet-red border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-semibold rounded-xl'
                >
                  <Eye size={12} />
                  <span>Xem hóa đơn</span>
                </Button>

                {action && ActionIcon && (
                  <button
                    type='button'
                    onClick={() => onUpdateStatus(order._id, action.nextStatus)}
                    className='inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-didongviet-red hover:bg-red-700 rounded-xl transition-colors cursor-pointer border-none'
                  >
                    <ActionIcon size={13} />
                    {action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
