import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { User } from '@/types/auth';

interface DeleteUserModalProps {
  isOpen: boolean;
  userToDelete: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserModal({
  isOpen,
  userToDelete,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  if (!isOpen || !userToDelete) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
          <ShieldAlert size={24} className='animate-pulse' />
        </div>
        <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>
          Xóa vĩnh viễn tài khoản?
        </h3>
        <p className='text-xs text-slate-500 leading-relaxed mb-6'>
          ⚠️ <strong>CẢNH BÁO NGUY HIỂM!</strong> Hành động xóa vĩnh viễn tài
          khoản của <strong>{userToDelete.name}</strong> sẽ dọn sạch giỏ hàng,
          hồ sơ và khóa vĩnh viễn địa chỉ email này. Đây là thao tác{' '}
          <strong>không thể đảo ngược</strong>.
        </p>
        <div className='flex flex-col gap-2 mt-6'>
          <Button
            onClick={onConfirm}
            className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
          >
            Thanh trừng
          </Button>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-slate-500 hover:text-slate-700'
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    </div>
  );
}
