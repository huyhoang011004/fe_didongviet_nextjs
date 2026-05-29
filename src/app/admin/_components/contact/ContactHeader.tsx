import React from 'react';

export function ContactHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white'>
          Kênh tiếp nhận hỗ trợ CSKH
        </h1>
        <p className='text-sm text-slate-400 mt-1'>
          Hỗ trợ khách hàng gửi yêu cầu tư vấn, thu cũ đổi mới, kỹ thuật, khiếu nại dịch vụ.
        </p>
      </div>
    </div>
  );
}
