'use client';

import { X, MapPin, Clock, Truck, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
  onShip: (id: string) => void;
  onDeleteClick: () => void;
}

const formatVND = (num: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Chưa cập nhật';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const ORDER_STATUS_STYLE: Record<string, string> = {
  'Đã hoàn thành': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Đang giao hàng': 'bg-blue-50 text-blue-600 border-blue-200',
  'Đã hủy': 'bg-red-50 text-red-600 border-red-200',
};

export function OrderDetailsModal({ isOpen, order, onClose, onShip, onDeleteClick }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-500/5 to-indigo-600/5 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm'>
              <Truck size={16} className='text-white' />
            </div>
            <div>
              <h3 className='font-black text-slate-900 dark:text-white text-base'>Chi tiết hóa đơn</h3>
              <span className='text-[10px] font-mono text-slate-400 block mt-0.5'>{order._id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer border-none bg-transparent'
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className='p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300'>
          {/* Thông tin giao hàng */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80'>
            <div className='space-y-1.5'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>Người nhận hàng</span>
              <p className='font-bold text-slate-900 dark:text-white text-sm'>{order.shippingAddress?.fullName}</p>
              <p className='text-xs flex items-center gap-1'>
                <span className='text-slate-400'>SĐT:</span>
                <strong className='text-slate-800 dark:text-slate-200'>{order.shippingAddress?.phone}</strong>
              </p>
              <p className='text-xs flex items-center gap-1'>
                <span className='text-slate-400'>Thanh toán:</span>
                <strong className='text-slate-800 dark:text-slate-200'>{order.paymentMethod}</strong>
              </p>
            </div>

            <div className='space-y-1.5'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>Địa chỉ giao hàng</span>
              <p className='text-xs font-semibold text-slate-800 dark:text-slate-200 flex gap-1 items-start'>
                <MapPin size={13} className='text-didongviet-red flex-shrink-0 mt-0.5' />
                <span>
                  {order.shippingAddress?.streetAddress},{' '}
                  {order.shippingAddress?.ward},{' '}
                  {order.shippingAddress?.district},{' '}
                  {order.shippingAddress?.province}
                </span>
              </p>
              <p className='text-xs flex items-center gap-1 mt-1'>
                <Clock size={12} className='text-slate-400' />
                <span className='text-slate-400'>Thời gian mua:</span>
                <strong className='text-slate-800 dark:text-slate-200'>{formatDate(order.createdAt)}</strong>
              </p>
            </div>
          </div>

          {/* Mặt hàng */}
          <div className='space-y-3'>
            <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>
              Mặt hàng trong giỏ ({order.orderItems?.length ?? 0})
            </span>
            <div className='space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4'>
              {order.orderItems?.map((item: any, idx: number) => (
                <div key={idx} className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='h-12 w-12 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 overflow-hidden flex items-center justify-center p-1 flex-shrink-0'>
                      <img src={item.image || '/auth-image.webp'} alt={item.name} className='h-full w-full object-contain' />
                    </div>
                    <div className='truncate'>
                      <span className='font-bold text-slate-900 dark:text-white block truncate text-xs sm:text-sm'>{item.name}</span>
                      <span className='text-[10px] text-slate-400 block mt-0.5 font-mono'>SKU: {item.product}</span>
                    </div>
                  </div>
                  <div className='text-right flex-shrink-0'>
                    <span className='font-bold text-slate-900 dark:text-white block text-sm'>{formatVND(item.price)}</span>
                    <span className='text-xs text-slate-400 block mt-0.5'>Số lượng: <strong>{item.qty} máy</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
            <div className='flex justify-between text-xs'>
              <span className='text-slate-400'>Giá gốc sản phẩm:</span>
              <span className='font-semibold'>{formatVND(order.itemsPrice || 0)}</span>
            </div>
            {order.discountDMember > 0 && (
              <div className='flex justify-between text-xs text-purple-600 font-semibold'>
                <span>Ưu đãi thành viên D.Member:</span>
                <span>- {formatVND(order.discountDMember)}</span>
              </div>
            )}
            {order.tradeInBonus > 0 && (
              <div className='flex justify-between text-xs text-blue-600 font-semibold'>
                <span>Trợ giá Thu cũ đổi mới:</span>
                <span>- {formatVND(order.tradeInBonus)}</span>
              </div>
            )}
            <div className='flex justify-between text-xs'>
              <span className='text-slate-400'>Phí vận chuyển GHN:</span>
              <span className='font-semibold'>{formatVND(order.shippingPrice || 0)}</span>
            </div>
            <div className='flex justify-between text-base font-black pt-2'>
              <span className='text-slate-800 dark:text-white'>TỔNG HÓA ĐƠN THỰC THU:</span>
              <span className='text-didongviet-red'>{formatVND(order.totalPrice || 0)}</span>
            </div>
          </div>

          {/* Trạng thái */}
          <div className='flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80'>
            <div className='flex items-center gap-2'>
              <span className={`h-2.5 w-2.5 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className='text-xs font-bold text-slate-500 uppercase'>
                {order.isPaid ? 'ĐÃ THANH TOÁN THÀNH CÔNG' : 'CHỜ THANH TOÁN (COD / CỔNG)'}
              </span>
            </div>
            <span
              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase ${
                ORDER_STATUS_STYLE[order.orderStatus] ?? 'bg-amber-50 text-amber-600 border-amber-200'
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className='px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-900'>
          <button
            onClick={onDeleteClick}
            className='flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer bg-transparent'
          >
            <AlertTriangle size={13} />
            Xóa đơn hàng
          </button>

          <div className='flex gap-2.5'>
            <Button
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-xs'
            >
              Đóng
            </Button>

            {!order.isDelivered && order.orderStatus !== 'Đã hủy' && (
              <button
                onClick={() => onShip(order._id)}
                className='flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl transition-all shadow-md cursor-pointer border-none'
              >
                <Truck size={14} />
                <span>Xác nhận giao hàng</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
