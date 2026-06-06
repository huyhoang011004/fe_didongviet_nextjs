'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// 1. BANNER NGANG DÀI
export function HorizontalBanner() {
  return (
    <div className='w-full rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow relative h-[90px] sm:h-[120px]'>
      <Link href='#'>
        <div
          className='w-full h-full bg-cover bg-center'
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className='absolute inset-0 flex flex-col justify-center px-6 sm:px-10 text-white space-y-1'>
          <span className='text-[8px] sm:text-[9px] font-black text-yellow-300 uppercase tracking-widest block'>
            KHUYẾN MÃI LỚN
          </span>
          <h3 className='text-xs sm:text-base font-extrabold tracking-tight leading-snug'>
            TUẦN LỄ LÊN ĐỜI SMARTPHONE - TRỢ GIÁ ĐẾN 4.000.000Đ
          </h3>
          <p className='text-[8px] sm:text-[10px] text-slate-200 font-medium hidden sm:block'>
            Áp dụng cho chủ thẻ tín dụng và thành viên D.Member khi thu cũ đổi
            mới.
          </p>
        </div>
      </Link>
    </div>
  );
}

// 2. LƯỚI 4 BANNER ĐỨNG ĐẶC QUYỀN
export function GridBanners() {
  const banners = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      title: 'Lên Đời Điện Thoại',
      tagline: 'Trợ giá thu cũ 4,5 Triệu',
      color: 'from-orange-500/20 to-red-600/20',
      textColor: 'text-orange-500',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      title: 'Đặc Quyền D.Member',
      tagline: 'Giảm thêm đến 1,5%',
      color: 'from-purple-500/20 to-indigo-600/20',
      textColor: 'text-purple-600',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
      title: 'Trả Góp 0% Lãi Suất',
      tagline: 'Kỳ hạn đến 12 tháng',
      color: 'from-blue-500/20 to-cyan-600/20',
      textColor: 'text-blue-600',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
      title: 'Giao Nhanh Siêu Tốc',
      tagline: 'Miễn phí giao hàng 1H',
      color: 'from-emerald-500/20 to-teal-600/20',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
      {banners.map((b) => (
        <Link
          key={b.id}
          href='#'
          className='h-[160px] sm:h-[200px] rounded-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow group'
        >
          <div
            className='absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105'
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.15)), url(${b.image})`,
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-tr opacity-40 mix-blend-overlay' />

          <div className='absolute bottom-4 left-4 right-4 text-white space-y-1 relative z-10'>
            <span
              className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white w-fit block mb-1.5 ${b.textColor}`}
            >
              {b.title}
            </span>
            <h4 className='text-xs sm:text-sm font-black leading-tight drop-shadow-sm'>
              {b.tagline}
            </h4>
          </div>
        </Link>
      ))}
    </div>
  );
}

// 3. LOGO ĐỐI TÁC THƯƠNG HIỆU LIÊN KẾT
export function PartnerLogos() {
  const partners = [
    {
      name: 'Apple',
      colorClass:
        'text-slate-900 dark:text-slate-150 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:bg-slate-200',
    },
    {
      name: 'Samsung',
      colorClass:
        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40 hover:bg-blue-100/50',
    },
    {
      name: 'Xiaomi',
      colorClass:
        'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/40 hover:bg-orange-100/50',
    },
    {
      name: 'Oppo',
      colorClass:
        'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/50',
    },
    {
      name: 'Vivo',
      colorClass:
        'text-sky-600 dark:text-sky-450 bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40 hover:bg-sky-100/50',
    },
    {
      name: 'Realme',
      colorClass:
        'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40 hover:bg-purple-100/50',
    },
    {
      name: 'Asus',
      colorClass:
        'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100/50',
    },
    {
      name: 'Anker',
      colorClass:
        'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/40 hover:bg-orange-100/50',
    },
    {
      name: 'JBL',
      colorClass:
        'text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 hover:bg-red-100/50',
    },
  ];

  return (
    <div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-xs'>
      <span className='text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block mb-4'>
        Đối tác thương hiệu chiến lược
      </span>
      <div className='flex flex-wrap items-center justify-center gap-3 md:gap-4'>
        {partners.map((partner, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${partner.colorClass}`}
          >
            <span className='text-[10px] sm:text-xs font-black uppercase tracking-tight'>
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
