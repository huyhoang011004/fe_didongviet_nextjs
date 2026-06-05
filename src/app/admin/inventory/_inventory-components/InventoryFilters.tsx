'use client';

import {
  Search,
  MapPin,
  SlidersHorizontal,
  Tag,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { CategorySelectDropdown } from '@/app/admin/_components/shared/CategorySelectDropdown';

interface InventoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedBranchFilter: string;
  setSelectedBranchFilter: (val: string) => void;
  branches: any[];
  thresholdFilter: number | undefined;
  setThresholdFilter: (val: number | undefined) => void;
  currentThreshold: number;

  // Bộ lọc nâng cao mới bổ sung
  stockFilterType: 'all' | 'low-stock' | 'out-of-stock';
  setStockFilterType: (val: 'all' | 'low-stock' | 'out-of-stock') => void;
  categories: any[];
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (val: string) => void;
}

export default function InventoryFilters({
  searchQuery,
  setSearchQuery,
  selectedBranchFilter,
  setSelectedBranchFilter,
  branches,
  thresholdFilter,
  setThresholdFilter,
  currentThreshold,
  stockFilterType,
  setStockFilterType,
  categories,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
}: InventoryFiltersProps) {
  // Lấy tên chi nhánh đang chọn để hiển thị trên nút Trigger
  const selectedBranch = branches.find((b) => b._id === selectedBranchFilter);
  const selectedBranchName = selectedBranch
    ? selectedBranch.name
    : 'Tất cả chi nhánh';

  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3'>
      {/* Tab chọn loại tồn kho */}
      <div className='flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0'>
        <button
          onClick={() => setStockFilterType('all')}
          className={`
            px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex-shrink-0
            ${stockFilterType === 'all' ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200'}
          `}
        >
          Tất cả
        </button>
        <button
          onClick={() => setStockFilterType('low-stock')}
          className={`
            px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex-shrink-0
            ${stockFilterType === 'low-stock' ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-855 dark:hover:text-slate-200'}
          `}
        >
          Sắp hết hàng
        </button>
        <button
          onClick={() => setStockFilterType('out-of-stock')}
          className={`
            px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex-shrink-0
            ${stockFilterType === 'out-of-stock' ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-855 dark:hover:text-slate-200'}
          `}
        >
          Đã hết hàng
        </button>
      </div>

      {/* Lọc theo Danh mục - nằm trước ô tìm kiếm */}
      <div className='flex items-center gap-1.5 flex-shrink-0 w-full sm:w-auto'>
        <Tag size={16} className='text-slate-400' />
        <CategorySelectDropdown
          categoriesData={categories}
          value={selectedCategoryFilter}
          onChange={setSelectedCategoryFilter}
          showSpecialOptions={false}
          emptyLabel="Tất cả danh mục"
          emptyValue=""
          size="sm"
        />
      </div>

      {/* Ô Tìm kiếm - nằm sau danh mục, chiếm không gian còn lại */}
      <div className='relative flex-1 min-w-[200px]'>
        <Search
          className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          size={16}
        />
        <Input
          type='text'
          placeholder='Tìm sản phẩm hoặc mã SKU...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-10 pr-4 py-5 rounded-xl border-slate-200 dark:border-slate-855 w-full text-sm'
        />
      </div>

      {/* Lọc theo Chi nhánh */}
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
              onClick={() => setSelectedBranchFilter('')}
              className='px-3.5 py-2.5 text-xs md:text-sm font-bold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer hover:text-didongviet-red dark:hover:text-didongviet-red border-none outline-none'
            >
              Tất cả chi nhánh
            </DropdownMenuItem>
            {branches.map((b) => (
              <DropdownMenuItem
                key={b._id}
                onClick={() => setSelectedBranchFilter(b._id)}
                className='px-3.5 py-2.5 text-xs md:text-sm font-bold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer hover:text-didongviet-red dark:hover:text-didongviet-red border-none outline-none'
              >
                {b.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Lọc nhanh ngưỡng tồn kho (chỉ hiện khi chọn tab 'Sắp hết hàng') */}
      {stockFilterType === 'low-stock' && (
        <div className='flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3.5 flex-shrink-0'>
          <SlidersHorizontal size={16} className='text-slate-400' />
          <span className='text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:inline'>
            Tồn kho &lt;=
          </span>
          <input
            type='number'
            min={0}
            max={500}
            value={
              thresholdFilter !== undefined
                ? thresholdFilter
                : currentThreshold
            }
            onChange={(e) => {
              const val = e.target.value;
              setThresholdFilter(val !== '' ? parseInt(val) : undefined);
            }}
            className='h-10 w-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-extrabold text-didongviet-red focus:border-red-500 focus:outline-hidden text-xs md:text-sm'
            placeholder={currentThreshold.toString()}
            title='Lọc các biến thể có lượng tồn kho nhỏ hơn hoặc bằng giá trị này'
          />
          <button
            onClick={() => setThresholdFilter(currentThreshold)}
            className='text-[10px] text-slate-400 dark:text-slate-500 hover:text-didongviet-red hover:underline font-bold cursor-pointer border-none bg-transparent'
            title='Đặt lại về ngưỡng hệ thống'
          >
            Mặc định
          </button>
        </div>
      )}
    </div>
  );
}
