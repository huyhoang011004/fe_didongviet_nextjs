import React from 'react';
import Link from 'next/link';
import { Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface OrderCardProps {
  order: any;
  idx: number;
  formatVND: (num: number) => string;
  onSelectOrder: (order: any) => void;
  onCancelClick: (orderId: string) => void;
  onReceiveClick: (orderId: string) => void;
  submittingId: string | null;
  isReviewed: boolean;
}

export default function OrderCard({
  order,
  idx,
  formatVND,
  onSelectOrder,
  onCancelClick,
  onReceiveClick,
  submittingId,
  isReviewed,
}: OrderCardProps) {
  const isPaid = order.isPaid || (order.paymentMethod === 'COD' && order.orderStatus === 'Đã giao');
  
  // Kiểm tra điều kiện 7 ngày từ lúc giao hàng thành công
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const isAfter7Days = order.deliveredAt
    ? Date.now() - new Date(order.deliveredAt).getTime() > sevenDays
    : false;

  const showReceiveAndReturn = order.orderStatus === 'Đã giao' && !order.isReceived && !isAfter7Days;
  const showReview = order.orderStatus === 'Đã giao' && (order.isReceived || isAfter7Days);

  return (
    <div
      className='border border-slate-100 rounded-2xl bg-white hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer'
      onClick={() => onSelectOrder(order)}
    >
      {/* Header của Đơn hàng */}
      <div className='flex items-center justify-between bg-slate-50/50 px-4 py-3 border-b border-slate-100/50 text-[10px] font-bold text-slate-500'>
        <div className='flex items-center gap-1.5 font-mono'>
          <span>MÃ ĐH:</span>
          <span className='text-slate-800 text-[11px] font-black'>
            {order._id}
          </span>
        </div>
        <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
          <span className={`px-2 py-0.5 rounded border uppercase text-[8px] tracking-wide font-black
            ${order.orderStatus === 'Đã giao' ? 'bg-green-50 text-green-600 border-green-200' :
              order.orderStatus === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' :
                order.orderStatus === 'Trả hàng/Hoàn tiền' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                  'bg-blue-50 text-blue-600 border-blue-200'}
          `}>
            {order.orderStatus || 'Chờ xác nhận'}
          </span>
        </div>
      </div>

      {/* Danh sách các sản phẩm trong Đơn hàng */}
      <div className='divide-y divide-slate-50 px-4 py-1.5'>
        {order.orderItems?.map((item: any, itemIdx: number) => (
          <div key={itemIdx} className='flex gap-3.5 py-3 items-center'>
            <div className='h-12 w-12 rounded-lg border border-slate-100 flex items-center justify-center p-1 bg-white shrink-0 shadow-2xs'>
              <img
                src={item.image || '/placeholder-product.png'}
                alt={item.name}
                className='h-full w-full object-contain'
                referrerPolicy='no-referrer'
              />
            </div>
            <div className='flex-1 min-w-0 space-y-1 text-left'>
              <h5 className='text-xs font-bold text-slate-800 leading-snug line-clamp-2'>
                {item.name}
              </h5>
              <div className='flex items-center justify-between text-[10px] font-semibold text-slate-400'>
                <span>Số lượng: <strong className='text-slate-600 font-bold'>{item.qty}</strong></span>
                <span className='font-mono text-slate-500'>{formatVND(item.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer của Đơn hàng (Thông tin chi phí & nút hành động) */}
      <div className='bg-slate-50/20 px-4 py-3.5 border-t border-slate-100/50 flex flex-wrap gap-4 items-center justify-between' onClick={(e) => e.stopPropagation()}>
        <div className='flex flex-wrap items-center gap-3.5 text-[10px] font-semibold text-slate-400'>
          <span className='flex items-center gap-1'>
            <Calendar size={12} className='text-slate-400' />
            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </span>
          <span className='flex items-center gap-1'>
            <CreditCard size={12} className='text-slate-400' />
            {order.paymentMethod} {isPaid ? '(Đã thanh toán)' : '(Chưa TT)'}
          </span>
        </div>

        <div className='flex items-center gap-3.5 ml-auto'>
          <div className='text-right mr-3.5'>
            <span className='text-[10px] font-semibold text-slate-400 uppercase tracking-wide block'>Tổng tiền thanh toán</span>
            <strong className='text-sm font-black text-didongviet-red font-mono'>{formatVND(order.totalPrice || 0)}</strong>
          </div>

          {/* Nút hủy đơn hàng nếu đơn hàng đang ở trạng thái chờ xác nhận */}
          {order.orderStatus === 'Chờ xác nhận' && (
            <Button
              onClick={() => onCancelClick(order._id)}
              disabled={submittingId === order._id}
              className='bg-transparent border border-red-200 hover:bg-red-50 text-red-650 hover:text-red-700 h-8 text-[10px] px-3 font-bold rounded-lg cursor-pointer transition-colors shadow-2xs'
            >
              {submittingId === order._id ? 'Đang xử lý...' : 'Hủy đơn'}
            </Button>
          )}

          {/* Hiện nút Nhận hàng và Trả hàng/Hoàn tiền ở tab Đã giao khi chưa nhận và chưa quá 7 ngày */}
          {showReceiveAndReturn && (
            <div className='flex items-center gap-2'>
              <Button
                asChild
                className='bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-600 h-8 text-[10px] px-3 font-bold rounded-lg cursor-pointer transition-colors'
              >
                <Link href={`/profile/orders/return/${order._id}`}>Trả hàng</Link>
              </Button>
              <Button
                onClick={() => onReceiveClick(order._id)}
                disabled={submittingId === order._id}
                className='bg-didongviet-red hover:bg-red-700 text-white h-8 text-[10px] px-3 font-bold rounded-lg cursor-pointer transition-colors shadow-xs border-none'
              >
                {submittingId === order._id ? 'Đang xử lý...' : 'Đã nhận được hàng'}
              </Button>
            </div>
          )}

          {/* Hiện nút Đánh giá khi đã nhận được hàng hoặc quá 7 ngày */}
          {showReview && (
            <Button
              asChild
              className='bg-blue-600 hover:bg-blue-700 text-white h-8 text-[10px] px-3 font-bold rounded-lg cursor-pointer transition-colors shadow-xs border-none'
            >
              <Link href={`/profile/orders/review/${order._id}`}>{isReviewed ? 'Sửa đánh giá' : 'Đánh giá'}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
