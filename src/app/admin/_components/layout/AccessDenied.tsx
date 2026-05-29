'use client';

import { ShieldAlert, RefreshCw } from 'lucide-react';

interface AccessDeniedProps {
  countdown: number;
}

export function AccessDenied({ countdown }: AccessDeniedProps) {
  return (
    <div className='flex items-center justify-center min-h-screen bg-slate-900 p-6 text-white'>
      <div className='max-w-md w-full bg-slate-800/80 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-300'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-6 border border-red-500/20'>
          <ShieldAlert size={36} className='animate-bounce' />
        </div>
        <h1 className='text-2xl font-bold text-red-500 mb-2'>Quyền truy cập bị từ chối</h1>
        <p className='text-sm text-slate-300 leading-relaxed mb-6'>
          Tài khoản của bạn không có đặc quyền truy cập khu vực Quản trị hệ thống. Khu vực này chỉ dành cho Ban quản trị Di Động Việt.
        </p>
        <div className='py-3 px-4 bg-slate-900/50 rounded-xl border border-slate-700/50 inline-flex items-center gap-2 text-xs text-slate-400'>
          <RefreshCw size={14} className='animate-spin text-didongviet-red' />
          <span>Tự động quay lại trang chủ sau <strong className='text-white text-sm font-bold'>{countdown}s</strong></span>
        </div>
      </div>
    </div>
  );
}
