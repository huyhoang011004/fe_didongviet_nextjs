'use client';

import { Search, MapPin, Tag, ChevronDown } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { CategorySelectDropdown } from '@/app/admin/_components/shared/CategorySelectDropdown';

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  filteredCount: number;
  totalCount: number;
  categories: any[];
  selectedCategoryFilter: string;
  onCategorySelect: (id: string) => void;
  branches: any[];
  selectedBranchFilter: string;
  onBranchSelect: (id: string) => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
  categories,
  selectedCategoryFilter,
  onCategorySelect,
  branches,
  selectedBranchFilter,
  onBranchSelect,
}: ProductFiltersProps) {
  const selectedBranch = branches.find((b) => b._id === selectedBranchFilter);
  const selectedBranchName = selectedBranch ? selectedBranch.name : 'Tất cả chi nhánh';

  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3'>
      {/* Dropdown lọc theo Danh mục (có cây con) */}
      <div className='flex items-center gap-1.5 flex-shrink-0 w-full sm:w-auto'>
        <Tag size={16} className='text-slate-400' />
        <CategorySelectDropdown
          categoriesData={categories}
          value={selectedCategoryFilter}
          onChange={onCategorySelect}
          showSpecialOptions={false}
          emptyLabel="Tất cả danh mục"
          emptyValue=""
          size="sm"
        />
      </div>

      {/* Ô tìm kiếm - chiếm không gian còn lại */}
      <div className='relative flex-1 min-w-[200px]'>
        <Search
          className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          size={16}
        />
        <Input
          type='text'
          placeholder='Tìm sản phẩm hoặc mã SKU...'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10 pr-4 py-5 rounded-xl border-slate-200 dark:border-slate-855 w-full text-sm'
        />
      </div>

      {/* Dropdown lọc theo Chi nhánh */}
      <div className='flex items-center gap-1.5 flex-shrink-0'>
        <MapPin size={16} className='text-slate-400' />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='h-10 text-xs md:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 focus:border-red-500 focus:outline-hidden font-bold text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800'
            >
              <span>{selectedBranchName}</span>
              <ChevronDown size={14} className='text-slate-400' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='max-h-60 overflow-y-auto min-w-[200px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-55'>
            <DropdownMenuItem
              onClick={() => onBranchSelect('')}
              className='px-3.5 py-2.5 text-xs md:text-sm font-bold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer hover:text-didongviet-red dark:hover:text-didongviet-red border-none outline-none'
            >
              Tất cả chi nhánh
            </DropdownMenuItem>
            {branches.map((b) => (
              <DropdownMenuItem
                key={b._id}
                onClick={() => onBranchSelect(b._id)}
                className='px-3.5 py-2.5 text-xs md:text-sm font-bold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer hover:text-didongviet-red dark:hover:text-didongviet-red border-none outline-none'
              >
                {b.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
