'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';
import { VIETNAM_PROVINCES, getBranchRegion } from './_components/checkout-utils';
import { calcVoucherValue } from '../cart/cart-actions';
import { loadCheckoutData, loadProductDetails, applyVoucherCode, placeOrder } from './checkout-actions';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export function useCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNow = searchParams.get('buyNow') === 'true';
  const productId = searchParams.get('productId') || '';
  const variantId = searchParams.get('variantId') || '';
  const qty = parseInt(searchParams.get('qty') || '1', 10);

  // Zustand Cart Store
  const allCartItems = useCartStore((state) => state.items);
  const selected = useCartStore((state) => state.selected);
  const removeItem = useCartStore((state) => state.removeItem);

  // Buy now item
  const [buyNowItem, setBuyNowItem] = useState<any | null>(null);

  // Lọc lấy các sản phẩm đã chọn thanh toán hoặc dùng sản phẩm mua ngay trực tiếp
  const cartItems = buyNow
    ? (buyNowItem ? [buyNowItem] : [])
    : allCartItems.filter((item) =>
      selected.includes(`${item.product}|${item.variant}`)
    );

  const selectedTotalPrice = cartItems.reduce(
    (total, item) => total + (item.salePrice || item.price) * item.quantity,
    0
  );

  // Profile & Loading
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
  const [paymentMethod, setPaymentMethod] = useState('COD');

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

  // Order submission
  const [submitting, setSubmitting] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
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

  // Load profile, chi nhánh và thông tin mua ngay trực tiếp
  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadCheckoutData(buyNow, productId, variantId, qty);

        if (data.profile) {
          setProfile(data.profile);
          setFullName(data.profile.name || '');
          setPhone(data.profile.phone || '');

          const defaultAddress =
            data.profile.address?.find((a: any) => a.isDefault) || data.profile.address?.[0];
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

        if (data.branches && data.branches.length > 0) {
          setBranches(data.branches);
          setSelectedBranchId(data.branches[0]._id);
        }

        if (data.vouchers) {
          setVouchers(data.vouchers);
        }

        if (data.buyNowItem) {
          setBuyNowItem(data.buyNowItem);
        }

        if (data.productDetails) {
          setProductDetails((prev) => ({ ...prev, ...data.productDetails }));
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
  }, [router, mounted, buyNow, productId, variantId, qty]);

  // Tự động chuyển hướng về /cart nếu giỏ hàng thường trống
  useEffect(() => {
    if (mounted && !loading && !buyNow && cartItems.length === 0 && !isOrderCompleted) {
      router.push('/cart');
    }
  }, [mounted, loading, buyNow, cartItems.length, isOrderCompleted, router]);

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

    async function loadDetails() {
      try {
        const uniqueIds = Array.from(new Set(cartItems.map((item) => item.product)));
        const detailsMap = await loadProductDetails(uniqueIds);
        setProductDetails((prev) => ({ ...prev, ...detailsMap }));
      } catch (err) {
        console.error('Failed to load product details for branch stock check:', err);
      }
    }

    loadDetails();
  }, [serializedProductIds]);

  // Danh sách các voucher đủ điều kiện áp dụng
  const applicableVouchers = (vouchers || [])
    .map((v) => ({ ...v, _value: calcVoucherValue(v, selectedTotalPrice) }))
    .filter((v) => v._value !== null && v._value > 0)
    .sort((a, b) => b._value - a._value);

  // Tìm chi nhánh hiện tại đang chọn
  const selectedBranch = branches.find((b) => b._id === selectedBranchId);

  // Tính phí vận chuyển tự động
  const getShippingPrice = useCallback(() => {
    if (selectedTotalPrice > 2000000) return 0;
    if (!province || !selectedBranch) return 30000;

    const recipient = VIETNAM_PROVINCES.find((p) => p.name === province);
    const branchInfo = getBranchRegion(selectedBranch.address);

    if (!recipient) return 30000;

    if (recipient.name === branchInfo.province) {
      return 30000;
    }
    if (recipient.region === branchInfo.region) {
      return 40000;
    }
    return 60000;
  }, [selectedTotalPrice, province, selectedBranch]);

  const shippingPrice = getShippingPrice();
  const grandTotal = Math.max(0, selectedTotalPrice + shippingPrice - discountAmount);

  // Hàm áp dụng voucher thủ công
  const handleApplyVoucher = useCallback(async () => {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    try {
      const result = await applyVoucherCode(voucherCode.toUpperCase(), selectedTotalPrice);
      
      if (result.success) {
        setAppliedVoucher(result.voucher);
        setDiscountAmount(result.discountAmount);
        setAlert({ type: 'success', message: result.message });
        setVoucherCode('');
        setShowVoucherModal(false);
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi khi kiểm tra mã giảm giá' });
    } finally {
      setVoucherLoading(false);
    }
  }, [voucherCode, selectedTotalPrice]);

  const applyVoucherByCode = useCallback(async (code: string) => {
    setVoucherLoading(true);
    try {
      const result = await applyVoucherCode(code, selectedTotalPrice);
      
      if (result.success) {
        setAppliedVoucher(result.voucher);
        setDiscountAmount(result.discountAmount);
        setAlert({ type: 'success', message: result.message });
        setShowVoucherModal(false);
      } else {
        setAlert({ type: 'error', message: result.message });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi khi áp dụng mã' });
    } finally {
      setVoucherLoading(false);
    }
  }, [selectedTotalPrice]);

  // Đặt hàng ngay
  const handlePlaceOrder = useCallback(async () => {
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

      const data = await placeOrder(payload);
      
      if (data.success) {
        setIsOrderCompleted(true);

        if (!buyNow) {
          for (const item of cartItems) {
            await removeItem(item.product, item.variant);
          }
        }

        const orderId = data.data?._id || data.order?._id || data._id || '';
        router.replace(`/checkout/success?orderId=${orderId}&paymentMethod=${paymentMethod}&total=${grandTotal}`);
      } else {
        setAlert({ type: 'error', message: data.message || 'Lỗi đặt hàng' });
        setSubmitting(false);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Lỗi kết nối khi đặt hàng' });
      setSubmitting(false);
    }
  }, [fullName, phone, province, district, ward, streetAddress, selectedBranchId, paymentMethod, discountAmount, shippingPrice, cartItems, buyNow, grandTotal, removeItem, router]);

  return {
    // State
    profile,
    loading,
    mounted,
    fullName,
    setFullName,
    phone,
    setPhone,
    province,
    setProvince,
    district,
    setDistrict,
    ward,
    setWard,
    streetAddress,
    setStreetAddress,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    paymentMethod,
    setPaymentMethod,
    vouchers,
    appliedVoucher,
    setAppliedVoucher,
    discountAmount,
    setDiscountAmount,
    bestVoucherCode,
    showVoucherModal,
    setShowVoucherModal,
    voucherCode,
    setVoucherCode,
    voucherLoading,
    showAddressModal,
    setShowAddressModal,
    productDetails,
    submitting,
    isOrderCompleted,
    alert,
    setAlert,
    setProfile,
    cartItems,
    selectedTotalPrice,
    applicableVouchers,
    selectedBranch,
    shippingPrice,
    grandTotal,
    buyNow,
    // Functions
    formatVND,
    handleApplyVoucher,
    applyVoucherByCode,
    handlePlaceOrder,
  };
}
