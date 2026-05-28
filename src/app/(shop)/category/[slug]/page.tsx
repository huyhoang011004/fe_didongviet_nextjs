'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  SlidersHorizontal, 
  Star, 
  ArrowRight,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('newest');

  useEffect(() => {
    if (!slug) return;

    async function loadCategoryData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        
        const [catRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/categories/slug/${slug}`).then(r => r.ok ? r.json() : null),
          fetch(`${apiUrl}/products/category/${slug}`).then(r => r.ok ? r.json() : null)
        ]);

        if (catRes && catRes.success) {
          setCategory(catRes.data);
        } else {
          const catName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          setCategory({ name: catName, description: `Khám phá các dòng sản phẩm ${catName} chính hãng.` });
        }

        if (productsRes && productsRes.success) {
          setProducts(productsRes.data || []);
        } else {
          const allRes = await fetch(`${apiUrl}/products`).then(r => r.ok ? r.json() : null);
          if (allRes && allRes.success) {
            const allProds = allRes.products || allRes.data || [];
            const filtered = allProds.filter((p: any) => 
              (p.category?.slug === slug) || 
              (p.category?._id === catRes?.data?._id)
            );
            setProducts(filtered.length > 0 ? filtered : allProds.slice(0, 8));
          }
        }
      } catch (err) {
        console.error('Failed to load category data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [slug]);

  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.brand?.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter === 'all' ? true : p.brand === brandFilter;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      const aPrice = a.priceRange?.min || 0;
      const bPrice = b.priceRange?.min || 0;
      if (priceSort === 'price_asc') return aPrice - bPrice;
      if (priceSort === 'price_desc') return bPrice - aPrice;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>DĐV</div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>Đang tải sản phẩm ngành hàng...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700'>
      
      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-6xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>Trang chủ</Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>{category?.name || 'Ngành hàng'}</span>
        </div>
      </nav>

      {/* HEADER BANNER */}
      <section className='bg-slate-900 text-white py-8 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-48 h-48 bg-didongviet-red/10 rounded-full blur-3xl pointer-events-none' />
        <div className='max-w-6xl mx-auto px-4 relative z-10 space-y-1.5'>
          <h1 className='text-lg sm:text-2xl font-black uppercase tracking-tight'>{category?.name}</h1>
          <p className='text-[10px] sm:text-xs text-slate-400 font-medium max-w-xl leading-relaxed'>
            {category?.description || `Tuyển tập sản phẩm ${category?.name} chính hãng ưu đãi tại Di Động Việt.`}
          </p>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-5'>
        
        {/* SIDEBAR FILTERS */}
        <aside className='lg:col-span-1 bg-white border border-slate-100 rounded-xl p-4 space-y-4 shadow-xs h-fit sticky top-20'>
          <div className='flex items-center gap-2 border-b border-slate-100 pb-2.5'>
            <SlidersHorizontal size={14} className='text-didongviet-red' />
            <span className='text-[10px] font-black text-slate-800 uppercase tracking-wider'>Lọc nhóm hàng</span>
          </div>

          {/* Tìm kiếm */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-slate-500 uppercase'>Tìm trong danh mục</label>
            <div className='relative'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400' size={13} />
              <Input
                placeholder='Nhập tên máy...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className='pl-8 py-2 rounded-lg text-[11px] w-full border-slate-200 h-9'
              />
            </div>
          </div>

          {/* Lọc thương hiệu */}
          {brands.length > 1 && (
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold text-slate-500 uppercase'>Thương hiệu</label>
              <select
                value={brandFilter}
                onChange={e => setBrandFilter(e.target.value)}
                className='w-full py-2 px-2.5 border border-slate-200 rounded-lg bg-white text-[11px] outline-none focus:border-didongviet-red h-9'
              >
                <option value='all'>Tất cả hãng</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sắp xếp giá */}
          <div className='space-y-1.5'>
            <label className='text-[10px] font-bold text-slate-500 uppercase'>Sắp xếp</label>
            <select
              value={priceSort}
              onChange={e => setPriceSort(e.target.value)}
              className='w-full py-2 px-2.5 border border-slate-200 rounded-lg bg-white text-[11px] outline-none focus:border-didongviet-red h-9'
            >
              <option value='newest'>Mới nhất</option>
              <option value='price_asc'>Giá thấp → cao</option>
              <option value='price_desc'>Giá cao → thấp</option>
            </select>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className='lg:col-span-3 space-y-4'>
          
          <div className='flex items-center justify-between text-[10px] font-bold text-gray-500 bg-white p-3 rounded-lg border border-slate-100 shadow-xs'>
            <span>Tìm thấy: <strong className='text-didongviet-red'>{filteredProducts.length}</strong> sản phẩm</span>
            <span className='hidden sm:inline text-slate-400'>Rẻ hơn các loại rẻ</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className='text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white'>
              <ShoppingBag size={36} className='mx-auto text-gray-300 mb-2' />
              <p className='text-xs font-semibold'>Chưa có sản phẩm nào thuộc ngành hàng này.</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
              {filteredProducts.map(p => {
                const minPrice = p.priceRange?.min || 0;
                const activeVariant = p.variants?.[0] || {};
                const originalPrice = activeVariant?.price || minPrice;
                const salePrice = activeVariant?.salePrice || originalPrice;
                const percentOff = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

                return (
                  <div key={p._id} className='bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden'>
                    
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
                        />
                      </div>
                      
                      <div className='space-y-0.5'>
                        <span className='text-[9px] text-slate-400 font-bold block uppercase'>{p.brand || 'DI ĐỘNG VIỆT'}</span>
                        <Link href={`/product/${p.slug || p._id}`} className='font-bold text-slate-800 text-[11px] sm:text-xs hover:text-didongviet-red block truncate leading-snug'>
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
                      <div className='flex flex-wrap items-baseline gap-1'>
                        <span className='text-xs sm:text-sm font-black text-didongviet-red'>{formatVND(salePrice)}</span>
                        {percentOff > 0 && (
                          <span className='text-[9px] font-bold text-slate-400 line-through'>{formatVND(originalPrice)}</span>
                        )}
                      </div>
                      
                      <span className='inline-block text-[8px] font-extrabold text-purple-600 bg-purple-50 border border-purple-200 px-1 py-0.5 rounded uppercase'>
                        D.Member -1%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
