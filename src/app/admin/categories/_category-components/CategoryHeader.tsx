'use client';

import { FolderTree, Plus } from 'lucide-react';

interface CategoryHeaderProps {
  onAddCategory: () => void;
}

export function CategoryHeader({ onAddCategory }: CategoryHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-md'>
          <FolderTree size={20} className='text-white' />
        </div>
        <div>
          <h1 className='text-xl font-black text-slate-800 dark:text-slate-100'>
            Quản lý Danh mục Ngành hàng
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
            Phân chia nhóm hàng điện thoại, tablet, macbook cha-con và thương hiệu liên kết.
          </p>
        </div>
      </div>

      <button
        onClick={onAddCategory}
        className='flex items-center gap-2 bg-gradient-to-r from-didongviet-red to-rose-600 hover:from-rose-600 hover:to-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer border-none'
      >
        <Plus size={16} />
        <span>Thêm Danh mục</span>
      </button>
    </div>
  );
}
