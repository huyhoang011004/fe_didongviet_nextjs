'use client';

import { useState, useEffect } from 'react';
import { X, Plus, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface CreateReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  variantIndex: number | null;
  branchId: string;
  branches: any[];
  isPending: boolean;
  onSubmit: (quantity: number, notes?: string) => void;
}

export default function CreateReceiptModal({
  isOpen,
  onClose,
  product,
  variantIndex,
  branchId,
  branches,
  isPending,
  onSubmit,
}: CreateReceiptModalProps) {
  const [quantity, setQuantity] = useState<number>(10);
  const [notes, setNotes] = useState<string>('');

  // Reset values when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(10);
      setNotes('');
    }
  }, [isOpen]);

  if (!isOpen || !product || variantIndex === null) return null;

  const variant = product.variants[variantIndex];
  const branch = branches.find((b) => b._id === branchId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      alert('Số lượng nhập kho phải lớn hơn 0');
      return;
    }
    onSubmit(quantity, notes.trim());
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs'>
      <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in-50 zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100'>
          <div className='flex items-center gap-2 text-gray-800 font-bold'>
            <FileSpreadsheet size={18} className='text-red-600' />
            <h3>Lập Phiếu Nhập Kho Bổ Sung</h3>
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
              <span className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1'>Nhập về kho chi nhánh</span>
              <p className='font-bold text-gray-800 text-sm bg-emerald-50 text-emerald-700 px-2 py-1.5 rounded-lg border border-emerald-100 inline-flex items-center gap-1.5'>
                <span className='w-2 h-2 rounded-full bg-emerald-500' />
                {branch?.name || 'Chi nhánh chưa xác định'}
              </p>
            </div>

            {/* Số lượng nhập bổ sung */}
            <div>
              <label className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5'>Số lượng nhập hàng (máy)</label>
              <Input
                type='number'
                min={1}
                max={99999}
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className='h-10 text-center font-bold text-emerald-600 focus-visible:ring-emerald-500 text-base rounded-lg border-gray-200'
              />
            </div>

            {/* Ghi chú nhập kho */}
            <div>
              <label className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5'>Ghi chú nhập kho (không bắt buộc)</label>
              <textarea
                placeholder='Nhập lý do hoặc thông tin nhà cung cấp, số hóa đơn...'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className='w-full text-xs md:text-sm rounded-lg border border-gray-200 p-2.5 focus:border-red-500 focus:outline-hidden resize-none font-medium'
              />
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
                <Plus size={16} />
              )}
              Tạo phiếu nhập kho
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
