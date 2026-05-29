import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface VoucherHeaderProps {
  onAddVoucher: () => void;
}

export function VoucherHeader({ onAddVoucher }: VoucherHeaderProps) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
      <div>
        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white'>
          Quản lý Mã giảm giá & Ưu đãi
        </h1>
        <p className='text-sm text-slate-400 mt-1'>
          Thiết lập ưu đãi giảm giá cố định, phần trăm, đặc quyền HSSV chống spam.
        </p>
      </div>

      <Button
        onClick={onAddVoucher}
        className='bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-2 rounded-xl py-5 px-4 font-semibold shadow-md border-none cursor-pointer'
      >
        <Plus size={16} />
        <span>Tạo Voucher</span>
      </Button>
    </div>
  );
}
