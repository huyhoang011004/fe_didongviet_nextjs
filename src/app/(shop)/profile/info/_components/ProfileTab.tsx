import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { resolveImageUrl } from '@/shared/lib/utils';

interface ProfileTabProps {
  user: any;
  editName: string;
  setEditName: (val: string) => void;
  editPhone: string;
  setEditPhone: (val: string) => void;
  saving: boolean;
  studentProfile: any;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileTab({
  user,
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  saving,
  studentProfile,
  onSave,
  onCancel,
}: ProfileTabProps) {
  return (
    <div className='space-y-4 animate-in fade-in duration-200 text-left'>
      <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5'>
        <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-4'>
          <div className='flex items-center gap-2'>
            <ShieldCheck size={16} className='text-emerald-500' />
            <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
              Hồ sơ cá nhân
            </h2>
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={onCancel}
              variant='outline'
              size='sm'
              className='text-[10px] h-7 font-bold border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50'
            >
              Hủy
            </Button>
            <Button
              onClick={onSave}
              disabled={saving}
              size='sm'
              className='bg-didongviet-red hover:bg-red-700 text-white text-[10px] h-7 font-bold shadow-xs border-none rounded-lg cursor-pointer disabled:opacity-50'
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Họ và tên</label>
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className='text-xs h-9.5 rounded-xl font-semibold bg-white border-slate-200'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Địa chỉ Email (Cố định)</label>
            <Input
              value={user.email}
              disabled
              className='text-xs h-9.5 rounded-xl font-semibold bg-slate-50/70 border-transparent text-slate-400'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Số điện thoại</label>
            <Input
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              placeholder='Chưa cập nhật số điện thoại'
              className='text-xs h-9.5 rounded-xl font-semibold bg-white border-slate-200'
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-[9px] font-black text-slate-400 uppercase tracking-wider block'>Nhóm khách hàng</label>
            <Input
              value={
                user.role === 'admin'
                  ? 'Quản trị viên (Admin)'
                  : user.role === 'staff' ? 'Nhân viên (Staff)' : 'Khách hàng (User)'
              }
              disabled
              className='text-xs h-9.5 rounded-xl font-semibold bg-slate-50/70 border-transparent text-purple-600 font-bold'
            />
          </div>
        </div>
      </div>

      {/* Thông tin HSSV nếu có */}
      {studentProfile && (
        <div className='bg-blue-50/50 rounded-xl border border-blue-100 shadow-xs p-5'>
          <div className='flex items-center gap-2 border-b border-blue-100/50 pb-3 mb-4'>
            <Award size={16} className='text-blue-500' />
            <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
              Hồ sơ Học sinh - Sinh viên
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${studentProfile.isHSSVVerified === 'Đã xác thực'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : studentProfile.isHSSVVerified === 'Bị từ chối'
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : studentProfile.isHSSVVerified === 'Đang chờ'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
            >
              {studentProfile.isHSSVVerified}
            </span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <span className='text-[9px] font-black text-slate-400 uppercase block'>Mã số sinh viên</span>
              <span className='text-xs font-bold text-slate-700 block'>
                {studentProfile.studentIdCard || '---'}
              </span>
            </div>
            <div className='space-y-1'>
              <span className='text-[9px] font-black text-slate-400 uppercase block'>Trường học</span>
              <span className='text-xs font-bold text-slate-700 block truncate'>
                {studentProfile.schoolName || '---'}
              </span>
            </div>
          </div>

          {studentProfile.studentCardImage && (
            <div className='mt-3 space-y-1'>
              <span className='text-[9px] font-black text-slate-400 uppercase block'>Ảnh thẻ sinh viên</span>
              <div className='bg-slate-100 rounded-lg overflow-hidden border border-slate-200 max-h-[180px] flex items-center justify-center p-1'>
                <img
                  src={resolveImageUrl(studentProfile.studentCardImage)}
                  alt='Thẻ sinh viên'
                  className='max-h-[160px] w-auto object-contain rounded'
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/auth-image.webp';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
