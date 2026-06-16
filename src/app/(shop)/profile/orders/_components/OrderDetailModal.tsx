'use client';

import React from 'react';
import { X, MapPin, CreditCard, ShoppingBag, DollarSign, Calendar, Truck, Store } from 'lucide-react';

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  formatVND: (num: number) => string;
}

const ORDER_STATUS_STYLE: Record<string, string> = {
  'Chờ xác nhận': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
  'Chờ lấy hàng': 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900',
  'Đang giao': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900',
  'Đã giao': 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900',
  'Đã hủy': 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900',
  'Trả hàng/Hoàn tiền': 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900',
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Chưa cập nhật';
  return new Date(dateStr).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function OrderDetailModal({ order, onClose, formatVND }: OrderDetailModalProps) {
  if (!order) return null;

  // Kiểm tra xem đơn hàng có phải nhận tại chi nhánh không
  const isPickUpAtStore = order.paymentMethod?.toLowerCase().includes('cửa hàng') ||
    order.paymentMethod?.toLowerCase().includes('store') ||
    order.shippingAddress?.streetAddress?.toLowerCase().includes('chi nhánh');

  return (
    <div className='fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left relative'>

        {/* Header (Đồng bộ Gradient Admin) */}
        <div className='px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-500/5 to-indigo-600/5 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm'>
              <ShoppingBag size={16} className='text-white' />
            </div>
            <div>
              <h3 className='font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight'>Chi tiết đơn hàng của bạn</h3>
              <span className='text-[10px] font-mono text-slate-400 block mt-0.5'>Mã ĐH: {order._id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer border-none bg-transparent'
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className='p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-600 dark:text-slate-300 font-medium'>

          {/* Trạng thái đơn hàng */}
          <div className='bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800/80'>
            <span className='font-bold text-slate-500 dark:text-slate-400'>Trạng thái đơn hàng:</span>
            <span className={`px-2.5 py-1.5 rounded-xl border uppercase text-[9px] tracking-wide font-black shadow-2xs ${ORDER_STATUS_STYLE[order.orderStatus] ?? 'bg-amber-50 text-amber-600 border-amber-200'}`}>
              {order.orderStatus || 'Chờ xác nhận'}
            </span>
          </div>

          {/* Grid thông tin nhận hàng & thanh toán */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            {/* 1. Địa chỉ / Chi nhánh */}
            <div className='space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100/70 dark:border-slate-800/60'>
              <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
                {isPickUpAtStore ? (
                  <>
                    <Store size={14} className='text-didongviet-red' />
                    Chi nhánh nhận hàng
                  </>
                ) : (
                  <>
                    <MapPin size={14} className='text-didongviet-red' />
                    Địa chỉ nhận hàng
                  </>
                )}
              </h4>
              <div className='space-y-1 dark:text-slate-300'>
                <p className='font-bold text-slate-800 dark:text-white text-sm'>{order.shippingAddress?.fullName}</p>
                <p><span className='text-slate-400'>Số điện thoại:</span> {order.shippingAddress?.phone}</p>
                <p className='leading-relaxed'>
                  <span className='text-slate-400'>{isPickUpAtStore ? 'Địa chỉ kho/đại lý:' : 'Địa chỉ nhận:'}</span>{' '}
                  {order.shippingAddress?.streetAddress}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
                </p>
              </div>
            </div>

            {/* 2. Thanh toán */}
            <div className='space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100/70 dark:border-slate-800/60'>
              <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
                <CreditCard size={14} className='text-didongviet-red' />
                Thông tin thanh toán
              </h4>
              <div className='space-y-1 dark:text-slate-300'>
                <p><span className='text-slate-400'>Hình thức:</span> <span className='font-bold text-slate-800 dark:text-white'>{order.paymentMethod}</span></p>
                <p>
                  <span className='text-slate-400'>Trạng thái:</span>{' '}
                  <span className={`font-bold ${order.isPaid ? 'text-green-600 dark:text-green-400' : 'text-amber-500'}`}>
                    {order.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </p>
                {order.paidAt && <p><span className='text-slate-400'>Thời gian:</span> {formatDate(order.paidAt)}</p>}
              </div>
            </div>
          </div>

          {/* 3. Danh sách sản phẩm mua */}
          <div className='space-y-3'>
            <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
              <ShoppingBag size={14} className='text-didongviet-red' />
              Sản phẩm mua ({order.orderItems?.length ?? 0})
            </h4>
            <div className='divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950/20 shadow-2xs'>
              {order.orderItems?.map((item: any, itemIdx: number) => (
                <div key={itemIdx} className='flex gap-3.5 p-3.5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors'>
                  <div className='h-12 w-12 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center p-1 bg-white shrink-0 shadow-3xs'>
                    <img src={item.image && (item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`) || '/placeholder-product.png'} alt={item.name} className='h-full w-full object-contain' referrerPolicy='no-referrer' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h5 className='text-xs font-bold text-slate-800 dark:text-white leading-snug line-clamp-1'>{item.name}</h5>
                    {(item.selectedColor || item.selectedStorage) && (
                      <span className='text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mt-0.5'>
                        Phân loại: {item.selectedColor} {item.selectedStorage ? `- ${item.selectedStorage}` : ''}
                      </span>
                    )}
                    <div className='flex justify-between items-center mt-1 text-[10px] font-bold'>
                      <span className='text-slate-400 dark:text-slate-500'>Số lượng: {item.qty}</span>
                      <span className='font-mono text-slate-700 dark:text-slate-300'>{formatVND(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Chi tiết chi phí */}
          <div className='space-y-3'>
            <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
              <DollarSign size={14} className='text-didongviet-red' />
              Chi tiết thanh toán
            </h4>
            <div className='bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 font-semibold space-y-2 shadow-3xs'>
              <div className='flex justify-between text-slate-500 dark:text-slate-400'>
                <span>Tổng tiền hàng:</span>
                <span className='font-mono'>{formatVND(order.itemsPrice || 0)}</span>
              </div>
              <div className='flex justify-between text-slate-500 dark:text-slate-400'>
                <span>Phí vận chuyển:</span>
                <span className='font-mono'>{order.shippingPrice > 0 ? `+${formatVND(order.shippingPrice)}` : formatVND(0)}</span>
              </div>
              {order.discountDMember > 0 && (
                <div className='flex justify-between text-green-600 dark:text-green-400'>
                  <span>Voucher giảm giá (DMember):</span>
                  <span className='font-mono'>-{formatVND(order.discountDMember)}</span>
                </div>
              )}
              {order.discountVoucher > 0 && (
                <div className='flex justify-between text-green-600 dark:text-green-400'>
                  <span>Mã giảm giá (Voucher):</span>
                  <span className='font-mono'>-{formatVND(order.discountVoucher)}</span>
                </div>
              )}
              {order.tradeInBonus > 0 && (
                <div className='flex justify-between text-blue-600 dark:text-blue-400'>
                  <span>Trợ giá Thu cũ đổi mới:</span>
                  <span className='font-mono'>-{formatVND(order.tradeInBonus)}</span>
                </div>
              )}
              <div className='flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2.5 font-black text-sm'>
                <span className='text-slate-850 dark:text-white'>TỔNG HÓA ĐƠN CẦN TRẢ:</span>
                <span className='font-mono text-didongviet-red text-base'>{formatVND(order.totalPrice || 0)}</span>
              </div>
            </div>
          </div>

          {/* 5. Lịch sử trạng thái thời gian */}
          {order.createdAt && (
            <div className='space-y-3'>
              <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
                <Calendar size={14} className='text-didongviet-red' />
                Thời gian đơn hàng
              </h4>
              <div className='bg-white dark:bg-slate-950/20 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 space-y-1.5 font-bold shadow-3xs'>
                <div className='flex justify-between'>
                  <span>Ngày tạo đơn:</span>
                  <span className='text-slate-600 dark:text-slate-300'>{formatDate(order.createdAt)}</span>
                </div>
                {order.paidAt && (
                  <div className='flex justify-between'>
                    <span>Thời gian thanh toán:</span>
                    <span className='text-slate-600 dark:text-slate-300'>{formatDate(order.paidAt)}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className='flex justify-between'>
                    <span>Thời gian hoàn tất giao:</span>
                    <span className='text-slate-600 dark:text-slate-300'>{formatDate(order.deliveredAt)}</span>
                  </div>
                )}
                {order.isReceived && order.receivedAt && (
                  <div className='flex justify-between text-emerald-600 dark:text-emerald-400'>
                    <span>Bạn đã nhận hàng vào lúc:</span>
                    <span>{formatDate(order.receivedAt)}</span>
                  </div>
                )}

                {order.orderStatus === 'Trả hàng/Hoàn tiền' && order.returnCode && (
                  <div className='space-y-1.5 text-orange-600 dark:text-orange-400 border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1.5'>
                    <div className='flex justify-between'>
                      <span>Mã hoàn trả:</span>
                      <span className='font-mono font-bold'>{order.returnCode}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Lý do hoàn trả:</span>
                      <span>{order.returnReason}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Trạng thái hoàn trả:</span>
                      <span className='font-bold uppercase'>{order.returnStatus}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer (Chỉ có duy nhất nút Đóng dành cho khách) */}
        <div className='px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/60'>
          <button
            onClick={onClose}
            className='px-5 h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none'
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
}