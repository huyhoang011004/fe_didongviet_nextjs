'use client';

import Link from 'next/link';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: UserProfile;
  handleLogout: () => Promise<void>;
}

export function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  user,
  handleLogout,
}: AdminHeaderProps) {
  return (
    <header className='h-16 sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between px-4 sm:px-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors'
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href='/' className='flex items-center gap-2'>
          <span className='text-lg sm:text-xl font-black text-didongviet-red tracking-tight'>
            Di Động Việt
          </span>
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
            <span className='text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate'>
              {user.name}
            </span>
            <span className='text-[10px] text-slate-400 truncate'>
              {user.email}
            </span>
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
  );
}
