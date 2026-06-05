'use client';

import { Button } from '@/shared/components/ui/button';
import { Category } from '@/types/product';
import { CategoryFormFields } from './CategoryFormFields';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  createCategoryPending: boolean;
  categoriesData: Category[];
}

export function CreateCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  createCategoryPending,
  categoriesData,
}: CreateCategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
            Tạo danh mục mới
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className='p-6 space-y-4 overflow-y-auto flex-1 flex flex-col'
        >
          <CategoryFormFields categoriesData={categoriesData} isOpen={isOpen} />

          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end bg-white dark:bg-slate-900 mt-auto'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={createCategoryPending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
            >
              {createCategoryPending ? 'Đang tạo...' : 'Xác nhận'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
