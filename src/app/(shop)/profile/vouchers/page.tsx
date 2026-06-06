'use client';

import { useEffect, useState } from 'react';
import { Ticket, Percent, Clock, AlertCircle, Check, Copy, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { fetchVouchers } from '../../cart/cart-actions';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProfileVouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadVouchers() {
      try {
        const data = await fetchVouchers();
        setVouchers(data || []);
      } catch (err) {
        console.error('Lỗi khi tải vouchers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVouchers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4'>
        <div className='h-6 w-32 bg-slate-200 rounded-md animate-pulse' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='h-24 bg-slate-100 rounded-xl animate-pulse' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-5 animate-in fade-in duration-300'>
      <div className='flex items-center justify-between border-b border-slate-100 pb-3.5 mb-2'>
        <div className='flex items-center gap-2'>
          <Ticket size={16} className='text-didongviet-red' />
          <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
            Kho Voucher D.Member
          </h2>
        </div>
        <span className='text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-lg'>
          Hiện có: {vouchers.length}
        </span>
      </div>

      {vouchers.length === 0 ? (
        <div className='text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200'>
          <AlertCircle size={32} className='mx-auto text-slate-300 mb-2' />
          <p className='text-xs font-semibold text-slate-500'>
            Không tìm thấy mã giảm giá nào khả dụng.
          </p>
          <p className='text-[9px] text-slate-400 mt-0.5'>
            Các chương trình khuyến mãi mới nhất sẽ sớm quay trở lại!
          </p>
          <Button
            asChild
            className='mt-4.5 bg-didongviet-red hover:bg-red-700 text-white h-8 text-[10px] font-black rounded-lg border-none shadow-sm cursor-pointer'
          >
            <Link href='/'>Trang chủ Di Động Việt</Link>
          </Button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {vouchers.map((v: any, idx: number) => {
            const isPercent = v.discountType === 'percentage';
            const valueStr = isPercent
              ? `Giảm ${v.discountValue}%`
              : `Giảm ${formatVND(v.discountValue || v.amount || 0)}`;

            return (
              <div
                key={v._id || v.code || idx}
                className='relative flex bg-white border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-sm hover:border-slate-200 group'
              >
                {/* Trái: Phần vé xé mang màu sắc nổi bật */}
                <div className='w-16 bg-gradient-to-br from-red-500 to-didongviet-red flex flex-col items-center justify-center relative shrink-0 text-white select-none'>
                  {isPercent ? <Percent size={18} /> : <Ticket size={18} />}
                  <span className='text-[8px] font-extrabold uppercase tracking-widest mt-1 scale-90'>
                    {isPercent ? `${v.discountValue}%` : 'GIẢM'}
                  </span>
                  {/* Vết cắt nửa hình tròn ngăn cách */}
                  <div className='absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full bg-white border-l border-slate-100 z-10' />
                </div>

                {/* Phải: Chi tiết Voucher */}
                <div className='flex-1 p-3.5 flex items-center justify-between min-w-0 relative'>
                  {/* Vết cắt lõm phía bên phải của mép ngăn cách */}
                  <div className='absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-full bg-white border-r border-slate-100 z-10' />

                  <div className='min-w-0 space-y-1.5 pl-3'>
                    <div className='flex items-center gap-1.5 flex-wrap'>
                      <span className='text-xs font-black text-slate-800 tracking-wide uppercase font-mono'>
                        {v.code}
                      </span>
                    </div>

                    <div className='text-[10px] text-slate-700 font-bold leading-snug line-clamp-1'>
                      {v.title || v.description || valueStr}
                    </div>

                    {/* Hạn dùng & điều kiện đơn hàng */}
                    <div className='flex flex-col gap-1 text-[8px] text-slate-400 font-bold'>
                      <span className='flex items-center gap-0.5 shrink-0'>
                        <Clock size={9} />
                        Hạn dùng: HSD gần nhất
                      </span>
                      {v.minOrderAmount > 0 && (
                        <span className='w-fit bg-slate-50 text-slate-500 px-1 py-0.2 rounded border border-slate-100'>
                          Đơn tối thiểu: {formatVND(v.minOrderAmount)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className='flex flex-col items-end gap-1.5 shrink-0 pl-1.5 self-center'>
                    <button
                      onClick={() => handleCopyCode(v.code)}
                      className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg border cursor-pointer select-none transition-all duration-150 flex items-center gap-1
                        ${copiedCode === v.code
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-600 font-extrabold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 active:scale-95'
                        }
                      `}
                    >
                      {copiedCode === v.code ? (
                        <>
                          <Check size={10} className='stroke-[3]' />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy size={9} />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <Link
                      href='/cart'
                      className='text-[9px] font-black px-2.5 py-1.5 bg-didongviet-red hover:bg-red-700 text-white rounded-lg cursor-pointer transition-all duration-150 flex items-center gap-0.5 decoration-transparent hover:scale-105 active:scale-95'
                    >
                      <span>Dùng ngay</span>
                      <ArrowRight size={9} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
