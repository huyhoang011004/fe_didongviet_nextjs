import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { StudentProfile } from '@/types/student';

interface StudentVerificationDetailsModalProps {
  isOpen: boolean;
  selectedProfile: StudentProfile | null;
  onClose: () => void;
  onSubmit: (data: {
    status: 'Đã xác thực' | 'Bị từ chối';
    studentIdCard?: string;
    schoolName?: string;
    rejectedReason?: string;
  }) => void;
  verifyPending: boolean;
}

export function StudentVerificationDetailsModal({
  isOpen,
  selectedProfile,
  onClose,
  onSubmit,
  verifyPending,
}: StudentVerificationDetailsModalProps) {
  const [status, setStatus] = useState<'Đã xác thực' | 'Bị từ chối'>('Đã xác thực');
  const [schoolName, setSchoolName] = useState('');
  const [studentIdCard, setStudentIdCard] = useState('');
  const [rejectedReason, setRejectedReason] = useState('');

  // Cập nhật lại thông tin ban đầu khi mở modal
  useEffect(() => {
    if (selectedProfile) {
      setSchoolName(selectedProfile.schoolName || '');
      setStudentIdCard(selectedProfile.studentIdCard || '');
      setRejectedReason('');
      setStatus('Đã xác thực');
    }
  }, [selectedProfile, isOpen]);

  if (!isOpen || !selectedProfile) return null;

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

  const user =
    selectedProfile._id && typeof selectedProfile._id === 'object'
      ? (selectedProfile._id as any)
      : { name: 'Khách hàng', email: '', phone: '' };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'Đã xác thực') {
      onSubmit({
        status,
        schoolName,
        studentIdCard,
      });
    } else {
      onSubmit({
        status,
        rejectedReason,
      });
    }
  };

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <div>
            <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
              Xét duyệt hồ sơ thẻ sinh viên
            </h3>
            <span className='text-[10px] text-slate-400 block font-mono mt-0.5'>
              Profile ID: {selectedProfile._id}
            </span>
          </div>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className='p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300'
        >
          {/* Thông tin cá nhân HSSV */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850'>
            <div className='space-y-1'>
              <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                Họ tên sinh viên
              </span>
              <p className='font-bold text-slate-900 dark:text-white'>
                {user.name}
              </p>
              <span className='text-[9px] font-bold text-slate-400 block uppercase pt-2'>
                Số điện thoại / Email
              </span>
              <p className='text-xs font-semibold text-slate-850 dark:text-slate-200'>
                {user.phone ? `${user.phone} / ` : ''}{user.email}
              </p>
            </div>
            <div className='space-y-1'>
              <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                Thời gian gửi yêu cầu
              </span>
              <p className='text-xs font-semibold text-slate-850 dark:text-slate-200'>
                {formatDate(selectedProfile.createdAt)}
              </p>
              <span className='text-[9px] font-bold text-slate-400 block uppercase pt-2'>
                Trạng thái hiện tại
              </span>
              <p className='text-xs font-bold text-amber-500 uppercase'>
                {selectedProfile.isHSSVVerified}
              </p>
            </div>
          </div>

          {/* Trực quan Ảnh thẻ minh chứng thẻ sinh viên */}
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase block'>
              Ảnh minh chứng thẻ sinh viên (Đối chiếu thực tế)
            </label>
            <div className='bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2 max-h-[300px]'>
              {selectedProfile.studentCardImage ? (
                <img
                  src={selectedProfile.studentCardImage}
                  alt='Minh chứng thẻ sinh viên'
                  className='max-h-[280px] w-auto object-contain rounded-lg shadow-xs'
                  onError={(e) => {
                    (e.target as any).src = '/auth-image.webp';
                  }}
                />
              ) : (
                <span className='text-slate-400 italic text-xs py-10'>
                  Chưa upload ảnh thẻ sinh viên
                </span>
              )}
            </div>
          </div>

          {/* Nghiệp vụ nội bộ CSKH Duyệt thẻ HSSV */}
          <div className='space-y-4 bg-purple-50/20 dark:bg-purple-950/10 p-4 rounded-xl border border-purple-100 dark:border-purple-950/50'>
            <span className='text-xs font-bold text-purple-700 dark:text-purple-400 block'>
              Nghiệp vụ phê duyệt đặc quyền
            </span>

            <div className='space-y-1.5'>
              <span className='text-[10px] font-bold text-slate-400 block uppercase'>
                Quyết định phê duyệt
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs outline-none font-semibold'
              >
                <option value='Đã xác thực'>Phê duyệt thành công (Approved)</option>
                <option value='Bị từ chối'>Từ chối hồ sơ (Rejected)</option>
              </select>
            </div>

            {status === 'Đã xác thực' ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200'>
                <div className='space-y-1.5'>
                  <span className='text-[10px] font-bold text-slate-400 block uppercase'>
                    Mã số sinh viên (MSSV)
                  </span>
                  <Input
                    value={studentIdCard}
                    onChange={(e) => setStudentIdCard(e.target.value)}
                    placeholder='Ví dụ: B20DCCN123'
                    required
                    className='h-9 rounded-lg border-slate-250 text-xs'
                  />
                </div>
                <div className='space-y-1.5'>
                  <span className='text-[10px] font-bold text-slate-400 block uppercase'>
                    Tên trường đại học
                  </span>
                  <Input
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder='Ví dụ: Học viện Công nghệ Bưu chính Viễn thông'
                    required
                    className='h-9 rounded-lg border-slate-250 text-xs'
                  />
                </div>
              </div>
            ) : (
              <div className='space-y-1.5 animate-in fade-in duration-200'>
                <span className='text-[10px] font-bold text-slate-400 block uppercase'>
                  Lý do từ chối hồ sơ
                </span>
                <textarea
                  value={rejectedReason}
                  onChange={(e) => setRejectedReason(e.target.value)}
                  placeholder='Hình ảnh minh chứng không rõ ràng hoặc thông tin thẻ sinh viên bị sai lệch...'
                  required
                  rows={2}
                  className='w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs focus:border-didongviet-red outline-none'
                />
              </div>
            )}
          </div>

          {/* Nhóm nút bấm xếp dọc flex-col cân đối chống tràn chữ */}
          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 mt-6'>
            <Button
              type='submit'
              disabled={verifyPending}
              className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs shadow-md'
            >
              {verifyPending
                ? 'Đang xử lý phê duyệt...'
                : status === 'Đã xác thực'
                  ? 'Xác nhận phê duyệt HSSV'
                  : 'Xác nhận từ chối hồ sơ'}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='w-full rounded-xl border-slate-200 dark:border-slate-700 cursor-pointer py-5 px-4 font-semibold text-slate-500 hover:text-slate-700 text-xs'
            >
              Hủy bỏ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
