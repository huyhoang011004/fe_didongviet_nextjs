'use client';

import { Search, Layers } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filteredCount: number;
  totalCount: number;
  categories: any[];
  selectedCategorySlug: string;
  onCategorySelect: (slug: string) => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
  categories,
  selectedCategorySlug,
  onCategorySelect,
}: ProductFiltersProps) {
  // Lấy các danh mục cha chính để hiển thị làm thanh Navigation
  const rootCategories = categories.filter(
    (c) => !c.parentCategory || c.parentCategory === null,
  );

  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        {/* Thanh Navigation Lọc nhanh theo Danh mục cha trượt ngang */}
        <div className='flex items-center gap-2 flex-1 min-w-0'>
          {/* <span className='text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0'>
            <Layers size={12} className='text-didongviet-red' />
            <span>Danh mục:</span>
          </span> */}

          <div className='flex gap-1.5 overflow-x-auto whitespace-nowrap pb-1 pr-4 no-scrollbar scroll-smooth flex-1'>
            {/* Nút lọc Tất cả */}
            <button
              onClick={() => onCategorySelect('')}
              className={`
                px-4 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex-shrink-0
                ${selectedCategorySlug === '' ? 'bg-didongviet-red text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-350'}
              `}
            >
              Tất cả sản phẩm
            </button>

            {/* Các danh mục cha chính */}
            {rootCategories.map((c) => (
              <button
                key={c._id}
                onClick={() => onCategorySelect(c.slug || '')}
                className={`
                  px-4 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex-shrink-0
                  ${selectedCategorySlug === c.slug ? 'bg-didongviet-red text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-350'}
                `}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ô Tìm kiếm sản phẩm */}
        <div className='relative w-full md:w-72 flex-shrink-0'>
          <Search
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            placeholder='Tìm sản phẩm...'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
          />
        </div>
      </div>
    </div>
  );
}
