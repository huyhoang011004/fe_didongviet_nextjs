'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Thêm để nhận diện trang hiện tại
import {
  Users,
  ShoppingBag,
  ClipboardList,
  BarChart3,
  FolderTree,
  Ticket,
  Newspaper,
  PackageOpen,
  ChevronLeft,
  Building2,
  DollarSign,
  ChevronDown,
  PieChart,
  Briefcase,
  FileText,
  Settings2,
  Megaphone,
  X, // Thêm nút đóng nhanh trên Mobile
  Zap,
} from 'lucide-react';
import { UserProfile } from './AdminHeader';
import { MdHeadset } from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  isAdminOnly?: boolean;
}

interface MenuGroup {
  groupLabel: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  isAdminOnly?: boolean;
  items: MenuItem[];
}

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user: UserProfile;
  sidebarCollapsed?: boolean;
  setSidebarCollapsed?: (collapsed: boolean) => void;
}

export function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
  user,
  sidebarCollapsed = false,
  setSidebarCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại để active menu

  const menuGroups: MenuGroup[] = [
    {
      groupLabel: 'Báo cáo & Thống kê',
      icon: PieChart,
      items: [
        { title: 'Tổng quan', href: '/admin', icon: BarChart3 },
        {
          title: 'Doanh thu & Phân tích',
          href: '/admin/analytics',
          icon: DollarSign,
          isAdminOnly: true,
        },
      ],
    },
    // {
    //   groupLabel: 'Bảng điều khiển',
    //   icon: Briefcase,
    //   items: [
    //     { title: 'Tổng quan', href: '/admin', icon: BarChart3 },
    //   ],
    // },
    {
      groupLabel: 'Quản lý Nghiệp vụ',
      icon: Briefcase,
      items: [
        {
          title: 'Quản lý Đơn hàng',
          href: '/admin/orders',
          icon: ClipboardList,
        },
        {
          title: 'Quản lý Sản phẩm',
          href: '/admin/products',
          icon: ShoppingBag,
          isAdminOnly: true,
        },
        {
          title: 'Quản lý tồn kho',
          href: '/admin/inventory',
          icon: PackageOpen,
        },
      ],
    },
    {
      groupLabel: 'Chiến dịch Marketing',
      icon: Megaphone,
      items: [
        {
          title: 'Duyệt hồ sơ HSSV',
          href: '/admin/student-verifications',
          icon: PiStudent,
        },
        {
          title: 'Quản lý Voucher',
          href: '/admin/vouchers',
          icon: Ticket,
          isAdminOnly: true,
        },
        {
          title: 'Quản lý Flash Sale',
          href: '/admin/flashsales',
          icon: Zap,
          isAdminOnly: true,
        },
      ],
    },
    {
      groupLabel: 'Tin tức & CSKH',
      icon: FileText,
      items: [
        { title: 'Tin tức công nghệ', href: '/admin/blogs', icon: Newspaper },
        {
          title: 'Chăm sóc khách hàng',
          href: '/admin/contacts',
          icon: MdHeadset,
        },
      ],
    },
    {
      groupLabel: 'Quản trị Hệ thống',
      icon: Settings2,
      isAdminOnly: true,
      items: [
        {
          title: 'Quản lý Danh mục',
          href: '/admin/categories',
          icon: FolderTree,
        },
        {
          title: 'Quản lý Chi nhánh',
          href: '/admin/branches',
          icon: Building2,
        },
        { title: 'Quản lý Tài khoản', href: '/admin/accounts', icon: Users },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Tổng quan': true,
    'Quản lý Nghiệp vụ': true,
    'Chiến dịch & Marketing': true,
    'Nội dung & Khách hàng': true,
    'Quản trị Hệ thống': true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
        bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out
        
        /* Cấu hình vị trí linh hoạt: Cố định toàn màn hình trên Mobile, dính (sticky) trên Desktop */
        fixed lg:sticky top-0 lg:top-16 left-0 bottom-0 z-40 h-full lg:h-[calc(100vh-64px)]
        
        /* Hiệu ứng đóng mở Slide-in mượt mà trên Mobile */
        ${sidebarOpen ? 'translate-x-0 w-[280px] md:w-64 px-4 py-4' : '-translate-x-full lg:translate-x-0'}
        
        /* Cấu hình co giãn trên Desktop */
        ${sidebarCollapsed ? 'lg:w-20 lg:px-2 lg:py-6' : 'lg:w-64 lg:px-4 lg:py-6'}
      `}
      >
        {/* Nút đóng nhanh Sidebar độc quyền dành cho Mobile (Ẩn hoàn toàn trên Desktop) */}
        <div className='flex lg:hidden items-center justify-between pb-4 mb-2 border-b border-slate-100 dark:border-slate-800'>
          <span className='font-bold text-sm text-slate-800 dark:text-slate-200'>
            Menu Điều Hành
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className='p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full border-none bg-transparent'
          >
            <X size={20} />
          </button>
        </div>

        {/* Khối chứa menu có tính năng cuộn nội bộ mượt mà không làm cuộn cả trang web */}
        <div className='flex-1 overflow-y-auto pr-1 no-scrollbar space-y-5 touch-pan-y'>
          {/* Tiêu đề vùng điều hành ẩn trên Mobile để tiết kiệm không gian */}
          <div
            className={`hidden lg:flex items-center gap-2 px-3 mb-6 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}
          >
            {setSidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className='p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-didongviet-red transition-all border-none bg-transparent flex items-center justify-center cursor-pointer'
                title={sidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              >
                <div
                  className={`transform transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                >
                  <ChevronLeft size={16} />
                </div>
              </button>
            )}
            <span
              className={`text-[11px] font-bold text-slate-400 uppercase tracking-wider transition-all duration-200 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'lg:hidden' : 'opacity-100'}`}
            >
              Khu vực điều hành
            </span>
          </div>

          <nav className='space-y-4 pb-10 lg:pb-0'>
            {menuGroups.map((group, groupIdx) => {
              if (group.isAdminOnly && user?.role !== 'admin') return null;

              const visibleItems = group.items.filter(
                (item) => item.isAdminOnly !== true || user?.role === 'admin',
              );

              if (visibleItems.length === 0) return null;

              const isGroupOpen = openGroups[group.groupLabel] ?? true;
              const GroupIcon = group.icon;

              return (
                <div
                  key={groupIdx}
                  className='pb-4 border-b border-slate-100 dark:border-slate-800/80 last:border-b-0 last:pb-0'
                >
                  {/* TIÊU ĐỀ NHÓM: Trên mobile tăng khoảng cách bấm (py-2.5) */}
                  <button
                    onClick={() => toggleGroup(group.groupLabel)}
                    className={`w-full flex items-center text-[11px] font-bold uppercase tracking-wider transition-all bg-transparent border-none cursor-pointer group/title mb-2 py-2.5 lg:py-1.5 ${sidebarCollapsed
                      ? 'lg:px-0 lg:justify-center lg:gap-0'
                      : 'px-3 justify-between gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    title={group.groupLabel}
                  >
                    <div className='flex items-center gap-2.5 overflow-hidden whitespace-nowrap text-ellipsis'>
                      <GroupIcon
                        size={sidebarCollapsed ? 22 : 16}
                        className={`flex-shrink-0 transition-all ${sidebarCollapsed
                          ? 'text-slate-600 dark:text-slate-300 lg:bg-slate-100 lg:dark:bg-slate-800 lg:p-1 lg:rounded-xl'
                          : 'text-slate-500 dark:text-slate-400'
                          }`}
                      />
                      <span
                        className={`${sidebarCollapsed ? 'lg:hidden' : 'block text-slate-500 dark:text-slate-400'}`}
                      >
                        {group.groupLabel}
                      </span>
                    </div>

                    <div
                      className={`transform transition-transform duration-200 flex-shrink-0 text-slate-400 ${isGroupOpen ? '' : '-rotate-90'} ${sidebarCollapsed ? 'lg:hidden' : 'block'}`}
                    >
                      <ChevronDown size={12} />
                    </div>
                  </button>

                  {/* DANH SÁCH MENU CON */}
                  <div
                    className={`space-y-1 transition-all duration-300 overflow-hidden ${isGroupOpen
                      ? 'max-h-[600px] opacity-100 visible'
                      : 'max-h-0 opacity-0 invisible pointer-events-none'
                      }`}
                  >
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href; // Kiểm tra trang hiện tại

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)} // TỰ ĐỘNG ĐÓNG MENU TRÊN MOBILE KHI BẤM LINK
                          className={`flex items-center gap-3 rounded-xl font-medium text-sm transition-all group py-3 px-4 lg:py-2.5 ${sidebarCollapsed
                            ? 'lg:px-2.5 lg:justify-center'
                            : 'lg:pl-7 lg:pr-3'
                            } ${isActive
                              ? 'bg-red-50 dark:bg-red-950/30 text-didongviet-red'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-didongviet-red'
                            }`}
                        >
                          <Icon
                            size={18}
                            className={`flex-shrink-0 transition-colors ${isActive ? 'text-didongviet-red' : 'text-slate-400 group-hover:text-didongviet-red'}`}
                          />
                          <span
                            className={`transition-all duration-200 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'lg:hidden' : 'opacity-100 w-auto'}`}
                          >
                            {item.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* LỚP PHỦ BACKDROP (Mờ nền khi mở menu ở Mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-30 lg:hidden'
        />
      )}
    </>
  );
}
