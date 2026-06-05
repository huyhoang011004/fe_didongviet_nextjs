import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  createUserPending: boolean;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  createUserPending,
}: CreateUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 text-base'>
            Thêm tài khoản vận hành
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
              placeholder='Ví dụ: Nguyễn Văn Hoàng'
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
                type='tel'
                placeholder='0987654321'
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
              placeholder='hoang@gmail.com'
              required
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Mật khẩu khởi tạo
            </label>
            <Input
              name='password'
              type='password'
              placeholder='******'
              required
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          <p className='text-[10px] text-slate-400 italic bg-slate-50 border border-slate-100 rounded-lg p-2.5'>
            * Hệ thống sẽ tự động tạo mã OTP kích hoạt và gửi email hướng
            dẫn về Gmail của tài khoản được tạo ngay khi ấn xác nhận.
          </p>

          <div className='pt-4 border-t border-slate-100 flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={createUserPending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
            >
              {createUserPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
