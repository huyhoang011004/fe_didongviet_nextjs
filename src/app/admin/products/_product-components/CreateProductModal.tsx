'use client';

import { Button } from '@/shared/components/ui/button';
import { ProductFormFields } from './ProductFormFields';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  categories: any[];
  branches: any[];
  variants: any[];
  setVariants: React.Dispatch<React.SetStateAction<any[]>>;
  pending: boolean;
}

export function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  branches,
  variants,
  setVariants,
  pending,
}: CreateProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]'>
        <div className='p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 text-base'>
            Thêm sản phẩm mới
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className='p-6 space-y-5 overflow-y-auto flex-1 text-sm'
          encType='multipart/form-data'
        >
          {/* Tái sử dụng form fields */}
          <ProductFormFields
            categories={categories}
            branches={branches}
            variants={variants}
            setVariants={setVariants}
            isEditMode={false}
          />

          <div className='pt-4 border-t border-slate-100 flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl py-5 px-4 font-semibold text-xs'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={pending}
              className='bg-didongviet-red text-white rounded-xl py-5 px-4 font-semibold text-xs shadow-md'
            >
              {pending ? 'Đang thêm...' : 'Thêm sản phẩm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
