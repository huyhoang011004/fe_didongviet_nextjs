'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ProductHeaderProps {
  onAddClick: () => void;
}

export function ProductHeader({ onAddClick }: ProductHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white'>
          Quản lý Kho sản phẩm
        </h1>
        <p className='text-sm text-slate-400 mt-1'>
          Quản lý trạng thái ẩn hiển thị, cấu hình tồn kho chi nhánh và các ảnh đa dạng.
        </p>
      </div>

      <Button
        onClick={onAddClick}
        className='bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-2 rounded-xl py-5 px-4 font-semibold shadow-md border-none cursor-pointer'
      >
        <Plus size={16} />
        <span>Thêm sản phẩm</span>
      </Button>
    </div>
  );
}
