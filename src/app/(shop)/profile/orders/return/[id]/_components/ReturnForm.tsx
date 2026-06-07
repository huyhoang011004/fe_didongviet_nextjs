import React, { useState } from 'react';
import { Camera, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ReturnFormProps {
  reason: string;
  setReason: (val: string) => void;
  selectedReason: string;
  setSelectedReason: (val: string) => void;
  images: string[];
  handleAddImage: (url: string) => void;
  handleRemoveImage: (index: number) => void;
  videos: string[];
  handleAddVideo: (url: string) => void;
  handleRemoveVideo: (index: number) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ReturnForm({
  reason,
  setReason,
  selectedReason,
  setSelectedReason,
  images,
  handleAddImage,
  handleRemoveImage,
  videos,
  handleAddVideo,
  handleRemoveVideo,
  submitting,
  onSubmit,
}: ReturnFormProps) {
  const [imgUrl, setImgUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const returnReasons = [
    'Sản phẩm bị lỗi kỹ thuật',
    'Giao sai mẫu mã, màu sắc',
    'Sản phẩm bị bể vỡ, móp méo khi vận chuyển',
    'Sản phẩm không hoạt động đúng mô tả',
    'Khác (vui lòng mô tả chi tiết)',
  ];

  return (
    <form onSubmit={onSubmit} className='space-y-5 text-left'>
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

      {/* 3. Đính kèm hình ảnh minh họa */}
      <div className='space-y-3.5'>
        <div className='flex justify-between items-center'>
          <label className='text-xs font-black text-slate-700 uppercase tracking-tight block'>
            Hình ảnh minh họa sự cố (Tối đa 6 ảnh):
          </label>
          <span className='text-[10px] font-bold text-slate-450'>{images.length}/6</span>
        </div>
        <div className='flex gap-2'>
          <input
            type='text'
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
            placeholder='Dán URL ảnh minh họa ở đây...'
            className='flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:ring-didongviet-red focus:border-didongviet-red outline-none'
          />
          <button
            type='button'
            onClick={() => {
              handleAddImage(imgUrl);
              setImgUrl('');
            }}
            disabled={images.length >= 6}
            className='px-4 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer border-none disabled:bg-slate-300 disabled:cursor-not-allowed'
          >
            <Camera size={14} />
            <span>Thêm</span>
          </button>
        </div>

        {/* Preview hình ảnh đã đính kèm */}
        {images.length > 0 && (
          <div className='grid grid-cols-4 sm:grid-cols-6 gap-3 pt-1'>
            {images.map((img, idx) => (
              <div key={idx} className='relative aspect-square rounded-xl border border-slate-100 bg-white overflow-hidden shadow-2xs group'>
                <img
                  src={img}
                  alt={`Return upload ${idx}`}
                  className='h-full w-full object-contain'
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.png';
                  }}
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(idx)}
                  className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white border-none cursor-pointer'
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3b. Đính kèm video minh họa */}
      <div className='space-y-3.5'>
        <div className='flex justify-between items-center'>
          <label className='text-xs font-black text-slate-700 uppercase tracking-tight block'>
            Video minh họa sự cố (Tối đa 1 video):
          </label>
          <span className='text-[10px] font-bold text-slate-450'>{videos.length}/1</span>
        </div>
        <div className='flex gap-2'>
          <input
            type='text'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder='Dán URL video minh họa ở đây (mp4)...'
            className='flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:ring-didongviet-red focus:border-didongviet-red outline-none'
          />
          <button
            type='button'
            onClick={() => {
              handleAddVideo(videoUrl);
              setVideoUrl('');
            }}
            disabled={videos.length >= 1}
            className='px-4 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer border-none disabled:bg-slate-300 disabled:cursor-not-allowed'
          >
            <Camera size={14} />
            <span>Thêm</span>
          </button>
        </div>

        {/* Preview video đã đính kèm */}
        {videos.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1'>
            {videos.map((vid, idx) => (
              <div key={idx} className='relative rounded-xl border border-slate-100 bg-white overflow-hidden shadow-2xs p-2 flex flex-col gap-2'>
                <div className='relative w-full aspect-video bg-black rounded-lg overflow-hidden'>
                  <video
                    src={vid}
                    controls
                    className='h-full w-full object-contain'
                  />
                </div>
                <button
                  type='button'
                  onClick={() => handleRemoveVideo(idx)}
                  className='h-8 w-full rounded-lg bg-red-50 hover:bg-red-100 text-red-650 hover:text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-1 border-none cursor-pointer'
                >
                  <Trash2 size={14} />
                  <span>Xóa video</span>
                </button>
              </div>
            ))}
          </div>
        )}
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
          className='flex-1 h-11 rounded-xl bg-didongviet-red hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs border-none'
        >
          {submitting ? 'Đang gửi...' : 'Gửi yêu cầu hoàn trả'}
        </button>
      </div>
    </form>
  );
}
