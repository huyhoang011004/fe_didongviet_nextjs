'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  ChevronRight,
  Copy,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Scissors
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/vouchers`);
        const data = await res.json();
        
        if (data.success) {
          setVouchers(data.data || []);
        }
      } catch (err) {
        console.error('Lỗi khi tải mã giảm giá:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVouchers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-12'>
      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-6xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Tổng hợp Voucher</span>
        </div>
      </nav>

      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='h-10 w-10 bg-didongviet-red text-white rounded-xl flex items-center justify-center shadow-md shadow-red-200'>
            <Ticket size={20} />
          </div>
          <div>
            <h1 className='text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight'>
              Mã giảm giá hot nhất
            </h1>
            <p className='text-xs text-slate-500 font-medium mt-1'>
              Lưu ngay mã ưu đãi để mua sắm tiết kiệm hơn tại Di Động Việt
            </p>
          </div>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse'>
             {[...Array(6)].map((_, i) => (
                <div key={i} className='h-36 bg-slate-200 rounded-2xl' />
             ))}
          </div>
        ) : vouchers.length === 0 ? (
          <div className='text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm'>
            <AlertCircle size={48} className='mx-auto text-slate-300 mb-4' />
            <h2 className='text-base font-black text-slate-700 uppercase'>Hiện chưa có mã giảm giá nào</h2>
            <p className='text-xs text-slate-500 mt-2'>Vui lòng quay lại sau để cập nhật những ưu đãi mới nhất.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
            {vouchers.map((voucher) => {
               const isExpired = new Date(voucher.expiryDate) < new Date();
               const isCopied = copiedCode === voucher.code;

               return (
                  <div key={voucher._id} className={`relative flex bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md ${isExpired ? 'opacity-60 grayscale' : ''}`}>
                     {/* Cạnh răng cưa mô phỏng vé */}
                     <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 h-full py-4 justify-between z-10">
                        {[...Array(8)].map((_, i) => (
                           <div key={i} className="w-4 h-4 bg-slate-50 rounded-full shadow-inner" />
                        ))}
                     </div>

                     {/* Phần trái: Giá trị giảm */}
                     <div className="bg-gradient-to-br from-red-50 to-red-100 w-[120px] sm:w-[140px] flex flex-col items-center justify-center p-4 border-r border-dashed border-red-200 relative">
                        <Tag size={20} className="text-red-400 mb-2 opacity-50" />
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider text-center">Giảm</span>
                        <span className="text-lg sm:text-xl font-black text-didongviet-red tracking-tighter my-1">
                           {voucher.discountType === 'percent' ? `${voucher.discountValue}%` : formatVND(voucher.discountValue)}
                        </span>
                        {voucher.discountType === 'percent' && voucher.maxDiscountAmount && (
                           <span className="text-[9px] font-medium text-red-600 text-center leading-tight">
                              Tối đa {formatVND(voucher.maxDiscountAmount)}
                           </span>
                        )}
                        
                        <Scissors size={14} className="absolute -right-2 top-1/2 -translate-y-1/2 text-red-200 bg-white" />
                     </div>

                     {/* Phần phải: Thông tin */}
                     <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="space-y-1.5">
                           <div className="flex justify-between items-start">
                              <h3 className="font-bold text-sm text-slate-800 line-clamp-2 pr-2">
                                 {voucher.description || `Mã giảm giá ${voucher.code}`}
                              </h3>
                              <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded tracking-wider mt-0.5">
                                 SL: {voucher.usageLimit - (voucher.usageCount || 0)}
                              </span>
                           </div>
                           <p className="text-[10px] font-medium text-slate-500">
                              Đơn tối thiểu {formatVND(voucher.minOrderValue || 0)}
                           </p>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-2">
                           <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400">
                              <Clock size={12} />
                              HSD: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}
                           </div>

                           <Button
                              onClick={() => !isExpired && handleCopy(voucher.code)}
                              disabled={isExpired}
                              size="sm"
                              className={`h-8 px-4 text-[10px] font-bold uppercase tracking-wider rounded-lg border-none transition-all ${
                                 isCopied 
                                 ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                                 : 'bg-didongviet-red hover:bg-didongviet-dark-red text-white shadow-red-200'
                              } shadow-md`}
                           >
                              {isCopied ? (
                                 <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Đã sao chép</span>
                              ) : (
                                 <span className="flex items-center gap-1"><Copy size={12} /> Lưu mã</span>
                              )}
                           </Button>
                        </div>
                     </div>
                  </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
