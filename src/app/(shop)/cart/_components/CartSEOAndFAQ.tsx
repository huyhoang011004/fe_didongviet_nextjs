'use client';

import React, { useState } from 'react';
import { FileText, HelpCircle, ShieldCheck, Truck, RotateCw, ChevronDown, ChevronUp } from 'lucide-react';

interface CartSEOAndFAQProps {
  seoContent: {
    seoTitle: string;
    toc: string[];
    content: string;
  };
  faqs: Array<{ q: string; a: string }>;
}

export default function CartSEOAndFAQ({ seoContent, faqs }: CartSEOAndFAQProps) {
  const [showFullSeo, setShowFullSeo] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-6">
      {/* ─── PHẦN 3: KHỐI NỘI DUNG SEO BỔ TRỢ ─── */}
      <div className='space-y-6 pt-4'>
        {/* Mục lục TOC */}
        <div className='bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-3.5'>
          <div className='flex items-center gap-2 text-slate-800'>
            <FileText size={16} className='text-didongviet-red' />
            <span className='text-xs font-black uppercase tracking-wider'>
              Nội dung hướng dẫn mua sắm
            </span>
          </div>
          <ol className='space-y-2 text-xs font-semibold text-slate-600 list-decimal pl-4.5'>
            {seoContent.toc.map((item, idx) => (
              <li
                key={idx}
                className='hover:text-didongviet-red transition-colors'
              >
                <a href={`#seo-section-${idx}`}>{item}</a>
              </li>
            ))}
          </ol>
          <div className='pt-1.5'>
            <a
              href='#seo-container'
              className='text-[11px] font-extrabold text-didongviet-red hover:underline flex items-center gap-1'
            >
              <span>Xem đầy đủ bài viết hướng dẫn</span>
              <ChevronDown size={12} />
            </a>
          </div>
        </div>

        {/* Chi tiết nội dung giới thiệu */}
        <div
          id='seo-container'
          className='bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 relative'
        >
          <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
            {seoContent.seoTitle}
          </h2>
          <div
            className={`prose prose-sm prose-slate max-w-none text-xs font-medium leading-relaxed text-slate-600 space-y-3
              ${!showFullSeo ? 'max-h-[160px] overflow-hidden relative' : ''}
            `}
          >
            <div dangerouslySetInnerHTML={{ __html: seoContent.content }} />
            {!showFullSeo && (
              <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none' />
            )}
          </div>

          <div className='flex justify-center pt-2 relative z-10 border-t border-slate-100/50 mt-4'>
            <button
              onClick={() => setShowFullSeo(!showFullSeo)}
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

      {/* ─── PHẦN 4: KHỐI CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) ─── */}
      <div className='space-y-4 pt-4'>
        <div className='flex items-center gap-2 text-slate-800'>
          <HelpCircle size={16} className='text-didongviet-red' />
          <span className='text-xs font-black uppercase tracking-wider'>
            Câu hỏi thường gặp về giỏ hàng & thanh toán
          </span>
        </div>

        <div className='space-y-2.5'>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className='bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs transition-all'
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className='w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors border-none bg-transparent'
                >
                  <span className='text-xs font-bold text-slate-700 leading-snug'>
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={14} className='text-slate-400' />
                  ) : (
                    <ChevronDown size={14} className='text-slate-400' />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden
                    ${isOpen ? 'max-h-[200px] border-t border-slate-100/50' : 'max-h-0'}
                  `}
                >
                  <p className='p-4 text-xs text-slate-500 font-medium leading-relaxed bg-slate-50/30'>
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Badges */}
      <div className='pt-6'>
        <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-5 grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[
            {
              icon: ShieldCheck,
              color: 'text-emerald-600',
              label: '100% chính hãng, cam kết hoàn tiền',
            },
            {
              icon: Truck,
              color: 'text-blue-500',
              label: 'Giao hàng miễn phí toàn quốc',
            },
            {
              icon: RotateCw,
              color: 'text-purple-600',
              label: '1 đổi 1 trong 30 ngày nếu lỗi NSX',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className='flex items-center gap-3 text-xs text-slate-600 font-semibold p-2.5 rounded-xl border border-slate-50 bg-slate-50/20'
            >
              <item.icon size={18} className={`${item.color} flex-shrink-0`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
