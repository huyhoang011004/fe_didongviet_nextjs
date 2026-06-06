'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  LogOut,
  Settings,
  Award,
  ChevronRight,
  Package,
  Ticket,
} from 'lucide-react';

export const ProfileContext = createContext<any>(null);

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (!user) return null;

  return (
    <ProfileContext.Provider value={{ user, setUser, studentProfile }}>
      <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-12'>
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
            <span className='text-slate-800 font-bold'>Tôi</span>
          </div>
        </nav>

        <div className='max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-5'>
          {/* SIDEBAR NAVIGATION */}
          <aside className='lg:col-span-1 space-y-4 h-fit sticky top-20'>
            {/* THÔNG TIN TÀI KHOẢN MINI */}
            <div className='bg-white rounded-xl border border-slate-100 p-4 shadow-xs flex items-center gap-3.5'>
              <div className='h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0'>
                <User size={22} className='text-slate-400' />
              </div>
              <div className='min-w-0 flex-1 space-y-1'>
                <h4 className='text-xs font-black text-slate-800 truncate leading-snug'>
                  {user.name || 'Người dùng'}
                </h4>
                <div className='flex items-center gap-1'>
                  <span className='px-1.5 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-700 text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5 shrink-0'>
                    <Award size={8} />
                    {user.membershipLevel || 'Thành viên'}
                  </span>
                </div>
                <p className='text-[9px] text-slate-400 font-semibold'>
                  Tham gia từ:{' '}
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className='bg-white rounded-xl border border-slate-100 p-2 shadow-xs'>
              <Link
                href='/profile/info'
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-[11px] font-bold transition-all border-none cursor-pointer
                  ${pathname === '/profile/info' ? 'bg-red-50 text-didongviet-red' : 'bg-transparent text-slate-600 hover:bg-slate-50'}
                `}
              >
                <Settings
                  size={16}
                  className={
                    pathname === '/profile/info'
                      ? 'text-didongviet-red'
                      : 'text-slate-400'
                  }
                />
                <span>Tài khoản của tôi</span>
              </Link>

              <Link
                href='/profile/orders'
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-[11px] font-bold transition-all border-none cursor-pointer
                  ${pathname === '/profile/orders' ? 'bg-red-50 text-didongviet-red' : 'bg-transparent text-slate-600 hover:bg-slate-50'}
                `}
              >
                <Package
                  size={16}
                  className={
                    pathname === '/profile/orders'
                      ? 'text-didongviet-red'
                      : 'text-slate-400'
                  }
                />
                <span>Đơn mua</span>
              </Link>

              <Link
                href='/profile/vouchers'
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-[11px] font-bold transition-all border-none cursor-pointer
                  ${pathname === '/profile/vouchers' ? 'bg-red-50 text-didongviet-red' : 'bg-transparent text-slate-600 hover:bg-slate-50'}
                `}
              >
                <Ticket
                  size={16}
                  className={
                    pathname === '/profile/vouchers'
                      ? 'text-didongviet-red'
                      : 'text-slate-400'
                  }
                />
                <span>Kho Voucher</span>
              </Link>

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
          <main className='lg:col-span-3'>{children}</main>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
