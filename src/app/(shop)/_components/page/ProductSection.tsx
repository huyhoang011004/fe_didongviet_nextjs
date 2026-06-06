'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ProductSectionProps {
  title: string;
  products: any[];
  loading: boolean;
  viewAllLink?: string;
  themeColor?: 'red' | 'blue' | 'purple' | 'amber' | 'slate';
  tabs?: string[];
}

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProductSection({
  title,
  products,
  loading,
  viewAllLink = '/dien-thoai',
  themeColor = 'slate',
  tabs,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState(tabs && tabs.length > 0 ? tabs[0] : 'Xem tất cả');

  // Cập nhật selectedTab nếu props tabs thay đổi
  useEffect(() => {
    if (tabs && tabs.length > 0) {
      setSelectedTab(tabs[0]);
    } else {
      setSelectedTab('Xem tất cả');
    }
  }, [tabs]);

  const indicatorColors = {
    red: 'bg-didongviet-red',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    amber: 'bg-amber-500',
    slate: 'bg-slate-700',
  };

  const textColors = {
    red: 'hover:text-didongviet-red',
    blue: 'hover:text-blue-600',
    purple: 'hover:text-purple-600',
    amber: 'hover:text-amber-500',
    slate: 'hover:text-slate-700',
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Logic match sản phẩm theo Tab
  const matchTab = (product: any, tabName: string) => {
    if (tabName === 'Xem tất cả' || !tabName) return true;

    const pName = product.name.toLowerCase();
    const pBrand = product.brand?.toLowerCase() || '';
    const tabLower = tabName.toLowerCase();
    const catName = product.category?.name?.toLowerCase() || '';
    const catSlug = product.category?.slug?.toLowerCase() || '';

    // Các trường hợp đặc biệt
    if (tabLower === 'galaxy z series' || tabLower === 'galaxy z fold/flip' || tabLower === 'galaxy z') {
      return pName.includes('fold') || pName.includes('flip') || pName.includes('z fold') || pName.includes('z flip');
    }
    if (tabLower === 'galaxy s series' || tabLower === 'galaxy s') {
      return pName.includes('galaxy s') || (pBrand.includes('samsung') && pName.includes(' s2'));
    }
    if (tabLower === 'galaxy a series' || tabLower === 'galaxy a') {
      return pName.includes('galaxy a') || (pBrand.includes('samsung') && pName.includes(' a5')) || pName.includes(' a3') || pName.includes(' a1');
    }
    if (tabLower === 'macbook') {
      return pName.includes('macbook');
    }
    if (tabLower === 'ipad') {
      return pName.includes('ipad');
    }

    // Hỗ trợ lọc danh mục sản phẩm cũ và các mục đặc biệt
    if (tabLower === 'điện thoại') {
      return catName.includes('điện thoại') || catSlug.includes('dien-thoai');
    }
    if (tabLower === 'ipad & tablet' || tabLower === 'tablet') {
      return (
        pName.includes('ipad') ||
        pName.includes('tablet') ||
        catName.includes('ipad') ||
        catName.includes('tablet')
      );
    }
    if (tabLower === 'macbook & laptop' || tabLower === 'laptop') {
      return (
        (pName.includes('macbook') ||
          pName.includes('laptop') ||
          catName.includes('laptop') ||
          catName.includes('macbook')) &&
        !pName.includes('ipad')
      );
    }

    const keywords = tabLower
      .replace('series', '')
      .replace('chính hãng', '')
      .trim()
      .split(/\s+/)
      .filter((k) => k.length > 0);

    return keywords.every((kw) => pName.includes(kw) || pBrand.includes(kw));
  };

  const displayProducts = products.filter((p) => matchTab(p, selectedTab));

  return (
    <section className='space-y-4'>
      {/* HEADER KHU VỰC */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3'>
        <div className='flex items-center gap-2 flex-shrink-0'>
          <div className={`h-1 w-3.5 rounded-full ${indicatorColors[themeColor]}`} />
          <h2 className='text-sm sm:text-base font-black text-slate-800 dark:text-white uppercase tracking-tight'>
            {title}
          </h2>
        </div>

        {/* TABS LỌC DANH MỤC CON */}
        {tabs && tabs.length > 0 ? (
          <div className='flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0'>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap
                  ${
                    selectedTab === tab
                      ? 'border-didongviet-red bg-red-50 text-didongviet-red dark:bg-red-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : (
          <Button
            asChild
            variant='ghost'
            size='sm'
            className='text-[10px] text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer h-7'
          >
            <Link href={viewAllLink} className='flex items-center gap-1'>
              <span>Xem tất cả</span>
              <ArrowRight size={11} />
            </Link>
          </Button>
        )}
      </div>

      {/* DANH SÁCH SẢN PHẨM HOẶC SKELETON */}
      {loading ? (
        <div className='flex overflow-x-auto gap-3 pb-3 animate-pulse no-scrollbar'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-slate-900 h-[260px] w-[160px] sm:w-[210px] shrink-0 rounded-xl border border-slate-100 dark:border-slate-800'
            />
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className='text-center py-10 text-gray-400 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 w-full'>
          <ShoppingBag size={30} className='mx-auto text-gray-300 mb-2' />
          <p className='text-[11px] font-semibold'>Không tìm thấy sản phẩm phù hợp ở mục này.</p>
        </div>
      ) : (
        <div className='relative group/slider'>
          {/* NÚT CUỘN TRÁI */}
          <button
            onClick={() => scroll('left')}
            className='absolute left-[-14px] top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-750 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-110 shadow-slate-200 dark:shadow-none'
          >
            <ChevronLeft size={16} className='text-slate-600 dark:text-slate-300' />
          </button>

          {/* LIST SẢN PHẨM CUỘN NGANG */}
          <div
            ref={scrollRef}
            className='flex overflow-x-auto gap-3 pb-3 scrollbar-thin scroll-smooth snap-x snap-mandatory pr-2'
          >
            {displayProducts.map((p) => {
              const minPrice = p.priceRange?.min || 0;
              const activeVariant = p.variants?.[0] || {};
              const originalPrice = activeVariant?.price || minPrice;
              const salePrice = activeVariant?.salePrice || originalPrice;
              const percentOff = Math.round(
                ((originalPrice - salePrice) / originalPrice) * 100,
              );

              // Phân loại nhãn Best Seller
              const isBestSeller = p.ratingsCount > 100 || p.name.includes('Pro Max') || p.name.includes('Ultra');

              return (
                <Link
                  key={p._id}
                  href={`/${p.category?.slug || 'dien-thoai'}/${p.slug}`}
                  className='w-[160px] sm:w-[210px] shrink-0 snap-start bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all group relative overflow-hidden'
                >
                  {/* BADGES HÀNG ĐẦU */}
                  <div className='flex items-center justify-between gap-1 w-full relative z-10'>
                    <span className='px-1.5 py-0.5 border border-red-205 dark:border-red-900/40 text-didongviet-red text-[8px] sm:text-[9px] font-bold rounded bg-white dark:bg-slate-900'>
                      Trả góp 0%
                    </span>
                    {percentOff > 0 && (
                      <span className='px-1 py-0.5 bg-didongviet-red text-white text-[8px] sm:text-[9px] font-black rounded flex items-center gap-0.5'>
                        ↓{percentOff}%
                      </span>
                    )}
                  </div>

                  {/* LOGO ĐỐI TÁC ỦY QUYỀN */}
                  <div className='flex flex-col items-center justify-center py-1 border-b border-slate-100/50 dark:border-slate-800/50 mb-1'>
                    {p.brand?.toLowerCase() === 'apple' ? (
                      <div className='flex flex-col items-center justify-center opacity-85'>
                        <svg className='w-3.5 h-3.5 fill-current text-slate-800 dark:text-slate-200' viewBox='0 0 170 170'>
                          <path d='M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-3.23-2.62-7.07-7.24-11.54-13.86-5.26-7.77-9.43-16.82-12.51-27.18-3.08-10.35-4.63-20.08-4.63-29.2 0-14.93 3.84-26.96 11.54-36.07 7.7-9.11 17.29-13.72 28.77-13.84 5.37 0 11.22 1.55 17.54 4.64 6.33 3.1 10.4 4.64 12.22 4.64 1.7 0 5.75-1.54 12.16-4.64 6.42-3.1 11.97-4.58 16.67-4.43 12.57.58 22.42 5.14 29.54 13.68-10.15 6.16-15.14 14.77-14.99 25.82.16 8.7 3.39 15.93 9.69 21.68 6.3 5.75 13.67 9.07 22.09 9.97-2.6 7.42-5.9 14.78-9.92 22.08zm-29.23-118c0 7.82-2.8 14.85-8.39 21.1-5.6 6.25-12.33 9.94-20.2 11.07.16-7.25 2.87-14.28 8.16-21.09 5.28-6.81 12.35-10.87 20.2-12.18.23 1.1.23 1.93.23 1.1z' />
                        </svg>
                        <span className='text-[7px] text-slate-400 font-extrabold uppercase mt-0.5 tracking-tight'>
                          Authorised Reseller
                        </span>
                      </div>
                    ) : p.brand?.toLowerCase() === 'samsung' ? (
                      <div className='flex flex-col items-center justify-center opacity-85'>
                        <span className='text-[8px] font-black text-blue-600 tracking-wider font-mono italic leading-none'>SAMSUNG</span>
                        <span className='text-[6px] text-slate-400 font-extrabold uppercase tracking-tight mt-0.5'>
                          Premium Partner
                        </span>
                      </div>
                    ) : (
                      <div className='flex flex-col items-center justify-center opacity-85'>
                        <span className='text-[8px] font-black text-slate-650 dark:text-slate-350 tracking-wider uppercase leading-none'>{p.brand}</span>
                        <span className='text-[6px] text-slate-400 font-bold uppercase tracking-tight mt-0.5'>
                          Official Partner
                        </span>
                      </div>
                    )}
                  </div>

                  {/* KHUNG ẢNH CÓ BEST SELLER */}
                  <div className='h-28 w-full rounded-lg bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform relative'>
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
                  </div>

                  {/* THÔNG TIN SẢN PHẨM */}
                  <div className='space-y-1'>
                    <span className='text-[9px] text-slate-450 dark:text-slate-500 font-bold block uppercase'>
                      {p.brand || 'DI ĐỘNG VIỆT'}
                    </span>
                    <span className={`font-bold text-slate-800 dark:text-white text-[11px] sm:text-xs block line-clamp-2 h-8 sm:h-9 leading-snug ${textColors[themeColor]} transition-colors`}>
                      {p.name}
                    </span>

                    <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                      <Star size={9} className='fill-amber-500 text-amber-500' />
                      <span>{p.ratingsAverage || 5}</span>
                      <span className='text-slate-400 dark:text-slate-500'>({p.ratingsCount || 0})</span>
                    </div>
                  </div>

                  {/* GIÁ CẢ */}
                  <div className='space-y-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80'>
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

                    <span className='inline-block text-[8px] font-extrabold text-purple-600 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 px-1 py-0.5 rounded uppercase'>
                      D.Member -1%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* NÚT CUỘN PHẢI */}
          <button
            onClick={() => scroll('right')}
            className='absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-750 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-0 group-hover/slider:opacity-100 hover:scale-110 shadow-slate-200 dark:shadow-none'
          >
            <ChevronRight size={16} className='text-slate-600 dark:text-slate-300' />
          </button>
        </div>
      )}
    </section>
  );
}
