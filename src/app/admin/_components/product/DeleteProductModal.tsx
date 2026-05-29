'use client';

import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: DeleteProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
          <ShieldAlert size={24} />
        </div>
        <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>
          Xóa vĩnh viễn sản phẩm?
        </h3>
        <p className='text-xs text-slate-500 leading-relaxed mb-6'>
          Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm{' '}
          <strong>{productName}</strong> khỏi kho hàng của Di Động Việt? Thao tác này sẽ gỡ bỏ máy và tất cả các ảnh biến thể liên quan.
        </p>
        <div className='flex flex-col gap-2'>
          <Button
            onClick={onConfirm}
            className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
          >
            Xóa bỏ
          </Button>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-slate-500'
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    </div>
  );
}
