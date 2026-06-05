'use client';

import { GraduationCap } from 'lucide-react';

export function StudentVerificationHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-md'>
          <GraduationCap size={20} className='text-white' />
        </div>
        <div>
          <h1 className='text-xl font-black text-slate-800 dark:text-slate-100'>
            Cổng phê duyệt đặc quyền HSSV
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
            Xét duyệt minh chứng thẻ sinh viên, cấp mã voucher giảm giá đặc quyền cho Học sinh Sinh viên D.Member.
          </p>
        </div>
      </div>
    </div>
  );
}
