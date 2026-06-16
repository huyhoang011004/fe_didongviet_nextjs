'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Phone,
  User,
  FileSearchCorner,
  ShieldCheck,
  BadgeDollarSign,
  RefreshCw,
  Newspaper,
  BookOpen,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { BiCategory } from 'react-icons/bi';
import { Label } from '@/shared/components/ui/label';
import HeaderSearch from './HeaderSearch';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger, // Thêm dòng này vào
} from '@/shared/components/ui/dropdown-menu';

// XÓA DÒNG NÀY: import { DropdownMenu as DropdownMenuPrimitive } from '@radix-ui/react-dropdown-menu';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';

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
  const [mounted, setMounted] = useState(false);

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const cartItems = useCartStore((state) => state.items);
  const removeCartItem = useCartStore((state) => state.removeItem);
  const cartTotalPrice = useCartStore((state) => state.getTotalPrice());

  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const cartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCartMouseEnter = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    setIsCartDropdownOpen(true);
  };

  const handleCartMouseLeave = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }
    cartTimeoutRef.current = setTimeout(() => {
      setIsCartDropdownOpen(false);
    }, 300);
  };

  const [categories, setCategories] = useState<any[]>([]);

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHeaderVisible(false);
        setIsDropdownOpen(false);
        setIsCategoryOpen(false);
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    }, 500);
  };

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
      }, 0);
    }
  };

  const handleCategoryMouseLeave = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    if (isCategoryOpen) {
      categoryTimeoutRef.current = setTimeout(() => {
        setIsCategoryOpen(false);
      }, 500);
    } else {
      setIsCategoryOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
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
        loading && setLoading(false);
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
    useCartStore.getState().fetchCart();
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className='fixed top-0 z-50 w-full bg-primary text-white shadow-sm'>
      {/* ĐÃ CHỈNH: Giảm py-2 md:py-3 xuống py-1.5 md:py-2 để thu nhỏ chiều cao header */}
      <div className='max-w-[1400px] mx-auto px-[30px] py-1.5 md:py-2'>
        {/* ĐÃ CHỈNH: Giảm gap từ gap-2 md:gap-3 xuống gap-1.5 md:gap-2 */}
        <div className='flex flex-col gap-1.5 md:gap-2'>
          {/* ĐOẠN ĐÃ SỬA: Giảm padding dọc (py-1 md:py-2 -> py-0.5 md:py-1) để thanh Marquee mỏng lại */}
          <div
            className={`
              flex items-center justify-between gap-4 md:gap-8 w-full min-w-0 
              transition-all duration-300 ease-in-out border-b border-white/10
              ${isHeaderVisible
                ? 'max-h-[35px] opacity-100 py-0.5 md:py-1'
                : 'max-h-0 opacity-0 py-0 pointer-events-none overflow-hidden border-none'
              }
            `}
          >
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

          {/* Phần chính chứa Logo, Search, Giỏ hàng... */}
          <div className='flex flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4'>
            <Link
              href='/'
              className='flex flex-row sm:flex-row sm:items-center gap-1 md:gap-2 text-white min-w-0 '
            >
              <div className='text-md md:text-2xl font-black tracking-tighter whitespace-nowrap'>
                {' '}
                {/* Giảm size text trên md từ 3xl xuống 2xl */}Di Động
              </div>
              <div className='text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-white/90'>
                {' '}
                {/* Giảm size text trên md từ base xuống sm */}
                VIỆT
              </div>
            </Link>
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
                      className='cursor-pointerh-9' // Thêm h-9 để đồng bộ chiều cao nút danh mục với ô search mới
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
                            {/* ĐÃ SỬA: Thay thế DropdownMenuPrimitive.SubTrigger bằng DropdownMenuSubTrigger */}
                            <DropdownMenuSubTrigger
                              asChild
                              className='cursor-pointer'
                            >
                              <Link
                                href={`/${cat.slug}`}
                                className='flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-didongviet-red rounded-lg transition-colors'
                              >
                                <span>{cat.name}</span>
                                <ChevronRight
                                  size={12}
                                  className='text-slate-400 ml-auto'
                                />
                              </Link>
                            </DropdownMenuSubTrigger>

                            <DropdownMenuSubContent className='w-56 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-1 z-50 ml-1'>
                              {cat.children.map((child: any) => (
                                <DropdownMenuItem key={child._id} asChild>
                                  <Link
                                    href={`/${child.slug}`}
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
                              href={`/${cat.slug}`}
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

              <Button
                asChild
                variant='header'
                size='header-responsive'
                className='h-9'
              >
                <Link
                  href='/blogs'
                  className='flex items-center justify-center gap-1 md:gap-2 text-amber-400 hover:text-amber-300'
                >
                  <BookOpen size={16} />
                  <span className='hidden md:inline text-xs md:text-sm'>
                    Tin tức
                  </span>
                </Link>
              </Button>
            </div>

            <div className='flex-1 max-w-xl h-9'>
              <HeaderSearch />
            </div>

            <div className='flex items-center gap-2'>
              <div
                className='relative'
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
              >
                <DropdownMenu
                  open={isCartDropdownOpen}
                  onOpenChange={setIsCartDropdownOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      asChild
                      variant='header'
                      size='header-responsive'
                      className='relative h-9 cursor-pointer'
                    >
                      <Link
                        href='/cart'
                        className='flex items-center justify-center gap-1 md:gap-2'
                      >
                        <ShoppingCart size={16} />
                        <span className='hidden md:inline text-xs md:text-sm'>
                          Giỏ hàng
                        </span>
                        {mounted && totalCartItems > 0 && (
                          <span className='absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm'>
                            {totalCartItems}
                          </span>
                        )}
                      </Link>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align='end'
                    sideOffset={6}
                    className='w-[360px] bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-0 z-50 overflow-hidden'
                  >
                    <div className='p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50'>
                      <span className='text-xs font-bold text-slate-800 uppercase tracking-wider'>
                        Giỏ hàng của tôi ({cartItems.length} sản phẩm)
                      </span>
                      <Link href='/cart' className='text-[11px] font-bold text-didongviet-red hover:underline'>
                        Xem tất cả
                      </Link>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className='p-6 text-center flex flex-col items-center justify-center gap-2'>
                        <ShoppingCart size={36} className='text-slate-300' />
                        <p className='text-xs text-slate-400 font-bold'>
                          Giỏ hàng của bạn còn trống
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className='max-h-[280px] overflow-y-auto divide-y divide-slate-100 no-scrollbar'>
                          {cartItems.slice(0, 5).map((item) => (
                            <div key={`${item.product}-${item.variant}`} className='p-3 flex gap-3 hover:bg-slate-50/40 transition-colors group'>
                              <Link
                                href={`/${item.categorySlug || 'dien-thoai'}/${item.slug}`}
                                className='w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center p-1 shrink-0'
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className='w-full h-full object-contain'
                                  referrerPolicy='no-referrer'
                                />
                              </Link>

                              <div className='flex-1 min-w-0 space-y-0.5'>
                                <Link
                                  href={`/${item.categorySlug || 'dien-thoai'}/${item.slug}`}
                                  className='block text-[11px] font-bold text-slate-800 hover:text-didongviet-red transition-colors truncate'
                                >
                                  {item.name}
                                </Link>
                                <span className='block text-[9px] text-slate-400 font-semibold'>
                                  Phân loại: {item.selectedColor || 'Mặc định'}{item.selectedStorage ? ` - ${item.selectedStorage}` : ''}
                                </span>
                                <div className='flex items-center justify-between mt-1'>
                                  <span className='text-[10px] text-slate-405 font-medium'>
                                    SL: {item.quantity}
                                  </span>
                                  <span className='text-[11px] font-bold text-didongviet-red'>
                                    {((item.salePrice || item.price) * item.quantity).toLocaleString('vi-VN')}đ
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => removeCartItem(item.product, item.variant)}
                                className='h-6 w-6 rounded-md border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-didongviet-red hover:border-red-200 hover:bg-red-50 cursor-pointer transition-all opacity-0 group-hover:opacity-100 self-center'
                                title='Xóa sản phẩm'
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {cartItems.length > 5 && (
                          <div className='px-4 py-1.5 bg-red-50/20 border-t border-slate-100 text-center text-[10px] font-semibold text-slate-500'>
                            Còn {cartItems.length - 5} sản phẩm khác trong giỏ hàng
                          </div>
                        )}

                        <div className='p-3 bg-slate-50/80 border-t border-slate-100 space-y-2.5'>
                          <div className='flex items-center justify-between text-xs'>
                            <span className='font-semibold text-slate-500'>Tổng tiền tạm tính:</span>
                            <span className='font-black text-sm text-didongviet-red'>
                              {cartTotalPrice.toLocaleString('vi-VN')}đ
                            </span>
                          </div>

                          <div className='grid grid-cols-2 gap-2'>
                            <Button
                              asChild
                              variant='outline'
                              size='sm'
                              className='w-full text-xs font-bold py-1.5 h-auto rounded-lg cursor-pointer border-slate-200 hover:bg-slate-100'
                            >
                              <Link href='/cart'>Vào giỏ hàng</Link>
                            </Button>
                            <Button
                              asChild
                              size='sm'
                              className='w-full bg-didongviet-red hover:bg-red-700 text-white font-bold text-xs rounded-lg py-1.5 h-auto transition-all cursor-pointer border-none shadow-sm'
                            >
                              <Link href='/checkout'>Thanh toán</Link>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
                        className='flex items-center gap-2 cursor-pointer h-9' // Đồng bộ h-9
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
                        className='cursor-pointer h-9' // Đồng bộ h-9
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
                            href='/profile/info'
                            className='flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer'
                          >
                            Tài khoản của tôi
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href='/profile/orders'
                            className='flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer'
                          >
                            Đơn mua
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
