'use client';

import { useState } from 'react';
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

interface CreateBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => void;
  pending: boolean;
}

export function CreateBranchModal({ isOpen, onClose, onSubmit, pending }: CreateBranchModalProps) {
  const [form, setForm] = useState<BranchFormData>({
    name: '',
    address: '',
    phone: '',
    managerName: '',
    isActive: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({ name: '', address: '', phone: '', managerName: '', isActive: true });
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-slate-950/50 backdrop-blur-sm' onClick={handleClose} />
      <div className='relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-red-500/5 to-rose-600/5'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-sm'>
              <Building2 size={16} className='text-white' />
            </div>
            <div>
              <h2 className='text-base font-black text-slate-800 dark:text-slate-100'>Thêm chi nhánh mới</h2>
              <p className='text-xs text-slate-400 mt-0.5'>Điền đầy đủ thông tin chi nhánh</p>
            </div>
          </div>
          <button onClick={handleClose} className='p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer border-none bg-transparent'>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs font-bold text-slate-600 dark:text-slate-400'>Tên chi nhánh *</Label>
            <Input
              required
              placeholder='VD: Di Động Việt - Cầu Giấy'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='rounded-xl border-slate-200 dark:border-slate-700 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <Label className='text-xs font-bold text-slate-600 dark:text-slate-400'>Địa chỉ *</Label>
            <Input
              required
              placeholder='VD: 150 Xuân Thủy, Cầu Giấy, Hà Nội'
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
                placeholder='0987 654 321'
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className='rounded-xl border-slate-200 dark:border-slate-700 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <Label className='text-xs font-bold text-slate-600 dark:text-slate-400'>Tên quản lý</Label>
              <Input
                placeholder='VD: Nguyễn Văn A'
                value={form.managerName}
                onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                className='rounded-xl border-slate-200 dark:border-slate-700 text-sm'
              />
            </div>
          </div>

          <div className='flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl'>
            <input
              type='checkbox'
              id='create-isActive'
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className='w-4 h-4 rounded accent-didongviet-red cursor-pointer'
            />
            <label htmlFor='create-isActive' className='text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none'>
              Chi nhánh đang hoạt động
            </label>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={handleClose}
              className='px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={pending}
              className='flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-didongviet-red to-rose-600 hover:from-rose-600 hover:to-red-700 rounded-xl transition-all shadow-md disabled:opacity-60 cursor-pointer border-none'
            >
              {pending && <Loader2 size={14} className='animate-spin' />}
              {pending ? 'Đang tạo...' : 'Tạo chi nhánh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
