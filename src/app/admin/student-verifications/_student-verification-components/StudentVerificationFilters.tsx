import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface StudentVerificationFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pendingCount: number;
}

export function StudentVerificationFilters({
  searchQuery,
  setSearchQuery,
  pendingCount,
}: StudentVerificationFiltersProps) {
  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
      <div className='flex items-center gap-1.5 p-1 rounded-xl w-full md:w-auto'>
        <span className='px-4 py-2 text-xs font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200 dark:border-amber-900/50 rounded-lg flex-shrink-0'>
          Chờ phê duyệt
        </span>
      </div>

      <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
        <div className='relative w-full md:w-64'>
          <Search
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            placeholder='Tìm kiếm tên, MSSV, trường...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
          />
        </div>
        <span className='text-xs text-slate-400 font-semibold whitespace-nowrap hidden sm:inline'>
          Đang chờ duyệt: {pendingCount} hồ sơ
        </span>
      </div>
    </div>
  );
}
