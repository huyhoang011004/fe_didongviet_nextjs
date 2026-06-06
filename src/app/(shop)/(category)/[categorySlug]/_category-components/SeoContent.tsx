'use client';

import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface SeoContentProps {
  currentSeo: {
    seoTitle: string;
    toc: string[];
    content: string;
  };
  showFullSeo: boolean;
  onToggleSeo: () => void;
}

export default function SeoContent({
  currentSeo,
  showFullSeo,
  onToggleSeo,
}: SeoContentProps) {
  return (
    <div className='space-y-6'>
      {/* KHỐI NỘI DUNG CHÍNH (TOC) */}
      <div className='bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-3.5'>
        <div className='flex items-center gap-2 text-slate-800'>
          <FileText size={16} className='text-didongviet-red' />
          <span className='text-xs font-black uppercase tracking-wider'>
            Nội dung chính
          </span>
        </div>
        <ol className='space-y-2 text-xs font-semibold text-slate-600 list-decimal pl-4.5'>
          {currentSeo.toc.map((item, idx) => (
            <li key={idx} className='hover:text-didongviet-red transition-colors'>
              <a href={`#seo-section-${idx}`}>{item}</a>
            </li>
          ))}
        </ol>
        <div className='pt-1.5'>
          <a
            href='#seo-container'
            className='text-[11px] font-extrabold text-didongviet-red hover:underline flex items-center gap-1'
          >
            <span>Xem tất cả nội dung</span>
            <ChevronDown size={12} />
          </a>
        </div>
      </div>

      {/* BÀI VIẾT SEO GIỚI THIỆU SẢN PHẨM */}
      <div id='seo-container' className='bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 relative'>
        <div
          className={`prose prose-sm prose-slate max-w-none text-xs font-medium leading-relaxed text-slate-600 space-y-3
            ${!showFullSeo ? 'max-h-[200px] overflow-hidden relative' : ''}
          `}
        >
          <div dangerouslySetInnerHTML={{ __html: currentSeo.content }} />
          {!showFullSeo && (
            <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none' />
          )}
        </div>

        <div className='flex justify-center pt-2 relative z-10 border-t border-slate-100/50 mt-4'>
          <button
            onClick={onToggleSeo}
            className='text-xs font-extrabold text-didongviet-red hover:underline cursor-pointer flex items-center gap-1 h-8 px-4 bg-white rounded-lg shadow-sm border border-slate-200/60'
          >
            {showFullSeo ? (
              <>
                <span>Thu gọn</span>
                <ChevronUp size={13} />
              </>
            ) : (
              <>
                <span>Xem thêm</span>
                <ChevronDown size={13} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
