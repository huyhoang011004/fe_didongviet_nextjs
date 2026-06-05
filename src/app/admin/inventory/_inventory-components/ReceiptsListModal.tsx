'use client';

import { X, Calendar, User, Trash2, ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ReceiptsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onCancelReceipt: (receiptId: string) => void;
}

export default function ReceiptsListModal({
  isOpen,
  onClose,
  receipts,
  loading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onCancelReceipt,
}: ReceiptsListModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs'>
      <div className='bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in-50 zoom-in-95 duration-200 flex flex-col max-h-[85vh]'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 flex-shrink-0'>
          <div className='flex items-center gap-2 text-gray-800 font-bold'>
            <Calendar size={18} className='text-red-600' />
            <h3>Lịch Sử Phiếu Nhập Kho</h3>
            <span className='px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full font-semibold border border-red-200'>
              {totalCount} phiếu
            </span>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600 cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Container with scroll */}
        <div className='p-6 flex-1 overflow-y-auto min-h-0 bg-gray-50/20'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <span className='h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent mb-3' />
              <p className='text-xs text-gray-500 font-semibold animate-pulse'>Đang tải lịch sử nhập kho...</p>
            </div>
          ) : receipts.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
              <CornerDownLeft size={36} className='text-gray-300 mb-2' />
              <h4 className='font-bold text-gray-700 mb-1 text-sm'>Chưa có phiếu nhập kho nào</h4>
              <p className='text-xs text-gray-400 max-w-xs'>
                Các hoạt động nhập kho bổ sung sẽ được lưu vết và hiển thị tại đây.
              </p>
            </div>
          ) : (
            <div className='bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse text-left text-xs text-gray-500'>
                  <thead className='bg-gray-50 font-bold uppercase text-gray-600 border-b border-gray-100'>
                    <tr>
                      <th scope='col' className='px-4 py-3'>Mã phiếu</th>
                      <th scope='col' className='px-4 py-3'>Sản phẩm / Biến thể</th>
                      <th scope='col' className='px-4 py-3'>Chi nhánh</th>
                      <th scope='col' className='px-4 py-3 text-center'>Số lượng</th>
                      <th scope='col' className='px-4 py-3'>Người lập</th>
                      <th scope='col' className='px-4 py-3'>Thời gian</th>
                      <th scope='col' className='px-4 py-3'>Ghi chú</th>
                      <th scope='col' className='px-4 py-3 text-center'>Trạng thái</th>
                      <th scope='col' className='px-4 py-3 text-center'>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100 bg-white font-medium'>
                    {receipts.map((r) => {
                      const isCancelled = r.status === 'cancelled';
                      return (
                        <tr
                          key={r._id}
                          className={`hover:bg-gray-50/50 transition-colors ${
                            isCancelled ? 'bg-gray-50/40 text-gray-400' : ''
                          }`}
                        >
                          <td className='px-4 py-3 font-mono font-bold text-gray-900'>
                            {r.receiptNumber}
                          </td>
                          <td className='px-4 py-3'>
                            <div className='max-w-[150px]'>
                              <p className={`font-bold truncate ${isCancelled ? 'text-gray-400' : 'text-gray-800'}`}>
                                {r.product?.name || 'Sản phẩm đã bị xóa'}
                              </p>
                              <p className='text-[10px] text-gray-400 mt-0.5'>
                                Biến thể index: {r.variantIndex}
                              </p>
                            </div>
                          </td>
                          <td className='px-4 py-3 text-gray-700 font-semibold'>
                            {r.branch?.name || 'N/A'}
                          </td>
                          <td className='px-4 py-3 text-center font-bold text-emerald-600 text-sm'>
                            +{r.quantity} máy
                          </td>
                          <td className='px-4 py-3'>
                            <div className='flex items-center gap-1.5'>
                              <div className='w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0 text-[10px]'>
                                <User size={10} />
                              </div>
                              <div className='text-[10px] leading-tight'>
                                <p className='font-bold text-gray-700 truncate max-w-[100px]'>
                                  {r.createdBy?.name || 'Hệ thống'}
                                </p>
                                <p className='text-gray-400 truncate max-w-[100px]'>
                                  {r.createdBy?.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className='px-4 py-3 text-gray-500 font-semibold whitespace-nowrap'>
                            {formatDate(r.receiptDate)}
                          </td>
                          <td className='px-4 py-3 italic text-gray-400 max-w-[120px] truncate' title={r.notes}>
                            {r.notes || 'Không có ghi chú'}
                          </td>
                          <td className='px-4 py-3 text-center whitespace-nowrap'>
                            {isCancelled ? (
                              <span className='px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-400 border border-gray-200'>
                                Đã hủy
                              </span>
                            ) : (
                              <span className='px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-600 border border-emerald-200'>
                                Hoàn thành
                              </span>
                            )}
                          </td>
                          <td className='px-4 py-3 text-center'>
                            {!isCancelled && (
                              <button
                                onClick={() => onCancelReceipt(r._id)}
                                className='p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer'
                                title='Hủy phiếu nhập và giảm tồn kho tương ứng'
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Pagination & Close) */}
        <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0'>
          {/* Phân trang */}
          {totalPages > 1 ? (
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                variant='outline'
                disabled={currentPage <= 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
                className='h-8 w-8 p-0 cursor-pointer'
              >
                <ArrowLeft size={14} />
              </Button>
              <span className='text-xs font-semibold text-gray-500'>
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                size='sm'
                variant='outline'
                disabled={currentPage >= totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
                className='h-8 w-8 p-0 cursor-pointer'
              >
                <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            <div />
          )}

          <Button
            onClick={onClose}
            variant='outline'
            className='cursor-pointer text-xs md:text-sm font-semibold'
          >
            Đóng cửa sổ
          </Button>
        </div>
      </div>
    </div>
  );
}
