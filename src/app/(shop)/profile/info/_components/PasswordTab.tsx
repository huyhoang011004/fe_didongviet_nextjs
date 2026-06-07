import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface PasswordTabProps {
  oldPassword: string;
  setOldPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  passwordLoading: boolean;
  showOldPassword: boolean;
  setShowOldPassword: (val: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  onChangePassword: (e: React.FormEvent) => void;
}

export default function PasswordTab({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  passwordLoading,
  showOldPassword,
  setShowOldPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onChangePassword,
}: PasswordTabProps) {
  return (
    <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-6 sm:p-8 animate-in fade-in duration-200 max-w-lg mx-auto w-full text-left'>
      <div className='border-b border-slate-100 pb-3.5 mb-5 text-center'>
        <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center justify-center gap-2'>
          <Lock size={15} className='text-amber-500' />
          Đổi mật khẩu tài khoản
        </h2>
        <p className='text-[9px] text-slate-400 font-medium mt-0.5'>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu mới cho người khác
        </p>
      </div>

      <form onSubmit={onChangePassword} className='max-w-md mx-auto space-y-4'>
        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>
            Mật khẩu hiện tại *
          </label>
          <div className='relative'>
            <Input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder='Nhập mật khẩu hiện tại'
              className='text-xs h-9.5 rounded-xl pr-10 bg-white border-slate-200'
              required
            />
            <button
              type='button'
              onClick={() => setShowOldPassword(!showOldPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center'
            >
              {showOldPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>
            Mật khẩu mới *
          </label>
          <div className='relative'>
            <Input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Nhập mật khẩu mới (tối thiểu 6 ký tự)'
              className='text-xs h-9.5 rounded-xl pr-10 bg-white border-slate-200'
              required
            />
            <button
              type='button'
              onClick={() => setShowNewPassword(!showNewPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center'
            >
              {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='text-[9px] font-black text-slate-500 uppercase tracking-wider block'>
            Xác nhận mật khẩu mới *
          </label>
          <div className='relative'>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Nhập lại mật khẩu mới'
              className='text-xs h-9.5 rounded-xl pr-10 bg-white border-slate-200'
              required
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center'
            >
              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <Button
          type='submit'
          disabled={passwordLoading}
          className='w-full bg-didongviet-red hover:bg-red-700 text-white text-[10px] h-9.5 px-4 font-bold border-none rounded-lg shadow-sm cursor-pointer disabled:opacity-50 mt-2'
        >
          {passwordLoading ? 'Đang xử lý...' : 'XÁC NHẬN ĐỔI MẬT KHẨU'}
        </Button>
      </form>
    </div>
  );
}
