'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, ShoppingBag, RotateCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ProductGridProps {
  products: any[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  loadingMore: boolean;
  limitPerPage: number;
  onLoadMore: () => void;
}

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProductGrid({
  products,
  totalProducts,
  currentPage,
  totalPages,
  loadingMore,
  limitPerPage,
  onLoadMore,
}: ProductGridProps) {
  const params = useParams();
  const categorySlug = (params.categorySlug as string) || 'dien-thoai';
  if (products.length === 0) {
    return (
      <div className='text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-white shadow-xs'>
        <ShoppingBag size={42} className='mx-auto text-gray-300 mb-2' />
        <p className='text-xs font-semibold'>
          Không có sản phẩm nào phù hợp với bộ lọc này.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {products.map((p) => {
          const minPrice = p.priceRange?.min || 0;
          const activeVariant = p.variants?.[0] || {};
          const originalPrice = activeVariant?.price || minPrice;
          const salePrice = activeVariant?.salePrice || originalPrice;
          const percentOff = Math.round(
            ((originalPrice - salePrice) / originalPrice) * 100,
          );

          const isBestSeller = p.ratingsCount > 5 || p.name.includes('Pro Max') || p.name.includes('Ultra');
          const isGoodPrice = salePrice < 20000000 && !isBestSeller;

          return (
            <Link
              key={p._id}
              href={`/${p.category?.slug || categorySlug}/${p.slug}`}
              className='bg-white border border-slate-100 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden'
            >
              <div className='flex items-center justify-between gap-1 w-full relative z-10'>
                <span className='px-1.5 py-0.5 border border-red-200 text-didongviet-red text-[8px] sm:text-[9px] font-black rounded bg-white'>
                  Trả góp 0%
                </span>
                {percentOff > 0 && (
                  <span className='px-1 py-0.5 bg-didongviet-red text-white text-[8px] sm:text-[9px] font-black rounded flex items-center gap-0.5'>
                    ↓{percentOff}%
                  </span>
                )}
              </div>

              <div className='h-32 w-full rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform relative'>
                <img
                  src={p.imageUrl || '/placeholder-product.png'}
                  alt={p.name}
                  className='h-full w-full object-contain'
                  referrerPolicy='no-referrer'
                />
                {isBestSeller && (
                  <div className='absolute bottom-1 left-1 bg-didongviet-red text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow uppercase tracking-wide'>
                    BEST SELLER
                  </div>
                )}
                {isGoodPrice && (
                  <div className='absolute bottom-1 left-1 bg-amber-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow uppercase tracking-wide'>
                    GIÁ TỐT
                  </div>
                )}
              </div>

              <div className='space-y-1 pt-1'>
                <span className='text-[9px] text-slate-400 font-bold block uppercase tracking-wide'>
                  {p.brand || 'DI ĐỘNG VIỆT'}
                </span>
                <span className='font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-didongviet-red block line-clamp-2 h-8 leading-snug transition-colors'>
                  {p.name}
                </span>

                <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                  <Star size={9} className='fill-amber-500 text-amber-500' />
                  <span>{p.ratingsAverage || 5}</span>
                  <span className='text-slate-400'>({p.ratingsCount || 0})</span>
                </div>
              </div>

              <div className='space-y-2 pt-2 border-t border-slate-100'>
                <div className='flex flex-col justify-start items-start'>
                  <span className='text-xs sm:text-sm font-extrabold text-didongviet-red leading-tight'>
                    {formatVND(salePrice)}
                  </span>
                  {percentOff > 0 ? (
                    <span className='text-[10px] font-bold text-slate-400 line-through leading-tight'>
                      {formatVND(originalPrice)}
                    </span>
                  ) : (
                    <span className='text-[10px] text-transparent leading-tight select-none'>
                      Placeholder
                    </span>
                  )}
                </div>

                <span className='inline-block text-[8px] font-extrabold text-purple-600 bg-purple-50 border border-purple-100 px-1 py-0.5 rounded uppercase'>
                  D.Member -1%
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages && (
        <div className='flex justify-center pt-4'>
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            className='bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full py-2 px-6 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2 h-10 min-w-56 justify-center'
          >
            {loadingMore ? (
              <RotateCw className='h-3.5 w-3.5 animate-spin text-slate-400' />
            ) : (
              <span>Xem thêm {totalProducts - products.length > limitPerPage ? limitPerPage : totalProducts - products.length} sản phẩm</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
