import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Category } from '@/types/product';

interface EditCategoryModalProps {
  isOpen: boolean;
  selectedCategory: Category | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editCategoryPending: boolean;
  categoriesData: Category[];
}

export function EditCategoryModal({
  isOpen,
  selectedCategory,
  onClose,
  onSubmit,
  editCategoryPending,
  categoriesData,
}: EditCategoryModalProps) {
  if (!isOpen || !selectedCategory) return null;

  // Lấy danh sách ID danh mục con trực thuộc của danh mục đang chỉnh sửa (tránh vòng lặp vô hạn)
  const getSubCategoryIds = (catId: string): string[] => {
    const ids: string[] = [];
    const findChildren = (parentId: string) => {
      const children = categoriesData.filter((c) => {
        const pId =
          c.parentCategory && typeof c.parentCategory === 'object'
            ? (c.parentCategory as any)._id
            : c.parentCategory;
        return pId === parentId;
      });
      
      children.forEach((child) => {
        ids.push(child._id);
        findChildren(child._id);
      });
    };
    findChildren(catId);
    return ids;
  };

  const forbiddenParentIds = [selectedCategory._id, ...getSubCategoryIds(selectedCategory._id)];

  // Hàm đệ quy tạo options cho danh mục cha dạng cây thụt đầu dòng
  const renderTreeOptions = (
    categories: Category[],
    parentId: string | null = null,
    level = 0
  ): React.ReactNode[] => {
    const levelIndicator = level > 0 ? '\u00A0\u00A0'.repeat(level) + '└─ ' : '';
    
    const filtered = categories.filter((c) => {
      const pId =
        c.parentCategory && typeof c.parentCategory === 'object'
          ? (c.parentCategory as any)._id
          : c.parentCategory;
      return parentId === null ? !pId : pId === parentId;
    });

    return filtered.reduce<React.ReactNode[]>((acc, c) => {
      // Bỏ qua chính nó và các con của nó làm danh mục cha để tránh lỗi vòng lặp
      if (!forbiddenParentIds.includes(c._id)) {
        acc.push(
          <option key={c._id} value={c._id}>
            {levelIndicator}{c.name}
          </option>
        );
      }
      const children = renderTreeOptions(categories, c._id, level + 1);
      acc.push(...children);
      return acc;
    }, []);
  };

  const parentId =
    selectedCategory.parentCategory && typeof selectedCategory.parentCategory === 'object'
      ? (selectedCategory.parentCategory as any)._id
      : selectedCategory.parentCategory;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
            Sửa danh mục
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
          className='p-6 space-y-4 overflow-y-auto flex-1'
        >
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Tên Danh Mục
            </label>
            <Input
              name='name'
              defaultValue={selectedCategory.name}
              required
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Mô tả ngành hàng
            </label>
            <Input
              name='description'
              defaultValue={selectedCategory.description || ''}
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Danh mục cha
            </label>
            <select
              name='parentCategory'
              defaultValue={parentId || ''}
              className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none font-semibold text-slate-700 dark:text-slate-200'
            >
              <option value=''>Không có (Là Danh mục gốc)</option>
              {renderTreeOptions(categoriesData)}
            </select>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Thương hiệu (Ngăn cách bằng dấu phẩy)
            </label>
            <Input
              name='brands'
              defaultValue={
                selectedCategory.brands ? selectedCategory.brands.join(', ') : ''
              }
              placeholder='Ví dụ: Apple, Samsung'
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Thứ tự hiển thị
              </label>
              <Input
                name='displayOrder'
                type='number'
                defaultValue={selectedCategory.displayOrder || '0'}
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Kích hoạt ngay
              </label>
              <select
                name='isActive'
                defaultValue={selectedCategory.isActive !== false ? 'true' : 'false'}
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none font-semibold text-slate-700 dark:text-slate-200'
              >
                <option value='true'>Hiển thị trên Menu</option>
                <option value='false'>Ẩn tạm thời</option>
              </select>
            </div>
          </div>

          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
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
              disabled={editCategoryPending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
            >
              {editCategoryPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
