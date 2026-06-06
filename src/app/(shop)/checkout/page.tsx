'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Ticket,
} from 'lucide-react';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';
import VoucherList from '../cart/_components/VoucherList';
import {
  fetchVouchers,
  findVoucherByCode,
  calcVoucherValue,
  applyVoucherServer,
} from '../cart/cart-actions';
import { VIETNAM_PROVINCES, getBranchRegion } from './_components/checkout-utils';
import AddressModal from './_components/AddressModal';

// Các component con mới tách
import CheckoutAddressForm from './_components/CheckoutAddressForm';
import BranchSelector from './_components/BranchSelector';
import PaymentMethods from './_components/PaymentMethods';
import CheckoutProductList from './_components/CheckoutProductList';
import PaymentSummary from './_components/PaymentSummary';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function CheckoutPage() {
  const router = useRouter();

  // Zustand Cart Store
  const allCartItems = useCartStore((state) => state.items);
  const selected = useCartStore((state) => state.selected);
  const removeItem = useCartStore((state) => state.removeItem);

  // Lọc lấy các sản phẩm đã chọn thanh toán
  const cartItems = allCartItems.filter((item) =>
    selected.includes(`${item.product}|${item.variant}`)
  );

  const selectedTotalPrice = cartItems.reduce(
    (total, item) => total + (item.salePrice || item.price) * item.quantity,
    0
  );

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Form Địa chỉ nhận hàng
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Hồ Chí Minh');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  // Chi nhánh & Phương thức thanh toán
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, MOMO, VNPAY

  // Voucher States
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [bestVoucherCode, setBestVoucherCode] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Sổ địa chỉ ở Checkout States
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Chi tiết sản phẩm để kiểm tra tồn kho tại các chi nhánh
  const [productDetails, setProductDetails] = useState<Record<string, any>>({});

  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Load profile và chi nhánh
  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, branchesRes, vouchersRes] = await Promise.all([
          fetch('/api/auth/me').then((r) => r.json()),
          fetch(`${API_URL}/branches`).then((r) => r.json()),
          fetchVouchers()
        ]);

        if (profileRes.success && profileRes.data) {
          const user = profileRes.data.user;
          setProfile(user);
          setFullName(user.name || '');
          setPhone(user.phone || '');

          const defaultAddress =
            user.address?.find((a: any) => a.isDefault) || user.address?.[0];
          if (defaultAddress) {
            setProvince(defaultAddress.province || 'Hồ Chí Minh');
            setDistrict(defaultAddress.district || '');
            setWard(defaultAddress.ward || '');
            setStreetAddress(defaultAddress.streetAddress || '');
          }
        } else {
          router.push('/login');
          return;
        }

        if (branchesRes && branchesRes.success) {
          const list = branchesRes.branches || branchesRes.data || [];
          setBranches(list);
          if (list.length > 0) {
            setSelectedBranchId(list[0]._id);
          }
        }

        if (vouchersRes) {
          setVouchers(vouchersRes);
        }

        if (cartItems.length === 0) {
          router.push('/cart');
        }
      } catch (err) {
        console.error('Failed to load checkout data', err);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      loadData();
    }
  }, [router, mounted, cartItems.length]);

  // Tính chất tự động áp dụng và tính lại giá trị Voucher dựa trên các sản phẩm
  useEffect(() => {
    if (!vouchers || vouchers.length === 0) return;
    const total = selectedTotalPrice;

    const calcValue = (v: any) => {
      return calcVoucherValue(v, total);
    };

    const applicable = vouchers
      .map((v) => ({ ...v, _value: calcValue(v) }))
      .filter((v) => v._value !== null && v._value > 0)
      .sort((a, b) => b._value - a._value);

    if (applicable.length > 0) {
      const best = applicable[0];
      setBestVoucherCode(best.code);
      if (!appliedVoucher) {
        setAppliedVoucher(best);
        setDiscountAmount(best._value);
      } else {
        const currentVal = calcValue(appliedVoucher);
        if (currentVal === null || currentVal === 0) {
          setAppliedVoucher(best);
          setDiscountAmount(best._value);
        } else {
          setDiscountAmount(currentVal);
          if (currentVal < best._value) {
            setBestVoucherCode(best.code);
          }
        }
      }
    } else {
      setBestVoucherCode(null);
      setAppliedVoucher(null);
      setDiscountAmount(0);
    }
  }, [vouchers, selectedTotalPrice]);

  // Chuỗi serialized của danh sách ID sản phẩm duy nhất để dùng làm dependency cho useEffect
  const serializedProductIds = JSON.stringify(
    Array.from(new Set(cartItems.map((item) => item.product))).sort()
  );

  // Load chi tiết sản phẩm để lấy thông tin tồn kho
  useEffect(() => {
    if (cartItems.length === 0) return;

    async function loadProductDetails() {
      try {
        const uniqueIds = Array.from(new Set(cartItems.map((item) => item.product)));
        const detailsMap: Record<string, any> = {};

        await Promise.all(
          uniqueIds.map(async (id) => {
            const res = await fetch(`${API_URL}/products/${id}`).then((r) => r.json());
            if (res && res.success && res.data) {
              detailsMap[id] = res.data;
            }
          })
        );

        setProductDetails((prev) => ({ ...prev, ...detailsMap }));
      } catch (err) {
        console.error('Failed to load product details for branch stock check:', err);
      }
    }

    loadProductDetails();
  }, [serializedProductIds]);

  // Danh sách các voucher đủ điều kiện áp dụng
  const applicableVouchers = (vouchers || [])
    .map((v) => ({ ...v, _value: calcVoucherValue(v, selectedTotalPrice) }))
    .filter((v) => v._value !== null && v._value > 0)
    .sort((a, b) => b._value - a._value);

  // Tìm chi nhánh hiện tại đang chọn
  const selectedBranch = branches.find((b) => b._id === selectedBranchId);

  // Tính phí vận chuyển tự động
  const getShippingPrice = () => {
    if (selectedTotalPrice > 2000000) return 0; // Đơn trên 2 triệu miễn phí ship
    if (!province || !selectedBranch) return 30000;

    const recipient = VIETNAM_PROVINCES.find((p) => p.name === province);
    const branchInfo = getBranchRegion(selectedBranch.address);

    if (!recipient) return 30000;

    if (recipient.name === branchInfo.province) {
      return 30000; // Cùng tỉnh thành
    }
    if (recipient.region === branchInfo.region) {
      return 40000; // Cùng miền
    }
    return 60000; // Khác miền
  };

  const shippingPrice = getShippingPrice();
  const grandTotal = Math.max(0, selectedTotalPrice + shippingPrice - discountAmount);

  // Hàm áp dụng voucher thủ công
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const code = voucherCode.toUpperCase();
      const srv = await applyVoucherServer(code);
      if (srv.status === 200 && srv.data && srv.data.success) {
        const payload = srv.data.data || srv.data;
        setAppliedVoucher({ code: payload.voucherCode || code });
        setDiscountAmount(payload.discountAmount || 0);
        setAlert({ type: 'success', message: 'Áp dụng mã thành công!' });
        setVoucherCode('');
        setShowVoucherModal(false);
        return;
      }

      if (srv.status === 401) {
        const result = await findVoucherByCode(code, selectedTotalPrice);
        if (!result || !result.voucher) {
          setAlert({
            type: 'error',
            message: 'Mã không hợp lệ hoặc đã hết hạn',
          });
          return;
        }
        if (!result.value || result.value <= 0) {
          setAlert({
            type: 'error',
            message: 'Mã chưa đạt điều kiện áp dụng cho các sản phẩm đã chọn',
          });
          return;
        }
        setAppliedVoucher(result.voucher);
        setDiscountAmount(result.value);
        setAlert({
          type: 'success',
          message: 'Áp dụng mã (tạm tính) thành công!',
        });
        setVoucherCode('');
        setShowVoucherModal(false);
        return;
      }

      const msg = srv.data?.message || 'Mã không hợp lệ hoặc đã hết hạn';
      setAlert({ type: 'error', message: msg });
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi khi kiểm tra mã giảm giá' });
    } finally {
      setVoucherLoading(false);
    }
  };

  const applyVoucherByCode = async (code: string) => {
    setVoucherLoading(true);
    try {
      const srv = await applyVoucherServer(code);
      if (srv.status === 200 && srv.data && srv.data.success) {
        const payload = srv.data.data || srv.data;
        setAppliedVoucher({ code: payload.voucherCode || code });
        setDiscountAmount(payload.discountAmount || 0);
        setAlert({ type: 'success', message: 'Áp dụng mã thành công!' });
        setShowVoucherModal(false);
        return;
      }

      if (srv.status === 401) {
        const result = await findVoucherByCode(code, selectedTotalPrice);
        if (result && result.voucher && result.value > 0) {
          setAppliedVoucher(result.voucher);
          setDiscountAmount(result.value);
          setAlert({
            type: 'success',
            message: 'Áp dụng mã giảm giá thành công!',
          });
          setShowVoucherModal(false);
        } else {
          setAlert({
            type: 'error',
            message:
              'Mã giảm giá này chưa đạt điều kiện tối thiểu của đơn hàng đã chọn',
          });
        }
        return;
      }

      setAlert({
        type: 'error',
        message: srv.data?.message || 'Không thể áp dụng mã',
      });
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi khi áp dụng mã' });
    } finally {
      setVoucherLoading(false);
    }
  };

  // Đặt hàng ngay
  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !province || !district.trim() || !ward.trim() || !streetAddress.trim()) {
      setAlert({
        type: 'error',
        message: 'Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng!',
      });
      return;
    }

    if (!selectedBranchId) {
      setAlert({
        type: 'error',
        message: 'Vui lòng chọn chi nhánh đặt hàng!',
      });
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        variantId: item.variant !== 'default' ? item.variant : null,
        qty: item.quantity,
      }));

      // Đẩy voucher giảm giá vào discountDMember để backend trừ tiền hợp lệ
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
        paymentMethod,
        discountDMember: discountAmount,
        tradeInBonus: 0,
        shippingPrice,
        branchId: selectedBranchId,
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

        // Xóa các sản phẩm đã thanh toán thành công khỏi store/giỏ hàng
        for (const item of cartItems) {
          await removeItem(item.product, item.variant);
        }

        setTimeout(() => {
          router.push('/profile/orders');
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

  if (!mounted || loading) {
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

  if (cartItems.length === 0) return null;

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-16 animate-in fade-in duration-200'>
      {/* Alert toast */}
      {alert && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-3.5 rounded-xl shadow-lg border flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}`}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-xs font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5 shadow-xs'>
        <div className='max-w-[1400px] mx-auto px-[30px] flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
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
          <span className='text-slate-800 font-bold'>Thanh toán đơn hàng</span>
        </div>
      </nav>

      {/* CỐT BỐ CỤC CHÍNH */}
      <div className='max-w-[1400px] mx-auto px-[30px] py-6 space-y-6'>
        {/* Header Title */}
        <div className='flex items-center gap-2.5'>
          <div className='h-8 w-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-sm'>
            <ShieldCheck size={16} />
          </div>
          <div>
            <h1 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight'>
              Thanh toán an toàn
            </h1>
            <p className='text-[10px] text-slate-400 font-medium'>
              Hoàn tất thông tin để nhận hàng siêu tốc
            </p>
          </div>
        </div>

        {/* Layout Grid 2 cột */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
          {/* CỘT BÊN TRÁI (CHIẾM 1 NỬA) */}
          <div className='lg:col-span-5 space-y-5'>
            {/* 1. ĐỊA CHỈ NHẬN HÀNG */}
            <CheckoutAddressForm
              fullName={fullName}
              setFullName={setFullName}
              phone={phone}
              setPhone={setPhone}
              province={province}
              setProvince={setProvince}
              district={district}
              setDistrict={setDistrict}
              ward={ward}
              setWard={setWard}
              streetAddress={streetAddress}
              setStreetAddress={setStreetAddress}
              profile={profile}
              setShowAddressModal={setShowAddressModal}
            />

            {/* 2. CHỌN CHI NHÁNH ĐẶT HÀNG */}
            <BranchSelector
              branches={branches}
              selectedBranchId={selectedBranchId}
              setSelectedBranchId={setSelectedBranchId}
              selectedBranch={selectedBranch}
            />

            {/* 3. PHƯƠNG THỨC THANH TOÁN */}
            <PaymentMethods
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          {/* CỘT BÊN PHẢI */}
          <div className='lg:col-span-7 space-y-5'>
            {/* 1. ĐƠN HÀNG */}
            <CheckoutProductList
              cartItems={cartItems}
              formatVND={formatVND}
              branches={branches}
              productDetails={productDetails}
              selectedBranchId={selectedBranchId}
            />

            {/* 2. CHỌN MÃ GIẢM GIÁ (VOUCHER) */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-2xs p-4 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Ticket size={16} className='text-didongviet-red' />
                <span className='text-xs font-bold text-slate-800'>
                  Mã giảm giá (Voucher)
                </span>
              </div>
              <div className='flex items-center gap-3'>
                {appliedVoucher ? (
                  <span className='bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1'>
                    <span>{appliedVoucher.code}</span>
                    <button
                      onClick={() => {
                        setAppliedVoucher(null);
                        setDiscountAmount(0);
                      }}
                      className='text-green-500 hover:text-green-700 font-black ml-1 text-xs'
                    >
                      ×
                    </button>
                  </span>
                ) : bestVoucherCode ? (
                  <span className='text-[10px] text-didongviet-red bg-red-50 px-2 py-0.5 rounded font-bold animate-pulse'>
                    Có mã tốt nhất!
                  </span>
                ) : null}
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className='text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none'
                >
                  {appliedVoucher ? 'Thay đổi' : 'Chọn mã'}
                </button>
              </div>
            </div>

            {/* 3. TÍNH PHÍ VẬN CHUYỂN & THANH TOÁN */}
            <PaymentSummary
              selectedTotalPrice={selectedTotalPrice}
              shippingPrice={shippingPrice}
              discountAmount={discountAmount}
              grandTotal={grandTotal}
              submitting={submitting}
              handlePlaceOrder={handlePlaceOrder}
              formatVND={formatVND}
            />

            {/* Cam kết bảo mật */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex items-start gap-3'>
              <ShieldCheck size={20} className='text-emerald-600 flex-shrink-0' />
              <div>
                <h4 className='text-[10px] font-bold text-slate-800 uppercase'>
                  Thanh toán bảo mật 100%
                </h4>
                <p className='text-[9px] text-slate-400 mt-0.5 leading-relaxed font-semibold'>
                  Hệ thống bảo mật SSL đạt chuẩn quốc tế. Thông tin cá nhân của bạn được cam kết mã hóa tuyệt đối.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up Voucher selection modal */}
      {showVoucherModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-100 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between border-b border-slate-100 pb-3 mb-4 flex-shrink-0'>
              <h3 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                Chọn mã giảm giá (Voucher)
              </h3>
              <button
                onClick={() => setShowVoucherModal(false)}
                className='text-slate-400 hover:text-slate-600 text-lg font-bold p-1 bg-transparent border-none cursor-pointer'
              >
                ×
              </button>
            </div>

            <div className='flex-1 overflow-y-auto pr-1'>
              <VoucherList
                applicableVouchers={applicableVouchers}
                vouchers={vouchers}
                bestVoucherCode={bestVoucherCode}
                appliedVoucher={appliedVoucher}
                onApplyVoucher={(v: any) => applyVoucherByCode(v.code)}
                onManualApply={(code: string) => {
                  setVoucherCode(code);
                  setTimeout(() => handleApplyVoucher(), 50);
                }}
                loading={voucherLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Address selection modal */}
      <AddressModal
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
        profile={profile}
        setProfile={setProfile}
        setProvince={setProvince}
        setDistrict={setDistrict}
        setWard={setWard}
        setStreetAddress={setStreetAddress}
        setAlert={setAlert}
      />
    </div>
  );
}
