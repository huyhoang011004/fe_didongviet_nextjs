'use client';

export function AdminLoading() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900'>
      <div className='relative flex items-center justify-center'>
        <div className='h-16 w-16 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
        <div className='absolute text-[10px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
          DĐV
        </div>
      </div>
      <p className='mt-4 text-sm font-medium text-slate-500 animate-pulse'>
        Đang xác thực thông tin quản trị...
      </p>
    </div>
  );
}
