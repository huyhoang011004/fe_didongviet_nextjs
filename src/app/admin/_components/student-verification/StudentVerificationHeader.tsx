import React from 'react';

export function StudentVerificationHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white'>
          Cổng phê duyệt đặc quyền HSSV
        </h1>
        <p className='text-sm text-slate-400 mt-1'>
          Xét duyệt minh chứng thẻ sinh viên, cấp mã voucher giảm giá đặc quyền cho Học sinh Sinh viên D.Member.
        </p>
      </div>
    </div>
  );
}
