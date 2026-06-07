'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  ChevronRight,
  PackageSearch,
  CheckCircle,
  AlertCircle,
  Package,
  Calendar,
  CreditCard,
  Clock,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
};

export default function TrackingPage() {
  const [formData, setFormData] = useState({
    orderId: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!formData.orderId.trim() || !formData.phone.trim()) {
      setError('Vui lòng nhập đầy đủ Mã đơn hàng và Số điện thoại mua hàng');
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const query = new URLSearchParams({
        orderId: formData.orderId.trim(),
        phone: formData.phone.trim(),
      });

      const res = await fetch(`${apiUrl}/orders/track?${query.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
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
          <span className='text-slate-800 font-bold'>Tra cứu đơn hàng</span>
        </div>
      </nav>

      <div className='max-w-3xl mx-auto px-4 py-6'>
        <div className='text-center mb-6 space-y-2'>
          <div className='h-12 w-12 bg-didongviet-red/10 text-didongviet-red rounded-full flex items-center justify-center mx-auto mb-2'>
            <PackageSearch size={24} />
          </div>
          <h1 className='text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight'>
            Kiểm tra trạng thái đơn hàng
          </h1>
          <p className='text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed'>
            Để tra cứu hành trình đơn hàng, quý khách vui lòng nhập chính xác{' '}
            <strong>Mã đơn hàng</strong> và <strong>Số điện thoại</strong> đã dùng để đặt hàng.
          </p>
        </div>

        <div className='bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden'>
          <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* Form */}
            <div className='p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-100'>
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='space-y-2'>
                  <label className='text-[11px] font-bold text-slate-600 uppercase tracking-wide'>
                    Mã đơn hàng
                  </label>
                  <Input
                    placeholder='VD: 64a7b...'
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    className='h-11 text-xs font-semibold placeholder:font-normal'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-[11px] font-bold text-slate-600 uppercase tracking-wide'>
                    Số điện thoại
                  </label>
                  <Input
                    placeholder='Nhập số điện thoại mua hàng'
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className='h-11 text-xs font-semibold placeholder:font-normal'
                  />
                </div>

                {error && (
                  <div className='flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in'>
                    <AlertCircle size={16} className='flex-shrink-0 mt-0.5' />
                    <p className='text-xs font-medium'>{error}</p>
                  </div>
                )}

                <Button
                  type='submit'
                  disabled={submitting}
                  className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white h-12 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]'
                >
                  {submitting ? 'Đang tra cứu...' : 'Tra cứu ngay'}
                </Button>
              </form>
            </div>

            {/* Result */}
            <div className='p-6 sm:p-8 bg-slate-50/50 flex flex-col justify-center min-h-[300px]'>
              {!result ? (
                <div className='text-center space-y-4 opacity-50'>
                  <FileSearch size={48} className='mx-auto text-slate-300' />
                  <p className='text-xs font-medium text-slate-500'>
                    Kết quả tra cứu sẽ hiển thị tại đây
                  </p>
                </div>
              ) : (
                <div className='space-y-6 animate-in slide-in-from-right-4 fade-in duration-300'>
                  <div className='flex items-center gap-3 pb-4 border-b border-slate-200'>
                    <div className='h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0'>
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className='text-[10px] uppercase font-bold text-slate-400'>Mã ĐH</p>
                      <p className='text-sm font-black text-slate-800 break-all'>
                        {result.orderId}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                      <Package size={16} className='text-slate-400 mt-0.5' />
                      <div>
                        <p className='text-[11px] font-medium text-slate-500'>Trạng thái hiện tại</p>
                        <p className={`text-sm font-bold ${result.status === 'Đã giao' ? 'text-green-600' :
                            result.status === 'Đã hủy' ? 'text-red-600' :
                              'text-amber-500'
                          }`}>
                          {result.status || 'Chờ xác nhận'}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <CreditCard size={16} className='text-slate-400 mt-0.5' />
                      <div>
                        <p className='text-[11px] font-medium text-slate-500'>Thanh toán</p>
                        <p className={`text-xs font-bold ${result.isPaid ? 'text-green-600' : 'text-slate-700'}`}>
                          {result.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán (Thanh toán khi nhận hàng)'}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-3'>
                      <Calendar size={16} className='text-slate-400 mt-0.5' />
                      <div>
                        <p className='text-[11px] font-medium text-slate-500'>Ngày đặt hàng</p>
                        <p className='text-xs font-bold text-slate-700'>
                          {result.createdAt ? formatDate(result.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] text-slate-400 italic text-center">Để xem chi tiết sản phẩm, vui lòng đăng nhập vào tài khoản của bạn.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
