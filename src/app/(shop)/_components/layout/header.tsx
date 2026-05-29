'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Phone,
  User,
  MapPinPlus,
  FileSearchCorner,
  ShieldCheck,
  BadgeDollarSign,
  RefreshCw,
  Newspaper,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { BiCategory } from 'react-icons/bi';
import { Label } from '@/shared/components/ui/label';
import HeaderSearch from './HeaderSearch';
import { ChevronRight } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export default function Header() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Xóa logic search cũ vì đã chuyển sang HeaderSearch component
  const [searchValue] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data && resData.data.user) {
            setUser(resData.data.user);
          }
        }
      } catch (err) {
        console.error('Failed to load user profile in header:', err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/categories`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCategories(data.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load categories in header:', err);
      }
    }

    fetchProfile();
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        setUser(null);
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSearchSubmit = (keyword: string) => {
    if (!keyword.trim()) return;
    console.log('Đang tìm kiếm cụm từ:', keyword);
    // Thực hiện router.push(`/search?q=${keyword}`) hoặc gọi API tìm kiếm của Di Động Việt ở đây
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Ngăn reload trang ngoài ý muốn
      handleSearchSubmit(searchValue);
    }
  };
  return (
    <header className='sticky top-0 z-50 w-full bg-primary text-white shadow-sm'>
      <div className='container mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3'>
        <div className='flex flex-col gap-2 md:gap-3'>
          <div className='flex items-center justify-between gap-4 md:gap-8 w-full min-w-0'>
            <Link
              href='/'
              className='flex flex-row sm:flex-row sm:items-center gap-1 md:gap-2 text-white min-w-0 '
            >
              <div className='text-md md:text-3xl font-black tracking-tighter whitespace-nowrap'>
                Di Động
              </div>
              <div className='text-xs md:text-base font-semibold uppercase tracking-[0.18em] text-white/90'>
                VIỆT
              </div>
            </Link>
            <div className='overflow-hidden min-w-0 flex-1'>
              <div className='inline-flex min-w-full items-center gap-8 animate-marquee whitespace-nowrap'>
                <div className='flex items-center gap-2'>
                  <RefreshCw size={14} className='text-white ' />
                  <span className='text-xs md:text-sm'>
                    Thu cũ đổi mới - Lên đời siêu tốc
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <BadgeDollarSign size={14} className='text-white ' />
                  <span className='text-xs md:text-sm'>
                    Trả góp 0% - Giao hàng miễn phí
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <ShieldCheck size={14} className='text-white ' />
                  <span className='text-xs md:text-sm'>
                    BH 12 tháng - 1 đổi 1 trong 30 ngày
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <RefreshCw size={14} className='text-white ' />
                  <span className='text-xs md:text-sm'>
                    Thu cũ đổi mới - Lên đời siêu tốc
                  </span>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Label
                asChild
                className='flex items-center gap-1 text-xs md:text-sm cursor-pointer'
              >
                <Link href='/track' className='flex items-center gap-1'>
                  <FileSearchCorner size={16} />
                  <span className='hidden whitespace-nowrap md:inline'>
                    Tra cứu đơn hàng
                  </span>
                </Link>
              </Label>
              <Label
                asChild
                className='flex items-center gap-1 text-xs md:text-sm cursor-pointer'
              >
                <Link href='/contact' className='flex items-center gap-1'>
                  <Phone size={16} />
                  <span className='hidden whitespace-nowrap md:inline'>
                    Liên hệ
                  </span>
                </Link>
              </Label>
            </div>
          </div>

          <div className='flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4'>
            <div className='flex items-center gap-2'>
              <div className='relative group'>
                <Button
                  asChild
                  variant='header'
                  size='header-responsive'
                  className='cursor-pointer'
                >
                  <Link
                    href='/products'
                    className='flex items-center justify-center gap-1 md:gap-2'
                  >
                    <BiCategory size={16} />
                    <span className='hidden md:inline text-xs md:text-sm'>
                      Danh mục
                    </span>
                  </Link>
                </Button>

                {/* Dropdown Danh mục */}
                <div className='absolute left-0 top-full mt-1 w-64 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden'>
                  <ul className='py-2'>
                    {categories.map((cat: any) => (
                      <li key={cat._id} className='relative group/sub'>
                        <Link
                          href={`/category/${cat.slug}`}
                          className='flex items-center justify-between px-4 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-didongviet-red transition-colors'
                        >
                          <span>{cat.name}</span>
                          {cat.children && cat.children.length > 0 && (
                            <ChevronRight
                              size={12}
                              className='text-slate-400'
                            />
                          )}
                        </Link>

                        {/* Sub-menu (Danh mục con) */}
                        {cat.children && cat.children.length > 0 && (
                          <div className='absolute left-full top-0 ml-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto transition-all duration-200 z-50 overflow-hidden'>
                            <ul className='py-2'>
                              {cat.children.map((child: any) => (
                                <li key={child._id}>
                                  <Link
                                    href={`/category/${child.slug}`}
                                    className='block px-4 py-2.5 text-xs font-semibold hover:bg-red-50 hover:text-didongviet-red transition-colors'
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                    {categories.length === 0 && (
                      <li className='px-4 py-3 text-xs text-slate-400 text-center italic'>
                        Đang tải danh mục...
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* <Button asChild variant='header' size='header-responsive'>
                <Link
                  href='/he-thong-cua-hang'
                  className='flex items-center justify-center gap-1 md:gap-2'
                >
                  <MapPinPlus size={16} />
                  <span className='hidden md:inline text-xs md:text-sm'>
                    Cửa hàng
                  </span>
                </Link>
              </Button> */}
              <Button asChild variant='header' size='header-responsive'>
                <Link
                  href='/news'
                  className='flex items-center justify-center gap-1 md:gap-2 text-amber-400 hover:text-amber-300'
                >
                  <Newspaper size={16} />
                  <span className='hidden md:inline text-xs md:text-sm'>
                    Tin tức
                  </span>
                </Link>
              </Button>
            </div>

            <HeaderSearch />

            <div className='flex items-center gap-2'>
              <Button asChild variant='header' size='header-responsive'>
                <Link
                  href='/cart'
                  className='flex items-center justify-center gap-1 md:gap-2'
                >
                  <ShoppingCart size={16} />
                  <span className='hidden md:inline text-xs md:text-sm'>
                    Giỏ hàng
                  </span>
                </Link>
              </Button>
              {loading ? (
                <div className='w-10 h-8 flex items-center justify-center'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white' />
                </div>
              ) : user ? (
                <div className='relative group flex items-center gap-2'>
                  <Button
                    variant='header'
                    size='header-responsive'
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <User size={16} />
                    <span className='hidden md:inline text-xs md:text-sm font-semibold max-w-[100px] truncate'>
                      {user.name}
                    </span>
                  </Button>

                  {/* Dropdown Menu khéo léo */}
                  <div className='absolute right-0 top-full mt-1 w-48 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50'>
                    <div className='px-4 py-2 border-b border-gray-100'>
                      <p className='text-xs text-gray-400'>Tài khoản của bạn</p>
                      <p className='text-xs font-semibold text-gray-700 truncate'>
                        {user.email}
                      </p>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        href='/admin'
                        className='block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium'
                      >
                        Quản trị hệ thống
                      </Link>
                    )}
                    {user.role === 'staff' && (
                      <Link
                        href='/admin'
                        className='block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium'
                      >
                        Quản trị hệ thống
                      </Link>
                    )}
                    <Link
                      href='/profile'
                      className='block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50'
                    >
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='w-full text-left block px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-medium cursor-pointer border-t border-gray-100'
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <Button asChild variant='header' size='header-responsive'>
                  <Link
                    href='/login'
                    className='flex items-center justify-center gap-1 md:gap-2'
                  >
                    <User size={16} />
                    <span className='hidden md:inline text-xs md:text-sm'>
                      Đăng nhập
                    </span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
