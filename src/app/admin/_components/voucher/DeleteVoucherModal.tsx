import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Voucher } from '@/types/voucher';

interface DeleteVoucherModalProps {
  isOpen: boolean;
  selectedVoucher: Voucher | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteVoucherModal({
  isOpen,
  selectedVoucher,
  onClose,
  onConfirm,
}: DeleteVoucherModalProps) {
  if (!isOpen || !selectedVoucher) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
          <ShieldAlert size={24} />
        </div>
        <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>
          Xóa vĩnh viễn Voucher?
        </h3>
        <p className='text-xs text-slate-500 leading-relaxed mb-6'>
          Bạn có chắc chắn muốn xóa mã voucher{' '}
          <strong>{selectedVoucher.code}</strong>? Mã này sẽ biến mất khỏi
          bộ nhớ ưu đãi và các tài khoản khách hàng không thể dùng tiếp.
        </p>
        <div className='flex flex-col gap-2 mt-6'>
          <Button
            onClick={onConfirm}
            className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
          >
            Xóa bỏ
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
