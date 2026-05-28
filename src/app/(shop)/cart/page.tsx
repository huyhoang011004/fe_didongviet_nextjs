'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  Ticket,
  ShieldCheck,
  Truck,
  RotateCw,
  ArrowRight,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

interface CartItem {
  product: {
    _id: string;
    name: string;
    images?: { url: string; isThumbnail?: boolean }[];
  };
  variantId: string;
  quantity: number;
  selectedColor: string;
  selectedStorage: string;
  price: number;
}

interface CartData {
  items: CartItem[];
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  appliedVoucher: string | null;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // variantId being updated
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Alert
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Tải giỏ hàng
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.status === 401) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Cập nhật số lượng
  const handleUpdateQty = async (productId: string, variantId: string, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(variantId);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể cập nhật' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối' });
    } finally {
      setUpdating(null);
    }
  };

  // Xóa item
  const handleRemoveItem = async (productId: string, variantId: string) => {
    setUpdating(variantId);
    try {
      const res = await fetch(`/api/cart/${productId}/${variantId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        setAlert({ type: 'success', message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể xóa' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối' });
    } finally {
      setUpdating(null);
    }
  };

  // Áp dụng voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const res = await fetch('/api/cart/apply-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherCode: voucherCode.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAlert({ type: 'success', message: data.message || 'Áp dụng mã thành công!' });
        // Reload cart to get updated prices
        await fetchCart();
        setVoucherCode('');
      } else {
        setAlert({ type: 'error', message: data.message || 'Mã không hợp lệ' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối' });
    } finally {
      setVoucherLoading(false);
    }
  };

  // Chưa đăng nhập
  if (!isLoggedIn) {
    return (
      <div className='min-h-screen bg-slate-50 font-sans flex flex-col items-center justify-center p-8 text-center'>
        <div className='h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4'>
          <ShoppingBag size={28} />
        </div>
        <h2 className='text-base font-black text-slate-800 uppercase'>Bạn cần đăng nhập</h2>
        <p className='text-[11px] text-gray-500 max-w-sm mt-1 mb-5 leading-relaxed'>
          Vui lòng đăng nhập tài khoản Di Động Việt để xem và quản lý giỏ hàng của bạn.
        </p>
        <div className='flex gap-3'>
          <Button onClick={() => router.push('/login')} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white py-2.5 px-6 text-xs font-bold rounded-xl border-none shadow-sm'>
            Đăng nhập
          </Button>
          <Button onClick={() => router.push('/signup')} variant='outline' className='py-2.5 px-6 text-xs font-bold rounded-xl border-slate-200'>
            Đăng ký
          </Button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>DĐV</div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>Đang tải giỏ hàng...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700'>
      
      {/* Alert toast */}
      {alert && (
        <div className={`
          fixed bottom-4 right-4 z-50 p-3 rounded-xl shadow-lg border flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}>
          {alert.type === 'success' ? <CheckCircle size={16} className='text-green-600 flex-shrink-0' /> : <AlertCircle size={16} className='text-red-600 flex-shrink-0' />}
          <span className='text-[11px] font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-6xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>Trang chủ</Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Giỏ hàng</span>
        </div>
      </nav>

      <div className='max-w-6xl mx-auto px-4 py-6'>

        {/* Title */}
        <div className='flex items-center gap-2.5 mb-5'>
          <div className='h-8 w-8 rounded-lg bg-didongviet-red text-white flex items-center justify-center'>
            <ShoppingBag size={16} />
          </div>
          <div>
            <h1 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight'>Giỏ hàng của bạn</h1>
            <p className='text-[10px] text-slate-400 font-medium'>
              {isEmpty ? 'Chưa có sản phẩm nào' : `${items.length} sản phẩm trong giỏ`}
            </p>
          </div>
        </div>

        {isEmpty ? (
          /* Empty cart */
          <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-12 text-center'>
            <div className='h-20 w-20 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-4'>
              <ShoppingBag size={36} />
            </div>
            <h2 className='text-sm font-black text-slate-800 uppercase mb-1'>Giỏ hàng trống</h2>
            <p className='text-[10px] text-gray-500 max-w-sm mx-auto mb-5 leading-relaxed'>
              Hãy khám phá kho sản phẩm chính hãng của Di Động Việt và thêm sản phẩm yêu thích vào giỏ hàng nhé!
            </p>
            <Button asChild className='bg-didongviet-red hover:bg-didongviet-dark-red text-white py-2.5 px-6 text-xs font-bold rounded-xl border-none shadow-sm'>
              <Link href='/products' className='flex items-center gap-1.5'>
                <span>Khám phá sản phẩm</span>
                <ArrowRight size={12} />
              </Link>
            </Button>
          </div>
        ) : (
          /* Cart with items */
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
            
            {/* LEFT: Cart items */}
            <div className='lg:col-span-8 space-y-3'>
              {items.map((item) => {
                const productId = typeof item.product === 'object' ? item.product._id : item.product;
                const productName = typeof item.product === 'object' ? item.product.name : 'Sản phẩm';
                const thumbUrl = typeof item.product === 'object' 
                  ? (item.product.images?.find(img => img.isThumbnail)?.url || item.product.images?.[0]?.url || '/placeholder-product.png')
                  : '/placeholder-product.png';
                const isUpdating = updating === item.variantId;

                return (
                  <div 
                    key={`${productId}-${item.variantId}`}
                    className={`bg-white rounded-xl border border-slate-100 shadow-xs p-4 flex gap-4 items-start transition-all ${isUpdating ? 'opacity-60' : ''}`}
                  >
                    {/* Product image */}
                    <Link href={`/product/${productId}`} className='flex-shrink-0'>
                      <div className='h-20 w-20 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center p-1.5 hover:border-slate-200 transition-colors'>
                        <img src={thumbUrl} alt={productName} className='h-full w-full object-contain' />
                      </div>
                    </Link>

                    {/* Product info */}
                    <div className='flex-1 min-w-0 space-y-2'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='min-w-0'>
                          <Link href={`/product/${productId}`} className='font-bold text-slate-800 text-xs sm:text-sm hover:text-didongviet-red block truncate leading-snug'>
                            {productName}
                          </Link>
                          <div className='flex flex-wrap items-center gap-2 mt-1'>
                            {item.selectedColor && (
                              <span className='text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded'>
                                Màu: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedStorage && (
                              <span className='text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded'>
                                {item.selectedStorage}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleRemoveItem(productId, item.variantId)}
                          disabled={isUpdating}
                          className='h-7 w-7 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 cursor-pointer transition-all flex-shrink-0 disabled:opacity-50'
                          title='Xóa khỏi giỏ'
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-black text-didongviet-red'>
                          {formatVND(item.price)}
                        </span>

                        <div className='flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white'>
                          <button
                            disabled={item.quantity <= 1 || isUpdating}
                            onClick={() => handleUpdateQty(productId, item.variantId, item.quantity - 1)}
                            className='px-2.5 py-1.5 hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-40 text-slate-800'
                          >
                            <Minus size={12} />
                          </button>
                          <span className='px-3 py-1 text-[11px] font-black text-slate-800 text-center min-w-[28px] border-x border-slate-200'>
                            {item.quantity}
                          </span>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdateQty(productId, item.variantId, item.quantity + 1)}
                            className='px-2.5 py-1.5 hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-40 text-slate-800'
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className='text-[10px] text-slate-400 font-semibold text-right'>
                        Thành tiền: <strong className='text-slate-700'>{formatVND(item.price * item.quantity)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Continue shopping */}
              <div className='pt-2'>
                <Button asChild variant='ghost' className='text-[10px] text-didongviet-red font-bold hover:bg-red-50 rounded-lg h-8 px-3'>
                  <Link href='/products' className='flex items-center gap-1'>
                    <ArrowRight size={10} className='rotate-180' />
                    <span>Tiếp tục mua sắm</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT: Order summary */}
            <div className='lg:col-span-4 space-y-4'>
              
              {/* Voucher */}
              <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-4 space-y-3'>
                <div className='flex items-center gap-1.5'>
                  <Ticket size={14} className='text-didongviet-red' />
                  <span className='text-[10px] font-black text-slate-800 uppercase tracking-wider'>Mã giảm giá</span>
                </div>

                {cart?.appliedVoucher ? (
                  <div className='flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-lg'>
                    <div className='flex items-center gap-1.5'>
                      <CheckCircle size={13} className='text-green-600' />
                      <span className='text-[10px] font-bold text-green-700'>
                        Đang dùng: <strong>{cart.appliedVoucher}</strong>
                      </span>
                    </div>
                    <span className='text-[10px] font-black text-green-700'>-{formatVND(cart.discountAmount)}</span>
                  </div>
                ) : (
                  <div className='flex gap-2'>
                    <Input
                      placeholder='Nhập mã voucher...'
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
                      className='text-[11px] h-9 rounded-lg border-slate-200 uppercase font-bold'
                    />
                    <Button
                      onClick={handleApplyVoucher}
                      disabled={voucherLoading || !voucherCode.trim()}
                      className='bg-didongviet-red hover:bg-didongviet-dark-red text-white h-9 px-4 text-[10px] font-bold rounded-lg border-none cursor-pointer disabled:opacity-50'
                    >
                      {voucherLoading ? <Loader2 size={12} className='animate-spin' /> : 'Áp dụng'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-4 space-y-3'>
                <span className='text-[10px] font-black text-slate-800 uppercase tracking-wider block'>Tóm tắt đơn hàng</span>

                <div className='space-y-2 text-[11px]'>
                  <div className='flex items-center justify-between text-slate-500 font-medium'>
                    <span>Tạm tính ({items.length} sản phẩm)</span>
                    <span className='font-bold text-slate-700'>{formatVND(cart?.totalPrice || 0)}</span>
                  </div>
                  
                  {(cart?.discountAmount || 0) > 0 && (
                    <div className='flex items-center justify-between text-green-600 font-bold'>
                      <span>Giảm giá voucher</span>
                      <span>-{formatVND(cart!.discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className='flex items-center justify-between text-slate-500 font-medium'>
                    <span>Phí vận chuyển</span>
                    <span className='font-bold text-emerald-600'>Miễn phí</span>
                  </div>

                  <div className='border-t border-slate-100 pt-2 flex items-center justify-between'>
                    <span className='text-xs font-black text-slate-800 uppercase'>Tổng thanh toán</span>
                    <span className='text-lg font-black text-didongviet-red'>{formatVND(cart?.finalPrice || cart?.totalPrice || 0)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push('/checkout')}
                  className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white py-5 rounded-xl font-bold border-none shadow-md cursor-pointer text-xs flex items-center justify-center gap-1.5 group transition-transform hover:scale-[1.01]'
                >
                  <Package size={15} className='group-hover:animate-bounce' />
                  <div className='text-left leading-tight'>
                    <span className='block font-black'>TIẾN HÀNH ĐẶT HÀNG</span>
                    <span className='block text-[8px] font-normal text-white/80'>Giao hàng siêu tốc 2h nội thành</span>
                  </div>
                </Button>
              </div>

              {/* Trust badges */}
              <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-3.5 space-y-2'>
                {[
                  { icon: ShieldCheck, color: 'text-emerald-600', label: '100% chính hãng, cam kết hoàn tiền' },
                  { icon: Truck, color: 'text-blue-500', label: 'Giao hàng miễn phí toàn quốc' },
                  { icon: RotateCw, color: 'text-purple-600', label: '1 đổi 1 trong 30 ngày nếu lỗi NSX' },
                ].map((item, idx) => (
                  <div key={idx} className='flex items-center gap-2 text-[10px] text-slate-500 font-medium'>
                    <item.icon size={13} className={`${item.color} flex-shrink-0`} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
