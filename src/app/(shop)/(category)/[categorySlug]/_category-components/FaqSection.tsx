'use client';

import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqSectionProps {
  faqs: { q: string; a: string }[];
  openFaqIndex: number | null;
  onToggleFaq: (index: number) => void;
}

export default function FaqSection({
  faqs,
  openFaqIndex,
  onToggleFaq,
}: FaqSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 text-slate-800'>
        <HelpCircle size={16} className='text-didongviet-red' />
        <span className='text-xs font-black uppercase tracking-wider'>
          Câu hỏi thường gặp
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
                onClick={() => onToggleFaq(idx)}
                className='w-full px-4 py-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors'
              >
                <span className='text-xs font-bold text-slate-700 leading-snug'>{faq.q}</span>
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
  );
}
