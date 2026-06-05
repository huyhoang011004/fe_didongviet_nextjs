'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

export function DeleteOrderModal({ isOpen, onClose, onConfirm, orderId }: DeleteOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-red-50 dark:bg-red-950/30 rounded-xl'>
              <AlertTriangle size={18} className='text-red-500' />
            </div>
            <h3 className='font-black text-slate-800 dark:text-slate-100 text-base'>Xóa vĩnh viễn đơn hàng?</h3>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 cursor-pointer border-none bg-transparent'>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className='px-6 py-5'>
          <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
            Hành động này sẽ gỡ bỏ vĩnh viễn đơn hàng{' '}
            <span className='font-bold font-mono text-slate-800 dark:text-slate-100 text-xs'>{orderId}</span>{' '}
            khỏi hệ thống kế toán.
          </p>
          <p className='text-xs text-red-500 mt-2 font-medium'>
            ⚠ Hành động này không thể hoàn tác.
          </p>
        </div>

        {/* Actions */}
        <div className='flex items-center justify-end gap-3 px-6 pb-5'>
          <Button
            variant='outline'
            onClick={onClose}
            className='rounded-xl border-slate-200 cursor-pointer py-5 px-5 font-semibold text-sm'
          >
            Hủy bỏ
          </Button>
          <button
            onClick={onConfirm}
            className='px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700 rounded-xl transition-all shadow-md cursor-pointer border-none'
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </div>
  );
}
