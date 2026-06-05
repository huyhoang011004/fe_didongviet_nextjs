'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from '@/shared/components/ui/dropdown-menu';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui';

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

  // State và Ref để quản lý dropdown hover delay 500ms cho Tài khoản
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 500); // Giữ dropdown hiển thị trong 500ms giây
  };

  // State và Ref để quản lý dropdown danh mục hover delay
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCategoryMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
      categoryTimeoutRef.current = null;
    }
    if (!isCategoryOpen) {
      categoryTimeoutRef.current = setTimeout(() => {
        setIsCategoryOpen(true);
      }, 0); // Đợi 100ms giây trước khi mở danh mục
    }
  };

  const handleCategoryMouseLeave = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    if (isCategoryOpen) {
      categoryTimeoutRef.current = setTimeout(() => {
        setIsCategoryOpen(false);
      }, 500); // Giữ hiển thị trong 2 giây khi chuột rời đi
    } else {
      setIsCategoryOpen(false);
    }
  };

  // Cleanup timeout khi unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
    };
  }, []);

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
              <div
                className='relative'
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
              >
                <DropdownMenu
                  open={isCategoryOpen}
                  onOpenChange={setIsCategoryOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='header'
                      size='header-responsive'
                      className='cursor-pointer'
                    >
                      <div className='flex items-center justify-center gap-1 md:gap-2'>
                        <BiCategory size={16} />
                        <span className='hidden md:inline text-xs md:text-sm'>
                          Danh mục
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align='start'
                    sideOffset={6}
                    className='w-64 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-1 z-50 overflow-visible'
                  >
                    {categories.map((cat: any) => (
                      <div key={cat._id}>
                        {cat.children && cat.children.length > 0 ? (
                          <DropdownMenuSub>
                            <DropdownMenuPrimitive.SubTrigger asChild>
                              <Link
                                href={`/category/${cat.slug}`}
                                className='flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-didongviet-red rounded-lg transition-colors cursor-pointer'
                              >
                                <span>{cat.name}</span>
                                <ChevronRight
                                  size={12}
                                  className='text-slate-400 ml-auto'
                                />
                              </Link>
                            </DropdownMenuPrimitive.SubTrigger>
                            <DropdownMenuSubContent className='w-56 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-1 z-50 ml-1'>
                              {cat.children.map((child: any) => (
                                <DropdownMenuItem key={child._id} asChild>
                                  <Link
                                    href={`/category/${child.slug}`}
                                    className='block w-full px-4 py-2.5 text-xs font-semibold hover:bg-red-50 hover:text-didongviet-red rounded-lg transition-colors cursor-pointer'
                                  >
                                    {child.name}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        ) : (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/category/${cat.slug}`}
                              className='block w-full px-4 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-didongviet-red rounded-lg transition-colors cursor-pointer'
                            >
                              {cat.name}
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className='px-4 py-3 text-xs text-slate-400 text-center italic'>
                        Đang tải danh mục...
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
              {/* Khu vực Tài khoản với hover delay và Dropdown */}
              <div
                className='relative flex items-center gap-2'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <DropdownMenu
                  open={isDropdownOpen}
                  onOpenChange={setIsDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    {user ? (
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
                    ) : (
                      <Button
                        variant='header'
                        size='header-responsive'
                        className='cursor-pointer'
                      >
                        <div className='flex items-center justify-center gap-1 md:gap-2'>
                          <User size={16} />
                          <span className='hidden md:inline text-xs md:text-sm'>
                            {loading ? 'Đang tải...' : 'Đăng nhập'}
                          </span>
                        </div>
                      </Button>
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align='end'
                    sideOffset={6}
                    className='w-52 bg-white text-gray-900 border border-gray-200 rounded-xl shadow-2xl p-0 z-50 overflow-hidden'
                  >
                    {loading ? (
                      <div className='flex flex-col items-center justify-center py-6 px-4 gap-2'>
                        <span className='h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent' />
                        <p className='text-xs text-gray-500 font-medium animate-pulse'>
                          Đang tải thông tin...
                        </p>
                      </div>
                    ) : user ? (
                      <>
                        <div className='px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl mb-1'>
                          <p className='text-[10px] uppercase font-bold text-gray-400 tracking-wider'>
                            Tài khoản của bạn
                          </p>
                          <p className='text-xs font-semibold text-gray-800 truncate mt-0.5'>
                            {user.name}
                          </p>
                          <p className='text-[11px] text-gray-500 truncate'>
                            {user.email}
                          </p>
                        </div>
                        {(user.role === 'admin' || user.role === 'staff') && (
                          <DropdownMenuItem asChild>
                            <Link
                              href='/admin'
                              className='flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium transition-colors cursor-pointer'
                            >
                              Quản trị hệ thống
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link
                            href='/profile'
                            className='flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer'
                          >
                            Hồ sơ cá nhân
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <button
                            onClick={handleLogout}
                            className='w-full text-left flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold cursor-pointer border-t border-gray-100 mt-1.5 pt-2 transition-colors'
                          >
                            Đăng xuất
                          </button>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <div className='px-4 py-3 text-center flex flex-col gap-2.5'>
                        <p className='text-[11px] text-gray-500 font-medium leading-relaxed'>
                          Đăng nhập để nhận nhiều ưu đãi hấp dẫn & quản lý đơn
                          hàng tốt hơn
                        </p>
                        <Button
                          asChild
                          size='sm'
                          className='w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg py-1.5 h-auto transition-all shadow-md shadow-red-100 hover:shadow-red-200 cursor-pointer'
                        >
                          <Link href='/login'>Đăng nhập</Link>
                        </Button>
                        <div className='text-[11px] text-gray-400 mt-0.5'>
                          Khách hàng mới?{' '}
                          <Link
                            href='/login?tab=register'
                            className='text-red-600 hover:underline font-semibold'
                          >
                            Đăng ký ngay
                          </Link>
                        </div>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
