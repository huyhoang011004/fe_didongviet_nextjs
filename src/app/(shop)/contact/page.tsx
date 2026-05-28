'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  HeadphonesIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Tư vấn mua hàng',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
      setAlert({ type: 'error', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)' });
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${apiUrl}/contacts/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAlert({ type: 'success', message: 'Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm nhất.' });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: 'Tư vấn mua hàng',
          message: ''
        });
      } else {
        setAlert({ type: 'error', message: data.message || 'Lỗi khi gửi thông tin' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối máy chủ' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-12'>
      
      {/* Alert toast */}
      {alert && (
        <div className={`
          fixed bottom-4 right-4 z-50 p-3 rounded-xl shadow-lg border flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}>
          {alert.type === 'success' ? <CheckCircle size={16} className='text-green-600 flex-shrink-0' /> : <AlertCircle size={16} className='text-red-600 flex-shrink-0' />}
          <span className='text-[11px] font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-6xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>Trang chủ</Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Liên hệ hệ thống</span>
        </div>
      </nav>

      {/* HEADER BANNER */}
      <section className='bg-slate-900 py-12 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none' />
        <div className='max-w-6xl mx-auto px-4 relative z-10 text-center'>
          <h1 className='text-2xl sm:text-3xl font-black tracking-tight text-white uppercase mb-3'>Liên hệ Di Động Việt</h1>
          <p className='text-xs text-slate-400 font-medium max-w-lg mx-auto'>
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy liên hệ với Di Động Việt qua các kênh dưới đây!
          </p>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8'>
        
        {/* LEFT: INFO CARDS */}
        <div className='lg:col-span-5 space-y-4'>
          <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-6'>
            <h2 className='text-sm font-black text-slate-800 uppercase mb-5 flex items-center gap-2'>
              <HeadphonesIcon size={18} className='text-didongviet-red' />
              Thông tin liên hệ
            </h2>
            
            <div className='space-y-6'>
              <div className='flex gap-4'>
                <div className='h-10 w-10 rounded-full bg-red-50 text-didongviet-red flex items-center justify-center flex-shrink-0'>
                  <Phone size={18} />
                </div>
                <div>
                  <h3 className='text-xs font-bold text-slate-800'>Tổng đài hỗ trợ (Miễn phí)</h3>
                  <p className='text-lg font-black text-didongviet-red mt-1'>1800.6018</p>
                  <p className='text-[10px] text-slate-500 mt-1'>Tư vấn bán hàng: 08:00 - 21:30</p>
                  <p className='text-[10px] text-slate-500'>Bảo hành/Kỹ thuật: 08:30 - 21:00</p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0'>
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className='text-xs font-bold text-slate-800'>Email hỗ trợ</h3>
                  <a href='mailto:cskh@didongviet.vn' className='text-sm font-black text-blue-600 hover:underline mt-1 block'>
                    cskh@didongviet.vn
                  </a>
                  <p className='text-[10px] text-slate-500 mt-1'>Chúng tôi sẽ phản hồi trong 24h làm việc</p>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0'>
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className='text-xs font-bold text-slate-800'>Trụ sở chính</h3>
                  <p className='text-[11px] font-semibold text-slate-600 mt-1 leading-relaxed'>
                    75 Nguyễn Bỉnh Khiêm, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh
                  </p>
                  <Button asChild variant='link' className='px-0 h-auto text-[10px] text-didongviet-red font-bold mt-1'>
                    <Link href='/he-thong-cua-hang'>Xem tất cả hệ thống cửa hàng &rarr;</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CONTACT FORM */}
        <div className='lg:col-span-7'>
          <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-6 sm:p-8'>
            <h2 className='text-sm font-black text-slate-800 uppercase mb-2'>Gửi tin nhắn cho chúng tôi</h2>
            <p className='text-xs text-slate-500 mb-6'>Quý khách vui lòng điền đầy đủ thông tin để được hỗ trợ tốt nhất.</p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>Họ và tên *</label>
                  <Input 
                    name='fullName' value={formData.fullName} onChange={handleChange}
                    placeholder='Nguyễn Văn A' className='text-xs h-10' 
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>Số điện thoại *</label>
                  <Input 
                    name='phone' value={formData.phone} onChange={handleChange}
                    placeholder='09xx.xxx.xxx' className='text-xs h-10' 
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>Email *</label>
                  <Input 
                    name='email' type='email' value={formData.email} onChange={handleChange}
                    placeholder='email@domain.com' className='text-xs h-10' 
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>Vấn đề cần hỗ trợ</label>
                  <select 
                    name='subject' value={formData.subject} onChange={handleChange}
                    className='w-full text-xs h-10 rounded-lg border border-slate-200 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-didongviet-red/20 focus:border-didongviet-red transition-all outline-none font-semibold text-slate-700 cursor-pointer'
                  >
                    <option value='Tư vấn mua hàng'>Tư vấn mua hàng</option>
                    <option value='Khiếu nại dịch vụ'>Khiếu nại dịch vụ</option>
                    <option value='Hỗ trợ kỹ thuật'>Hỗ trợ kỹ thuật</option>
                    <option value='Bảo hành sản phẩm'>Bảo hành sản phẩm</option>
                    <option value='Thu cũ đổi mới'>Thu cũ đổi mới</option>
                    <option value='Khác'>Vấn đề khác</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-[10px] font-bold text-slate-500 uppercase'>Nội dung chi tiết *</label>
                <textarea 
                  name='message' value={formData.message} onChange={handleChange}
                  placeholder='Mô tả chi tiết vấn đề bạn đang gặp phải hoặc thông tin cần tư vấn...' 
                  className='w-full text-xs p-3 min-h-[120px] rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-didongviet-red/20 focus:border-didongviet-red transition-all outline-none resize-y font-semibold text-slate-700'
                />
              </div>

              <Button 
                type='submit' 
                disabled={submitting}
                className='w-full sm:w-auto px-8 bg-didongviet-red hover:bg-didongviet-dark-red text-white h-11 rounded-xl font-bold border-none shadow-md cursor-pointer text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100'
              >
                {submitting ? 'Đang gửi...' : (
                  <>
                    <Send size={16} /> Gửi yêu cầu hỗ trợ
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
