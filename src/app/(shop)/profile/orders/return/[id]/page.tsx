'use client';

import { useParams } from 'next/navigation';
import { useReturn } from './useReturn';
import ReturnForm from './_components/ReturnForm';
import { ClipboardList, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReturnOrderPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    order,
    loading,
    reason,
    setReason,
    selectedReason,
    setSelectedReason,
    images,
    submitting,
    alert,
    handleSubmit,
    handleAddImage,
    handleRemoveImage,
    videos,
    handleAddVideo,
    handleRemoveVideo,
  } = useReturn(id);

  if (loading) {
    return (
      <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-8 flex flex-col items-center justify-center min-h-[400px]'>
        <div className='h-10 w-10 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
        <p className='mt-3 text-xs font-semibold text-slate-500 animate-pulse'>
          Đang tải thông tin đơn hàng...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-8 text-center min-h-[300px] flex flex-col items-center justify-center'>
        <AlertCircle size={36} className='text-didongviet-red mb-3' />
        <h3 className='text-sm font-black text-slate-800 uppercase'>Không tìm thấy đơn hàng</h3>
        <p className='text-[10px] text-slate-500 mt-1'>Đơn hàng không tồn tại hoặc bạn không có quyền yêu cầu hoàn trả cho đơn hàng này.</p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-6 animate-in fade-in duration-300 relative'>
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

      {/* Tiêu đề */}
      <div className='flex items-center gap-2 border-b border-slate-50 pb-3.5'>
        <ClipboardList size={18} className='text-didongviet-red' />
        <div className='text-left'>
          <h2 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
            Yêu cầu trả hàng / hoàn tiền
          </h2>
          <p className='text-[10px] font-mono text-slate-400 mt-0.5'>
            Đơn hàng #{order._id}
          </p>
        </div>
      </div>

      {/* Thông tin đơn hàng tóm tắt */}
      <div className='bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3.5 text-left'>
        <h4 className='text-xs font-black text-slate-800 uppercase'>Sản phẩm yêu cầu trả hàng:</h4>
        <div className='divide-y divide-slate-150'>
          {order.orderItems?.map((item: any, idx: number) => (
            <div key={idx} className='flex gap-3 py-2.5 first:pt-0 last:pb-0 items-center'>
              <div className='h-10 w-10 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0'>
                <img src={item.image} alt={item.name} className='h-full w-full object-contain' />
              </div>
              <div className='flex-1 min-w-0 text-left'>
                <h5 className='text-xs font-bold text-slate-850 line-clamp-1'>{item.name}</h5>
                <span className='text-[9px] text-slate-400 font-semibold'>Số lượng: {item.qty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form hoàn trả */}
      <ReturnForm
        reason={reason}
        setReason={setReason}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
        images={images}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        videos={videos}
        handleAddVideo={handleAddVideo}
        handleRemoveVideo={handleRemoveVideo}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
