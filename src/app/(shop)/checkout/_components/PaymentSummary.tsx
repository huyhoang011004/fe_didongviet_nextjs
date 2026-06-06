'use client';

import React from 'react';
import { Button } from '@/shared/components/ui/button';

interface PaymentSummaryProps {
  selectedTotalPrice: number;
  shippingPrice: number;
  discountAmount: number;
  grandTotal: number;
  submitting: boolean;
  handlePlaceOrder: () => void;
  formatVND: (num: number) => string;
}

export default function PaymentSummary({
  selectedTotalPrice,
  shippingPrice,
  discountAmount,
  grandTotal,
  submitting,
  handlePlaceOrder,
  formatVND,
}: PaymentSummaryProps) {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4'>
      <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight border-b border-slate-50 pb-3'>
        Tóm tắt thanh toán
      </h2>

      <div className='space-y-2.5 text-[11px] font-medium text-slate-500 border-b border-slate-50 pb-3.5'>
        <div className='flex items-center justify-between'>
          <span>Tổng tiền hàng</span>
          <span className='font-bold text-slate-700 font-mono'>
            {formatVND(selectedTotalPrice)}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span>Phí vận chuyển</span>
          <span
            className={`font-black font-mono
              ${shippingPrice === 0 ? 'text-emerald-600' : 'text-slate-700'}
            `}
          >
            {shippingPrice === 0 ? 'Miễn phí' : formatVND(shippingPrice)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className='flex items-center justify-between text-green-600 font-bold'>
            <span>Voucher giảm giá</span>
            <span className='font-mono'>
              -{formatVND(discountAmount)}
            </span>
          </div>
        )}
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-black text-slate-800 uppercase'>
            Tổng thanh toán
          </span>
          <span className='text-lg font-black text-didongviet-red font-mono'>
            {formatVND(grandTotal)}
          </span>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={submitting}
          className='w-full bg-didongviet-red hover:bg-red-700 text-white py-5.5 rounded-xl font-black border-none shadow-md cursor-pointer text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100'
        >
          {submitting ? 'ĐANG XỬ LÝ ĐƠN HÀNG...' : 'ĐẶT HÀNG NGAY'}
        </Button>
      </div>
    </div>
  );
}
