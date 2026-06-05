'use client';

import { Eye, EyeOff, Edit, Trash2, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ProductTableProps {
  products: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string, currentActive: boolean) => void;
  onEditClick: (product: any) => void;
  onDeleteClick: (product: any) => void;
  currentUserRole?: string;
  selectedBranchFilter?: string;
  branches?: any[];
}

export function ProductTable({
  products,
  loading,
  currentPage,
  totalPages,
  totalProducts,
  onPageChange,
  onToggleStatus,
  onEditClick,
  onDeleteClick,
  currentUserRole,
  selectedBranchFilter = '',
  branches = [],
}: ProductTableProps) {
  // Định dạng hiển thị tiền tệ VNĐ
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  // Lấy tên chi nhánh đang lọc (nếu có)
  const selectedBranchName = selectedBranchFilter
    ? (branches.find((b) => b._id === selectedBranchFilter)?.name || 'Chi nhánh')
    : null;

  return (
    <div>
      {loading ? (
        <div className='flex flex-col items-center justify-center p-20'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang lấy danh mục sản phẩm từ MongoDB...
          </span>
        </div>
      ) : products.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
          <FolderOpen size={48} className='text-slate-300 mb-2' />
          <p className='text-sm font-semibold'>
            Không có sản phẩm nào trong cửa hàng.
          </p>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse min-w-[700px]'>
            <thead>
              <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                <th className='py-4 px-6'>Sản phẩm</th>
                <th className='py-4 px-6'>Thương hiệu</th>
                <th className='py-4 px-6'>Giá (Khoảng)</th>
                <th className='py-4 px-6'>
                  {selectedBranchName ? (
                    <span className='flex items-center gap-1'>
                      Tồn kho
                      <span className='text-didongviet-red'>({selectedBranchName})</span>
                    </span>
                  ) : (
                    'Tổng tồn kho'
                  )}
                </th>
                <th className='py-4 px-6'>Trạng thái</th>
                <th className='py-4 px-6 text-right'>Hành động</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
              {products.map((p) => {
                const minP = p.priceRange?.min || 0;
                const maxP = p.priceRange?.max || 0;
                const stock = p.totalStock ?? 0;
                const thumbUrl = p.imageUrl || '/auth-image.webp';

                return (
                  <tr
                    key={p._id}
                    className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                  >
                    <td className='py-4 px-6 flex items-center gap-3 min-w-[280px]'>
                      <div className='h-12 w-12 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center p-1 flex-shrink-0'>
                        <img
                          src={thumbUrl}
                          alt={p.name}
                          className='h-full w-full object-contain'
                        />
                      </div>
                      <div>
                        <span className='font-bold text-slate-900 dark:text-white block leading-tight'>
                          {p.name}
                        </span>
                        <span className='text-[10px] text-slate-400 font-mono mt-0.5 block'>
                          {p._id}
                        </span>
                      </div>
                    </td>
                    <td className='py-4 px-6 font-semibold text-slate-600 dark:text-slate-400'>
                      {p.brand || 'Di Động Việt'}
                    </td>
                    <td className='py-4 px-6 font-bold text-didongviet-red'>
                      {minP === maxP
                        ? formatVND(minP)
                        : `${formatVND(minP)} - ${formatVND(maxP)}`}
                    </td>
                    <td className='py-4 px-6 font-bold text-slate-800 dark:text-slate-200'>
                      {stock} máy
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`
                        flex items-center gap-1.5 text-xs font-semibold
                        ${p.isActive ? 'text-emerald-600' : 'text-slate-400'}
                      `}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${p.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`}
                        />
                        <span>
                          {p.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                        </span>
                      </span>
                    </td>
                    <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                      <Button
                        onClick={() => onToggleStatus(p._id, p.isActive)}
                        variant='outline'
                        size='icon'
                        className={`h-8 w-8 border-slate-200 cursor-pointer ${p.isActive ? 'hover:text-slate-500 hover:bg-slate-50' : 'hover:text-emerald-600 hover:bg-emerald-50'}`}
                        title={p.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                      >
                        {p.isActive ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </Button>

                      <Button
                        onClick={() => onEditClick(p)}
                        variant='outline'
                        size='icon'
                        className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                        title='Chỉnh sửa'
                      >
                        <Edit size={14} />
                      </Button>

                      {currentUserRole === 'admin' && (
                        <Button
                          onClick={() => onDeleteClick(p)}
                          variant='outline'
                          size='icon'
                          className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                          title='Xóa vĩnh viễn'
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <span className='text-xs text-slate-400 font-medium'>
                Trang{' '}
                <strong className='text-slate-700 dark:text-slate-300'>
                  {currentPage}
                </strong>{' '}
                trên{' '}
                <strong className='text-slate-700 dark:text-slate-300'>
                  {totalPages}
                </strong>{' '}
                (Tổng {totalProducts} sản phẩm)
              </span>
              <div className='flex gap-1.5'>
                <Button
                  disabled={currentPage <= 1}
                  onClick={() => onPageChange(currentPage - 1)}
                  variant='outline'
                  size='sm'
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  <ChevronLeft size={16} className='mr-1' /> Trước
                </Button>
                <Button
                  disabled={currentPage >= totalPages}
                  onClick={() => onPageChange(currentPage + 1)}
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
      )}
    </div>
  );
}
