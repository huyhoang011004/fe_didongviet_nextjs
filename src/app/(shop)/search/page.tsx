'use client';
 
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShoppingBag, Star } from 'lucide-react';
 
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
 
const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};
 
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
 
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
 
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query.trim())}&limit=50`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setProducts(data.data || []);
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải kết quả tìm kiếm:', err);
      } finally {
        setLoading(false);
      }
    }
 
    fetchResults();
  }, [query]);
 
  return (
    <div className='min-h-screen bg-slate-50 font-sans pb-16'>
      {/* 1. BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5 shadow-xs'>
        <div className='max-w-[1400px] mx-auto px-[30px] flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold overflow-x-auto whitespace-nowrap'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold truncate'>
            Kết quả với từ khóa: {query}
          </span>
        </div>
      </nav>
 
      <div className='max-w-[1400px] mx-auto px-[30px] py-6 space-y-6'>
        {/* 2. TIÊU ĐỀ */}
        <div className='bg-white rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs'>
          <div className='space-y-1'>
            <h1 className='text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight'>
              Kết quả tìm kiếm cho: "{query}"
            </h1>
            <p className='text-xs text-slate-400 font-semibold'>
              Tìm thấy {products.length} sản phẩm phù hợp
            </p>
          </div>
        </div>
 
        {/* 3. DANH SÁCH KẾT QUẢ */}
        {loading ? (
          // SKELETON GRID
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse'>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className='bg-white h-[320px] rounded-xl border border-slate-100'
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          // GIỎ HÀNG / KẾT QUẢ TRỐNG
          <div className='bg-white border border-slate-100 rounded-xl py-16 text-center space-y-4 max-w-lg mx-auto shadow-sm'>
            <div className='h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-didongviet-red'>
              <ShoppingBag size={32} />
            </div>
            <div className='space-y-1'>
              <h3 className='font-bold text-slate-800 text-sm'>
                Không tìm thấy sản phẩm nào
              </h3>
              <p className='text-xs text-slate-400 font-semibold max-w-[280px] mx-auto leading-relaxed'>
                Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp với từ khóa "{query}". Vui lòng thử lại với từ khóa khác.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className='px-4 py-2 bg-didongviet-red hover:bg-red-700 text-white font-bold text-xs rounded-xl transition cursor-pointer border-none shadow-sm'
            >
              Quay lại trang chủ
            </button>
          </div>
        ) : (
          // LƯỚI SẢN PHẨM
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {products.map((p) => {
              const variants = p.variants || [];
              const activeVariant = variants[0] || {};
              
              // Tính toán giá cả
              const minPrice = p.price || 0;
              const originalPrice = activeVariant.price || minPrice;
              const salePrice = activeVariant.salePrice || originalPrice;
              
              const percentOff = originalPrice > salePrice 
                ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) 
                : 0;
 
              // Nhãn Best Seller
              const isBestSeller = p.name.includes('Pro Max') || p.name.includes('Ultra');
 
              return (
                <Link
                  key={p._id}
                  href={`/${p.category?.slug || 'dien-thoai'}/${p.slug}`}
                  className='bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden'
                >
                  {/* BADGES */}
                  <div className='flex items-center justify-between gap-1 w-full relative z-10'>
                    <span className='px-1.5 py-0.5 border border-red-200 text-didongviet-red text-[8px] sm:text-[9px] font-bold rounded bg-white'>
                      Trả góp 0%
                    </span>
                    {percentOff > 0 && (
                      <span className='px-1 py-0.5 bg-didongviet-red text-white text-[8px] sm:text-[9px] font-black rounded flex items-center gap-0.5'>
                        ↓{percentOff}%
                      </span>
                    )}
                  </div>
 
                  {/* THƯƠNG HIỆU PARTNER */}
                  <div className='flex flex-col items-center justify-center py-1 border-b border-slate-100/50 mb-1'>
                    {p.brand?.toLowerCase() === 'apple' ? (
                      <div className='flex flex-col items-center justify-center opacity-85'>
                        <svg className='w-3.5 h-3.5 fill-current text-slate-800' viewBox='0 0 170 170'>
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
                        <span className='text-[8px] font-black text-slate-600 tracking-wider uppercase leading-none'>{p.brand}</span>
                        <span className='text-[6px] text-slate-400 font-bold uppercase tracking-tight mt-0.5'>
                          Official Partner
                        </span>
                      </div>
                    )}
                  </div>
 
                  {/* HÌNH ẢNH */}
                  <div className='h-32 w-full rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform relative'>
                    <img
                      src={p.thumbnail || '/placeholder-product.png'}
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
                  <div className='space-y-1 flex-1'>
                    <span className='text-[9px] text-slate-400 font-bold block uppercase'>
                      {p.brand || 'DI ĐỘNG VIỆT'}
                    </span>
                    <h3 className='font-bold text-slate-800 text-[11px] sm:text-xs block line-clamp-2 h-8 sm:h-9 leading-snug hover:text-didongviet-red transition-colors'>
                      {p.name}
                    </h3>
 
                    <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                      <Star size={9} className='fill-amber-500 text-amber-500' />
                      <span>{p.ratingsAverage || 5}</span>
                      <span className='text-slate-400'>({p.ratingsCount || 0})</span>
                    </div>
                  </div>
 
                  {/* GIÁ CẢ */}
                  <div className='space-y-1.5 pt-1.5 border-t border-slate-100'>
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
        )}
      </div>
    </div>
  );
}
 
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
          <div className='flex flex-col items-center gap-2'>
            <div className='w-8 h-8 rounded-full border border-didongviet-red border-t-transparent animate-spin' />
            <p className='text-xs text-slate-400 font-bold animate-pulse'>Đang tải kết quả tìm kiếm...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
