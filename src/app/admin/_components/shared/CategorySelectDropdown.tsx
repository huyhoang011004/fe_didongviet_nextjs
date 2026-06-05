'use client';

import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/components/ui/dropdown-menu';

// Lấy ID của danh mục cha (hỗ trợ cả dạng string và object)
const getParentId = (c: any) => {
  return c.parentCategory && typeof c.parentCategory === 'object'
    ? c.parentCategory._id
    : c.parentCategory;
};

// Cải tiến hàm trả về cấu trúc cây kèm chỉ số độ sâu (depth)
function getIndentedCategories(categories: any[]): any[] {
  if (!categories || categories.length === 0) return [];

  // Lọc lấy danh mục gốc linh hoạt (chấp nhận cả null hoặc rỗng)
  const roots = categories.filter((c) => !getParentId(c));
  const result: any[] = [];

  const traverse = (parentId: string, depth: number) => {
    const children = categories.filter((c) => {
      const pId = getParentId(c);
      return pId && String(pId) === String(parentId);
    });

    children.forEach((child) => {
      result.push({
        ...child,
        depth, // Lưu lại độ sâu của node con để tính toán padding-left
      });
      traverse(child._id, depth + 1);
    });
  };

  roots.forEach((root) => {
    result.push({ ...root, depth: 0 }); // Danh mục gốc có độ sâu là 0
    traverse(root._id, 1);
  });

  return result;
}

interface CategorySelectDropdownProps {
  categoriesData: any[];
  value: string;
  onChange: (id: string) => void;
  showSpecialOptions?: boolean;
  showNoneOption?: boolean;
  emptyLabel?: string;
  emptyValue?: string;
  size?: 'sm' | 'md';
}

export function CategorySelectDropdown({
  categoriesData,
  value,
  onChange,
  showSpecialOptions = false,
  showNoneOption = false,
  emptyLabel,
  emptyValue,
  size = 'md',
}: CategorySelectDropdownProps) {
  const indentedCategories = useMemo(
    () => getIndentedCategories(categoriesData),
    [categoriesData],
  );

  const selectedCategoryObj = useMemo(
    () => categoriesData.find((c) => c._id === value),
    [categoriesData, value],
  );

  const labelName = useMemo(() => {
    if (value === 'all' || value === '') return emptyLabel || 'Tất cả danh mục';
    if (value === 'root') return showNoneOption ? 'Không có (Danh mục gốc)' : 'Chỉ danh mục gốc';
    return selectedCategoryObj ? selectedCategoryObj.name : 'Chọn danh mục';
  }, [value, selectedCategoryObj, emptyLabel, showNoneOption]);

  const buttonClass =
    size === 'sm'
      ? 'h-10 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 focus:border-red-500 focus:outline-hidden font-bold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center justify-between w-full sm:w-auto shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
      : 'h-11 text-sm md:text-base rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 focus:border-red-500 focus:outline-hidden font-bold text-slate-700 dark:text-slate-200 cursor-pointer flex items-center justify-between w-full shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors';

  const chevronSize = size === 'sm' ? 14 : 16;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className={buttonClass}
        >
          <span className='truncate'>{labelName}</span>
          <ChevronDown size={chevronSize} className='text-slate-400 shrink-0 ml-2' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='max-h-80 overflow-y-auto min-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-55 scrollbar-thin'>
        {emptyLabel && (
          <DropdownMenuItem
            onClick={() => onChange(emptyValue || '')}
            className={`px-4 py-2.5 text-sm font-bold rounded-lg cursor-pointer transition-colors border-none outline-hidden ${
              value === (emptyValue || '')
                ? 'bg-red-50 dark:bg-red-950/30 text-didongviet-red'
                : 'text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-didongviet-red dark:hover:text-didongviet-red'
            }`}
          >
            {emptyLabel}
          </DropdownMenuItem>
        )}

        {showSpecialOptions && (
          <>
            {!emptyLabel && (
              <DropdownMenuItem
                onClick={() => onChange('all')}
                className={`px-4 py-2.5 text-sm font-bold rounded-lg cursor-pointer transition-colors border-none outline-hidden ${
                  value === 'all'
                    ? 'bg-red-50 dark:bg-red-950/30 text-didongviet-red'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-didongviet-red dark:hover:text-didongviet-red'
                }`}
              >
                Tất cả danh mục ngành hàng
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onChange('root')}
              className={`px-4 py-2.5 text-sm font-bold rounded-lg cursor-pointer transition-colors border-none outline-hidden ${
                value === 'root'
                  ? 'bg-red-50 dark:bg-red-950/30 text-didongviet-red'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-didongviet-red dark:hover:text-didongviet-red'
              }`}
            >
              Chỉ danh mục gốc (Không có cha)
            </DropdownMenuItem>
          </>
        )}

        {showNoneOption && (
          <DropdownMenuItem
            onClick={() => onChange('root')}
            className={`px-4 py-2.5 text-sm font-bold rounded-lg cursor-pointer transition-colors border-none outline-hidden ${
              value === 'root'
                ? 'bg-red-50 dark:bg-red-950/30 text-didongviet-red'
                : 'text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-didongviet-red dark:hover:text-didongviet-red'
            }`}
          >
            Không có (Danh mục gốc)
          </DropdownMenuItem>
        )}

        {(emptyLabel || showSpecialOptions || showNoneOption) && (
          <div className='my-1.5 border-t border-slate-100 dark:border-slate-800' />
        )}

        {indentedCategories.map((cat) => {
          const isSelected = value === cat._id;
          const isRoot = !getParentId(cat);

          return (
            <DropdownMenuItem key={cat._id} asChild>
              <button
                type='button'
                onClick={() => onChange(cat._id)}
                style={{ paddingLeft: `${16 + cat.depth * 18}px` }}
                className={`block w-full text-left pr-4 py-2.5 text-sm rounded-lg transition-colors cursor-pointer border-none bg-transparent outline-hidden ${
                  isSelected
                    ? 'bg-red-50 dark:bg-red-950/30 text-didongviet-red font-extrabold'
                    : isRoot
                      ? 'font-bold text-slate-800 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-didongviet-red dark:hover:text-didongviet-red'
                      : 'font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-didongviet-red dark:hover:text-didongviet-red'
                }`}
              >
                <span className='truncate'>{cat.name}</span>
              </button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
