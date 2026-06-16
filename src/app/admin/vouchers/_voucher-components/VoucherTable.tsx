import { FolderOpen, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Voucher } from '@/types/voucher';

interface VoucherTableProps {
  voucherLoading: boolean;
  vouchersData: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
}

export function VoucherTable({
  voucherLoading,
  vouchersData,
  onEdit,
  onDelete,
}: VoucherTableProps) {
  // Định dạng hiển thị tiền tệ VNĐ
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  // Định dạng ngày hiển thị
  const formatDate = (dateStr: string) => {
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
      {voucherLoading ? (
        <div className='flex flex-col items-center justify-center p-20'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang lấy danh sách mã giảm giá...
          </span>
        </div>
      ) : vouchersData.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
          <FolderOpen size={48} className='text-slate-300 mb-2' />
          <p className='text-sm font-semibold'>
            Chưa phát hành bất kỳ mã voucher nào.
          </p>
        </div>
      ) : (
        <table className='w-full text-left border-collapse min-w-[750px]'>
          <thead>
            <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
              <th className='py-4 px-6'>Mã Voucher</th>
              <th className='py-4 px-6 min-w-[140px]'>Loại giảm</th>
              <th className='py-4 px-6'>Giá trị giảm</th>
              <th className='py-4 px-6'>Đã dùng / Tổng</th>
              <th className='py-4 px-6'>Thời gian áp dụng</th>
              <th className='py-4 px-6'>Đối tượng</th>
              <th className='py-4 px-6'>Kích hoạt</th>
              <th className='py-4 px-6 text-right'>Hành động</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
            {vouchersData.map((v) => (
              <tr
                key={v._id}
                className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
              >
                <td className='py-4 px-6 font-mono font-bold text-slate-900 dark:text-white'>
                  {v.code}
                </td>
                <td className='py-4 px-6'>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase
                    ${v.discountType === 'fixed' && 'bg-blue-50 text-blue-600 border-blue-200'}
                    ${v.discountType === 'percentage' && 'bg-amber-50 text-amber-600 border-amber-200'}
                    ${v.discountType === 'hssv_tiered' && 'bg-purple-50 text-purple-600 border-purple-200'}
                  `}
                  >
                    {v.discountType === 'fixed'
                      ? 'Tiền cố định'
                      : v.discountType === 'percentage'
                        ? 'Phần trăm'
                        : 'Dành riêng cho HSSV'}
                  </span>
                </td>
                <td className='py-4 px-6 font-bold text-didongviet-red'>
                  {v.discountType === 'hssv_tiered' ? (
                    <span
                      className='text-xs text-purple-600 underline cursor-help animate-pulse'
                      title={JSON.stringify(v.hssvTiers)}
                    >
                      Chi tiết bậc
                    </span>
                  ) : v.discountType === 'percentage' ? (
                    `${v.discountValue}% (Tối đa ${formatVND(v.maxDiscount || 0)})`
                  ) : (
                    formatVND(v.discountValue || 0)
                  )}
                </td>
                <td className='py-4 px-6 font-semibold'>
                  {v.usedCount ?? 0} / {v.usageLimit}
                </td>
                <td className='py-4 px-6 text-xs text-slate-500 leading-normal'>
                  <div className='flex flex-col'>
                    <span>Bắt đầu: {formatDate(v.startDate)}</span>
                    <span>Kết thúc: {formatDate(v.expiryDate)}</span>
                  </div>
                </td>
                <td className='py-4 px-6 text-xs'>
                  {v.isHSSVOnly ? (
                    <span className='bg-red-50 text-red-600 border border-red-200 font-bold px-2 py-0.5 rounded-full uppercase text-[9px]'>
                      Học sinh SV
                    </span>
                  ) : (
                    <span className='text-slate-400'>Mọi thành viên</span>
                  )}
                </td>
                <td className='py-4 px-6'>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-semibold ${v.isActive !== false ? 'text-emerald-600' : 'text-slate-400'}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${v.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`}
                    />
                    <span>
                      {v.isActive !== false ? 'Kích hoạt' : 'Tạm khóa'}
                    </span>
                  </span>
                </td>
                <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                  <Button
                    onClick={() => onEdit(v)}
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    onClick={() => onDelete(v)}
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
