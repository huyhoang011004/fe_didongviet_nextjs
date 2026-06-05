'use client';

import { PackageOpen, Settings, ClipboardList } from 'lucide-react';

interface InventoryHeaderProps {
  currentThreshold: number;
  onOpenThresholdEdit: () => void;
  onOpenReceiptsList: () => void;
}

export default function InventoryHeader({
  currentThreshold,
  onOpenThresholdEdit,
  onOpenReceiptsList,
}: InventoryHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-md'>
          <PackageOpen size={20} className='text-white' />
        </div>
        <div>
          <h1 className='text-xl font-black text-slate-800 dark:text-slate-100'>
            Quản lý Tồn Kho
          </h1>
          <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
            Theo dõi số lượng tồn kho sản phẩm, thiết lập cảnh báo và quản lý
            nhập kho bổ sung.
          </p>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        {/* Ngưỡng cảnh báo tồn tối thiểu */}
        <div className='flex flex-col sm:flex-row items-center gap-2 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-semibold shadow-xs'>
          <div>
            <span className='w-2 h-2 rounded-full bg-amber-550 animate-pulse' />
            <span>Ngưỡng cảnh báo: </span>
            <span className='text-didongviet-red font-extrabold bg-white dark:bg-slate-850 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 ml-1 shadow-2xs'>
              {currentThreshold} máy
            </span>

            <button
              onClick={onOpenThresholdEdit}
              className='p-1 hover:bg-slate-150 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ml-1.5 border-none bg-transparent'
              title='Thay đổi cấu hình ngưỡng tồn tối thiểu'
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Nút xem lịch sử nhập kho */}
        <button
          onClick={onOpenReceiptsList}
          className='flex items-center gap-2 bg-gradient-to-r from-didongviet-red to-rose-600 hover:from-rose-600 hover:to-red-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer border-none'
        >
          <ClipboardList size={16} />
          <span>Lịch sử nhập kho</span>
        </button>
      </div>
    </div>
  );
}
