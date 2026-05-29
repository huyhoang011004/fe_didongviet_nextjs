'use client';

import Link from 'next/link';
import {
  Users,
  ShoppingBag,
  ClipboardList,
  Settings,
  BarChart3,
  FolderTree,
  Ticket,
  Newspaper,
  Mail,
  User,
} from 'lucide-react';
import { UserProfile } from './AdminHeader';
import { MdHeadset, MdInventory } from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: UserProfile;
}

export function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  user,
}: AdminSidebarProps) {
  return (
    <>
      <aside
        className={`
        w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col justify-between py-6 px-4
        fixed lg:sticky top-16 left-0 bottom-0 z-30 transition-transform duration-300 transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        <div className='space-y-6'>
          <p className='text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3'>
            Khu vực điều hành
          </p>
          <nav className='space-y-1.5'>
            <Link
              href='/admin'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
            >
              <BarChart3
                size={18}
                className='text-slate-400 group-hover:text-didongviet-red'
              />
              <span>Tổng quan</span>
            </Link>

            <Link
              href='/admin/orders'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
            >
              <ClipboardList
                size={18}
                className='text-slate-400 group-hover:text-didongviet-red'
              />
              <span>Quản lý Đơn hàng</span>
            </Link>

            <Link
              href='/admin/products'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
            >
              <ShoppingBag
                size={18}
                className='text-slate-400 group-hover:text-didongviet-red'
              />
              <span>Quản lý Sản phẩm</span>
            </Link>

            <Link
              href='/admin/inventory'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
            >
              <MdInventory
                size={18}
                className='text-slate-400 group-hover:text-didongviet-red'
              />
              <span>Quản lý tồn kho</span>
            </Link>

            <Link
              href='/admin/student-verifications'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
            >
              <PiStudent
                size={18}
                className='text-slate-400 group-hover:text-didongviet-red'
              />
              <span>Duyệt hồ sơ HSSV</span>
            </Link>
            <Link
              href='/admin/blogs'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
            >
              <Newspaper
                size={18}
                className='text-slate-400 group-hover:text-didongviet-red'
              />
              <span>Tin tức & Bài viết</span>
            </Link>
            <Link
              href='/admin/contacts'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
            >
              <MdHeadset
                size={18}
                className='text-slate-400 group-hover:text-didongviet-red'
              />
              <span>Chăm sóc khách hàng</span>
            </Link>

            {/* User Admin */}
            {user.role === 'admin' && (
              <Link
                href='/admin/categories'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <FolderTree
                  size={18}
                  className='text-slate-400 group-hover:text-didongviet-red'
                />
                <span>Quản lý Danh mục</span>
              </Link>
            )}

            {user.role === 'admin' && (
              <Link
                href='/admin/vouchers'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <Ticket
                  size={18}
                  className='text-slate-400 group-hover:text-didongviet-red'
                />
                <span>Quản lý Voucher</span>
              </Link>
            )}
            {user.role === 'admin' && (
              <Link
                href='/admin/accounts'
                onClick={() => setSidebarOpen(false)}
                className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-didongviet-red font-medium text-sm transition-all group'
              >
                <Users
                  size={18}
                  className='text-slate-400 group-hover:text-didongviet-red'
                />
                <span>Quản lý Người dùng</span>
              </Link>
            )}
          </nav>
        </div>

        {/* <div className='border-t border-slate-100 dark:border-slate-800 pt-4 px-3'>
          <Link
            href='/admin/settings'
            onClick={() => setSidebarOpen(false)}
            className='flex items-center gap-3 py-2 text-xs font-semibold text-slate-400 hover:text-didongviet-red group'
          >
            <Settings
              size={14}
              className='group-hover:rotate-45 transition-transform duration-300'
            />
            <span>Thiết lập hệ thống</span>
          </Link>
        </div> */}
      </aside>

      {/* Bọc che phủ khi mở sidebar trên di động */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 top-16 bg-slate-950/40 backdrop-blur-xs z-20 lg:hidden'
        />
      )}
    </>
  );
}
