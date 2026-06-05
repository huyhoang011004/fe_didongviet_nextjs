import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Blog } from '@/types/blog';

interface DeleteBlogModalProps {
  isOpen: boolean;
  selectedBlog: Blog | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteBlogModal({
  isOpen,
  selectedBlog,
  onClose,
  onConfirm,
}: DeleteBlogModalProps) {
  if (!isOpen || !selectedBlog) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200'>
        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 mb-4 border border-red-200 dark:border-red-900/50'>
          <ShieldAlert size={24} className='animate-pulse' />
        </div>
        <h3 className='font-extrabold text-slate-900 dark:text-white text-base mb-2 text-red-600'>
          Xóa bài viết?
        </h3>
        <p className='text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6'>
          Bạn có chắc chắn muốn xóa vĩnh viễn bài viết{' '}
          <strong>{selectedBlog.title}</strong>? Thao tác này sẽ gỡ bài viết khỏi cơ sở dữ liệu và không thể hoàn tác.
        </p>
        <div className='flex flex-col gap-2 mt-6'>
          <Button
            onClick={onConfirm}
            className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
          >
            Xóa ngay
          </Button>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full rounded-xl border-slate-200 dark:border-slate-700 cursor-pointer py-5 px-4 font-semibold text-slate-500 hover:text-slate-700'
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    </div>
  );
}
