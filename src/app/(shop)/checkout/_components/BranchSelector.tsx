'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface BranchSelectorProps {
  branches: any[];
  selectedBranchId: string;
  setSelectedBranchId: (value: string) => void;
  selectedBranch: any;
}

export default function BranchSelector({
  branches,
  selectedBranchId,
  setSelectedBranchId,
  selectedBranch,
}: BranchSelectorProps) {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4'>
      <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3'>
        <ShoppingBag size={15} className='text-blue-500' />
        Chi nhánh đặt hàng
      </h2>
      <div className='space-y-3.5'>
        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider'>
            Chọn cửa hàng chuẩn bị hàng *
          </label>
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className='w-full text-xs h-10 rounded-xl border border-slate-200 bg-white px-3 focus:outline-none focus:ring-1 focus:ring-didongviet-red/30'
          >
            {branches.length === 0 ? (
              <option value=''>Đang tải danh sách chi nhánh...</option>
            ) : (
              branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))
            )}
          </select>
        </div>

        {selectedBranch && (
          <div className='p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-semibold space-y-1 leading-relaxed animate-in fade-in'>
            <div className='text-slate-700 font-bold uppercase scale-95 origin-left text-[9px] text-blue-600'>
              Địa chỉ cụ thể:
            </div>
            <div>{selectedBranch.address}</div>
            {selectedBranch.phone && (
              <div className='text-[9px] text-slate-400 mt-0.5'>
                Hotline cửa hàng: {selectedBranch.phone}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
