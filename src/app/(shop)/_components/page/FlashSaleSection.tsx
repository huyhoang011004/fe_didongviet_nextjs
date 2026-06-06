'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ShoppingBag, Star } from 'lucide-react';

interface FlashSaleSectionProps {
  loading: boolean;
  flashSaleCampaign: any;
  flashSaleProducts: any[];
}

// Chuẩn hóa định dạng hiển thị tiền tệ VNĐ
const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function FlashSaleSection({
  loading,
  flashSaleCampaign,
  flashSaleProducts,
}: FlashSaleSectionProps) {
  const [countdownTime, setCountdownTime] = useState({ hours: '00', minutes: '00', seconds: '00' });

  // Bộ đếm ngược động cho Flash Sale
  useEffect(() => {
    if (!flashSaleCampaign) return;

    let targetTime = 0;
    if (flashSaleCampaign.endTime) {
      targetTime = new Date(flashSaleCampaign.endTime).getTime();
    } else if (flashSaleCampaign.nextSlot !== undefined) {
      const next = new Date();
      next.setHours(flashSaleCampaign.nextSlot, 0, 0, 0);
      if (flashSaleCampaign.isNextDay) {
        next.setDate(next.getDate() + 1);
      }
      targetTime = next.getTime();
    }

    if (targetTime <= 0) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setCountdownTime({ hours: '00', minutes: '00', seconds: '00' });
        return false;
      }

      const hrs = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdownTime({
        hours: String(hrs).padStart(2, '0'),
        minutes: String(mins).padStart(2, '0'),
        seconds: String(secs).padStart(2, '0'),
      });
      return true;
    };

    updateCountdown();
    const interval = setInterval(() => {
      const keepRunning = updateCountdown();
      if (!keepRunning) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSaleCampaign]);

  return (
    <section>
      <div className='bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 md:p-6 space-y-4 shadow-lg border border-red-400/30 relative overflow-hidden'>
        {/* Vòng tròn hiệu ứng sáng */}
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none' />

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/20 pb-4 relative z-10'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-lg bg-white text-didongviet-red flex items-center justify-center shadow-md animate-bounce'>
              <Zap size={16} className='fill-didongviet-red text-didongviet-red' />
            </div>
            <div>
              <h2 className='text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2'>
                <span>{flashSaleCampaign?.endTime ? (flashSaleCampaign.name || 'GIỜ VÀNG GIÁ SỐC') : 'FLASH SALE SẮP DIỄN RA'}</span>
                <span className='text-[9px] bg-yellow-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded animate-pulse shadow-sm'>
                  {flashSaleCampaign?.endTime ? 'LIVE' : 'WAITING'}
                </span>
              </h2>
              <p className='text-[10px] text-red-100 mt-0.5 font-medium'>
                {flashSaleCampaign?.endTime ? 'Săn ngay deal tốt giá kịch sàn!' : 'Chuẩn bị săn deal cực sốc sắp tới!'}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-1.5 text-[10px] font-bold text-red-100'>
            <span>{flashSaleCampaign?.endTime ? 'Kết thúc sau:' : 'Bắt đầu sau:'}</span>
            <div className='flex gap-1 items-center'>
              {[countdownTime.hours, countdownTime.minutes, countdownTime.seconds].map((t, i) => (
                <span key={i} className='flex items-center gap-1'>
                  <span className='px-2 py-1 bg-black/30 text-white rounded-md border border-white/10 font-mono text-[10px] backdrop-blur-xs shadow-sm'>
                    {t}
                  </span>
                  {i < 2 && <span className="text-white font-bold">:</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-pulse'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='bg-white/10 h-[240px] rounded-xl' />
            ))}
          </div>
        ) : flashSaleProducts.length === 0 ? (
          <div className='text-center py-10 text-red-100 border border-dashed border-red-300/40 rounded-xl bg-white/5'>
            <ShoppingBag
              size={36}
              className='mx-auto text-red-200/60 mb-2'
            />
            <p className='text-xs font-semibold'>
              Deal sốc đang được chuẩn bị. Quay lại sau!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 relative z-10'>
            {flashSaleProducts.map((item) => {
              const p = item.product;
              if (!p) return null;

              const minPrice = p.priceRange?.min || 0;
              const activeVariant = p.variants?.[0] || {};
              const originalPrice = activeVariant?.price || minPrice;
              const salePrice = item.flashSalePrice || originalPrice;
              const percentOff = Math.round(
                ((originalPrice - salePrice) / originalPrice) * 100,
              );

              const soldCount = item.soldCount || 0;
              const totalStock = item.flashSaleStock || 10;
              const percentSold = Math.min(Math.round((soldCount / totalStock) * 100), 100);

              return (
                <Link
                  key={p._id}
                  href={`/${p.category?.slug || 'dien-thoai'}/${p.slug}`}
                  className='bg-white dark:bg-slate-900 border border-red-100 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:shadow-xl hover:-translate-y-0.5 transition-all group relative overflow-hidden'
                >
                  {percentOff > 0 && (
                    <span className='absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-didongviet-red text-white text-[9px] font-black rounded-md shadow uppercase'>
                      -{percentOff}%
                    </span>
                  )}

                  <div className='space-y-2'>
                    <div className='h-28 w-full rounded-lg bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform'>
                      <img
                        src={p.imageUrl || '/placeholder-product.png'}
                        alt={p.name}
                        className='h-full w-full object-contain'
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className='space-y-0.5'>
                      <span className='text-[9px] text-slate-400 dark:text-slate-500 font-bold block uppercase'>
                        {p.brand || 'DI ĐỘNG VIỆT'}
                      </span>
                      <span className='font-bold text-slate-800 dark:text-white text-[11px] sm:text-xs group-hover:text-didongviet-red block truncate leading-snug'>
                        {p.name}
                      </span>

                      <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                        <Star
                          size={9}
                          className='fill-amber-500 text-amber-500'
                        />
                        <span>{p.ratingsAverage || 5}</span>
                        <span className='text-slate-400 dark:text-slate-500'>
                          ({p.ratingsCount || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800'>
                    <div className='flex flex-wrap items-baseline gap-1'>
                      <span className='text-xs sm:text-sm font-black text-didongviet-red'>
                        {formatVND(salePrice)}
                      </span>
                      {percentOff > 0 && (
                        <span className='text-[9px] font-bold text-slate-400 line-through'>
                          {formatVND(originalPrice)}
                        </span>
                      )}
                    </div>

                    <span className='inline-block text-[8px] font-extrabold text-purple-600 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 px-1 py-0.5 rounded uppercase'>
                      D.Member -1%
                    </span>

                    <div className='space-y-0.5'>
                      <div className='h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full'
                          style={{ width: `${percentSold}%` }}
                        />
                      </div>
                      <span className='text-[8px] font-bold text-slate-500 dark:text-slate-400 block'>
                        Đã bán: {soldCount} / {totalStock} máy
                      </span>
                    </div>
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
