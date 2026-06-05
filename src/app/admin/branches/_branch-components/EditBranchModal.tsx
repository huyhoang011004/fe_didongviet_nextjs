'use client';

import { useState, useEffect } from 'react';
import { X, Building2, Loader2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface BranchFormData {
  name: string;
  address: string;
  phone: string;
  managerName: string;
  isActive: boolean;
}

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => void;
  pending: boolean;
  branch: any | null;
}

export function EditBranchModal({ isOpen, onClose, onSubmit, pending, branch }: EditBranchModalProps) {
  const [form, setForm] = useState<BranchFormData>({
    name: '',
    address: '',
    phone: '',
    managerName: '',
    isActive: true,
  });

  // Populate form khi branch thay đổi
  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name || '',
        address: branch.address || '',
        phone: branch.phone || '',
        managerName: branch.managerName || '',
        isActive: branch.isActive ?? true,
      });
    }
  }, [branch]);

  if (!isOpen || !branch) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-slate-950/50 backdrop-blur-sm' onClick={onClose} />
      <div className='relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-500/5 to-indigo-600/5'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm'>
              <Building2 size={16} className='text-white' />
            </div>
            <div>
              <h2 className='text-base font-black text-slate-800 dark:text-slate-100'>Chỉnh sửa chi nhánh</h2>
              <p className='text-xs text-slate-400 mt-0.5 truncate max-w-[240px]'>{branch.name}</p>
            </div>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer border-none bg-transparent'>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-bold text-slate-600 dark:text-slate-400'>Tên chi nhánh *</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='rounded-xl border-slate-200 dark:border-slate-700 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-bold text-slate-600 dark:text-slate-400'>Địa chỉ *</Label>
            <Input
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className='rounded-xl border-slate-200 dark:border-slate-700 text-sm'
            />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label className='text-xs font-bold text-slate-600 dark:text-slate-400'>Số điện thoại *</Label>
              <Input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className='rounded-xl border-slate-200 dark:border-slate-700 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <Label className='text-xs font-bold text-slate-600 dark:text-slate-400'>Tên quản lý</Label>
              <Input
                value={form.managerName}
                onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                className='rounded-xl border-slate-200 dark:border-slate-700 text-sm'
              />
            </div>
          </div>

          <div className='flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl'>
            <input
              type='checkbox'
              id='edit-isActive'
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className='w-4 h-4 rounded accent-didongviet-red cursor-pointer'
            />
            <label htmlFor='edit-isActive' className='text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none'>
              Chi nhánh đang hoạt động
            </label>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={pending}
              className='flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 rounded-xl transition-all shadow-md disabled:opacity-60 cursor-pointer border-none'
            >
              {pending && <Loader2 size={14} className='animate-spin' />}
              {pending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
