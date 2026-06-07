import React from 'react';
import { X, MapPin, CreditCard, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  formatVND: (num: number) => string;
}

export default function OrderDetailModal({ order, onClose, formatVND }: OrderDetailModalProps) {
  if (!order) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 relative'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-slate-100 px-6 py-4'>
          <div className='space-y-0.5 text-left'>
            <h3 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
              Chi tiết đơn hàng
            </h3>
            <p className='text-[10px] font-mono text-slate-400'>
              Mã ĐH: {order._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 text-lg font-bold p-1 bg-transparent border-none cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6 text-left'>
          {/* Trạng thái đơn hàng */}
          <div className='bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100'>
            <span className='text-xs font-bold text-slate-500'>Trạng thái đơn:</span>
            <span className={`px-2.5 py-0.5 rounded-full border uppercase text-[9px] tracking-wide font-black
              ${order.orderStatus === 'Đã giao' ? 'bg-green-50 text-green-600 border-green-200' :
                order.orderStatus === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' :
                  order.orderStatus === 'Trả hàng/Hoàn tiền' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    'bg-blue-50 text-blue-600 border-blue-200'}
            `}>
              {order.orderStatus || 'Chờ xác nhận'}
            </span>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {/* 1. Địa chỉ nhận hàng */}
            <div className='space-y-2.5'>
              <h4 className='text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5'>
                <MapPin size={14} className='text-didongviet-red' />
                Địa chỉ nhận hàng
              </h4>
              <div className='text-xs text-slate-600 space-y-1 font-medium'>
                <p className='font-bold text-slate-800'>{order.shippingAddress?.fullName}</p>
                <p>Số điện thoại: {order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.streetAddress}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}</p>
              </div>
            </div>

            {/* 2. Thanh toán & Vận chuyển */}
            <div className='space-y-2.5'>
              <h4 className='text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5'>
                <CreditCard size={14} className='text-didongviet-red' />
                Thông tin thanh toán
              </h4>
              <div className='text-xs text-slate-600 space-y-1 font-medium'>
                <p>Hình thức: <span className='font-bold text-slate-800'>{order.paymentMethod}</span></p>
                <p>Thanh toán: <span className={`font-bold ${order.isPaid ? 'text-green-600' : 'text-amber-500'}`}>{order.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}</span></p>
                {order.paidAt && <p>Thời gian: {new Date(order.paidAt).toLocaleString('vi-VN')}</p>}
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className='space-y-3.5'>
            <h4 className='text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5'>
              <ShoppingBag size={14} className='text-didongviet-red' />
              Sản phẩm mua ({order.orderItems?.length})
            </h4>
            <div className='divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white'>
              {order.orderItems?.map((item: any, itemIdx: number) => (
                <div key={itemIdx} className='flex gap-3.5 p-3.5 items-center bg-slate-50/10'>
                  <div className='h-12 w-12 rounded-lg border border-slate-100 flex items-center justify-center p-1 bg-white shrink-0 shadow-2xs'>
                    <img
                      src={item.image || '/placeholder-product.png'}
                      alt={item.name}
                      className='h-full w-full object-contain'
                      referrerPolicy='no-referrer'
                    />
                  </div>
                  <div className='flex-1 min-w-0 text-left'>
                    <h5 className='text-xs font-bold text-slate-800 leading-snug line-clamp-1'>
                      {item.name}
                    </h5>
                    {(item.selectedColor || item.selectedStorage) && (
                      <span className='text-[9px] font-bold text-slate-400 uppercase tracking-wide block'>
                        Phân loại: {item.selectedColor} {item.selectedStorage ? `- ${item.selectedStorage}` : ''}
                      </span>
                    )}
                    <div className='flex justify-between items-center mt-1 text-[10px] font-bold'>
                      <span className='text-slate-400'>Số lượng: {item.qty}</span>
                      <span className='font-mono text-slate-700'>{formatVND(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chi tiết chi phí */}
          <div className='space-y-3.5'>
            <h4 className='text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5'>
              <DollarSign size={14} className='text-didongviet-red' />
              Chi tiết thanh toán
            </h4>
            <div className='bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs font-medium space-y-2'>
              <div className='flex justify-between'>
                <span className='text-slate-400'>Tổng tiền hàng:</span>
                <span className='font-mono text-slate-800'>{formatVND(order.itemsPrice || 0)}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-400'>Phí vận chuyển:</span>
                <span className='font-mono text-slate-800'>+{formatVND(order.shippingPrice || 0)}</span>
              </div>
              {order.discountDMember > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Ưu đãi D.Member:</span>
                  <span className='font-mono'>-{formatVND(order.discountDMember)}</span>
                </div>
              )}
              {order.discountVoucher > 0 && (
                <div className='flex justify-between text-green-600'>
                  <span>Mã giảm giá (Voucher):</span>
                  <span className='font-mono'>-{formatVND(order.discountVoucher)}</span>
                </div>
              )}
              <div className='flex justify-between border-t border-slate-200/60 pt-2 font-bold'>
                <span className='text-slate-850'>Tổng thanh toán:</span>
                <span className='font-mono text-sm text-didongviet-red'>{formatVND(order.totalPrice || 0)}</span>
              </div>
            </div>
          </div>

          {/* Lịch sử trạng thái */}
          {order.createdAt && (
            <div className='space-y-3.5'>
              <h4 className='text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 border-b border-slate-100 pb-1.5'>
                <Calendar size={14} className='text-didongviet-red' />
                Thời gian đơn hàng
              </h4>
              <div className='bg-white rounded-xl p-3 border border-slate-100 text-[10px] text-slate-500 font-semibold space-y-1.5'>
                <div className='flex justify-between'>
                  <span>Ngày tạo đơn:</span>
                  <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                {order.paidAt && (
                  <div className='flex justify-between'>
                    <span>Thời gian thanh toán:</span>
                    <span>{new Date(order.paidAt).toLocaleString('vi-VN')}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className='flex justify-between'>
                    <span>Thời gian hoàn tất giao:</span>
                    <span>{new Date(order.deliveredAt).toLocaleString('vi-VN')}</span>
                  </div>
                )}
                {order.isReceived && order.receivedAt && (
                  <div className='flex justify-between text-emerald-650'>
                    <span>Khách đã nhận hàng:</span>
                    <span>{new Date(order.receivedAt).toLocaleString('vi-VN')}</span>
                  </div>
                )}
                {order.orderStatus === 'Trả hàng/Hoàn tiền' && order.returnCode && (
                  <div className='space-y-1.5 text-orange-600 border-t border-slate-100/60 pt-1.5 mt-1.5'>
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
      </div>
    </div>
  );
}
