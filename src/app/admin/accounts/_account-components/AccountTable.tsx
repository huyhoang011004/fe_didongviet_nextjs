import {
  FolderOpen,
  Edit,
  Unlock,
  Lock,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { User } from '@/types/auth';

interface AccountTableProps {
  userLoading: boolean;
  usersData: User[];
  usersPage: number;
  usersTotalPages: number;
  usersTotalCount: number;
  setUsersPage: (page: number) => void;
  onEdit: (user: User) => void;
  onLock: (user: User) => void;
  onDelete: (user: User) => void;
}

export function AccountTable({
  userLoading,
  usersData,
  usersPage,
  usersTotalPages,
  usersTotalCount,
  setUsersPage,
  onEdit,
  onLock,
  onDelete,
}: AccountTableProps) {
  return (
    <div className='bg-white dark:bg-slate-900 overflow-hidden'>
      <div className='overflow-x-auto'>
        {userLoading ? (
          <div className='flex flex-col items-center justify-center p-20'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
            <span className='text-xs text-slate-400 mt-2 font-medium'>
              Đang lấy dữ liệu tài khoản...
            </span>
          </div>
        ) : usersData.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
            <FolderOpen size={48} className='text-slate-300 mb-2' />
            <p className='text-sm font-semibold'>
              Không tìm thấy người dùng phù hợp.
            </p>
          </div>
        ) : (
          <table className='w-full text-left border-collapse min-w-[700px]'>
            <thead>
              <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                <th className='py-4 px-6'>Họ và Tên</th>
                <th className='py-4 px-6'>Email</th>
                <th className='py-4 px-6'>Số điện thoại</th>
                <th className='py-4 px-6'>Vai trò</th>
                <th className='py-4 px-6'>Trạng thái</th>
                <th className='py-4 px-6 text-right'>Hành động</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
              {usersData.map((u) => (
                <tr
                  key={u._id}
                  className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                >
                  <td className='py-4 px-6 font-semibold text-slate-900 dark:text-white'>
                    {u.name}
                  </td>
                  <td className='py-4 px-6'>{u.email}</td>
                  <td className='py-4 px-6'>
                    {u.phone || 'Chưa cập nhật'}
                  </td>
                  <td className='py-4 px-6'>
                    <span
                      className={`
                        text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase
                        ${u.role === 'admin' && 'bg-purple-50 text-purple-600 border-purple-200'}
                        ${u.role === 'staff' && 'bg-blue-50 text-blue-600 border-blue-200'}
                        ${u.role === 'user' && 'bg-slate-100 text-slate-600 border-slate-200'}
                      `}
                    >
                      {u.role === 'admin'
                        ? 'Quản trị'
                        : u.role === 'staff'
                          ? 'Nhân viên'
                          : 'Khách hàng'}
                    </span>
                  </td>
                  <td className='py-4 px-6 space-y-1.5'>
                    {/* Trạng thái hoạt động */}
                    <span
                      className={`
                        flex items-center gap-1.5 text-xs font-semibold
                        ${u.isDeleted ? 'text-red-500' : 'text-emerald-600'}
                      `}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${u.isDeleted ? 'bg-red-500' : 'bg-emerald-600'}`}
                      />
                      <span>
                        {u.isDeleted ? 'Bị tạm khóa' : 'Hoạt động'}
                      </span>
                    </span>

                    {/* Trạng thái xác thực */}
                    <span
                      className={`
                        flex items-center gap-1.5 text-[11px] font-semibold
                        ${u.isVerified ? 'text-blue-500' : 'text-amber-500'}
                      `}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${u.isVerified ? 'bg-blue-500' : 'bg-amber-500'}`}
                      />
                      <span>
                        {u.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </span>
                  </td>
                  <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                    <Button
                      onClick={() => onEdit(u)}
                      variant='outline'
                      size='icon'
                      className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                    >
                      <Edit size={14} />
                    </Button>

                    {u.email !== 'admin@gmail.com' && (
                      <>
                        <Button
                          onClick={() => onLock(u)}
                          variant='outline'
                          size='icon'
                          className={`h-8 w-8 border-slate-200 cursor-pointer ${u.isDeleted ? 'hover:text-emerald-600 hover:bg-emerald-50' : 'hover:text-amber-600 hover:bg-amber-50'}`}
                        >
                          {u.isDeleted ? (
                            <Unlock size={14} />
                          ) : (
                            <Lock size={14} />
                          )}
                        </Button>

                        <Button
                          onClick={() => onDelete(u)}
                          variant='outline'
                          size='icon'
                          className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                        >
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Phân trang */}
      {!userLoading && usersTotalPages > 1 && (
        <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <span className='text-xs text-slate-400 font-medium'>
            Trang{' '}
            <strong className='text-slate-700 dark:text-slate-300'>
              {usersPage}
            </strong>{' '}
            trên{' '}
            <strong className='text-slate-700 dark:text-slate-300'>
              {usersTotalPages}
            </strong>{' '}
            (Tổng {usersTotalCount} thành viên)
          </span>
          <div className='flex gap-1.5'>
            <Button
              disabled={usersPage <= 1}
              onClick={() => setUsersPage(usersPage - 1)}
              variant='outline'
              size='sm'
              className='rounded-xl border-slate-200 cursor-pointer'
            >
              <ChevronLeft size={16} className='mr-1' /> Trước
            </Button>
            <Button
              disabled={usersPage >= usersTotalPages}
              onClick={() => setUsersPage(usersPage + 1)}
              variant='outline'
              size='sm'
              className='rounded-xl border-slate-200 cursor-pointer'
            >
              Sau <ChevronRight size={16} className='ml-1' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
