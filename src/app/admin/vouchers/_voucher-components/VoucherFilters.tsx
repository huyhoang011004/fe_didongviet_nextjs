import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

interface VoucherFiltersProps {
  vouchersFilter: string;
  setVouchersFilter: (filter: string) => void;
  voucherSearch: string;
  setVoucherSearch: (search: string) => void;
  filteredCount: number;
  totalCount: number;
}

export function VoucherFilters({
  vouchersFilter,
  setVouchersFilter,
  voucherSearch,
  setVoucherSearch,
  filteredCount,
  totalCount,
}: VoucherFiltersProps) {
  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
      <div className='flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto overflow-x-auto'>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'active', label: 'Đang hoạt động' },
          { key: 'expired', label: 'Đã hết hạn' },
          { key: 'locked', label: 'Bị tạm khóa' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setVouchersFilter(t.key)}
            className={`
              flex-shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
              ${
                vouchersFilter === t.key
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
        <div className='relative w-full md:w-64'>
          <Search
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            size={16}
          />
          <Input
            placeholder='Tìm kiếm theo mã voucher...'
            value={voucherSearch}
            onChange={(e) => setVoucherSearch(e.target.value)}
            className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
          />
        </div>
        <span className='text-xs text-slate-400 font-semibold whitespace-nowrap hidden sm:inline'>
          Đang hiển thị: {filteredCount} / {totalCount} mã
        </span>
      </div>
    </div>
  );
}
