'use client';

import Link from 'next/link';
import { Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { fetchRelatedProducts } from '../product-detail-actions';

interface RelatedProductsProps {
  productId: string;
  title: string;
  isUsed?: boolean;
}

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function RelatedProducts({ productId, title, isUsed }: RelatedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [excludeIds, setExcludeIds] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initLoad() {
      if (!productId) return;
      try {
        setLoading(true);
        const res = await fetchRelatedProducts(productId, 10, isUsed, []);
        if (res && res.success && res.data) {
          setProducts(res.data);
          const ids = res.data.map((p: any) => p._id);
          setExcludeIds(ids);
          if (res.data.length < 10) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error initializing related products:', err);
      } finally {
        setLoading(false);
      }
    }

    initLoad();
  }, [productId, isUsed]);

  const loadMore = async () => {
    if (loadingMore || !hasMore || !productId) return;
    try {
      setLoadingMore(true);
      const res = await fetchRelatedProducts(productId, 5, isUsed, excludeIds);
      if (res && res.success && res.data && res.data.length > 0) {
        setProducts((prev) => [...prev, ...res.data]);
        const newIds = res.data.map((p: any) => p._id);
        setExcludeIds((prev) => [...prev, ...newIds]);
        if (res.data.length < 5) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more related products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current || loadingMore || !hasMore) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    // Khi cuộn ngang đến gần sát lề phải (cách khoảng 100px), tự động tải thêm
    if (scrollLeft + clientWidth >= scrollWidth - 100) {
      loadMore();
    }
  };

  const scrollLeftClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRightClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className='space-y-4 py-2 animate-pulse'>
        <div className='flex items-center gap-2 border-b border-slate-200 pb-3'>
          <div className='h-1.5 w-3.5 bg-slate-300 rounded-full' />
          <div className='h-4 w-40 bg-slate-200 rounded' />
        </div>
        <div className='flex gap-3 overflow-hidden pb-3'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='min-w-[170px] sm:min-w-[190px] h-[220px] bg-slate-50 border border-slate-100 rounded-xl' />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className='space-y-4 relative group/section'>
      <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
        <div className='flex items-center gap-2'>
          <div className={`h-1.5 w-3.5 rounded-full ${isUsed ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <h3 className='text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight'>
            {title}
          </h3>
        </div>

        {/* Nút bấm chuyển hướng nhanh */}
        <div className='flex items-center gap-1.5 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300 hidden md:flex'>
          <button
            onClick={scrollLeftClick}
            className='p-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer'
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={scrollRightClick}
            className='p-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-xs cursor-pointer'
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className='flex overflow-x-auto gap-3 pb-3 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300'
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((p) => {
          const minPrice = p.priceRange?.min || 0;
          const activeVariant = p.variants?.[0] || {};
          const originalPrice = activeVariant?.price || minPrice;
          const salePrice = activeVariant?.salePrice || originalPrice;
          const percentOff = Math.round(
            ((originalPrice - salePrice) / originalPrice) * 100,
          );

          return (
            <div
              key={p._id}
              className='min-w-[160px] sm:min-w-[190px] max-w-[200px] bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:shadow-md hover:border-slate-200 transition-all snap-start group relative overflow-hidden flex-shrink-0'
            >
              {percentOff > 0 && (
                <span className='absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-didongviet-red text-white text-[9px] font-black rounded-md shadow uppercase'>
                  -{percentOff}%
                </span>
              )}

              <div className='space-y-2'>
                <div className='h-28 w-full rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform'>
                  <img
                    src={p.imageUrl || '/placeholder-product.png'}
                    alt={p.name}
                    className='h-full w-full object-contain'
                    referrerPolicy='no-referrer'
                  />
                </div>

                <div className='space-y-0.5'>
                  <div className='flex items-center justify-between'>
                    <span className='text-[9px] text-slate-400 font-bold uppercase'>
                      {p.brand || 'DI ĐỘNG VIỆT'}
                    </span>
                    {p.isUsed && (
                      <span className='text-[8px] bg-amber-50 text-amber-600 font-extrabold px-1 rounded-sm border border-amber-200'>
                        CŨ LIKENEW
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/${p.category?.slug || 'dien-thoai'}/${p.slug}`}
                    className='font-bold text-slate-800 text-[11px] sm:text-xs hover:text-didongviet-red block truncate leading-snug'
                  >
                    {p.name}
                  </Link>

                  <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                    <Star size={9} className='fill-amber-500 text-amber-500' />
                    <span>{p.ratingsAverage || 5}</span>
                    <span className='text-slate-400'>({p.ratingsCount || 0})</span>
                  </div>
                </div>
              </div>

              <div className='space-y-1 pt-1 border-t border-slate-100'>
                <span className='text-xs sm:text-sm font-black text-didongviet-red'>
                  {formatVND(salePrice)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Trạng thái tải thêm ở cuối danh sách cuộn */}
        {hasMore && (
          <div className='min-w-[120px] sm:min-w-[140px] flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 text-center flex-shrink-0 snap-start space-y-1.5'>
            {loadingMore ? (
              <>
                <Loader2 className='w-5 h-5 text-didongviet-red animate-spin' />
                <span className='text-[10px] text-slate-500 font-bold'>Đang tải...</span>
              </>
            ) : (
              <button 
                onClick={loadMore}
                className='text-[10px] text-didongviet-red font-black hover:underline cursor-pointer'
              >
                Xem thêm
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
