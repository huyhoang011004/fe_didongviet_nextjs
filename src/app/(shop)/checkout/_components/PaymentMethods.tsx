'use client';

import React from 'react';
import { CreditCard, Truck } from 'lucide-react';

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
}

export default function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodsProps) {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4'>
      <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3'>
        <CreditCard size={15} className='text-purple-500' />
        Phương thức thanh toán
      </h2>

      <div className='flex flex-col gap-3'>
        {/* Option 1: COD */}
        <label
          onClick={() => setPaymentMethod('COD')}
          className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none
            ${
              paymentMethod === 'COD'
                ? 'border-didongviet-red bg-red-50/10 text-didongviet-red'
                : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
            }
          `}
        >
          <input
            type='radio'
            name='payment'
            checked={paymentMethod === 'COD'}
            onChange={() => setPaymentMethod('COD')}
            className='h-4 w-4 text-didongviet-red accent-didongviet-red cursor-pointer shrink-0'
          />

          <div className='h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0'>
            <Truck size={20} className='text-didongviet-red' />
          </div>

          <div className='flex-1 text-left'>
            <div className='flex items-center gap-2'>
              <div className='text-xs font-bold text-slate-800'>
                Giao hàng (COD)
              </div>
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide
                ${paymentMethod === 'COD' ? 'bg-red-100 text-didongviet-red' : 'bg-slate-100 text-slate-400'}
              `}
              >
                COD
              </span>
            </div>
            <div className='text-[9px] text-slate-400 font-semibold leading-tight'>
              Thanh toán tiền mặt khi nhận hàng
            </div>
          </div>
        </label>

        {/* Option 2: MOMO */}
        <label
          onClick={() => setPaymentMethod('MOMO')}
          className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none
            ${
              paymentMethod === 'MOMO'
                ? 'border-pink-500 bg-pink-50/10 text-pink-600'
                : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
            }
          `}
        >
          <input
            type='radio'
            name='payment'
            checked={paymentMethod === 'MOMO'}
            onChange={() => setPaymentMethod('MOMO')}
            className='h-4 w-4 text-pink-600 accent-pink-600 cursor-pointer shrink-0'
          />

          <div className='h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center border border-pink-100 font-black text-[10px] text-pink-600 shrink-0'>
            MoMo
          </div>

          <div className='flex-1 text-left'>
            <div className='flex items-center gap-2'>
              <div className='text-xs font-bold text-slate-800'>
                Thanh toán MoMo
              </div>
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide
                ${paymentMethod === 'MOMO' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-400'}
              `}
              >
                Ví điện tử
              </span>
            </div>
            <div className='text-[9px] text-slate-400 font-semibold leading-tight'>
              Quét mã QR qua ví điện tử MoMo
            </div>
          </div>
        </label>

        {/* Option 3: VNPAY */}
        <label
          onClick={() => setPaymentMethod('VNPAY')}
          className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none
            ${
              paymentMethod === 'VNPAY'
                ? 'border-blue-500 bg-blue-50/10 text-blue-600'
                : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
            }
          `}
        >
          <input
            type='radio'
            name='payment'
            checked={paymentMethod === 'VNPAY'}
            onChange={() => setPaymentMethod('VNPAY')}
            className='h-4 w-4 text-blue-600 accent-blue-600 cursor-pointer shrink-0'
          />

          <div className='h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 font-black text-[10px] text-blue-600 shrink-0'>
            VNPay
          </div>

          <div className='flex-1 text-left'>
            <div className='flex items-center gap-2'>
              <div className='text-xs font-bold text-slate-800'>Cổng VNPay</div>
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide
                ${paymentMethod === 'VNPAY' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}
              `}
              >
                Cổng QR-Pay
              </span>
            </div>
            <div className='text-[9px] text-slate-400 font-semibold leading-tight'>
              Quét mã Mobile Banking của ngân hàng
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
