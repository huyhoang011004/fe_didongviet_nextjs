'use client';

import { X, MapPin, CreditCard, ShoppingBag, DollarSign, Calendar, Truck, AlertTriangle, Check, PackageCheck, Store, ArrowRightLeft, Hash } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onDeleteClick: () => void;
}

const formatVND = (num: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Chưa cập nhật';
  return new Date(dateStr).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
};

const ORDER_STATUS_STYLE: Record<string, string> = {
  'Chờ xác nhận': 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
  'Chờ lấy hàng': 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900',
  'Đang giao': 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900',
  'Đã giao': 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-indigo-900',
  'Đã hủy': 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900',
  'Trả hàng/Hoàn tiền': 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900',
};

const STATUS_ACTIONS: Record<string, { label: string; nextStatus: string; icon: typeof Check }> = {
  'Chờ xác nhận': { label: 'Duyệt đơn hàng', nextStatus: 'Chờ lấy hàng', icon: Check },
  'Chờ lấy hàng': { label: 'Chuẩn bị hàng xong', nextStatus: 'Đang giao', icon: PackageCheck },
  'Đang giao': { label: 'Xác nhận đã giao', nextStatus: 'Đã giao', icon: Truck },
};

const getVariantLabel = (item: any) => {
  const variantId = String(item.variantId?._id || item.variantId || '');
  const variant = item.product?.variants?.find((v: any) => String(v._id) === variantId);
  const color = item.selectedColor || variant?.color || '';
  const ramRom = item.selectedStorage || (variant?.ram && variant?.rom ? `${variant.ram}/${variant.rom}` : '');
  const parts = [
    color ? `Màu sắc: ${color}` : '',
    ramRom ? `RAM/ROM: ${ramRom}` : '',
  ].filter(Boolean);

  return parts.length ? parts.join(' | ') : 'Chưa có thông tin phân loại';
};

