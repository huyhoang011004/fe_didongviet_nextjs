'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Package,
  ShieldCheck,
  ChevronRight,
  User,
  Phone,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Checkout Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    async function loadData() {
      try {
        const [cartRes, profileRes] = await Promise.all([
          fetch('/api/cart').then((r) => r.json()),
          fetch('/api/auth/me').then((r) => r.json()),
        ]);

        if (profileRes.success && profileRes.data) {
          const user = profileRes.data.user;
          setProfile(user);
          setFullName(user.name || '');
          setPhone(user.phone || '');

          const defaultAddress =
            user.address?.find((a: any) => a.isDefault) || user.address?.[0];
          if (defaultAddress) {
            setProvince(defaultAddress.province || '');
            setDistrict(defaultAddress.district || '');
            setWard(defaultAddress.ward || '');
            setStreetAddress(defaultAddress.streetAddress || '');
          }
        } else {
          router.push('/login');
          return;
        }

        if (cartRes.success && cartRes.data) {
          setCart(cartRes.data);
          if (cartRes.data.items.length === 0) {
            router.push('/cart'); // No items to checkout
          }
        }
      } catch (err) {
        console.error('Failed to load checkout data', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handlePlaceOrder = async () => {
    if (
      !fullName ||
      !phone ||
      !province ||
      !district ||
      !ward ||
      !streetAddress
    ) {
      setAlert({
        type: 'error',
        message: 'Vui lòng điền đầy đủ thông tin giao hàng!',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Map cart items to order items structure expected by backend
      const orderItems = cart.items.map((item: any) => ({
        product:
          typeof item.product === 'object' ? item.product._id : item.product,
        variantId: item.variantId,
        qty: item.quantity,
      }));

      const payload = {
        orderItems,
        shippingAddress: {
          fullName,
          phone,
          province,
          district,
          ward,
          streetAddress,
        },
        paymentMethod: 'COD', // Default for now
        discountDMember: cart.discountAmount || 0,
        tradeInBonus: 0,
        shippingPrice: cart.totalPrice > 5000000 ? 0 : 30000,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setAlert({
          type: 'success',
          message: 'Đặt hàng thành công! Đang chuyển hướng...',
        });
        setTimeout(() => {
          router.push('/profile'); // Redirect to profile to see the order
        }, 1500);
      } else {
        setAlert({ type: 'error', message: data.message || 'Lỗi đặt hàng' });
        setSubmitting(false);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối khi đặt hàng' });
      setSubmitting(false);
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
          Đang chuẩn bị trang thanh toán...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) return null; // Will redirect

  const shippingPrice = cart.totalPrice > 5000000 ? 0 : 30000;
  const grandTotal = cart.finalPrice + shippingPrice;

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-12'>
      {/* Alert toast */}
      {alert && (
        <div
          className={`
          fixed bottom-4 right-4 z-50 p-3 rounded-xl shadow-lg border flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-[11px] font-semibold'>{alert.message}</span>
        </div>
      )}

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
          <Link
            href='/cart'
            className='hover:text-didongviet-red transition-colors'
          >
            Giỏ hàng
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Tiến hành thanh toán</span>
        </div>
      </nav>

      <div className='max-w-6xl mx-auto px-4 py-6'>
        <div className='flex items-center gap-2.5 mb-5'>
          <div className='h-8 w-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-xs'>
            <ShieldCheck size={16} />
          </div>
          <div>
            <h1 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight'>
              Thanh toán an toàn
            </h1>
            <p className='text-[10px] text-slate-400 font-medium'>
              Vui lòng kiểm tra lại thông tin giao hàng
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-5'>
          {/* LEFT: Form & Delivery Options */}
          <div className='lg:col-span-8 space-y-4'>
            {/* THÔNG TIN KHÁCH HÀNG */}
            <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4'>
              <h2 className='text-sm font-black text-slate-800 uppercase flex items-center gap-2'>
                <User size={16} className='text-didongviet-red' />
                Thông tin người nhận
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>
                    Họ và tên *
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='Nhập họ tên người nhận'
                    className='text-xs h-10'
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>
                    Số điện thoại *
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='Nhập số điện thoại'
                    className='text-xs h-10'
                  />
                </div>
              </div>
            </div>

            {/* ĐỊA CHỈ GIAO HÀNG */}
            <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4'>
              <h2 className='text-sm font-black text-slate-800 uppercase flex items-center gap-2'>
                <MapPin size={16} className='text-blue-500' />
                Địa chỉ giao hàng
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>
                    Tỉnh / Thành phố *
                  </label>
                  <Input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder='VD: TP. Hồ Chí Minh'
                    className='text-xs h-10'
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>
                    Quận / Huyện *
                  </label>
                  <Input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder='VD: Quận 1'
                    className='text-xs h-10'
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-[10px] font-bold text-slate-500 uppercase'>
                    Phường / Xã *
                  </label>
                  <Input
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    placeholder='VD: Phường Bến Nghé'
                    className='text-xs h-10'
                  />
                </div>
              </div>
              <div className='space-y-1.5'>
                <label className='text-[10px] font-bold text-slate-500 uppercase'>
                  Số nhà, tên đường *
                </label>
                <Input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder='VD: 75 Nguyễn Bỉnh Khiêm'
                  className='text-xs h-10'
                />
              </div>
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4'>
              <h2 className='text-sm font-black text-slate-800 uppercase flex items-center gap-2'>
                <CreditCard size={16} className='text-purple-500' />
                Phương thức thanh toán
              </h2>

              <div className='grid grid-cols-1 gap-3'>
                <label className='relative flex items-center gap-3 p-3 rounded-xl border-2 border-didongviet-red bg-red-50/50 cursor-pointer transition-all'>
                  <input
                    type='radio'
                    name='payment'
                    defaultChecked
                    className='h-4 w-4 text-didongviet-red accent-didongviet-red'
                  />
                  <div className='flex flex-col'>
                    <span className='text-xs font-bold text-slate-800'>
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className='text-[10px] text-slate-500'>
                      Kiểm tra hàng trước khi thanh toán.
                    </span>
                  </div>
                </label>

                <label className='relative flex items-center gap-3 p-3 rounded-xl border border-slate-200 opacity-60 cursor-not-allowed'>
                  <input
                    type='radio'
                    name='payment'
                    disabled
                    className='h-4 w-4'
                  />
                  <div className='flex flex-col'>
                    <span className='text-xs font-bold text-slate-800'>
                      Thanh toán online (VNPAY / MOMO)
                    </span>
                    <span className='text-[10px] text-slate-500'>
                      Tính năng đang được bảo trì.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className='lg:col-span-4 space-y-4'>
            <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-4'>
              <h2 className='text-sm font-black text-slate-800 uppercase flex items-center gap-2 border-b border-slate-100 pb-3'>
                <Package size={16} className='text-didongviet-red' />
                Đơn hàng ({cart.items.length} sp)
              </h2>

              <div className='space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar'>
                {cart.items.map((item: any, idx: number) => {
                  const productName =
                    typeof item.product === 'object'
                      ? item.product.name
                      : 'Sản phẩm';
                  const thumbUrl =
                    typeof item.product === 'object'
                      ? item.product.images?.find((img: any) => img.isThumbnail)
                          ?.url ||
                        item.product.images?.[0]?.url ||
                        '/placeholder-product.png'
                      : '/placeholder-product.png';

                  return (
                    <div key={idx} className='flex gap-3'>
                      <div className='h-12 w-12 rounded bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center p-1'>
                        <img
                          src={thumbUrl}
                          alt='thumb'
                          className='h-full w-full object-contain'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-[11px] font-bold text-slate-800 truncate'>
                          {productName}
                        </h4>
                        <div className='flex items-center justify-between mt-1'>
                          <span className='text-[10px] text-slate-500 font-semibold'>
                            SL: {item.quantity}
                          </span>
                          <span className='text-[11px] font-black text-didongviet-red'>
                            {formatVND(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className='border-t border-slate-100 pt-3 space-y-2 text-[11px]'>
                <div className='flex items-center justify-between text-slate-500 font-medium'>
                  <span>Tạm tính</span>
                  <span className='font-bold text-slate-700'>
                    {formatVND(cart.totalPrice)}
                  </span>
                </div>

                {cart.discountAmount > 0 && (
                  <div className='flex items-center justify-between text-green-600 font-bold'>
                    <span>Giảm giá</span>
                    <span>-{formatVND(cart.discountAmount)}</span>
                  </div>
                )}

                <div className='flex items-center justify-between text-slate-500 font-medium'>
                  <span>Phí vận chuyển</span>
                  <span
                    className={
                      shippingPrice === 0
                        ? 'font-bold text-emerald-600'
                        : 'font-bold text-slate-700'
                    }
                  >
                    {shippingPrice === 0
                      ? 'Miễn phí'
                      : formatVND(shippingPrice)}
                  </span>
                </div>
              </div>

              <div className='border-t border-slate-100 pt-3'>
                <div className='flex items-center justify-between mb-4'>
                  <span className='text-xs font-black text-slate-800 uppercase'>
                    Tổng cộng
                  </span>
                  <span className='text-xl font-black text-didongviet-red'>
                    {formatVND(grandTotal)}
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white py-5 rounded-xl font-bold border-none shadow-md cursor-pointer text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100'
                >
                  {submitting ? 'Đang xử lý...' : 'ĐẶT HÀNG NGAY'}
                </Button>
              </div>
            </div>

            <div className='bg-white rounded-xl border border-slate-100 shadow-xs p-4 flex items-start gap-3'>
              <Truck size={20} className='text-blue-500 flex-shrink-0' />
              <div>
                <h4 className='text-[11px] font-bold text-slate-800 uppercase'>
                  Giao hàng siêu tốc 2H
                </h4>
                <p className='text-[10px] text-slate-500 mt-0.5'>
                  Nhận hàng trong vòng 2 giờ tại khu vực nội thành. Đảm bảo an
                  toàn, nhanh chóng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
