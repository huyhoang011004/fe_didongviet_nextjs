import React from 'react';
import { Eye, FolderOpen } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StudentProfile } from '@/types/student';

interface StudentVerificationTableProps {
  loading: boolean;
  profilesData: StudentProfile[];
  onOpenDetails: (profile: StudentProfile) => void;
}

export function StudentVerificationTable({
  loading,
  profilesData,
  onOpenDetails,
}: StudentVerificationTableProps) {
  // Định dạng ngày hiển thị
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Chưa cập nhật';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='p-0 overflow-x-auto'>
      {loading ? (
        <div className='flex flex-col items-center justify-center p-20'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang tải danh sách hồ sơ HSSV hàng đợi duyệt...
          </span>
        </div>
      ) : profilesData.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
          <FolderOpen size={48} className='text-slate-300 mb-2' />
          <p className='text-sm font-semibold'>
            Không có hồ sơ HSSV nào đang chờ phê duyệt.
          </p>
        </div>
      ) : (
        <table className='w-full text-left border-collapse min-w-[800px]'>
          <thead>
            <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
              <th className='py-4 px-6'>Họ tên khách hàng</th>
              <th className='py-4 px-6'>Trường Đại Học</th>
              <th className='py-4 px-6'>Mã số sinh viên (MSSV)</th>
              <th className='py-4 px-6'>Thời gian gửi</th>
              <th className='py-4 px-6'>Trạng thái</th>
              <th className='py-4 px-6 text-right'>Hành động</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
            {profilesData.map((p) => {
              const user =
                p._id && typeof p._id === 'object'
                  ? (p._id as any)
                  : { name: 'Khách hàng', email: '', phone: '' };

              return (
                <tr
                  key={p._id}
                  className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                >
                  <td className='py-4 px-6'>
                    <div className='flex flex-col'>
                      <span className='font-bold text-slate-900 dark:text-white'>
                        {user.name}
                      </span>
                      <span className='text-xs text-slate-400'>
                        {user.phone ? `${user.phone} / ` : ''}{user.email}
                      </span>
                    </div>
                  </td>
                  <td className='py-4 px-6 font-semibold text-slate-700 dark:text-slate-300'>
                    {p.schoolName || 'Chưa cung cấp'}
                  </td>
                  <td className='py-4 px-6 font-mono text-xs font-bold text-slate-600 dark:text-slate-400'>
                    {p.studentIdCard || 'Chưa cung cấp'}
                  </td>
                  <td className='py-4 px-6 text-xs text-slate-500'>
                    {formatDate(p.createdAt)}
                  </td>
                  <td className='py-4 px-6'>
                    <span className='px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-200 bg-amber-50 text-amber-600 uppercase animate-pulse'>
                      {p.isHSSVVerified}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-right whitespace-nowrap'>
                    <Button
                      onClick={() => onOpenDetails(p)}
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-1.5 hover:text-didongviet-red border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-semibold py-4 rounded-xl'
                    >
                      <Eye size={12} />
                      <span>Xét duyệt</span>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
