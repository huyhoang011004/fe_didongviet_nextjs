'use client';

import { Building2, MapPin, Phone, User, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface BranchTableProps {
  branches: any[];
  loading: boolean;
  onEdit: (branch: any) => void;
  onDelete: (branch: any) => void;
}

export function BranchTable({ branches, loading, onEdit, onDelete }: BranchTableProps) {
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-3'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
        <span className='text-xs text-slate-400 font-medium'>Đang tải danh sách chi nhánh...</span>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 gap-3'>
        <Building2 size={40} className='text-slate-200 dark:text-slate-700' />
        <p className='text-sm font-semibold text-slate-400'>Chưa có chi nhánh nào</p>
        <p className='text-xs text-slate-300 dark:text-slate-600'>Thêm chi nhánh đầu tiên để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'>
            <th className='text-left px-6 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
              Chi nhánh
            </th>
            <th className='text-left px-6 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
              Địa chỉ
            </th>
            <th className='text-left px-6 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
              Liên hệ
            </th>
            <th className='text-left px-6 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
              Quản lý
            </th>
            <th className='text-center px-6 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
              Trạng thái
            </th>
            <th className='text-right px-6 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-wider'>
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-50 dark:divide-slate-800/50'>
          {branches.map((branch, idx) => (
            <tr
              key={branch._id}
              className='hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group'
            >
              {/* Tên chi nhánh + STT */}
              <td className='px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm flex-shrink-0'>
                    <Building2 size={16} className='text-white' />
                  </div>
                  <div>
                    <p className='font-bold text-slate-800 dark:text-slate-100 text-sm'>
                      {branch.name}
                    </p>
                    <p className='text-[11px] text-slate-400 font-mono'>#{String(idx + 1).padStart(2, '0')}</p>
                  </div>
                </div>
              </td>

              {/* Địa chỉ */}
              <td className='px-6 py-4'>
                <div className='flex items-start gap-1.5 max-w-[260px]'>
                  <MapPin size={13} className='text-slate-400 mt-0.5 flex-shrink-0' />
                  <span className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed'>
                    {branch.address}
                  </span>
                </div>
              </td>

              {/* SĐT */}
              <td className='px-6 py-4'>
                <div className='flex items-center gap-1.5'>
                  <Phone size={13} className='text-slate-400 flex-shrink-0' />
                  <span className='text-xs text-slate-600 dark:text-slate-300 font-medium'>
                    {branch.phone}
                  </span>
                </div>
              </td>

              {/* Tên quản lý */}
              <td className='px-6 py-4'>
                <div className='flex items-center gap-1.5'>
                  <User size={13} className='text-slate-400 flex-shrink-0' />
                  <span className='text-xs text-slate-600 dark:text-slate-300'>
                    {branch.managerName || <span className='text-slate-300 dark:text-slate-600 italic'>Chưa có</span>}
                  </span>
                </div>
              </td>

              {/* Trạng thái */}
              <td className='px-6 py-4 text-center'>
                {branch.isActive ? (
                  <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
                    <CheckCircle2 size={11} />
                    Hoạt động
                  </span>
                ) : (
                  <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'>
                    <XCircle size={11} />
                    Tạm đóng
                  </span>
                )}
              </td>

              {/* Thao tác */}
              <td className='px-6 py-4'>
                <div className='flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <button
                    onClick={() => onEdit(branch)}
                    title='Chỉnh sửa'
                    className='p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all cursor-pointer border-none bg-transparent'
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(branch)}
                    title='Xóa'
                    className='p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all cursor-pointer border-none bg-transparent'
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
