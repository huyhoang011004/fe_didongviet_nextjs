'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  MapPin,
  ShoppingBag,
  LogOut,
  Save,
  ShieldCheck,
  Settings,
  Award,
  ChevronRight,
  Package,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);

  // UI Tabs (info | orders)
  const [activeTab, setActiveTab] = useState('info');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success && data.data) {
        setUser(data.data.user);
        setStudentProfile(data.data.studentProfile);
        setEditName(data.data.user.name || '');
        setEditPhone(data.data.user.phone || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, phone: editPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: 'Cập nhật hồ sơ thành công!' });
        setIsEditing(false);
        setUser(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
            DĐV
          </div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>
          Đang tải hồ sơ cá nhân...
        </p>
      </div>
    );
  }

  if (!user) return null; // Will redirect

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-12'>
      {/* Alert toast */}
      {alert && (
        <div
          className={`
          fixed bottom-4 right-4 z-50 p-3 rounded-xl shadow-lg border flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-[11px] font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-6xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link
            href='/'
            className='hover:text-didongviet-red transition-colors'
          >
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Hồ sơ D.Member</span>
        </div>
      </nav>

      {/* HEADER BANNER */}
      <section className='bg-slate-900 text-white py-8 relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none' />
        <div className='max-w-6xl mx-auto px-4 relative z-10 flex items-center gap-4'>
          <div className='h-16 w-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center'>
            <User size={28} className='text-slate-300' />
          </div>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <h1 className='text-lg sm:text-xl font-black tracking-tight'>
                {user.name}
              </h1>
              <span className='px-2 py-0.5 rounded bg-purple-600 text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1'>
                <Award size={10} />
                {user.membershipLevel || 'Thành viên'}
              </span>
            </div>
            <p className='text-[11px] text-slate-400 font-medium'>
              Tham gia từ:{' '}
              {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-5'>
        {/* SIDEBAR NAVIGATION */}
        <aside className='lg:col-span-1 space-y-4 h-fit sticky top-20'>
          <div className='bg-white rounded-xl border border-slate-100 p-2 shadow-xs'>
            <button
              onClick={() => setActiveTab('info')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-[11px] font-bold transition-all border-none cursor-pointer
                ${activeTab === 'info' ? 'bg-red-50 text-didongviet-red' : 'bg-transparent text-slate-600 hover:bg-slate-50'}
              `}
            >
              <Settings
                size={16}
                className={
                  activeTab === 'info'
                    ? 'text-didongviet-red'
                    : 'text-slate-400'
                }
              />
              <span>Thông tin tài khoản</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-[11px] font-bold transition-all border-none cursor-pointer
                ${activeTab === 'orders' ? 'bg-red-50 text-didongviet-red' : 'bg-transparent text-slate-600 hover:bg-slate-50'}
              `}
            >
              <Package
                size={16}
                className={
                  activeTab === 'orders'
                    ? 'text-didongviet-red'
                    : 'text-slate-400'
                }
              />
              <span>Quản lý đơn hàng</span>
            </button>
            <Link
              href='/cart'
              className='w-full flex items-center gap-3 p-3 rounded-lg text-left text-[11px] font-bold transition-all border-none cursor-pointer bg-transparent text-slate-600 hover:bg-slate-50'
            >
              <ShoppingBag size={16} className='text-slate-400' />
              <span>Giỏ hàng của tôi</span>
            </Link>
          </div>

          <div className='bg-white rounded-xl border border-slate-100 p-2 shadow-xs'>
            <button
              onClick={handleLogout}
              className='w-full flex items-center gap-3 p-3 rounded-lg text-left text-[11px] font-bold transition-all border-none cursor-pointer bg-transparent text-red-600 hover:bg-red-50'
            >
              <LogOut size={16} />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className='lg:col-span-3'>
          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'info' && (
            <div className='space-y-4'>
              <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5'>
                <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-4'>
                  <div className='flex items-center gap-2'>
                    <ShieldCheck size={16} className='text-emerald-500' />
                    <h2 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                      Thông tin bảo mật
                    </h2>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant='outline'
                      size='sm'
                      className='text-[10px] h-7 font-bold'
                    >
                      Cập nhật
                    </Button>
                  ) : (
                    <div className='flex gap-2'>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant='outline'
                        size='sm'
                        className='text-[10px] h-7 font-bold border-slate-200'
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        size='sm'
                        className='bg-didongviet-red hover:bg-didongviet-dark-red text-white text-[10px] h-7 font-bold shadow-xs border-none'
                      >
                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <label className='text-[10px] font-bold text-slate-500 uppercase'>
                      Họ và tên
                    </label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={!isEditing}
                      className={`text-[11px] h-9 font-semibold ${!isEditing ? 'bg-slate-50 border-transparent text-slate-800' : 'bg-white'}`}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-[10px] font-bold text-slate-500 uppercase'>
                      Email (Không thể đổi)
                    </label>
                    <Input
                      value={user.email}
                      disabled
                      className='text-[11px] h-9 font-semibold bg-slate-50 border-transparent text-slate-500'
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-[10px] font-bold text-slate-500 uppercase'>
                      Số điện thoại
                    </label>
                    <Input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      disabled={!isEditing}
                      placeholder='Chưa cập nhật'
                      className={`text-[11px] h-9 font-semibold ${!isEditing ? 'bg-slate-50 border-transparent text-slate-800' : 'bg-white'}`}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-[10px] font-bold text-slate-500 uppercase'>
                      Loại tài khoản
                    </label>
                    <Input
                      value={
                        user.role === 'admin'
                          ? 'Quản trị viên (Admin)'
                          : user.role === 'staff'
                            ? 'Nhân viên (Staff)'
                            : 'Khách hàng (User)'
                      }
                      disabled
                      className='text-[11px] h-9 font-semibold bg-slate-50 border-transparent text-purple-600'
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin HSSV */}
              {studentProfile && (
                <div className='bg-blue-50/50 rounded-xl border border-blue-100 shadow-xs p-5'>
                  <div className='flex items-center gap-2 border-b border-blue-100/50 pb-3 mb-4'>
                    <Award size={16} className='text-blue-500' />
                    <h2 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                      Hồ sơ Học sinh - Sinh viên
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${studentProfile.isHSSVVerified === 'Đã xác thực' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}
                    >
                      {studentProfile.isHSSVVerified}
                    </span>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <div className='space-y-1'>
                      <span className='text-[10px] font-bold text-slate-500 uppercase block'>
                        Trường học
                      </span>
                      <span className='text-[11px] font-bold text-slate-800 block truncate'>
                        {studentProfile.schoolName}
                      </span>
                    </div>
                    <div className='space-y-1'>
                      <span className='text-[10px] font-bold text-slate-500 uppercase block'>
                        MSSV
                      </span>
                      <span className='text-[11px] font-bold text-slate-800 block'>
                        {studentProfile.studentId}
                      </span>
                    </div>
                    <div className='space-y-1'>
                      <span className='text-[10px] font-bold text-slate-500 uppercase block'>
                        Ngày tốt nghiệp dự kiến
                      </span>
                      <span className='text-[11px] font-bold text-slate-800 block'>
                        {new Date(
                          studentProfile.graduationDate,
                        ).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ĐƠN HÀNG CỦA TÔI */}
          {activeTab === 'orders' && (
            <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4'>
              <div className='flex items-center gap-2 border-b border-slate-100 pb-3 mb-2'>
                <Package size={16} className='text-didongviet-red' />
                <h2 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                  Lịch sử mua hàng
                </h2>
              </div>

              {!user.orderHistory || user.orderHistory.length === 0 ? (
                <div className='text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200'>
                  <Package size={32} className='mx-auto text-slate-300 mb-2' />
                  <p className='text-xs font-semibold text-slate-500'>
                    Bạn chưa có đơn hàng nào.
                  </p>
                  <Button
                    asChild
                    className='mt-3 bg-didongviet-red hover:bg-didongviet-dark-red text-white h-8 text-[10px] font-bold rounded-lg border-none'
                  >
                    <Link href='/products'>Khám phá sản phẩm ngay</Link>
                  </Button>
                </div>
              ) : (
                <div className='space-y-3'>
                  {user.orderHistory.map((order: any, idx: number) => (
                    <div
                      key={order._id || idx}
                      className='p-4 border border-slate-100 rounded-xl hover:shadow-sm transition-all'
                    >
                      <div className='flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-2 mb-2 text-[10px] font-bold text-slate-500'>
                        <span className='font-mono'>
                          Mã ĐH:{' '}
                          <strong className='text-slate-800'>
                            {order.orderNumber ||
                              order._id?.slice(-8).toUpperCase()}
                          </strong>
                        </span>
                        <span className='px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase'>
                          {order.orderStatus || 'Đang xử lý'}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-[11px] font-bold text-slate-700'>
                          {new Date(order.createdAt).toLocaleDateString(
                            'vi-VN',
                          )}
                        </span>
                        <span className='text-xs font-black text-didongviet-red'>
                          {formatVND(order.totalPrice || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
