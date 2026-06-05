'use client';

import { useState, useEffect } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface UpdateStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  variantIndex: number | null;
  branchId: string;
  branches: any[];
  currentStock: number;
  isPending: boolean;
  onSubmit: (newStock: number) => void;
}

export default function UpdateStockModal({
  isOpen,
  onClose,
  product,
  variantIndex,
  branchId,
  branches,
  currentStock,
  isPending,
  onSubmit,
}: UpdateStockModalProps) {
  const [newStock, setNewStock] = useState(currentStock);

  // Reset giá trị mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setNewStock(currentStock);
    }
  }, [isOpen, currentStock]);

  if (!isOpen || !product || variantIndex === null) return null;

  const variant = product.variants[variantIndex];
  const branch = branches.find((b) => b._id === branchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStock < 0) {
      alert('Số lượng tồn kho không được nhỏ hơn 0');
      return;
    }
    onSubmit(newStock);
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs'>
      <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in-50 zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100'>
          <div className='flex items-center gap-2 text-gray-800 font-bold'>
            <ShieldAlert size={18} className='text-amber-500' />
            <h3>Điều Chỉnh Tồn Kho Chi Nhánh</h3>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600 cursor-pointer'
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className='p-6 space-y-4 text-sm text-gray-600'>
            {/* Tên sản phẩm & phiên bản */}
            <div>
              <span className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1'>Sản phẩm</span>
              <p className='font-bold text-gray-900 text-base'>{product.name}</p>
              <p className='text-xs font-semibold text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded inline-block'>
                Phiên bản: {variant.ram && `${variant.ram} / `}{variant.rom && `${variant.rom} / `}{variant.color} (SKU: {variant.sku || 'N/A'})
              </p>
            </div>

            {/* Chi nhánh */}
            <div>
              <span className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1'>Chi nhánh điều chỉnh</span>
              <p className='font-bold text-gray-800 text-sm bg-red-50/50 text-red-700 px-2 py-1.5 rounded-lg border border-red-100/50 inline-flex items-center gap-1.5'>
                <span className='w-2 h-2 rounded-full bg-red-500' />
                {branch?.name || 'Chi nhánh chưa xác định'}
              </p>
            </div>

            {/* Nhập tồn kho mới */}
            <div className='grid grid-cols-2 gap-4 pt-2'>
              <div>
                <label className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5'>Tồn hiện tại</label>
                <div className='h-10 border border-gray-200 bg-gray-50/80 rounded-lg flex items-center justify-center font-bold text-gray-700 text-base'>
                  {currentStock} máy
                </div>
              </div>
              <div>
                <label className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5'>Tồn kho mới</label>
                <Input
                  type='number'
                  min={0}
                  max={99999}
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                  className='h-10 text-center font-bold text-red-600 focus-visible:ring-red-500 text-base rounded-lg border-gray-200'
                />
              </div>
            </div>

            <div className='bg-amber-50 p-3 rounded-lg border border-amber-100 text-xs text-amber-700 flex items-start gap-2 leading-relaxed'>
              <ShieldAlert size={16} className='flex-shrink-0 mt-0.5' />
              <span>
                <strong>Cảnh báo:</strong> Thao tác này sẽ ghi đè trực tiếp số tồn kho thực tế của chi nhánh mà không tạo phiếu nhập. Chỉ thực hiện khi kiểm kho hoặc xử lý sai sót số liệu.
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3'>
            <Button
              type='button'
              onClick={onClose}
              variant='outline'
              disabled={isPending}
              className='cursor-pointer text-xs md:text-sm font-semibold'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={isPending}
              className='bg-red-600 hover:bg-red-700 text-white font-semibold text-xs md:text-sm flex items-center gap-1.5 cursor-pointer shadow-md'
            >
              {isPending ? (
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              ) : (
                <Save size={16} />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
