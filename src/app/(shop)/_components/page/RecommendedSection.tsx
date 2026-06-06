'use client';

import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface RecommendedSectionProps {
  loading: boolean;
  allProducts: any[];
}

// Chuẩn hóa định dạng hiển thị tiền tệ VNĐ
const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function RecommendedSection({
  loading,
  allProducts,
}: RecommendedSectionProps) {
  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
        <div className='flex items-center gap-2'>
          <div className='h-1 w-3.5 bg-didongviet-red rounded-full' />
          <h2 className='text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight'>
            SẢN PHẨM KHUYẾN NGHỊ
          </h2>
        </div>

        <Button
          asChild
          variant='ghost'
          size='sm'
          className='text-[10px] text-didongviet-red font-bold hover:bg-red-50 rounded-xl cursor-pointer h-7'
        >
          <Link href='/dien-thoai' className='flex items-center gap-1'>
            <span>Xem tất cả</span>
            <ArrowRight size={11} />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-pulse'>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className='bg-white h-[240px] rounded-xl border border-slate-100'
            />
          ))}
        </div>
      ) : allProducts.length === 0 ? (
        <div className='text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white'>
          <ShoppingBag size={36} className='mx-auto text-gray-300 mb-2' />
          <p className='text-xs font-semibold'>Chưa có sản phẩm nào.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
          {allProducts.map((p) => {
            const minPrice = p.priceRange?.min || 0;
            const activeVariant = p.variants?.[0] || {};
            const originalPrice = activeVariant?.price || minPrice;
            const salePrice = activeVariant?.salePrice || originalPrice;
            const percentOff = Math.round(
              ((originalPrice - salePrice) / originalPrice) * 100,
            );

            return (
              <Link
                key={p._id}
                href={`/${p.category?.slug || 'dien-thoai'}/${p.slug}`}
                className='bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden'
              >
                {percentOff > 0 && (
                  <span className='absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-didongviet-red text-white text-[9px] font-black rounded-md shadow uppercase'>
                    -{percentOff}%
                  </span>
                )}

                <div className='space-y-2'>
                  <div className='h-32 w-full rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform'>
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
                    <span className='font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-didongviet-red block truncate leading-snug'>
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

                <div className='space-y-1 pt-1 border-t border-slate-100'>
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

                  <span className='inline-block text-[8px] font-extrabold text-purple-600 bg-purple-50 border border-purple-200 px-1 py-0.5 rounded uppercase'>
                    D.Member -1%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
