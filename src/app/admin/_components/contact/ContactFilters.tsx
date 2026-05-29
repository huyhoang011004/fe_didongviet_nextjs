import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface ContactFiltersProps {
  contactsStatusFilter: string;
  setContactsStatusFilter: (status: string) => void;
  contactSearch: string;
  setContactSearch: (search: string) => void;
  contactsTotalCount: number;
}

export function ContactFilters({
  contactsStatusFilter,
  setContactsStatusFilter,
  contactSearch,
  setContactSearch,
  contactsTotalCount,
}: ContactFiltersProps) {
  const filterTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Chưa xử lý', label: 'Chưa xử lý' },
    { key: 'Đang xử lý', label: 'Đang xử lý' },
    { key: 'Đã xử lý', label: 'Đã xử lý' },
    { key: 'Đã hủy', label: 'Đã hủy' },
  ];

  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
      <div className='flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto'>
        {filterTabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setContactsStatusFilter(t.key)}
            className={`
              flex-shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
              ${
                contactsStatusFilter === t.key
                  ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 bg-transparent'
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
        <span className='text-xs text-slate-400 font-semibold whitespace-nowrap hidden sm:inline'>
          Tổng nhận: {contactsTotalCount} phản hồi
        </span>
        <div className='relative w-full md:w-64'>
          <Search
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            placeholder='Tìm theo tên khách...'
            value={contactSearch}
            onChange={(e) => setContactSearch(e.target.value)}
            className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
          />
        </div>
      </div>
    </div>
  );
}
