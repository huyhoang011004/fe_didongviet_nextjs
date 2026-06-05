'use client';

import { useState, useEffect } from 'react';
import { X, Sliders, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface ThresholdEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThreshold: number;
  isPending: boolean;
  onSubmit: (newThreshold: number) => void;
}

export default function ThresholdEditModal({
  isOpen,
  onClose,
  currentThreshold,
  isPending,
  onSubmit,
}: ThresholdEditModalProps) {
  const [threshold, setThreshold] = useState(currentThreshold);

  useEffect(() => {
    if (isOpen) {
      setThreshold(currentThreshold);
    }
  }, [isOpen, currentThreshold]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (threshold < 0) {
      alert('Ngưỡng cảnh báo không được nhỏ hơn 0');
      return;
    }
    onSubmit(threshold);
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs'>
      <div className='bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in-50 zoom-in-95 duration-200'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100'>
          <div className='flex items-center gap-2 text-gray-800 font-bold'>
            <Sliders size={18} className='text-red-600' />
            <h3>Ngưỡng Cảnh Báo Tồn Kho</h3>
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
            <p className='text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1'>
              Thiết lập hệ thống
            </p>
            <p className='text-xs leading-relaxed text-gray-500'>
              Thay đổi số lượng tối thiểu để kích hoạt nhãn <strong>"Cần bổ sung"</strong> và đưa sản phẩm vào bảng cảnh báo tồn kho sắp hết hàng.
            </p>

            {/* Input ngưỡng tồn kho */}
            <div>
              <label className='text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5'>
                Ngưỡng cảnh báo tối thiểu (máy)
              </label>
              <Input
                type='number'
                min={0}
                max={500}
                required
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                className='h-10 text-center font-bold text-red-600 focus-visible:ring-red-500 text-lg rounded-lg border-gray-200'
              />
            </div>

            <div className='bg-red-50/50 border border-red-100 p-3 rounded-lg text-[11px] text-red-700 leading-relaxed flex items-start gap-1.5'>
              <ShieldAlert size={14} className='flex-shrink-0 mt-0.5' />
              <span>
                Ngưỡng này áp dụng chung cho tất cả các chi nhánh cửa hàng của Di Động Việt trên toàn hệ thống.
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
              {isPending && (
                <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
              )}
              Cập nhật cấu hình
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
