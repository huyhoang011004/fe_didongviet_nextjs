'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Calendar, CreditCard, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ProfileContext } from '../layout';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProfileOrdersPage() {
  const { user } = useContext(ProfileContext);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tat_ca');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Hàm tải danh sách đơn hàng thực tế từ API
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (res.status === 200) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.data || []);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Xử lý ẩn thông báo tự động
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Bộ lọc logic đơn hàng theo từng Tab
  const getFilteredOrders = (tabKey: string) => {
    switch (tabKey) {
      case 'cho_thanh_toan':
        // Đơn hàng chưa thanh toán, không phải COD và chưa bị hủy/trả hàng
        return orders.filter(
          (o) => !o.isPaid && o.paymentMethod !== 'COD' && o.orderStatus !== 'Đã hủy' && o.orderStatus !== 'Trả hàng/Hoàn tiền'
        );
      case 'cho_giao_hang':
        // Đơn hàng đang xử lý/xác nhận/đang giao (đã thanh toán hoặc COD)
        return orders.filter(
          (o) =>
            (o.orderStatus === 'Đang xử lý' || o.orderStatus === 'Đã xác nhận' || o.orderStatus === 'Đang giao hàng') &&
            (o.isPaid || o.paymentMethod === 'COD')
        );
      case 'hoan_thanh':
        return orders.filter((o) => o.orderStatus === 'Đã hoàn thành');
      case 'da_huy':
        return orders.filter((o) => o.orderStatus === 'Đã hủy');
      case 'tra_hang':
        return orders.filter((o) => o.orderStatus === 'Trả hàng/Hoàn tiền');
      case 'tat_ca':
      default:
        return orders;
    }
  };

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    setSubmittingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Hủy đơn hàng thành công và hoàn trả kho!' });
        fetchMyOrders(); // Tải lại danh sách đơn hàng mới
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể hủy đơn hàng này.' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối khi gửi yêu cầu hủy đơn.' });
    } finally {
      setSubmittingId(null);
    }
  };

  const tabs = [
    { key: 'tat_ca', label: 'Tất cả' },
    { key: 'cho_thanh_toan', label: 'Chờ thanh toán' },
    { key: 'cho_giao_hang', label: 'Chờ giao hàng' },
    { key: 'hoan_thanh', label: 'Hoàn thành' },
    { key: 'da_huy', label: 'Đã hủy' },
    { key: 'tra_hang', label: 'Trả hàng/Hoàn tiền' },
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

      {/* Tiêu đề & Nút làm mới */}
      <div className='flex items-center justify-between border-b border-slate-50 pb-3'>
        <div className='flex items-center gap-2'>
          <Package size={16} className='text-didongviet-red' />
          <h2 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
            Đơn mua của tôi
          </h2>
        </div>
        <button
          onClick={fetchMyOrders}
          className='flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-didongviet-red transition-colors bg-transparent border-none cursor-pointer'
        >
          <RefreshCcw size={11} className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* THANH ĐIỀU HƯỚNG TABS (CÓ SCROLL TRÊN DI ĐỘNG) */}
      <div className='flex gap-1 border-b border-slate-100 pb-0.5 overflow-x-auto scrollbar-none select-none'>
        {tabs.map((tab) => {
          const count = getFilteredOrders(tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2.5 text-[11px] font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer bg-transparent border-none
                ${isActive 
                  ? 'border-didongviet-red text-didongviet-red font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                }
              `}
            >
              {tab.label}
              {count > 0 && (
                <span className={`ml-1.5 text-[9px] px-1.5 py-0.2 rounded-full font-bold
                  ${isActive ? 'bg-red-100 text-didongviet-red' : 'bg-slate-100 text-slate-500'}
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* NỘI DUNG HIỂN THỊ */}
      {loading ? (
        <div className='space-y-4 py-2'>
          {[1, 2].map((i) => (
            <div key={i} className='h-36 bg-slate-50 rounded-xl border border-slate-100 animate-pulse' />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className='text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60'>
          <Package size={36} className='mx-auto text-slate-350 mb-2.5' />
          <p className='text-xs font-bold text-slate-500'>
            Không tìm thấy đơn hàng nào ở mục này.
          </p>
          <Button
            asChild
            className='mt-4 bg-didongviet-red hover:bg-red-700 text-white h-9 text-[10px] font-black rounded-xl border-none shadow-sm cursor-pointer'
          >
            <Link href='/category/dien-thoai'>KHÁM PHÁ SẢN PHẨM NGAY</Link>
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order: any, idx: number) => (
            <div
              key={order._id || idx}
              className='border border-slate-100 rounded-2xl bg-white hover:shadow-xs transition-all overflow-hidden flex flex-col'
            >
              {/* Header của Đơn hàng */}
              <div className='flex items-center justify-between bg-slate-50/50 px-4 py-3 border-b border-slate-100/50 text-[10px] font-bold text-slate-500'>
                <div className='flex items-center gap-1.5 font-mono'>
                  <span>MÃ ĐH:</span>
                  <span className='text-slate-800 text-[11px] font-black'>
                    {order.orderNumber || order._id?.slice(-8).toUpperCase()}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded border uppercase text-[8px] tracking-wide font-black
                  ${order.orderStatus === 'Đã hoàn thành' ? 'bg-green-50 text-green-600 border-green-150' : 
                    order.orderStatus === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-150' : 
                    order.orderStatus === 'Trả hàng/Hoàn tiền' ? 'bg-orange-50 text-orange-600 border-orange-150' :
                    'bg-blue-50 text-blue-600 border-blue-150'}
                `}>
                  {order.orderStatus || 'Đang xử lý'}
                </span>
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
              <div className='bg-slate-50/20 px-4 py-3.5 border-t border-slate-100/50 flex flex-wrap gap-4 items-center justify-between'>
                <div className='flex flex-wrap items-center gap-3.5 text-[10px] font-semibold text-slate-400'>
                  <span className='flex items-center gap-1'>
                    <Calendar size={12} className='text-slate-450' />
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className='flex items-center gap-1'>
                    <CreditCard size={12} className='text-slate-450' />
                    {order.paymentMethod} {order.isPaid ? '(Đã TT)' : '(Chưa TT)'}
                  </span>
                </div>

                <div className='flex items-center gap-3.5 ml-auto'>
                  <div className='text-right'>
                    <span className='text-[10px] font-semibold text-slate-450 uppercase tracking-wide block'>Tổng tiền thanh toán</span>
                    <strong className='text-sm font-black text-didongviet-red font-mono'>{formatVND(order.totalPrice || 0)}</strong>
                  </div>

                  {/* Hiện nút hủy đơn hàng nếu đơn hàng đang ở trạng thái 'Đang xử lý' */}
                  {order.orderStatus === 'Đang xử lý' && (
                    <Button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={submittingId === order._id}
                      className='bg-transparent border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 h-8 text-[10px] px-3 font-bold rounded-lg cursor-pointer transition-colors shadow-2xs'
                    >
                      {submittingId === order._id ? 'Đang xử lý...' : 'Hủy đơn'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
