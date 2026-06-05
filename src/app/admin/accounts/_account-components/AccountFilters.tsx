import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface AccountFiltersProps {
  usersFilter: string;
  setUsersFilter: (filter: string) => void;
  usersSearch: string;
  setUsersSearch: (search: string) => void;
  setUsersPage: (page: number) => void;
  usersTotalCount: number;
}

export function AccountFilters({
  usersFilter,
  setUsersFilter,
  usersSearch,
  setUsersSearch,
  setUsersPage,
  usersTotalCount,
}: AccountFiltersProps) {
  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
      {/* Các tab trạng thái bên trái */}
      <div className='flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto'>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'active', label: 'Hoạt động' },
          { key: 'unverified', label: 'Chưa xác thực' },
          { key: 'deleted', label: 'Bị tạm khóa' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setUsersFilter(t.key);
              setUsersPage(1);
            }}
            className={`
              flex-shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
              ${
                usersFilter === t.key
                  ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 bg-transparent'
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Hiển thị số lượng và thanh tìm kiếm bên phải */}
      <div className='flex items-center gap-4 w-full md:w-auto justify-between md:justify-end'>
        <div className='relative w-full md:w-64'>
          <Search
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            placeholder='Tìm theo tên, email...'
            value={usersSearch}
            onChange={(e) => {
              setUsersSearch(e.target.value);
              setUsersPage(1);
            }}
            className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
          />
        </div>
        <span className='text-xs text-slate-400 font-semibold whitespace-nowrap hidden sm:inline'>
          Tổng: {usersTotalCount} thành viên
        </span>
      </div>
    </div>
  );
}
