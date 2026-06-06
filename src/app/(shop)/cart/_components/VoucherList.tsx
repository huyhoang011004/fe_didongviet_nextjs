'use client';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Loader2, Ticket, Percent, Clock, AlertCircle, Check, HelpCircle } from 'lucide-react';

export default function VoucherList({
  applicableVouchers,
  vouchers,
  bestVoucherCode,
  appliedVoucher,
  onApplyVoucher,
  onManualApply,
  loading,
}: any) {
  const [manual, setManual] = useState('');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  // Lọc các mã không khả dụng
  const nonApplicableVouchers = vouchers.filter(
    (v: any) => !applicableVouchers.find((av: any) => av.code === v.code)
  );

  return (
    <div className='space-y-4 font-sans'>
      {/* ─── PHẦN 1: NHẬP MÃ THỦ CÔNG ─── */}
      <div className='flex gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100'>
        <Input
          placeholder='Nhập mã giảm giá thủ công...'
          value={manual}
          onChange={(e) => setManual(e.target.value.toUpperCase())}
          className='text-xs h-9 rounded-lg border-slate-200 bg-white uppercase font-bold tracking-wider focus-visible:ring-didongviet-red/30'
        />
        <Button
          onClick={() => {
            onManualApply(manual);
            setManual('');
          }}
          disabled={loading || !manual.trim()}
          className='bg-didongviet-red hover:bg-red-700 text-white h-9 px-5 text-xs font-black rounded-lg border-none shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0 transition-all'
        >
          {loading ? (
            <Loader2 size={12} className='animate-spin' />
          ) : (
            <>
              <Check size={12} />
              <span>Áp dụng</span>
            </>
          )}
        </Button>
      </div>

      {/* ─── PHẦN 2: DANH SÁCH MÃ KHẢ DỤNG ─── */}
      <div className='space-y-3.5'>
        <div className='text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5'>
          <Ticket size={12} className='text-didongviet-red' />
          <span>Mã giảm giá khả dụng ({applicableVouchers.length})</span>
        </div>

        {applicableVouchers.length > 0 ? (
          <div className='space-y-2.5 pr-1'>
            {applicableVouchers.map((v: any) => {
              const isApplied = appliedVoucher && appliedVoucher.code === v.code;
              const isBest = v.code === bestVoucherCode;

              return (
                <div
                  key={v.code}
                  className={`relative flex bg-white border rounded-xl overflow-hidden transition-all duration-200 shadow-2xs hover:shadow-xs group
                    ${isApplied 
                      ? 'border-emerald-200 bg-emerald-50/5' 
                      : isBest 
                        ? 'border-amber-200 hover:border-amber-300' 
                        : 'border-slate-100 hover:border-slate-200'
                    }
                  `}
                >
                  {/* Trái: Phần vé xé với background gradient */}
                  <div
                    className={`w-16 flex flex-col items-center justify-center relative shrink-0 text-white select-none
                      ${isApplied 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                        : isBest 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                          : 'bg-gradient-to-br from-red-500 to-didongviet-red'
                      }
                    `}
                  >
                    {v.discountType === 'percentage' ? (
                      <Percent size={18} className='animate-pulse' />
                    ) : (
                      <Ticket size={18} className='animate-pulse' />
                    )}
                    <span className='text-[8px] font-extrabold uppercase tracking-widest mt-1 scale-90'>
                      {v.discountType === 'percentage' ? `${v.discountValue}%` : 'GIẢM'}
                    </span>

                    {/* Vết cắt nửa hình tròn ngăn cách */}
                    <div className='absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full bg-white border-l border-inherit z-10' />
                  </div>

                  {/* Phải: Chi tiết Voucher */}
                  <div className='flex-1 p-3 flex items-center justify-between min-w-0 relative'>
                    {/* Vết cắt lõm phía bên phải của mép ngăn cách */}
                    <div className='absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full bg-white border-r border-inherit z-10' />

                    <div className='min-w-0 space-y-1 pl-2.5'>
                      <div className='flex items-center gap-1.5 flex-wrap'>
                        <span className='text-xs font-black text-slate-800 tracking-wide uppercase'>
                          {v.code}
                        </span>
                        {isBest && (
                          <span className='text-[7px] font-black text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-95'>
                            Tốt nhất
                          </span>
                        )}
                        {isApplied && (
                          <span className='text-[7px] font-black text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-95 flex items-center gap-0.5'>
                            <Check size={8} />
                            Đã áp
                          </span>
                        )}
                      </div>

                      <div className='text-[10px] text-slate-500 font-semibold leading-snug line-clamp-1'>
                        {v.title || v.description || `Giảm ngay ${formatVND(v._value)}`}
                      </div>

                      {/* Thông tin hạn dùng & điều kiện đơn hàng */}
                      <div className='flex items-center gap-2 text-[8px] text-slate-400 font-bold'>
                        <span className='flex items-center gap-0.5 shrink-0'>
                          <Clock size={9} />
                          Hạn dùng: HSD gần nhất
                        </span>
                        {v.minOrderAmount > 0 && (
                          <span className='shrink-0 bg-slate-50 text-slate-500 px-1 py-0.2 rounded border border-slate-100'>
                            Đơn tối thiểu: {formatVND(v.minOrderAmount)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Khối giá trị giảm & nút áp dụng */}
                    <div className='text-right flex flex-col items-end gap-1.5 shrink-0 pl-2'>
                      <div className='text-xs font-black text-didongviet-red font-mono shrink-0'>
                        -{formatVND(v._value)}
                      </div>
                      
                      <button
                        onClick={() => onApplyVoucher(v)}
                        disabled={isApplied}
                        className={`text-[9px] font-black px-2.5 py-1 rounded-full border cursor-pointer select-none transition-all duration-150
                          ${isApplied
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600 cursor-default font-extrabold'
                            : 'border-didongviet-red/20 bg-white hover:bg-didongviet-red hover:text-white text-didongviet-red hover:scale-105 active:scale-95'
                          }
                        `}
                      >
                        {isApplied ? 'Đã chọn' : 'Áp dụng'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-6 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1'>
            <AlertCircle size={14} className='text-slate-300' />
            <span>Chưa đạt điều kiện đơn hàng tối thiểu của bất kỳ mã nào</span>
          </div>
        )}
      </div>

      {/* ─── PHẦN 3: DANH SÁCH MÃ KHÔNG KHẢ DỤNG ─── */}
      {nonApplicableVouchers.length > 0 && (
        <div className='space-y-2.5 pt-2'>
          <div className='text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5'>
            <AlertCircle size={12} className='text-slate-400' />
            <span>Mã giảm giá khác ({nonApplicableVouchers.length})</span>
          </div>

          <div className='space-y-2 pr-1'>
            {nonApplicableVouchers.slice(0, 3).map((v: any) => (
              <div
                key={v.code}
                className='relative flex bg-slate-50/50 border border-slate-100/60 rounded-xl overflow-hidden opacity-60'
              >
                {/* Phần vé xé bên trái bị làm mờ xám */}
                <div className='w-16 bg-slate-300 text-white flex flex-col items-center justify-center relative shrink-0 select-none'>
                  <Ticket size={18} />
                  <span className='text-[8px] font-extrabold uppercase mt-0.5 scale-90'>MÃ</span>
                  <div className='absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full bg-white border-l border-slate-100 z-10' />
                </div>

                {/* Phần chi tiết bên phải */}
                <div className='flex-1 p-2.5 flex items-center justify-between min-w-0 relative'>
                  <div className='absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full bg-white border-r border-slate-100 z-10' />

                  <div className='min-w-0 space-y-0.5 pl-2.5 text-left'>
                    <div className='text-[10px] font-bold text-slate-500 uppercase tracking-wide'>
                      {v.code}
                    </div>
                    <div className='text-[9px] text-slate-400 font-medium line-clamp-1'>
                      {v.title || v.description || 'Chưa đủ điều kiện áp dụng'}
                    </div>
                    {v.minOrderAmount > 0 && (
                      <div className='text-[8px] text-red-500/80 font-bold'>
                        Đơn tối thiểu: {formatVND(v.minOrderAmount)}
                      </div>
                    )}
                  </div>

                  <div className='text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-full shrink-0 border border-slate-200/50'>
                    Chưa đạt
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
