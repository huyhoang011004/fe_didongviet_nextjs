'use client';

import { Search, Tag } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Category } from '@/types/product';
import { CategorySelectDropdown } from '@/app/admin/_components/shared/CategorySelectDropdown';

interface CategoryFiltersProps {
  categoriesData: Category[];
  parentFilter: string;
  setParentFilter: (filter: string) => void;
  categorySearch: string;
  setCategorySearch: (search: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function CategoryFilters({
  categoriesData,
  parentFilter,
  setParentFilter,
  categorySearch,
  setCategorySearch,
  filteredCount,
  totalCount,
}: CategoryFiltersProps) {
  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
      {/* Gọi Component Dùng Chung */}
      <div className='flex items-center gap-1.5 flex-shrink-0 w-full md:w-auto'>
        <Tag size={16} className='text-slate-400' />
        <div className='w-full md:w-72'>
          <CategorySelectDropdown
            categoriesData={categoriesData}
            value={parentFilter}
            onChange={setParentFilter}
            showSpecialOptions={true} // Bật các lựa chọn đặc biệt cho Admin Filter
            emptyLabel='Tất cả danh mục ngành hàng'
            emptyValue='all'
            size='sm'
          />
        </div>
      </div>

      {/* Thanh tìm kiếm bên phải */}
      <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
        <div className='relative w-full md:w-64'>
          <Search
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            placeholder='Tìm kiếm danh mục...'
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
          />
        </div>
        <span className='text-xs text-slate-400 font-semibold whitespace-nowrap hidden sm:inline'>
          Đang hiển thị: {filteredCount} / {totalCount} danh mục
        </span>
      </div>
    </div>
  );
}

// === BỔ SUNG HÀM NÀY VÀO CUỐI FILE CATEGORYFILTERS.TSX ===
export function buildCategoryTree(categories: Category[]): any[] {
  if (!categories || categories.length === 0) return [];

  // Tạo map để tra cứu nhanh danh mục theo ID
  const map: { [key: string]: any } = {};
  categories.forEach((cat) => {
    map[cat._id] = { ...cat, children: [] };
  });

  const tree: any[] = [];

  categories.forEach((cat) => {
    const mappedCat = map[cat._id];

    // Đọc parentId linh hoạt (hỗ trợ cả dạng chuỗi ID lẫn dạng object định nghĩa từ MongoDB)
    const parentId =
      cat.parentCategory && typeof cat.parentCategory === 'object'
        ? (cat.parentCategory as any)._id
        : cat.parentCategory;

    if (parentId && map[parentId]) {
      // Nếu có danh mục cha nằm trong danh sách, đẩy vào mảng children của cha
      map[parentId].children.push(mappedCat);
    } else {
      // Nếu không có danh mục cha hoặc cha không nằm trong list, coi như danh mục gốc (root)
      tree.push(mappedCat);
    }
  });

  // Sắp xếp thứ tự hiển thị (displayOrder) nếu có
  const sortTree = (nodes: any[]) => {
    nodes.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children);
      }
    });
  };

  sortTree(tree);
  return tree;
}
