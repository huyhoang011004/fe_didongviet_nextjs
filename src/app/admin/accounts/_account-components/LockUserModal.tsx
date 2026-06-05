import { Lock, Unlock } from 'lucide-react';
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

  const isUnlocking = userToLock.isDeleted;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
        {/* Khối biểu tượng */}
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 border transition-all duration-300
            ${
              isUnlocking
                ? 'bg-emerald-50 text-emerald-500 border-emerald-200'
                : 'bg-amber-50 text-amber-500 border-amber-200'
            }
          `}
        >
          {isUnlocking ? (
            <Unlock size={24} className='animate-pulse' />
          ) : (
            <Lock size={24} className='animate-pulse' />
          )}
        </div>

        {/* Tiêu đề */}
        <h3
          className={`font-extrabold text-base mb-2
            ${isUnlocking ? 'text-emerald-600' : 'text-amber-600'}
          `}
        >
          {isUnlocking ? 'Mở khóa tài khoản?' : 'Tạm khóa tài khoản?'}
        </h3>

        {/* Nội dung mô tả */}
        <p className='text-xs text-slate-500 leading-relaxed mb-6'>
          {isUnlocking ? (
            <>
              Hành động <strong>MỞ KHÓA</strong> tài khoản của{' '}
              <strong>{userToLock.name}</strong> ({userToLock.email}) sẽ khôi
              phục toàn bộ quyền truy cập và sử dụng dịch vụ của hệ thống.
            </>
          ) : (
            <>
              Hành động <strong>TẠM KHÓA</strong> tài khoản của{' '}
              <strong>{userToLock.name}</strong> ({userToLock.email}) sẽ từ chối
              quyền đăng nhập của người dùng và đưa tài khoản vào hàng chờ xóa
              sau 60 ngày.
            </>
          )}
        </p>

        {/* Khối nút bấm sắp xếp dạng dọc */}
        <div className='flex flex-col gap-2 mt-6'>
          <Button
            onClick={onConfirm}
            className={`w-full text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md transition-all
              ${
                isUnlocking
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100/50'
                  : 'bg-amber-500 hover:bg-amber-600 shadow-amber-100/50'
              }
            `}
          >
            {isUnlocking ? 'Mở khóa ngay' : 'Tạm khóa ngay'}
          </Button>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-slate-500 hover:text-slate-700 transition-all'
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    </div>
  );
}


