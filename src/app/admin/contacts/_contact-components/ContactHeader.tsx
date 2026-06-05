'use client';

import { Headphones } from 'lucide-react';

export function ContactHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='p-2.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-md'>
          <Headphones size={20} className='text-white' />
        </div>
        <div>
          <h1 className='text-xl font-black text-slate-800 dark:text-slate-100'>
            Kênh tiếp nhận hỗ trợ CSKH
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
            Hỗ trợ khách hàng gửi yêu cầu tư vấn, thu cũ đổi mới, kỹ thuật, khiếu nại dịch vụ.
          </p>
        </div>
      </div>
    </div>
  );
}