export function OrderDetailsModal({ isOpen, order, onClose, onUpdateStatus, onDeleteClick }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;
  const action = STATUS_ACTIONS[order.orderStatus];
  const ActionIcon = action?.icon;

  // Kiểm tra xem đơn hàng có phải nhận tại chi nhánh/cửa hàng không
  const isPickUpAtStore = order.paymentMethod?.toLowerCase().includes('cửa hàng') ||
    order.paymentMethod?.toLowerCase().includes('store') ||
    order.shippingAddress?.streetAddress?.toLowerCase().includes('chi nhánh');

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left'>

        {/* Header */}
        <div className='px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-500/5 to-indigo-600/5 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm'>
              <Truck size={16} className='text-white' />
            </div>
            <div>
              <h3 className='font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight'>Chi tiết hóa đơn (Admin)</h3>
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

        {/* Body Content */}
        <div className='p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-600 dark:text-slate-300 font-medium'>

          {/* Trạng thái đơn hàng */}
          <div className='bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800/80'>
            <span className='font-bold text-slate-500 dark:text-slate-400'>Trạng thái đơn hiện tại:</span>
            <span className={`px-2.5 py-1.5 rounded-xl border uppercase text-[9px] tracking-wide font-black shadow-2xs ${ORDER_STATUS_STYLE[order.orderStatus] ?? 'bg-amber-50 text-amber-600 border-amber-200'}`}>
              {order.orderStatus || 'Chờ xác nhận'}
            </span>
          </div>

          {/* Grid Thông tin nhận hàng, Chi nhánh giao hàng & Thanh toán */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>

            {/* 1. Chi nhánh chịu trách nhiệm giao hàng */}
            {/* Ưu tiên deliveryBranch (snapshot), fallback sang order.branch (populated) */}
            {(() => {
              const branchData = order.deliveryBranch || order.branch;
              return (
                <div className='space-y-2.5 bg-blue-50/30 dark:bg-blue-950/10 p-4 rounded-xl border border-blue-100/70 dark:border-blue-900/40 sm:col-span-2'>
                  <h4 className='text-xs font-black text-blue-800 dark:text-blue-400 uppercase flex items-center gap-1.5 border-b border-blue-100/50 dark:border-blue-900/30 pb-1.5'>
                    <Store size={14} className='text-blue-600 dark:text-blue-400' />
                    Chi nhánh chịu trách nhiệm xuất kho / Giao hàng
                  </h4>
                  {branchData ? (
                    <div className='space-y-1 dark:text-slate-300'>
                      <p className='font-bold text-slate-800 dark:text-white text-sm'>
                        {branchData.name || 'Hệ thống Di Động Việt'}
                      </p>
                      <p>
                        <span className='text-slate-400'>Địa chỉ chi nhánh:</span>{' '}
                        <span className='text-slate-700 dark:text-slate-200 leading-relaxed'>
                          {branchData.address || 'Chưa cập nhật địa chỉ cụ thể'}
                        </span>
                      </p>
                      {branchData.phone && (
                        <p><span className='text-slate-400'>Hotline chi nhánh:</span> {branchData.phone}</p>
                      )}
                    </div>
                  ) : (
                    <p className='text-slate-400 italic animate-pulse'>
                      Đơn hàng chưa được điều phối hoặc phân bổ cho chi nhánh cụ thể.
                    </p>
                  )}
                </div>
              );
            })()}

            {/* 2. Địa chỉ nhận hàng hoặc Chi nhánh nơi khách đến lấy */}
            <div className='space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100/70 dark:border-slate-800/60'>
              <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
                {isPickUpAtStore ? (
                  <>
                    <Store size={14} className='text-didongviet-red' />
                    Điểm hẹn nhận hàng (Khách tự lấy)
                  </>
                ) : (
                  <>
                    <MapPin size={14} className='text-didongviet-red' />
                    Địa chỉ nhận hàng (Khách nhận)
                  </>
                )}
              </h4>
              <div className='space-y-1 dark:text-slate-300'>
                <p className='font-bold text-slate-800 dark:text-white text-sm'>{order.shippingAddress?.fullName}</p>
                <p><span className='text-slate-400'>Số điện thoại:</span> {order.shippingAddress?.phone}</p>
                <p className='leading-relaxed'>
                  <span className='text-slate-400'>{isPickUpAtStore ? 'Địa chỉ hẹn lấy máy:' : 'Địa chỉ nhận:'}</span>{' '}
                  {order.shippingAddress?.streetAddress}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.province}
                </p>
              </div>
            </div>

            {/* 3. Thanh toán */}
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
                    {order.isPaid ? 'Đã thanh toán thành công' : 'Chờ thanh toán'}
                  </span>
                </p>
                {order.paidAt && <p><span className='text-slate-400'>Thời gian:</span> {formatDate(order.paidAt)}</p>}
              </div>
            </div>
          </div>

          {/* 4. Danh sách sản phẩm mua */}
          <div className='space-y-3'>
            <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
              <ShoppingBag size={14} className='text-didongviet-red' />
              Sản phẩm mua ({order.orderItems?.length ?? 0})
            </h4>
            <div className='divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950/20 shadow-2xs'>
              {order.orderItems?.map((item: any, idx: number) => (
                <div key={idx} className='flex gap-3.5 p-3.5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors'>
                  <div className='h-12 w-12 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center p-1 bg-white shrink-0 shadow-3xs'>
                    <img src={item.image || '/placeholder-product.png'} alt={item.name} className='h-full w-full object-contain' referrerPolicy='no-referrer' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h5 className='text-xs font-bold text-slate-800 dark:text-white leading-snug line-clamp-1'>{item.name}</h5>
                    <span className='text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mt-0.5'>
                      {getVariantLabel(item)}
                    </span>
                    <div className='flex justify-between items-center mt-1 text-[10px] font-bold'>
                      <span className='text-slate-400 dark:text-slate-500'>Số lượng: {item.qty} máy</span>
                      <span className='font-mono text-slate-700 dark:text-slate-300'>{formatVND(item.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4.5. MÃ VẬN ĐƠN GHN */}
          {order.ghnOrderCode && (
            <div className='space-y-3'>
              <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
                <Truck size={14} className='text-emerald-600' />
                Thông tin vận đơn GHN
              </h4>
              <div className='bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-900/80 font-semibold space-y-2 shadow-3xs'>
                <div className='flex justify-between text-emerald-700 dark:text-emerald-300'>
                  <span className='flex items-center gap-1.5'>
                    <Hash size={12} />
                    Mã vận đơn GHN:
                  </span>
                  <span className='font-mono font-black text-sm'>{order.ghnOrderCode}</span>
                </div>
                {order.ghnExpectedDeliveryTime && (
                  <div className='flex justify-between text-emerald-600 dark:text-emerald-400'>
                    <span>Dự kiến giao hàng:</span>
                    <span className='font-mono'>
                      {new Date(order.ghnExpectedDeliveryTime).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Chi tiết chi phí */}
          <div className='space-y-3'>
            <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
              <DollarSign size={14} className='text-didongviet-red' />
              Chi tiết tài chính thực thu
            </h4>
            <div className='bg-slate-50 dark:bg-slate-950/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/80 font-semibold space-y-2 shadow-3xs'>
              <div className='flex justify-between text-slate-500 dark:text-slate-400'>
                <span>Tổng tiền hàng gốc:</span>
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
                  <span>Mã giảm giá tích lũy (Voucher):</span>
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
                <span className='text-slate-800 dark:text-white uppercase'>Tổng doanh thu thực tế:</span>
                <span className='font-mono text-didongviet-red text-base'>{formatVND(order.totalPrice || 0)}</span>
              </div>
            </div>
          </div>

          {/* 6. Khung thời gian lịch trình đơn */}
          {order.createdAt && (
            <div className='space-y-3'>
              <h4 className='text-xs font-black text-slate-850 dark:text-white uppercase flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1.5'>
                <Calendar size={14} className='text-didongviet-red' />
                Dấu mốc thời gian hệ thống
              </h4>
              <div className='bg-white dark:bg-slate-950/20 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 space-y-1.5 font-bold shadow-3xs'>
                <div className='flex justify-between'>
                  <span>Thời điểm khách tạo đơn:</span>
                  <span className='text-slate-600 dark:text-slate-300'>{formatDate(order.createdAt)}</span>
                </div>
                {order.paidAt && (
                  <div className='flex justify-between'>
                    <span>Thời điểm ghi nhận thanh toán:</span>
                    <span className='text-slate-600 dark:text-slate-300'>{formatDate(order.paidAt)}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className='flex justify-between'>
                    <span>Thời điểm hoàn thành giao vận:</span>
                    <span className='text-slate-600 dark:text-slate-300'>{formatDate(order.deliveredAt)}</span>
                  </div>
                )}
                {order.isReceived && order.receivedAt && (
                  <div className='flex justify-between text-emerald-600 dark:text-emerald-400'>
                    <span>Khách xác nhận đã nhận máy:</span>
                    <span>{formatDate(order.receivedAt)}</span>
                  </div>
                )}

                {/* Thông tin nếu đơn bị Hoàn trả */}
                {order.orderStatus === 'Trả hàng/Hoàn tiền' && order.returnCode && (
                  <div className='space-y-1.5 text-orange-600 dark:text-orange-400 border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1.5'>
                    <div className='flex justify-between'>
                      <span>Mã phiếu hoàn trả:</span>
                      <span className='font-mono font-bold'>{order.returnCode}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Lý do hoàn trả:</span>
                      <span>{order.returnReason}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Trạng thái xử lý hoàn:</span>
                      <span className='font-black uppercase'>{order.returnStatus}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions của Admin */}
        <div className='px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center bg-slate-50/50 dark:bg-slate-900/60'>
          <button
            onClick={onDeleteClick}
            className='flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer bg-transparent'
          >
            <AlertTriangle size={13} />
            Xóa đơn hàng
          </button>

          <div className='flex gap-2.5'>
            <Button
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 dark:border-slate-700 cursor-pointer h-9 text-xs font-bold'
            >
              Đóng
            </Button>

            {action && ActionIcon && (
              <button
                onClick={() => onUpdateStatus(order._id, action.nextStatus)}
                className='flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl transition-all shadow-sm cursor-pointer border-none'
              >
                <ActionIcon size={14} />
                <span>{action.label}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}