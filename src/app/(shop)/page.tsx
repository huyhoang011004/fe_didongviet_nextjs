'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  RotateCw,
  ShieldCheck,
  Truck,
  UserCheck,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Tablet,
  Laptop,
  Tv,
  Headphones,
  Award,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

// Chuẩn hóa định dạng hiển thị tiền tệ VNĐ
const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ShopHomepage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tradeInProducts, setTradeInProducts] = useState<any[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
      title: 'iPhone 16 Pro Max - Chạm Ngưỡng Siêu Cực',
      subtitle:
        'Trợ giá thu cũ lên đời đến 5.000.000đ. Độc quyền D.Member giảm thêm 1%.',
      link: '#',
      badge: 'HOT DEAL',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      title: 'Tuần Lễ Apple - Rẻ Hơn Các Loại Rẻ',
      subtitle:
        'iPad Pro M4, MacBook Air M3 giảm kịch sàn. Hỗ trợ trả góp 0% lãi suất.',
      link: '#',
      badge: 'APPLE WEEK',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=80',
      title: 'Phụ Kiện Công Nghệ - Mua 1 Tặng 1',
      subtitle:
        'Củ sạc nhanh, cáp sạc, tai nghe bluetooth chính hãng chỉ từ 99K.',
      link: '#',
      badge: 'SALE CHẠM ĐÁY',
    },
  ];

  // Tải dữ liệu từ backend
  useEffect(() => {
    async function loadHomepageData() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

        const [categoriesRes, productsRes, tradeInRes, blogsRes] =
          await Promise.all([
            fetch(`${apiUrl}/categories`).then((r) => (r.ok ? r.json() : null)),
            fetch(`${apiUrl}/products`).then((r) => (r.ok ? r.json() : null)),
            fetch(`${apiUrl}/products/trade-in`).then((r) =>
              r.ok ? r.json() : null,
            ),
            fetch(`${apiUrl}/blogs?limit=3`).then((r) =>
              r.ok ? r.json() : null,
            ),
          ]);

        if (categoriesRes && categoriesRes.success) {
          setCategories(categoriesRes.data || categoriesRes || []);
        }

        if (productsRes && productsRes.success) {
          const prods = productsRes.products || productsRes.data || [];
          setAllProducts(prods);

          // Lọc sản phẩm có giảm giá để làm Flash Sale (salePrice < price trong variants)
          const sales = prods.filter(
            (p: any) =>
              p.variants &&
              p.variants.some((v: any) => v.salePrice && v.salePrice < v.price),
          );
          setFlashSaleProducts(sales.slice(0, 5));
        }

        if (tradeInRes && tradeInRes.success) {
          setTradeInProducts(tradeInRes.data || []);
        } else {
          // Fallback trade-in nếu trống
          const fallbackTrade = allProducts.filter(
            (p: any) => p.tradeInBonus > 0,
          );
          setTradeInProducts(fallbackTrade);
        }

        if (blogsRes && blogsRes.success) {
          setBlogs(blogsRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load shop homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomepageData();
  }, [allProducts.length]);

  // Tự động xoay banner sau 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='min-h-screen bg-slate-50 font-sans'>
      {/* ─── HERO SLIDER & QUICK INFO ─── */}
      <section className='bg-white border-b border-slate-100'>
        <div className='max-w-6xl mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-4 gap-4'>
          {/* BANNER CAROUSEL */}
          <div className='lg:col-span-3 relative h-[220px] sm:h-[280px] md:h-[340px] rounded-2xl overflow-hidden shadow-md border border-slate-100 group'>
            {banners.map((b, idx) => (
              <div
                key={b.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-start p-6 md:p-12 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.15)), url(${b.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className='max-w-md text-white space-y-2.5'>
                  <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-didongviet-red text-white text-[10px] font-black uppercase tracking-wider animate-pulse'>
                    <Sparkles size={10} />
                    <span>{b.badge}</span>
                  </span>

                  <h2 className='text-lg sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight drop-shadow-md'>
                    {b.title}
                  </h2>

                  <p className='text-[11px] sm:text-xs text-gray-200 leading-relaxed font-medium'>
                    {b.subtitle}
                  </p>

                  <div className='pt-1'>
                    <Button
                      asChild
                      className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl py-2.5 px-5 text-xs font-bold cursor-pointer transition-transform hover:scale-105 border-none shadow-sm'
                    >
                      <Link href={b.link} className='flex items-center gap-1'>
                        <span>Khám phá ngay</span>
                        <ArrowRight size={12} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Nav arrows */}
            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) => (prev - 1 + banners.length) % banners.length,
                )
              }
              className='absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % banners.length)
              }
              className='absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <ChevronRight size={16} />
            </button>

            {/* Slide dots */}
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5'>
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full border-none cursor-pointer transition-all ${idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          {/* PROMO SIDEBAR */}
          <div className='lg:col-span-1 flex flex-col gap-3'>
            <div className='flex-1 rounded-2xl border border-dashed border-red-200 bg-red-50/40 p-4 flex flex-col justify-center text-center space-y-2.5 hover:border-red-400 transition-all'>
              <span className='text-[9px] font-black text-didongviet-red tracking-widest uppercase'>
                Đặc quyền D.Member
              </span>
              <h3 className='text-sm font-black text-slate-800 leading-tight'>
                Mở Thẻ Thành Viên
                <br />
                Nhận Vạn Ưu Đãi
              </h3>
              <p className='text-[10px] text-gray-500 leading-relaxed'>
                Giảm thêm đến 1.5% hóa đơn, tích điểm thưởng và nhận quà sinh
                nhật.
              </p>
              <div className='pt-0.5'>
                <Button
                  asChild
                  size='sm'
                  className='bg-slate-900 hover:bg-slate-800 text-white border-none rounded-xl text-[11px] font-bold cursor-pointer shadow-xs h-8 px-4'
                >
                  <Link href='/register'>Đăng ký miễn phí</Link>
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-2.5'>
              <div className='rounded-xl border border-slate-100 bg-white p-3 flex flex-col items-center justify-center text-center hover:shadow-sm transition-shadow'>
                <Truck className='text-didongviet-red mb-1' size={18} />
                <span className='text-[9px] font-black text-slate-800 uppercase'>
                  Giao nhanh 2H
                </span>
                <span className='text-[8px] text-gray-400 mt-0.5'>
                  Nội thành HCM - HN
                </span>
              </div>
              <div className='rounded-xl border border-slate-100 bg-white p-3 flex flex-col items-center justify-center text-center hover:shadow-sm transition-shadow'>
                <ShieldCheck className='text-emerald-500 mb-1' size={18} />
                <span className='text-[9px] font-black text-slate-800 uppercase'>
                  Bảo hành 24T
                </span>
                <span className='text-[8px] text-gray-400 mt-0.5'>
                  Độc quyền DDV
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAM KẾT CHÍNH SÁCH ─── */}
      <section className='max-w-6xl mx-auto px-4 -mt-1 relative z-10'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white rounded-2xl p-4 border border-slate-100 shadow-xs'>
          {[
            {
              icon: Award,
              color: 'text-didongviet-red bg-red-50',
              title: '100% CHÍNH HÃNG',
              desc: 'Cam kết chính hãng toàn cầu',
            },
            {
              icon: RotateCw,
              color: 'text-blue-500 bg-blue-50',
              title: '1 ĐỔI 1 TRONG 30 NGÀY',
              desc: 'Nếu phát sinh lỗi NSX',
            },
            {
              icon: Truck,
              color: 'text-purple-600 bg-purple-50',
              title: 'GIAO HÀNG MIỄN PHÍ',
              desc: 'Free ship toàn quốc',
            },
            {
              icon: UserCheck,
              color: 'text-amber-600 bg-amber-50',
              title: 'CSKH TẬN TÂM',
              desc: 'Hỗ trợ kỹ thuật 24/7',
            },
          ].map((item, idx) => (
            <div key={idx} className='flex items-center gap-2.5 p-2'>
              <div
                className={`h-9 w-9 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}
              >
                <item.icon size={18} />
              </div>
              <div>
                <span className='text-[10px] font-black text-slate-800 uppercase block leading-tight'>
                  {item.title}
                </span>
                <span className='text-[9px] text-gray-400 block'>
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-4 space-y-8 py-8'>
        {/* ─── FLASH SALE ─── */}
        <section>
          <div className='bg-slate-900 rounded-2xl p-5 md:p-6 space-y-4 shadow-lg border border-slate-800 relative overflow-hidden'>
            <div className='absolute top-0 right-0 w-48 h-48 bg-didongviet-red/10 rounded-full blur-3xl pointer-events-none' />

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4 relative z-10'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-lg bg-didongviet-red text-white flex items-center justify-center animate-bounce'>
                  <Zap size={16} className='fill-white' />
                </div>
                <div>
                  <h2 className='text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2'>
                    <span>GIỜ VÀNG GIÁ SỐC</span>
                    <span className='text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded animate-pulse'>
                      HOT
                    </span>
                  </h2>
                  <p className='text-[10px] text-slate-400 mt-0.5 font-medium'>
                    Săn ngay deal tốt giá kịch sàn!
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-1.5 text-[10px] font-bold text-slate-400'>
                <span>Kết thúc sau:</span>
                <div className='flex gap-1 items-center'>
                  {['02', '45', '30'].map((t, i) => (
                    <span key={i} className='flex items-center gap-1'>
                      <span className='px-2 py-1 bg-slate-800 text-white rounded-md border border-slate-700 font-mono text-[10px]'>
                        {t}
                      </span>
                      {i < 2 && <span>:</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-pulse'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='bg-slate-800 h-[240px] rounded-xl' />
                ))}
              </div>
            ) : flashSaleProducts.length === 0 ? (
              <div className='text-center py-10 text-slate-400 border border-dashed border-slate-800 rounded-xl bg-slate-950/20'>
                <ShoppingBag
                  size={36}
                  className='mx-auto text-slate-700 mb-2'
                />
                <p className='text-xs font-semibold'>
                  Deal sốc đang được chuẩn bị. Quay lại sau!
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 relative z-10'>
                {flashSaleProducts.map((p) => {
                  const minPrice = p.priceRange?.min || 0;
                  const activeVariant =
                    p.variants?.find(
                      (v: any) => v.salePrice && v.salePrice < v.price,
                    ) || p.variants?.[0];
                  const originalPrice = activeVariant?.price || minPrice;
                  const salePrice = activeVariant?.salePrice || originalPrice;
                  const percentOff = Math.round(
                    ((originalPrice - salePrice) / originalPrice) * 100,
                  );

                  return (
                    <div
                      key={p._id}
                      className='bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:border-didongviet-red/60 hover:shadow-lg transition-all group relative overflow-hidden'
                    >
                      {percentOff > 0 && (
                        <span className='absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-didongviet-red text-white text-[9px] font-black rounded-md shadow uppercase'>
                          -{percentOff}%
                        </span>
                      )}

                      <div className='space-y-2'>
                        <div className='h-28 w-full rounded-lg bg-slate-900/60 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform'>
                          <img
                            src={p.imageUrl || '/placeholder-product.png'}
                            alt={p.name}
                            className='h-full w-full object-contain'
                          />
                        </div>

                        <div className='space-y-0.5'>
                          <span className='text-[9px] text-slate-500 font-bold block uppercase'>
                            {p.brand || 'DI ĐỘNG VIỆT'}
                          </span>
                          <Link
                            href={`/product/${p.slug || p._id}`}
                            className='font-bold text-white text-[11px] sm:text-xs hover:text-didongviet-red block truncate leading-snug'
                          >
                            {p.name}
                          </Link>

                          <div className='flex items-center gap-1 text-[9px] text-amber-400 font-semibold'>
                            <Star
                              size={9}
                              className='fill-amber-400 text-amber-400'
                            />
                            <span>{p.ratingsAverage || 5}</span>
                            <span className='text-slate-500'>
                              ({p.ratingsCount || 0})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='space-y-1.5 pt-1 border-t border-slate-900'>
                        <div className='flex flex-wrap items-baseline gap-1'>
                          <span className='text-xs sm:text-sm font-black text-didongviet-red'>
                            {formatVND(salePrice)}
                          </span>
                          {percentOff > 0 && (
                            <span className='text-[9px] font-bold text-slate-500 line-through'>
                              {formatVND(originalPrice)}
                            </span>
                          )}
                        </div>

                        <span className='inline-block text-[8px] font-extrabold text-purple-400 bg-purple-950/40 border border-purple-900/50 px-1 py-0.5 rounded uppercase'>
                          D.Member -1%
                        </span>

                        <div className='space-y-0.5'>
                          <div className='h-1 w-full bg-slate-800 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-didongviet-red rounded-full animate-pulse'
                              style={{ width: '70%' }}
                            />
                          </div>
                          <span className='text-[8px] font-bold text-slate-400 block'>
                            Đã bán: 18 máy
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ─── TRADE-IN THU CŨ ĐỔI MỚI ─── */}
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
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 animate-pulse'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='bg-white h-[240px] rounded-xl' />
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
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 relative z-10'>
                {tradeInProducts.map((p) => {
                  const minPrice = p.priceRange?.min || 0;
                  const activeVariant = p.variants?.[0] || {};
                  const originalPrice = activeVariant?.price || minPrice;
                  const salePrice = activeVariant?.salePrice || originalPrice;

                  return (
                    <div
                      key={p._id}
                      className='bg-white border border-blue-100 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden'
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
                          />
                        </div>

                        <div className='space-y-0.5'>
                          <span className='text-[9px] text-slate-400 font-bold block uppercase'>
                            {p.brand || 'DI ĐỘNG VIỆT'}
                          </span>
                          <Link
                            href={`/product/${p.slug || p._id}`}
                            className='font-bold text-slate-800 text-[11px] sm:text-xs hover:text-blue-600 block truncate leading-snug'
                          >
                            {p.name}
                          </Link>

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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ─── DANH MỤC NỔI BẬT ─── */}
        <section className='space-y-4'>
          <div className='text-center space-y-0.5'>
            <h2 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight'>
              DANH MỤC NỔI BẬT
            </h2>
            <p className='text-[10px] text-gray-400 font-medium'>
              Tìm kiếm nhanh sản phẩm theo ngành hàng
            </p>
          </div>

          <div className='grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3'>
            {categories.slice(0, 8).map((cat, idx) => {
              const icons = [
                Smartphone,
                Tablet,
                Laptop,
                Tv,
                Headphones,
                Award,
                Zap,
                RotateCw,
              ];
              const IconComponent = icons[idx % icons.length];
              return (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className='bg-white border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-2 hover:border-didongviet-red hover:shadow-sm transition-all group'
                >
                  <div className='h-10 w-10 rounded-lg bg-red-50 text-didongviet-red flex items-center justify-center group-hover:scale-110 transition-transform'>
                    <IconComponent size={20} />
                  </div>
                  <span className='text-[10px] font-bold text-slate-700 group-hover:text-didongviet-red line-clamp-1'>
                    {cat.name}
                  </span>
                </Link>
              );
            })}
            {categories.length === 0 &&
              [
                { name: 'Điện thoại', slug: 'dien-thoai', icon: Smartphone },
                { name: 'Tablet / iPad', slug: 'tablet', icon: Tablet },
                { name: 'Laptop / Mac', slug: 'laptop', icon: Laptop },
                { name: 'Phụ kiện', slug: 'phu-kien', icon: Headphones },
                {
                  name: 'Máy cũ giá rẻ',
                  slug: 'dien-thoai-cu',
                  icon: RotateCw,
                },
                { name: 'Voucher xịn', slug: 'voucher', icon: Zap },
              ].map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/category/${cat.slug}`}
                  className='bg-white border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center space-y-2 hover:border-didongviet-red hover:shadow-sm transition-all group'
                >
                  <div className='h-10 w-10 rounded-lg bg-red-50 text-didongviet-red flex items-center justify-center group-hover:scale-110 transition-transform'>
                    <cat.icon size={20} />
                  </div>
                  <span className='text-[10px] font-bold text-slate-700 group-hover:text-didongviet-red truncate'>
                    {cat.name}
                  </span>
                </Link>
              ))}
          </div>
        </section>

        {/* ─── SẢN PHẨM KHUYẾN NGHỊ ─── */}
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
              <Link href='/products' className='flex items-center gap-1'>
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
                  <div
                    key={p._id}
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
                        />
                      </div>

                      <div className='space-y-0.5'>
                        <span className='text-[9px] text-slate-400 font-bold block uppercase'>
                          {p.brand || 'DI ĐỘNG VIỆT'}
                        </span>
                        <Link
                          href={`/product/${p.slug || p._id}`}
                          className='font-bold text-slate-800 text-[11px] sm:text-xs hover:text-didongviet-red block truncate leading-snug'
                        >
                          {p.name}
                        </Link>

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
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── TIN TỨC CÔNG NGHỆ ─── */}
        <section className='space-y-4'>
          <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
            <div className='flex items-center gap-2'>
              <div className='h-1 w-3.5 bg-purple-600 rounded-full' />
              <h2 className='text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight'>
                TIN TỨC CÔNG NGHỆ
              </h2>
            </div>

            <Button
              asChild
              variant='ghost'
              size='sm'
              className='text-[10px] text-purple-600 font-bold hover:bg-purple-50 rounded-xl cursor-pointer h-7'
            >
              <Link href='/blogs' className='flex items-center gap-1'>
                <span>Xem tất cả</span>
                <ArrowRight size={11} />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse'>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white h-[200px] rounded-xl border border-slate-100'
                />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className='text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white'>
              <Calendar size={36} className='mx-auto text-gray-300 mb-2' />
              <p className='text-xs font-semibold'>
                Chưa có tin công nghệ nào. Quay lại sau!
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {blogs.map((b) => (
                <div
                  key={b._id}
                  className='bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between'
                >
                  <div className='space-y-3'>
                    <div className='h-40 w-full bg-slate-100 overflow-hidden relative'>
                      <img
                        src={b.featuredImage || '/placeholder-blog.png'}
                        alt={b.title}
                        className='h-full w-full object-cover group-hover:scale-105 transition-transform'
                      />
                      <span className='absolute top-2 left-2 z-10 px-2 py-0.5 bg-purple-600 text-white text-[9px] font-black rounded-md shadow uppercase'>
                        {b.category || 'TIN MỚI'}
                      </span>
                    </div>

                    <div className='px-4 space-y-1.5'>
                      <span className='text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1'>
                        <Calendar size={9} />
                        <span>
                          {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </span>
                      <Link
                        href={`/blog/${b.slug || b._id}`}
                        className='font-black text-slate-800 text-xs sm:text-sm hover:text-purple-600 block line-clamp-2 leading-snug'
                      >
                        {b.title}
                      </Link>
                      <p className='text-[10px] text-gray-500 leading-relaxed font-medium line-clamp-2'>
                        {b.summary}
                      </p>
                    </div>
                  </div>

                  <div className='px-4 pb-4 pt-2'>
                    <Link
                      href={`/blog/${b.slug || b._id}`}
                      className='inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:text-purple-700 hover:underline'
                    >
                      <span>Đọc bài viết</span>
                      <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
