'use client';

import { ClipboardList } from 'lucide-react';

export function OrderHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md'>
          <ClipboardList size={20} className='text-white' />
        </div>
        <div>
          <h1 className='text-xl font-black text-slate-800 dark:text-slate-100'>
            Quản lý Đơn hàng
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
            Kiểm soát hóa đơn giao dịch và cập nhật trạng thái vận chuyển
          </p>
        </div>
      </div>
    </div>
  );
}
