'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader, UserProfile } from './_components/layout/AdminHeader';
import { AdminSidebar } from './_components/layout/AdminSidebar';
import { AdminLoading } from './_components/layout/AdminLoading';
import { AccessDenied } from './_components/layout/AccessDenied';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    return <AdminLoading />;
  }

  // 2. Màn hình Chặn truy cập (Access Denied)
  if (!user) {
    return <AccessDenied countdown={countdown} />;
  }

  // 3. Giao diện Admin chính thức
  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col'>
      
      {/* HEADER TOP BAR */}
      <AdminHeader 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        handleLogout={handleLogout}
      />

      <div className='flex-1 flex relative'>
        
        {/* SIDE NAVIGATION BAR */}
        <AdminSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* MAIN BODY CONTENT AREA */}
        <main className='flex-1 overflow-x-hidden min-w-0 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950'>
          {children}
        </main>

      </div>
    </div>
  );
}
