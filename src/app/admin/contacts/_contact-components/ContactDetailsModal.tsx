import React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Contact } from '@/types/contact';
import { User } from '@/types/auth';

interface ContactDetailsModalProps {
  isOpen: boolean;
  selectedContact: Contact | null;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancelContact: (id: string) => void;
  onDeleteContact: () => void;
  updateContactStatusPending: boolean;
}

export function ContactDetailsModal({
  isOpen,
  selectedContact,
  currentUser,
  onClose,
  onSubmit,
  onCancelContact,
  onDeleteContact,
  updateContactStatusPending,
}: ContactDetailsModalProps) {
  if (!isOpen || !selectedContact) return null;

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

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <div>
            <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
              Phiếu yêu cầu khách hàng
            </h3>
            <span className='text-[10px] text-slate-400 block font-mono mt-0.5'>
              {selectedContact._id}
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
          onSubmit={onSubmit}
          className='p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300'
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850'>
            <div className='space-y-1'>
              <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                Họ tên khách hàng
              </span>
              <p className='font-bold text-slate-900 dark:text-white'>
                {selectedContact.fullName}
              </p>
              <span className='text-[9px] font-bold text-slate-400 block uppercase pt-2'>
                Số điện thoại / Email
              </span>
              <p className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                {selectedContact.phone} / {selectedContact.email}
              </p>
            </div>
            <div className='space-y-1'>
              <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                Chủ đề liên hệ
              </span>
              <p className='text-xs font-bold text-didongviet-red uppercase'>
                {selectedContact.subject}
              </p>
              <span className='text-[9px] font-bold text-slate-400 block uppercase pt-2'>
                Thời gian tiếp nhận
              </span>
              <p className='text-xs font-semibold text-slate-800 dark:text-slate-200'>
                {formatDate(selectedContact.createdAt)}
              </p>
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase block'>
              Nội dung tin nhắn khiếu nại/Tư vấn
            </label>
            <div className='bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-250 dark:border-slate-800/80 leading-relaxed text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium whitespace-pre-wrap'>
              {selectedContact.message}
            </div>
          </div>

          <div className='space-y-3.5 bg-purple-50/20 dark:bg-purple-950/10 p-4 rounded-xl border border-purple-100 dark:border-purple-950/50'>
            <span className='text-xs font-bold text-purple-700 dark:text-purple-400 block'>
              Nghiệp vụ nội bộ CSKH
            </span>

            <div className='grid grid-cols-2 gap-4 items-center'>
              <div className='space-y-1.5'>
                <span className='text-[10px] font-bold text-slate-400 block uppercase'>
                  Trạng thái xử lý
                </span>
                <select
                  name='status'
                  defaultValue={selectedContact.status}
                  className='w-full py-2 px-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs outline-none font-semibold'
                >
                  <option value='Chưa xử lý'>Chưa xử lý (New)</option>
                  <option value='Đang xử lý'>Đang xử lý (Processing)</option>
                  <option value='Đã xử lý'>Đã xử lý (Resolved)</option>
                  <option value='Đã hủy'>Đã hủy (Cancelled)</option>
                </select>
              </div>
              <div className='space-y-1.5'>
                <span className='text-[10px] font-bold text-slate-400 block uppercase'>
                  Người chịu trách nhiệm
                </span>
                <p className='text-xs font-bold text-purple-600 pt-1'>
                  {selectedContact.processedBy?.name
                    ? `${selectedContact.processedBy.name} (${selectedContact.processedBy.role === 'admin' ? 'Quản trị' : 'Staff'})`
                    : 'Đang chờ nhận xử lý'}
                </p>
              </div>
            </div>

            <div className='space-y-1.5'>
              <span className='text-[10px] font-bold text-slate-400 block uppercase'>
                Ghi chú tiến trình xử lý (Notes)
              </span>
              <textarea
                name='notes'
                defaultValue={selectedContact.notes || ''}
                placeholder='Đã gọi điện lúc 10h tư vấn hỗ trợ đổi trả máy cho khách...'
                rows={3}
                className='w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs focus:border-didongviet-red outline-none'
              />
            </div>
          </div>

          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center'>
            <div className='flex gap-2'>
              <Button
                type='button'
                onClick={() => onCancelContact(selectedContact._id)}
                variant='outline'
                className='border-amber-250 text-amber-600 hover:bg-amber-50 rounded-xl cursor-pointer text-xs font-semibold py-5'
              >
                Hủy phiếu
              </Button>
              {isAdmin && (
                <Button
                  type='button'
                  onClick={onDeleteContact}
                  variant='outline'
                  className='border-red-200 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer text-xs font-semibold py-5'
                >
                  Xóa phiếu
                </Button>
              )}
            </div>

            <div className='flex gap-2.5'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-xs'
              >
                Thoát
              </Button>
              <Button
                type='submit'
                disabled={updateContactStatusPending}
                className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs shadow-md'
              >
                {updateContactStatusPending ? 'Đang cập nhật...' : 'Cập nhật phiếu'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
