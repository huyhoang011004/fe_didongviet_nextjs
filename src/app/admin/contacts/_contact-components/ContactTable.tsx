import React from 'react';
import { Eye, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Contact } from '@/types/contact';

interface ContactTableProps {
  contactLoading: boolean;
  contactsData: Contact[];
  contactsPage: number;
  contactsTotalPages: number;
  contactsTotalCount: number;
  setContactsPage: (page: number) => void;
  onOpenDetails: (contact: Contact) => void;
}

export function ContactTable({
  contactLoading,
  contactsData,
  contactsPage,
  contactsTotalPages,
  contactsTotalCount,
  setContactsPage,
  onOpenDetails,
}: ContactTableProps) {
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
      {contactLoading ? (
        <div className='flex flex-col items-center justify-center p-20'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang lấy danh sách yêu cầu khiếu nại...
          </span>
        </div>
      ) : contactsData.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
          <FolderOpen size={48} className='text-slate-300 mb-2' />
          <p className='text-sm font-semibold'>
            Không có phiếu khiếu nại/yêu cầu nào khớp.
          </p>
        </div>
      ) : (
        <>
          <table className='w-full text-left border-collapse min-w-[800px]'>
            <thead>
              <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                <th className='py-4 px-6'>Khách gửi phản hồi</th>
                <th className='py-4 px-6 min-w-[120px]'>Chủ đề tiếp nhận</th>
                <th className='py-4 px-6'>Thời gian gửi</th>
                <th className='py-4 px-6'>Nội dung tóm lược</th>
                <th className='py-4 px-6'>CSKH Phụ trách</th>
                <th className='py-4 px-6 min-w-[100px]'>Trạng thái</th>
                <th className='py-4 px-6'>Chi tiết</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
              {contactsData.map((c) => (
                <tr
                  key={c._id}
                  className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                >
                  <td className='py-4 px-6'>
                    <div className='flex flex-col'>
                      <span className='font-bold text-slate-900 dark:text-white'>
                        {c.fullName}
                      </span>
                      <span className='text-xs text-slate-400'>
                        {c.phone} / {c.email}
                      </span>
                    </div>
                  </td>
                  <td className='py-4 px-6 min-w-[180px]'>
                    <span
                      className={`inline-block px-3 py-1 rounded-xl text-[10px] font-bold border uppercase text-center min-w-[130px]
                      ${
                        c.subject === 'Khiếu nại dịch vụ'
                          ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                          : c.subject === 'Thu cũ đổi mới'
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                      }
                    `}
                    >
                      {c.subject}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-xs text-slate-500'>
                    {formatDate(c.createdAt)}
                  </td>
                  <td className='py-4 px-6 text-xs truncate max-w-[200px] text-slate-500 dark:text-slate-400'>
                    {c.message}
                  </td>
                  <td className='py-4 px-6 font-bold text-xs'>
                    {c.processedBy ? (
                      <span className='text-purple-600'>
                        {c.processedBy.name} (
                        {c.processedBy.role === 'admin' ? 'Quản trị' : 'Staff'})
                      </span>
                    ) : (
                      <span className='text-slate-400 italic font-normal'>
                        Đang chờ nhận ca
                      </span>
                    )}
                  </td>
                  <td className='py-4 px-6'>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase
                      ${
                        c.status === 'Đã xử lý'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : c.status === 'Đang xử lý'
                            ? 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse'
                            : c.status === 'Đã hủy'
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-amber-50 text-amber-600 border-amber-200'
                      }
                    `}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className='py-4 px-6 text-right whitespace-nowrap'>
                    <Button
                      onClick={() => onOpenDetails(c)}
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-1.5 hover:text-didongviet-red border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-semibold py-4 rounded-xl'
                    >
                      <Eye size={12} />
                      <span>Mở phiếu</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          {contactsTotalPages > 1 && (
            <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <span className='text-xs text-slate-400 font-medium'>
                Trang{' '}
                <strong className='text-slate-700 dark:text-slate-300'>
                  {contactsPage}
                </strong>{' '}
                trên{' '}
                <strong className='text-slate-700 dark:text-slate-300'>
                  {contactsTotalPages}
                </strong>{' '}
                (Tổng {contactsTotalCount} phản hồi)
              </span>
              <div className='flex gap-1.5'>
                <Button
                  disabled={contactsPage <= 1}
                  onClick={() => setContactsPage(contactsPage - 1)}
                  variant='outline'
                  size='sm'
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  <ChevronLeft size={16} className='mr-1' /> Trước
                </Button>
                <Button
                  disabled={contactsPage >= contactsTotalPages}
                  onClick={() => setContactsPage(contactsPage + 1)}
                  variant='outline'
                  size='sm'
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  Sau <ChevronRight size={16} className='ml-1' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
