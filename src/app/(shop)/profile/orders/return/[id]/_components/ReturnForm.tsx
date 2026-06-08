import React from 'react';
import { Camera, Trash2, ArrowLeft, Video, Plus } from 'lucide-react';
import Link from 'next/link';

interface ReturnFormProps {
  reason: string;
  setReason: (val: string) => void;
  selectedReason: string;
  setSelectedReason: (val: string) => void;
  imagePreviews: string[];
  handleAddImages: (files: FileList | null) => void;
  handleRemoveImage: (index: number) => void;
  videoPreview: string | undefined;
  handleAddVideo: (files: FileList | null) => void;
  handleRemoveVideo: () => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const getBackendUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
    .replace('/api/v1', '');
  return `${backendBase}${url}`;
};

export default function ReturnForm({
  reason,
  setReason,
  selectedReason,
  setSelectedReason,
  imagePreviews = [],
  handleAddImages,
  handleRemoveImage,
  videoPreview,
  handleAddVideo,
  handleRemoveVideo,
  submitting,
  onSubmit,
}: ReturnFormProps) {
  const returnReasons = [
    'Sản phẩm bị lỗi kỹ thuật',
    'Giao sai mẫu mã, màu sắc',
    'Sản phẩm bị bể vỡ, móp méo khi vận chuyển',
    'Sản phẩm không hoạt động đúng mô tả',
    'Khác (vui lòng mô tả chi tiết)',
  ];

  return (
    <form onSubmit={onSubmit} className='space-y-6 text-left'>
      {/* 1. Lý do trả hàng */}
      <div className='space-y-2'>
        <label className='text-xs font-black text-slate-700 uppercase tracking-tight block'>
          Lý do yêu cầu hoàn trả:
        </label>
        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
          className='w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white focus:ring-didongviet-red focus:border-didongviet-red outline-none'
        >
          {returnReasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Chi tiết lý do */}
      <div className='space-y-2'>
        <label className='text-xs font-black text-slate-700 uppercase tracking-tight block'>
          Mô tả chi tiết lý do hoàn trả:
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder='Vui lòng mô tả chi tiết lỗi sản phẩm hoặc sự cố gặp phải để được xử lý nhanh nhất...'
          className='w-full rounded-xl border border-slate-200 p-3.5 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:ring-didongviet-red focus:border-didongviet-red outline-none'
        />
      </div>

      {/* Media Upload Section (tối đa 6 ảnh và 1 video) */}
      <div className='grid grid-cols-1 md:grid-cols-7 gap-5 pt-4 border-t border-slate-100/50'>
        {/* Video Upload Field */}
        <div className='md:col-span-2 space-y-1.5'>
          <span className='text-[10px] font-bold text-slate-500 uppercase block'>
            Thêm 1 Video (tối đa 1 phút, nén 720p)
          </span>
          <div className='relative h-28 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer p-1 overflow-hidden'>
            {videoPreview ? (
              <>
                <video
                  src={getBackendUrl(videoPreview)}
                  controls
                  className='h-full w-full object-contain'
                />
                <button
                  type='button'
                  onClick={handleRemoveVideo}
                  className='absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 border-none cursor-pointer z-10'
                >
                  <Trash2 size={10} />
                </button>
              </>
            ) : (
              <div
                onClick={() => document.getElementById(`return-video-upload`)?.click()}
                className='text-center text-slate-400 text-[10px] w-full h-full flex flex-col items-center justify-center'
              >
                <Video size={20} className='mx-auto mb-1 text-slate-500' />
                <span>Chọn video</span>
              </div>
            )}
            <input
              id={`return-video-upload`}
              type='file'
              accept='video/*'
              className='hidden'
              onChange={(e) => handleAddVideo(e.target.files)}
            />
          </div>
        </div>

        {/* Images Upload Fields */}
        <div className='md:col-span-5 space-y-1.5'>
          <span className='text-[10px] font-bold text-slate-500 uppercase block'>
            Thêm ảnh (Tối đa 6 ảnh, nén 1080p, tối đa 2MB mỗi ảnh)
          </span>
          <div className='grid grid-cols-6 gap-2 items-center'>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const preview = imagePreviews[index];
              const isPlaceholder = index === imagePreviews.length;

              return (
                <div key={index} className='flex flex-col items-center gap-1 w-full'>
                  <div
                    onClick={() => {
                      if (!preview && isPlaceholder) {
                        document.getElementById(`return-img-upload`)?.click();
                      }
                    }}
                    className={`relative h-20 w-full rounded-xl border border-dashed flex items-center justify-center p-1 overflow-hidden ${preview
                      ? 'border-slate-200 bg-white'
                      : isPlaceholder
                        ? 'border-slate-300 bg-slate-50 cursor-pointer hover:border-slate-400'
                        : 'border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-50'
                      }`}
                  >
                    {preview ? (
                      <>
                        <img
                          src={getBackendUrl(preview)}
                          alt={`Return preview ${index}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(index)}
                          className='absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 border-none cursor-pointer z-10'
                        >
                          <Trash2 size={8} />
                        </button>
                      </>
                    ) : (
                      <div className='text-center text-slate-400'>
                        <Plus size={14} className='mx-auto text-slate-500' />
                        <span className='text-[7px] block font-bold'>
                          {isPlaceholder ? 'Thêm ảnh' : `Ảnh ${index + 1}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <input
              id={`return-img-upload`}
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={(e) => handleAddImages(e.target.files)}
            />
          </div>
        </div>
      </div>

      {/* 4. Buttons */}
      <div className='flex items-center gap-3 border-t border-slate-100 pt-5 mt-2'>
        <Link
          href='/profile/orders'
          className='flex-1 h-11 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1'
        >
          <ArrowLeft size={14} />
          <span>Quay lại</span>
        </Link>
        <button
          type='submit'
          disabled={submitting}
          className='flex-1 h-11 rounded-xl bg-didongviet-red hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs border-none disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed'
        >
          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu hoàn trả'}
        </button>
      </div>
    </form>
  );
}
