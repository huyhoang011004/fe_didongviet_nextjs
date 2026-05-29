import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { User } from '@/types/auth';

interface LockUserModalProps {
  isOpen: boolean;
  userToLock: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function LockUserModal({
  isOpen,
  userToLock,
  onClose,
  onConfirm,
}: LockUserModalProps) {
  if (!isOpen || !userToLock) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-500 mb-4 border border-amber-200'>
          <AlertTriangle size={24} />
        </div>
        <h3 className='font-extrabold text-slate-900 text-base mb-2'>
          {userToLock.isDeleted ? 'Mở khóa tài khoản?' : 'Tạm khóa tài khoản?'}
        </h3>
        <p className='text-xs text-slate-500 leading-relaxed mb-6'>
          Bạn có chắc chắn muốn{' '}
          {userToLock.isDeleted ? 'MỞ KHÓA' : 'TẠM KHÓA'} tài khoản của{' '}
          <strong>{userToLock.name}</strong> ({userToLock.email})? Người dùng
          sẽ{' '}
          {userToLock.isDeleted
            ? 'có thể đăng nhập bình thường.'
            : 'bị từ chối đăng nhập và đưa vào trạng thái chờ xóa cứng 60 ngày.'}
        </p>
        <div className='flex gap-3 justify-end'>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={onConfirm}
            className='w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
}
