'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  ShoppingBag, 
  ClipboardList, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  User as UserIcon, 
  BarChart3, 
  Menu, 
  X,
  RefreshCw,
  FolderTree,
  Ticket,
  Newspaper,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Lấy thông tin tài khoản và phân quyền
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.user) {
            const loggedUser = data.data.user;
            if (loggedUser.role === 'admin' || loggedUser.role === 'staff') {
              setUser(loggedUser);
            }
          }
        }
      } catch (err) {
        console.error('Check admin auth error:', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Countdown chuyển hướng khi bị chặn truy cập
  useEffect(() => {
    if (loading || user) return;
    if (countdown <= 0) {
      router.push('/');
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [loading, user, countdown, router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 1. Màn hình Loading
  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900'>
        <div className='relative flex items-center justify-center'>
          <div className='h-16 w-16 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[10px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
            DĐV
          </div>
        </div>
        <p className='mt-4 text-sm font-medium text-slate-500 animate-pulse'>
          Đang xác thực thông tin quản trị...
        </p>
      </div>
    );
  }

  // 2. Màn hình Chặn truy cập (Access Denied)
  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-slate-900 p-6 text-white'>
        <div className='max-w-md w-full bg-slate-800/80 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md animate-in fade-in-50 zoom-in-95 duration-300'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-6 border border-red-500/20'>
            <ShieldAlert size={36} className='animate-bounce' />
          </div>
          <h1 className='text-2xl font-bold text-red-500 mb-2'>Quyền truy cập bị từ chối</h1>
          <p className='text-sm text-slate-300 leading-relaxed mb-6'>
            Tài khoản của bạn không có đặc quyền truy cập khu vực Quản trị hệ thống. Khu vực này chỉ dành cho Ban quản trị Di Động Việt.
          </p>
          <div className='py-3 px-4 bg-slate-900/50 rounded-xl border border-slate-700/50 inline-flex items-center gap-2 text-xs text-slate-400'>
            <RefreshCw size={14} className='animate-spin text-didongviet-red' />
            <span>Tự động quay lại trang chủ sau <strong className='text-white text-sm font-bold'>{countdown}s</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Giao diện Admin chính thức
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col'>
      
      {/* HEADER TOP BAR */}
      <header className='h-16 sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between px-4 sm:px-6'>
        <div className='flex items-center gap-3'>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors'
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link href='/' className='flex items-center gap-2'>
            <span className='text-lg sm:text-xl font-black text-didongviet-red tracking-tight'>Di Động Việt</span>
            <span className='bg-didongviet-red/10 text-didongviet-red text-[10px] font-bold px-2 py-0.5 rounded-full border border-didongviet-red/20 uppercase'>
              Admin
            </span>
          </Link>
        </div>

        <div className='flex items-center gap-4'>
          {/* Admin Profile */}
          <div className='flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
            <div className='h-8 w-8 rounded-full bg-didongviet-red text-white flex items-center justify-center font-bold text-sm shadow-md'>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className='hidden sm:flex flex-col text-left'>
              <span className='text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate'>{user.name}</span>
              <span className='text-[10px] text-slate-400 truncate'>{user.email}</span>
            </div>
          </div>

          <Button 
            onClick={handleLogout} 
            variant='outline' 
            size='sm' 
            className='flex items-center gap-1.5 border-slate-200 hover:text-didongviet-red hover:bg-red-50 dark:border-slate-700 cursor-pointer'
          >
            <LogOut size={14} />
            <span className='hidden sm:inline'>Đăng xuất</span>
          </Button>
        </div>
      </header>

      <div className='flex-1 flex relative'>
        
        {/* SIDE NAVIGATION BAR */}
        <aside className={`
          w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col justify-between py-6 px-4
          fixed lg:sticky top-16 left-0 bottom-0 z-30 transition-transform duration-300 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className='space-y-6'>
            <p className='text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3'>
              Khu vực điều hành
            </p>
            <nav className='space-y-1.5'>
              <Link 
                href='/admin?tab=overview'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <BarChart3 size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                <span>Tổng quan</span>
              </Link>
              
              {user.role === 'admin' && (
                <Link 
                  href='/admin?tab=users'
                  onClick={() => setSidebarOpen(false)}
                  className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
                >
                  <Users size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                  <span>Quản lý Người dùng</span>
                </Link>
              )}

              <Link 
                href='/admin?tab=products'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <ShoppingBag size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                <span>Quản lý Sản phẩm</span>
              </Link>

              {user.role === 'admin' && (
                <Link 
                  href='/admin?tab=categories'
                  onClick={() => setSidebarOpen(false)}
                  className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
                >
                  <FolderTree size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                  <span>Quản lý Danh mục</span>
                </Link>
              )}

              {user.role === 'admin' && (
                <Link 
                  href='/admin?tab=vouchers'
                  onClick={() => setSidebarOpen(false)}
                  className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
                >
                  <Ticket size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                  <span>Quản lý Voucher</span>
                </Link>
              )}

              <Link 
                href='/admin?tab=orders'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <ClipboardList size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                <span>Quản lý Đơn hàng</span>
              </Link>
              <Link 
                href='/admin?tab=blogs'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <Newspaper size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                <span>Tin tức & Bài viết</span>
              </Link>
              <Link 
                href='/admin?tab=contacts'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <Mail size={18} className='text-slate-400 group-hover:text-didongviet-red' />
                <span>Yêu cầu Liên hệ</span>
              </Link>
            </nav>
          </div>

          <div className='border-t border-slate-100 dark:border-slate-800 pt-4 px-3'>
            <Link 
              href='/admin?tab=settings'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 py-2 text-xs font-semibold text-slate-400 hover:text-didongviet-red group'
            >
              <Settings size={14} className='group-hover:rotate-45 transition-transform duration-300' />
              <span>Thiết lập hệ thống</span>
            </Link>
          </div>
        </aside>

        {/* Bọc che phủ khi mở sidebar trên di động */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className='fixed inset-0 top-16 bg-slate-950/40 backdrop-blur-xs z-20 lg:hidden'
          />
        )}

        {/* MAIN BODY CONTENT AREA */}
        <main className='flex-1 overflow-x-hidden min-w-0 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950'>
          {children}
        </main>

      </div>
    </div>
  );
}
