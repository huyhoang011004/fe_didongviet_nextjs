'use client';

import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'Chờ xác nhận', label: 'Chờ xác nhận' },
  { key: 'Chờ lấy hàng', label: 'Chờ lấy hàng' },
  { key: 'Đang giao', label: 'Đang giao' },
  { key: 'Đã giao', label: 'Đã giao' },
  { key: 'Đã hủy', label: 'Đã hủy' },
  { key: 'Trả hàng/Hoàn tiền', label: 'Trả hàng/Hoàn tiền' },
];

interface OrderFiltersProps {
  orderSearch: string;
  setOrderSearch: (val: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (val: string) => void;
  filteredCount: number;
  totalCount: number;
  orders?: any[];
}

export function OrderFilters({
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  filteredCount,
  totalCount,
  orders = [],
}: OrderFiltersProps) {
  const getTabCount = (tabKey: string) => {
    return tabKey === 'all' ? orders.length : orders.filter(o => o.orderStatus === tabKey).length;
  };

  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3'>
      {/* Tab lọc trạng thái */}
      <div className='flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0 gap-0.5 overflow-x-auto no-scrollbar'>
        {STATUS_TABS.map((t) => {
          const count = getTabCount(t.key);
          return (
            <button
              key={t.key}
              onClick={() => setOrderStatusFilter(t.key)}
              className={`flex-shrink-0 px-3.5 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer flex items-center gap-1.5 ${orderStatusFilter === t.key
                  ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-sm font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-transparent font-bold'
                }`}
            >
              <span>{t.label}</span>
              {count > 0 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${orderStatusFilter === t.key
                    ? 'bg-red-100 dark:bg-red-950/50 text-didongviet-red'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Ô tìm kiếm */}
      <div className='relative flex-1 min-w-[200px]'>
        <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
        <Input
          type='text'
          placeholder='Tìm theo mã đơn, SĐT, tên khách...'
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          className='pl-10 pr-4 py-5 rounded-xl border-slate-200 dark:border-slate-700 w-full text-sm'
        />
      </div>

      {/* Số lượng kết quả */}
      <span className='text-xs text-slate-400 dark:text-slate-500 font-medium flex-shrink-0'>
        {filteredCount}/{totalCount} đơn hàng
      </span>
    </div>
  );
}
