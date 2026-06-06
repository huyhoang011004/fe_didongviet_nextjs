'use client';

import Link from 'next/link';
import { RotateCw, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface TradeInSectionProps {
  loading: boolean;
  tradeInProducts: any[];
}

// Chuẩn hóa định dạng hiển thị tiền tệ VNĐ
const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function TradeInSection({
  loading,
  tradeInProducts,
}: TradeInSectionProps) {
  return (
    <section>
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none' />

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-blue-200/50 pb-4 relative z-10'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center animate-pulse'>
              <RotateCw size={16} />
            </div>
            <div>
              <h2 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2'>
                <span>THU CŨ ĐỔI MỚI - TRỢ GIÁ KHỦNG</span>
                <span className='text-[9px] bg-blue-600 text-white font-extrabold px-1.5 py-0.5 rounded'>
                  ĐỘC QUYỀN
                </span>
              </h2>
              <p className='text-[10px] text-gray-500 mt-0.5 font-medium'>
                Lên đời smartphone, tiết kiệm tối đa!
              </p>
            </div>
          </div>

          <Button
            asChild
            variant='ghost'
            size='sm'
            className='text-[11px] text-blue-600 font-bold hover:bg-blue-50/50 rounded-xl cursor-pointer self-start sm:self-center h-8'
          >
            <Link href='/trade-in' className='flex items-center gap-1'>
              <span>Xem tất cả deal</span>
              <ArrowRight size={11} />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className='flex overflow-hidden gap-3 pb-3'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='min-w-[160px] sm:min-w-[190px] h-[240px] bg-white rounded-xl animate-pulse flex-shrink-0' />
            ))}
          </div>
        ) : tradeInProducts.length === 0 ? (
          <div className='text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white'>
            <RotateCw size={36} className='mx-auto text-gray-300 mb-2' />
            <p className='text-xs font-semibold'>
              Chưa có deal thu cũ đổi mới. Quay lại sau!
            </p>
          </div>
        ) : (
          <div 
            className='flex overflow-x-auto gap-3 pb-3 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-200 relative z-10'
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {tradeInProducts.map((p) => {
              const minPrice = p.priceRange?.min || 0;
              const activeVariant = p.variants?.[0] || {};
              const originalPrice = activeVariant?.price || minPrice;
              const salePrice = activeVariant?.salePrice || originalPrice;

              return (
                <Link
                  key={p._id}
                  href={`/${p.category?.slug || 'dien-thoai'}/${p.slug}`}
                  className='min-w-[160px] sm:min-w-[190px] max-w-[200px] flex-shrink-0 snap-start bg-white border border-blue-100 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden'
                >
                  {p.tradeInBonus > 0 && (
                    <span className='absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-md shadow uppercase'>
                      +{formatVND(p.tradeInBonus)}
                    </span>
                  )}

                  <div className='space-y-2'>
                    <div className='h-28 w-full rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform'>
                      <img
                        src={p.imageUrl || '/placeholder-product.png'}
                        alt={p.name}
                        className='h-full w-full object-contain'
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className='space-y-0.5'>
                      <span className='text-[9px] text-slate-400 font-bold block uppercase'>
                        {p.brand || 'DI ĐỘNG VIỆT'}
                      </span>
                      <span className='font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-blue-600 block truncate leading-snug'>
                        {p.name}
                      </span>

                      <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                        <Star
                          size={9}
                          className='fill-amber-500 text-amber-500'
                        />
                        <span>{p.ratingsAverage || 5}</span>
                        <span className='text-slate-400'>
                          ({p.ratingsCount || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-1 pt-1 border-t border-gray-100'>
                    <span className='text-xs sm:text-sm font-black text-blue-600'>
                      {formatVND(salePrice)}
                    </span>

                    <p className='text-[8px] text-gray-400 font-semibold leading-relaxed'>
                      Sau thu đổi:{' '}
                      <strong className='text-didongviet-red text-[10px] font-black'>
                        {formatVND(salePrice - (p.tradeInBonus || 0))}
                      </strong>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
