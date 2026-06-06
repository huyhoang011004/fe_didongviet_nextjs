'use client';

import { Store } from 'lucide-react';

interface StoreStockProps {
  activeVariant: any;
  branches: any[];
}

export default function StoreStock({ activeVariant, branches }: StoreStockProps) {
  if (!activeVariant.inventory || activeVariant.inventory.length === 0) {
    return null;
  }

  return (
    <section className='bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3'>
      <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5'>
        <Store size={14} className='text-blue-500' />
        <span>Hệ thống siêu thị còn hàng</span>
      </h3>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5'>
        {activeVariant.inventory.map((inv: any) => {
          const branchObj = branches.find(
            (b) => b._id === (inv.branch?._id || inv.branch),
          );
          if (!branchObj) return null;

          return (
            <div
              key={inv.branch}
              className='p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-2 text-[10px]'
            >
              <div className='space-y-0.5 truncate'>
                <span
                  className='font-bold text-slate-800 block truncate'
                  title={branchObj.name}
                >
                  {branchObj.name}
                </span>
                <span
                  className='text-[9px] text-gray-400 block truncate'
                  title={branchObj.address}
                >
                  {branchObj.address}
                </span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full font-bold uppercase text-[8px] border flex-shrink-0
                ${
                  inv.stock > 0
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-red-50 text-red-500 border-red-200'
                }
              `}
              >
                {inv.stock > 0 ? `Còn ${inv.stock} máy` : 'Hết hàng'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
