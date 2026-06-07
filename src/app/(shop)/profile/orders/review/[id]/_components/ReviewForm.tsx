import React from 'react';
import { Star, ArrowLeft, Image as ImageIcon, Video, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

interface ReviewFormProps {
  order: any;
  ratings: Record<string, number>;
  comments: Record<string, string>;
  imagePreviews: Record<string, string[]>;
  videoPreview: Record<string, string | undefined>;
  updateRating: (productId: string, rating: number) => void;
  updateComment: (productId: string, comment: string) => void;
  onAddImages: (productId: string, files: FileList | null) => void;
  onRemoveImage: (productId: string, index: number) => void;
  onAddVideo: (productId: string, files: FileList | null) => void;
  onRemoveVideo: (productId: string) => void;
  submitting: boolean;
  isExpired?: boolean;
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

export default function ReviewForm({
  order,
  ratings,
  comments,
  imagePreviews,
  videoPreview,
  updateRating,
  updateComment,
  onAddImages,
  onRemoveImage,
  onAddVideo,
  onRemoveVideo,
  submitting,
  isExpired = false,
  onSubmit,
}: ReviewFormProps) {
  return (
    <form onSubmit={onSubmit} className='space-y-6 text-left'>
      <div className='space-y-5'>
        {order.orderItems?.map((item: any, idx: number) => {
          const productId = typeof item.product === 'object' && item.product ? item.product._id : item.product;
          const currentRating = ratings[productId] || 5;
          const currentComment = comments[productId] || '';

          const previews = imagePreviews[productId] || [];
          const videoUrl = videoPreview[productId];

          return (
            <div key={idx} className='p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-4'>
              {/* Product Info */}
              <div className='flex gap-3.5 items-center'>
                <div className='h-12 w-12 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs'>
                  <img src={item.image} alt={item.name} className='h-full w-full object-contain' />
                </div>
                <div className='flex-1 min-w-0 text-left'>
                  <h5 className='text-xs font-bold text-slate-800 line-clamp-2 leading-snug'>{item.name}</h5>
                  {item.selectedColor && (
                    <span className='text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5'>
                      Phân loại: {item.selectedColor} {item.selectedStorage ? `- ${item.selectedStorage}` : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Star Rating Select */}
              <div className='flex items-center gap-2 border-t border-slate-100/50 pt-3'>
                <span className='text-xs font-bold text-slate-500'>Đánh giá sản phẩm:</span>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= currentRating;
                    return (
                      <button
                        key={star}
                        type='button'
                        disabled={isExpired}
                        onClick={() => updateRating(productId, star)}
                        className='p-0.5 bg-transparent border-none cursor-pointer outline-none transition-transform hover:scale-110 disabled:cursor-not-allowed'
                      >
                        <Star
                          size={18}
                          className={isFilled ? 'text-amber-500 fill-amber-500' : 'text-slate-350'}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className='text-[10px] font-black text-amber-600 uppercase ml-1.5'>
                  {currentRating === 5 ? 'Cực kỳ hài lòng' :
                    currentRating === 4 ? 'Hài lòng' :
                      currentRating === 3 ? 'Bình thường' :
                        currentRating === 2 ? 'Không hài lòng' : 'Tệ'}
                </span>
              </div>

              {/* Comment Input */}
              <div className='space-y-1.5'>
                <textarea
                  value={currentComment}
                  onChange={(e) => updateComment(productId, e.target.value)}
                  rows={3}
                  disabled={isExpired}
                  placeholder='Chia sẻ cảm nhận của bạn về sản phẩm (chất lượng, dịch vụ, giao hàng...)...'
                  className='w-full rounded-xl border border-slate-200 p-3.5 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:ring-didongviet-red focus:border-didongviet-red outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed'
                />
              </div>

              {/* Media Upload Section (tối đa 6 ảnh và 1 video) */}
              {!isExpired && (
                <div className='grid grid-cols-1 md:grid-cols-7 gap-4 pt-3 border-t border-slate-100/50'>
                  {/* Video Upload Field */}
                  <div className='md:col-span-2 space-y-1.5'>
                    <span className='text-[10px] font-bold text-slate-500 uppercase block'>
                      Thêm 1 Video (tối đa 1 phút, nén 720p)
                    </span>
                    <div className='relative h-28 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer p-1 overflow-hidden'>
                      {videoUrl ? (
                        <>
                          <video
                            src={getBackendUrl(videoUrl)}
                            controls
                            className='h-full w-full object-contain'
                          />
                          <button
                            type='button'
                            onClick={() => onRemoveVideo(productId)}
                            className='absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 border-none cursor-pointer z-10'
                          >
                            <Trash2 size={10} />
                          </button>
                        </>
                      ) : (
                        <div
                          onClick={() => document.getElementById(`review-video-upload-${productId}`)?.click()}
                          className='text-center text-slate-400 text-[10px] w-full h-full flex flex-col items-center justify-center'
                        >
                          <Video size={20} className='mx-auto mb-1 text-slate-500' />
                          <span>Chọn video</span>
                        </div>
                      )}
                      <input
                        id={`review-video-upload-${productId}`}
                        type='file'
                        accept='video/*'
                        className='hidden'
                        onChange={(e) => onAddVideo(productId, e.target.files)}
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
                        const preview = previews[index];
                        const isPlaceholder = index === previews.length;
                        const isAvailable = index <= previews.length;

                        return (
                          <div key={index} className='flex flex-col items-center gap-1 w-full'>
                            <div
                              onClick={() => {
                                if (!preview && isPlaceholder) {
                                  document.getElementById(`review-img-upload-${productId}`)?.click();
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
                                    alt={`Review preview ${index}`}
                                    className='h-full w-full object-cover'
                                  />
                                  <button
                                    type='button'
                                    onClick={() => onRemoveImage(productId, index)}
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
                        id={`review-img-upload-${productId}`}
                        type='file'
                        accept='image/*'
                        multiple
                        className='hidden'
                        onChange={(e) => onAddImages(productId, e.target.files)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Buttons */}
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
          disabled={submitting || isExpired}
          className='flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs border-none disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed'
        >
          {submitting ? 'Đang gửi...' : isExpired ? 'Đã hết hạn sửa' : 'Gửi đánh giá'}
        </button>
      </div>
    </form>
  );
}
