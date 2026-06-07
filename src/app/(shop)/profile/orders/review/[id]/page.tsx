'use client';

import { useParams } from 'next/navigation';
import { useReview } from './useReview';
import ReviewForm from './_components/ReviewForm';
import { ClipboardList, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReviewOrderPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    order,
    loading,
    ratings,
    comments,
    submitting,
    isExpired,
    alert,
    updateRating,
    updateComment,
    handleSubmit,
  } = useReview(id);

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
        <p className='text-[10px] text-slate-500 mt-1'>Đơn hàng không tồn tại hoặc bạn không có quyền đánh giá sản phẩm của đơn hàng này.</p>
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
            Đánh giá sản phẩm đã mua
          </h2>
          <p className='text-[10px] font-mono text-slate-400 mt-0.5'>
            Đơn hàng #{order._id}
          </p>
        </div>
      </div>

      {/* Cảnh báo hết hạn */}
      {isExpired && (
        <div className='bg-red-50 border border-red-150 text-red-750 text-xs font-semibold rounded-xl p-3.5 flex items-center gap-2 text-left'>
          <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          <span>Đã quá thời hạn 30 ngày kể từ lúc nhận hàng thành công. Bạn chỉ có thể xem lại đánh giá, không thể tạo mới hoặc chỉnh sửa.</span>
        </div>
      )}

      {/* Form Đánh giá */}
      <ReviewForm
        order={order}
        ratings={ratings}
        comments={comments}
        updateRating={updateRating}
        updateComment={updateComment}
        submitting={submitting}
        isExpired={isExpired}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
