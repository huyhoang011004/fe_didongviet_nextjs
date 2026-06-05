'use client';

import { AlertTriangle, X } from 'lucide-react';

interface DeleteBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  branchName: string;
}

export function DeleteBranchModal({ isOpen, onClose, onConfirm, branchName }: DeleteBranchModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-slate-950/50 backdrop-blur-sm' onClick={onClose} />
      <div className='relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-50 dark:bg-red-950/30 rounded-xl'>
              <AlertTriangle size={18} className='text-red-500' />
            </div>
            <h2 className='text-base font-black text-slate-800 dark:text-slate-100'>Xác nhận xóa</h2>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 cursor-pointer border-none bg-transparent'>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5'>
          <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
            Bạn có chắc chắn muốn xóa chi nhánh{' '}
            <span className='font-bold text-slate-800 dark:text-slate-100'>"{branchName}"</span>?
          </p>
          <p className='text-xs text-red-500 mt-2 font-medium'>
            ⚠ Hành động này không thể hoàn tác. Dữ liệu tồn kho liên quan cũng có thể bị ảnh hưởng.
          </p>
        </div>

        {/* Actions */}
        <div className='flex items-center justify-end gap-3 px-6 pb-5'>
          <button
            onClick={onClose}
            className='px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent'
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className='px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700 rounded-xl transition-all shadow-md cursor-pointer border-none'
          >
            Xóa chi nhánh
          </button>
        </div>
      </div>
    </div>
  );
}
