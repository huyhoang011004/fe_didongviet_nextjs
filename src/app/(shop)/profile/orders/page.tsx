'use client';

import { useOrders } from './useOrders';
import OrderTabs from './_components/OrderTabs';
import OrderCard from './_components/OrderCard';
import OrderDetailModal from './_components/OrderDetailModal';
import { Package, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProfileOrdersPage() {
  const {
    loading,
    activeTab,
    setActiveTab,
    submittingId,
    alert,
    cancelConfirmId,
    setCancelConfirmId,
    receiveConfirmId,
    setReceiveConfirmId,
    selectedOrder,
    setSelectedOrder,
    handleCancel,
    handleConfirmReceipt,
    getFilteredOrders,
    fetchOrders,
  } = useOrders();

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Chờ xác nhận', label: 'Chờ xác nhận' },
    { key: 'Chờ lấy hàng', label: 'Chờ lấy hàng' },
    { key: 'Đang giao', label: 'Đang giao' },
    { key: 'Đã giao', label: 'Đã giao' },
    { key: 'Đã hủy', label: 'Đã hủy' },
    { key: 'Trả hàng/Hoàn tiền', label: 'Trả hàng/Hoàn tiền' },
  ];

  const filteredOrders = getFilteredOrders(activeTab);

  return (
    <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-5 animate-in fade-in duration-300 relative'>
      {/* Alert toast */}
      {alert && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-3.5 rounded-xl shadow-lg border flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300
          ${alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-xs font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* Hủy đơn hàng Confirmation Modal */}
      {cancelConfirmId && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 space-y-5 animate-in zoom-in-95 duration-200 text-center relative'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50'>
              <AlertCircle size={28} className='text-didongviet-red' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                Xác nhận hủy đơn hàng
              </h3>
              <p className='text-xs font-semibold text-slate-500 leading-relaxed text-center'>
                Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này sẽ trả sản phẩm về kho và không thể hoàn tác.
              </p>
            </div>
            <div className='flex items-center gap-3 pt-1'>
              <button
                onClick={() => setCancelConfirmId(null)}
                className='flex-1 h-9 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold bg-white hover:bg-slate-50 transition-colors cursor-pointer'
              >
                Bỏ qua
              </button>
              <button
                onClick={() => handleCancel(cancelConfirmId)}
                className='flex-1 h-9 rounded-xl bg-didongviet-red hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs border-none'
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận nhận hàng Confirmation Modal */}
      {receiveConfirmId && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 space-y-5 animate-in zoom-in-95 duration-200 text-center relative'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50'>
              <CheckCircle size={28} className='text-green-600' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                Xác nhận đã nhận hàng
              </h3>
              <p className='text-xs font-semibold text-slate-500 leading-relaxed text-center'>
                Vui lòng xác nhận rằng bạn đã nhận được đầy đủ các sản phẩm của đơn hàng này và sản phẩm ở trạng thái tốt.
              </p>
            </div>
            <div className='flex items-center gap-3 pt-1'>
              <button
                onClick={() => setReceiveConfirmId(null)}
                className='flex-1 h-9 rounded-xl border border-slate-200 text-slate-650 text-xs font-bold bg-white hover:bg-slate-50 transition-colors cursor-pointer'
              >
                Bỏ qua
              </button>
              <button
                onClick={() => handleConfirmReceipt(receiveConfirmId)}
                className='flex-1 h-9 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs border-none'
              >
                Xác nhận nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chi tiết đơn hàng Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        formatVND={formatVND}
      />

      {/* Tiêu đề & Nút làm mới */}
      <div className='flex items-center justify-between border-b border-slate-50 pb-3'>
        <div className='flex items-center gap-2'>
          <Package size={16} className='text-didongviet-red' />
          <h2 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
            Đơn mua của tôi
          </h2>
        </div>
        <button
          onClick={fetchOrders}
          className='flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-didongviet-red transition-colors bg-transparent border-none cursor-pointer'
        >
          <RefreshCcw size={11} className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* THANH ĐIỀU HƯỚNG TABS */}
      <OrderTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        getFilteredOrders={getFilteredOrders}
      />

      {/* DANH SÁCH ĐƠN HÀNG */}
      {loading ? (
        <div className='space-y-4 py-2'>
          {[1, 2].map((i) => (
            <div key={i} className='h-36 bg-slate-50 rounded-xl border border-slate-100 animate-pulse' />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60'>
          <Package size={36} className='mx-auto text-slate-300 mb-2.5' />
          <p className='text-xs font-bold text-slate-500 text-center'>
            Không tìm thấy đơn hàng nào ở mục này.
          </p>
          <Button
            asChild
            className='mt-4 bg-didongviet-red hover:bg-red-700 text-white h-9 text-[10px] font-black rounded-xl border-none shadow-sm cursor-pointer'
          >
            <Link href='/ Dien-thoai'>KHÁM PHÁ SẢN PHẨM NGAY</Link>
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order: any, idx: number) => (
            <OrderCard
              key={order._id || idx}
              order={order}
              idx={idx}
              formatVND={formatVND}
              onSelectOrder={setSelectedOrder}
              onCancelClick={setCancelConfirmId}
              onReceiveClick={setReceiveConfirmId}
              submittingId={submittingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
