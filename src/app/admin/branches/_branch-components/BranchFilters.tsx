'use client';

import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface BranchFiltersProps {
  branchSearch: string;
  setBranchSearch: (val: string) => void;
  branchFilter: 'all' | 'active' | 'inactive';
  setBranchFilter: (val: 'all' | 'active' | 'inactive') => void;
  filteredCount: number;
  totalCount: number;
}

export function BranchFilters({
  branchSearch,
  setBranchSearch,
  branchFilter,
  setBranchFilter,
  filteredCount,
  totalCount,
}: BranchFiltersProps) {
  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
      {/* Tab lọc trạng thái */}
      <div className='flex flex-wrap bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0'>
        {(['all', 'active', 'inactive'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setBranchFilter(f)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex-shrink-0 ${
              branchFilter === f
                ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {f === 'all'
              ? 'Tất cả'
              : f === 'active'
                ? 'Đang hoạt động'
                : 'Tạm đóng'}
          </button>
        ))}
      </div>

      <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
        <div className='relative w-full md:w-64'>
          <Search
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            type='text'
            placeholder='Tìm tên, địa chỉ, SĐT, quản lý...'
            value={branchSearch}
            onChange={(e) => setBranchSearch(e.target.value)}
            className='pl-10 pr-4 py-5 rounded-xl border-slate-200 dark:border-slate-700 w-full text-sm'
          />
        </div>

        {/* Số lượng kết quả */}
        <span className='text-xs text-slate-400 dark:text-slate-500 font-medium '>
          {filteredCount}/{totalCount} chi nhánh
        </span>
      </div>
    </div>
  );
}
