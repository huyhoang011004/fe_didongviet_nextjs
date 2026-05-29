import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { User } from '@/types/auth';

interface EditUserModalProps {
  isOpen: boolean;
  selectedUser: User | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editUserPending: boolean;
}

export function EditUserModal({
  isOpen,
  selectedUser,
  onClose,
  onSubmit,
  editUserPending,
}: EditUserModalProps) {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 text-base'>
            Sửa hồ sơ người dùng
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className='p-6 space-y-4 overflow-y-auto flex-1'
        >
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Họ và Tên
            </label>
            <Input
              name='name'
              defaultValue={selectedUser.name}
              required
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Số điện thoại
              </label>
              <Input
                name='phone'
                defaultValue={selectedUser.phone}
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Vai trò
              </label>
              <select
                name='role'
                defaultValue={selectedUser.role}
                required
                className='w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:border-didongviet-red outline-none'
              >
                <option value='user'>Khách hàng</option>
                <option value='staff'>Nhân viên</option>
                <option value='admin'>Quản trị</option>
              </select>
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Địa chỉ Email
            </label>
            <Input
              name='email'
              type='email'
              defaultValue={selectedUser.email}
              required
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Địa chỉ cư trú
            </label>
            <Input
              name='address'
              defaultValue={selectedUser.address || ''}
              placeholder='Ví dụ: Quận 1, Tp. Hồ Chí Minh'
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Trạng thái khóa tài khoản
            </label>
            <select
              name='isDeleted'
              defaultValue={selectedUser.isDeleted ? 'true' : 'false'}
              required
              className='w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:border-didongviet-red outline-none'
            >
              <option value='false'>Hoạt động bình thường</option>
              <option value='true'>Tạm khóa (Soft-Deleted)</option>
            </select>
          </div>

          <div className='pt-4 border-t border-slate-100 flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={editUserPending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
            >
              {editUserPending ? 'Đang cập nhật...' : 'Lưu lại'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
