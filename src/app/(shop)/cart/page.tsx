'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  ChevronRight,
  Ticket,
  ShieldCheck,
  Truck,
  RotateCw,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useCartStore } from '@/app/(shop)/cart/useCartStore';
import CartItem from './_components/CartItem';
import VoucherList from './_components/VoucherList';
import CartSEOAndFAQ from './_components/CartSEOAndFAQ';
import {
  fetchVouchers,
  findVoucherByCode,
  calcVoucherValue,
  applyVoucherServer,
} from './cart-actions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Local SEO & FAQ states
  const [showFullSeo, setShowFullSeo] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Zustand Store
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const selected = useCartStore((state) => state.selected);
  const toggleSelectItem = useCartStore((state) => state.toggleSelectItem);
  const setSelectedItems = useCartStore((state) => state.setSelectedItems);
  const fetchCart = useCartStore((state) => state.fetchCart);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [bestVoucherCode, setBestVoucherCode] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchCart();
  }, [fetchCart]);

  // Load vouchers từ backend
  useEffect(() => {
    const load = async () => {
      const list = await fetchVouchers();
      setVouchers(list);
    };
    load();
  }, []);

  // Các sản phẩm được chọn
  const selectedItems = cartItems.filter((item) =>
    selected.includes(`${item.product}|${item.variant}`),
  );

  // Tính tổng tiền tạm tính cho các sản phẩm đã chọn
  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0,
  );

  // Tính chất tự động áp dụng và tính lại giá trị Voucher dựa trên các sản phẩm ĐÃ CHỌN
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
          // Mã cũ không còn đạt điều kiện áp dụng -> tự động đổi sang mã tốt nhất mới
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
  }, [vouchers, cartItems, selected]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleUpdateQty = async (
    productId: string,
    variantId: string,
    qty: number,
  ) => {
    if (qty < 1) return;
    const success = await updateQuantity(productId, variantId, qty);
    if (!success) {
      setAlert({
        type: 'error',
        message: 'Không thể cập nhật số lượng (Vượt quá tồn kho)',
      });
    }
  };

  const handleRemoveItem = async (productId: string, variantId: string) => {
    const success = await removeItem(productId, variantId);
    if (success) {
      setAlert({ type: 'success', message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } else {
      setAlert({ type: 'error', message: 'Lỗi khi xóa sản phẩm' });
    }
  };

  // Chọn/bỏ chọn tất cả sản phẩm
  const allKeys = cartItems.map((item) => `${item.product}|${item.variant}`);
  const isAllSelected =
    cartItems.length > 0 && selected.length === cartItems.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allKeys);
    }
  };

  // Xóa các sản phẩm đã chọn
  const handleRemoveSelected = async () => {
    if (selected.length === 0) {
      setAlert({
        type: 'error',
        message: 'Vui lòng chọn ít nhất 1 sản phẩm để xóa',
      });
      return;
    }
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa ${selected.length} sản phẩm đã chọn?`,
    );
    if (!confirmDelete) return;

    setVoucherLoading(true);
    try {
      let successCount = 0;
      for (const key of selected) {
        const [prodId, varId] = key.split('|');
        const success = await removeItem(prodId, varId);
        if (success) successCount++;
      }
      if (successCount > 0) {
        setSelectedItems([]);
        setAlert({
          type: 'success',
          message: `Đã xóa thành công ${successCount} sản phẩm`,
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Lỗi khi xóa các sản phẩm đã chọn' });
    } finally {
      setVoucherLoading(false);
    }
  };

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
        // Fallback offline cho khách vãng lai
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

  const handleChangeVariant = async (
    productId: string,
    oldVariantId: string,
    newVariantId: string,
    quantity: number,
  ) => {
    if (oldVariantId === newVariantId) return;

    setVoucherLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/products/${productId}`,
      ).then((r) => r.json());
      if (res && res.success && res.data) {
        const product = res.data;
        const newVariant = product.variants.find(
          (v: any) => v._id === newVariantId,
        );
        if (newVariant) {
          const thumbnail =
            newVariant.variantImage ||
            product.images?.find((img: any) => img.isThumbnail)?.url ||
            product.imageUrl ||
            '/placeholder-product.png';

          const itemDetails = {
            imageUrl: thumbnail.startsWith('http')
              ? thumbnail
              : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${thumbnail}`,
            price: newVariant.price,
            salePrice: newVariant.salePrice || newVariant.price,
            selectedColor: newVariant.color,
            selectedStorage:
              newVariant.ram && newVariant.rom
                ? `${newVariant.ram}/${newVariant.rom}`
                : newVariant.storage || '',
          };

          const success = await useCartStore.getState().changeVariant(
            productId,
            oldVariantId,
            newVariantId,
            quantity,
            itemDetails,
          );

          if (success) {
            // Đồng bộ trạng thái tích chọn key selection
            const oldKey = `${productId}|${oldVariantId}`;
            const newKey = `${productId}|${newVariantId}`;
            if (selected.includes(oldKey)) {
              setSelectedItems([
                ...selected.filter((k) => k !== oldKey),
                newKey,
              ]);
            }

            setAlert({
              type: 'success',
              message: 'Đã đổi phân loại thành công!',
            });
          } else {
            setAlert({
              type: 'error',
              message: 'Không thể đổi phân loại mới (Vượt quá tồn kho)',
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to change variant:', err);
      setAlert({ type: 'error', message: 'Lỗi hệ thống khi đổi phân loại' });
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!selected || selected.length === 0) {
      setAlert({
        type: 'error',
        message: 'Vui lòng chọn ít nhất 1 sản phẩm để thanh toán',
      });
      return;
    }
    router.push('/checkout');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  if (!mounted) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
            DĐV
          </div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>
          Đang tải giỏ hàng...
        </p>
      </div>
    );
  }

  const isEmpty = cartItems.length === 0;
  const finalPrice = Math.max(0, selectedTotalPrice - discountAmount);

  // Helper để VoucherList hiển thị giá trị quy đổi của mã
  const calcV = (v: any) => {
    return calcVoucherValue(v, selectedTotalPrice);
  };

  const applicableVouchers = (vouchers || [])
    .map((v) => ({ ...v, _value: calcVoucherValue(v, selectedTotalPrice) }))
    .filter((v) => v._value !== null && v._value > 0)
    .sort((a, b) => b._value - a._value);

  // Nội dung SEO bài viết mẫu
  const seoContent = {
    seoTitle: 'Quy trình thanh toán & Mua sắm an toàn tại Di Động Việt',
    toc: [
      '1. Giới thiệu chính sách giỏ hàng',
      '2. Quyền lợi khách hàng và D.Member',
      '3. Phương thức thanh toán linh hoạt',
      '4. Cam kết bảo hành, đổi trả vượt trội',
    ],
    content: `
      <h3>1. Giới thiệu chính sách giỏ hàng</h3>
      <p>Giỏ hàng tại Di Động Việt giúp quý khách dễ dàng quản lý, thêm bớt sản phẩm điện thoại, máy tính bảng, phụ kiện chính hãng chỉ bằng một click chuột. Các sản phẩm trong giỏ hàng sẽ được hệ thống giữ giá ưu đãi tốt nhất tại thời điểm kiểm tra đơn hàng.</p>
      <h3>2. Quyền lợi khách hàng và D.Member</h3>
      <p>Khi tiến hành thanh toán, khách hàng thành viên D.Member sẽ được tự động tích lũy và giảm thêm đến 1.5% giá trị hóa đơn. Quý khách vui lòng đăng nhập trước khi mua hàng để nhận được trọn vẹn đặc quyền thành viên.</p>
      <h3>3. Phương thức thanh toán linh hoạt</h3>
      <p>Di Động Việt hỗ trợ thanh toán linh hoạt qua các cổng thanh toán online (VNPAY, MoMo, ZaloPay), thẻ tín dụng hoặc chuyển khoản ngân hàng. Đặc biệt là chương trình hỗ trợ Trả góp 0% lãi suất nhanh chóng thông qua các đối tác tài chính lớn.</p>
      <h3>4. Cam kết bảo hành, đổi trả vượt trội</h3>
      <p>Toàn bộ sản phẩm bán ra đều được bảo hành chính hãng 100%. Quý khách hưởng quyền lợi dùng thử, 1 đổi 1 trong vòng 30 ngày nếu có lỗi kỹ thuật từ nhà sản xuất. Giao hàng siêu tốc 2 giờ nội thành tiện lợi.</p>
    `,
  };

  const faqs = [
    {
      q: 'Tôi có thể mua trả góp các sản phẩm trong giỏ hàng không?',
      a: 'Có, Di Động Việt hỗ trợ mua trả góp 0% lãi suất qua thẻ tín dụng của hơn 25 ngân hàng hoặc thông qua các công ty tài chính đối tác với hồ sơ cực kỳ đơn giản và duyệt nhanh chỉ trong 5 phút.',
    },
    {
      q: 'Thời gian giao hàng sau khi đặt hàng thành công là bao lâu?',
      a: 'Đối với khu vực nội thành TP.HCM, Hà Nội, Đà Nẵng, chúng tôi hỗ trợ giao hàng siêu tốc chỉ trong 2 giờ. Đối với các tỉnh thành khác, thời gian vận chuyển dao động từ 1 - 3 ngày làm việc.',
    },
    {
      q: 'Tôi có được kiểm tra sản phẩm trước khi thanh toán không?',
      a: 'Có, quý khách được quyền mở hộp đồng kiểm ngoại quan sản phẩm cùng nhân viên giao hàng để đảm bảo sản phẩm đúng mẫu mã, màu sắc và cấu hình đã đặt trước khi tiến hành thanh toán hoặc ký nhận.',
    },
    {
      q: 'Làm thế nào để áp dụng mã giảm giá voucher?',
      a: "Bạn chỉ cần nhấn vào 'Mã giảm giá', chọn voucher khả dụng hoặc nhập mã thủ công và áp dụng. Số tiền giảm sẽ được tính toán trực tiếp và trừ thẳng vào tổng tiền thanh toán đã chọn của bạn.",
    },
  ];

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-16'>
      {/* Alert toast */}
      {alert && (
        <div
          className={`fixed bottom-4 right-4 z-50 p-3 rounded-xl shadow-lg border flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}`}
        >
          {alert.type === 'success' ? (
            <CheckCircle size={16} className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle size={16} className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-[11px] font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* ─── PHẦN 1: BREADCRUMB ─── */}
      <nav className='bg-white border-b border-slate-100 py-2.5 shadow-xs'>
        <div className='max-w-[1400px] mx-auto px-[30px] flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link
            href='/'
            className='hover:text-didongviet-red transition-colors'
          >
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Giỏ hàng của bạn</span>
        </div>
      </nav>

      {/* CỐT BỐ CỤC CHÍNH */}
      <div className='max-w-[1400px] mx-auto px-[30px] py-6 space-y-6'>
        {/* Header Title */}
        <div className='flex items-center gap-2.5'>
          <div className='h-8 w-8 rounded-lg bg-didongviet-red text-white flex items-center justify-center shadow-sm'>
            <ShoppingBag size={16} />
          </div>
          <div>
            <h1 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight'>
              Giỏ hàng của bạn
            </h1>
            <p className='text-[10px] text-slate-400 font-medium'>
              {isEmpty
                ? 'Chưa có sản phẩm nào'
                : `${cartItems.length} sản phẩm trong giỏ hàng`}
            </p>
          </div>
        </div>

        {isEmpty ? (
          /* Empty cart */
          <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-12 text-center'>
            <div className='h-20 w-20 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center mx-auto mb-4'>
              <ShoppingBag size={36} />
            </div>
            <h2 className='text-sm font-black text-slate-800 uppercase mb-1'>
              Giỏ hàng trống
            </h2>
            <p className='text-[10px] text-slate-400 max-w-xs mx-auto mb-5 leading-relaxed'>
              Hiện tại bạn chưa chọn bất kỳ sản phẩm nào. Hãy quay lại cửa hàng
              để thêm những sản phẩm yêu thích vào giỏ hàng nhé!
            </p>
            <Button
              asChild
              className='bg-didongviet-red hover:bg-red-700 text-white py-2.5 px-6 text-xs font-bold rounded-xl border-none shadow-sm cursor-pointer'
            >
              <Link href='/dien-thoai' className='flex items-center gap-1.5'>
                <span>Khám phá sản phẩm</span>
                <ArrowRight size={12} />
              </Link>
            </Button>
          </div>
        ) : (
          /* Giao diện chính kiểu bảng Shopee */
          <div className='space-y-4'>
            <div className='w-full bg-white rounded-2xl border border-slate-100 shadow-xs overflow-visible'>
              {/* Header Cột (Chỉ trên màn hình lớn) */}
              <div className='hidden lg:grid lg:grid-cols-[50px_1fr_180px_120px_130px_120px_80px] gap-4 items-center bg-slate-50/70 px-6 py-3.5 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-wider'>
                <div className='flex justify-center'>
                  <input
                    type='checkbox'
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className='rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red w-4 h-4 cursor-pointer'
                  />
                </div>
                <div>Sản Phẩm</div>
                <div>Phân Loại</div>
                <div className='text-center'>Đơn Giá</div>
                <div className='text-center'>Số Lượng</div>
                <div className='text-center'>Số Tiền</div>
                <div className='text-center'>Thao Tác</div>
              </div>

              {/* Danh sách các sản phẩm */}
              <div className='divide-y divide-slate-100 bg-white'>
                {cartItems.map((item) => (
                  <CartItem
                    key={`${item.product}|${item.variant}`}
                    item={item}
                    selected={selected.includes(
                      `${item.product}|${item.variant}`,
                    )}
                    onToggleSelect={toggleSelectItem}
                    onUpdateQty={handleUpdateQty}
                    onRemove={handleRemoveItem}
                    onChangeVariant={handleChangeVariant}
                  />
                ))}
              </div>
            </div>

            {/* Hàng Mã Giảm Giá (Shopee Voucher style) */}
            <div className='bg-white rounded-2xl border border-slate-100 shadow-2xs p-4 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Ticket size={16} className='text-didongviet-red' />
                <span className='text-xs font-bold text-slate-800'>
                  Mã giảm giá (Voucher)
                </span>
              </div>
              <div className='flex items-center gap-3'>
                {appliedVoucher ? (
                  <span className='bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1'>
                    <span>Đã áp dụng: {appliedVoucher.code}</span>
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
                    Có mã tốt nhất cho bạn!
                  </span>
                ) : null}
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className='text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none'
                >
                  {appliedVoucher ? 'Thay đổi mã' : 'Chọn hoặc nhập mã'}
                </button>
              </div>
            </div>

            {/* Thanh thanh toán bottom bar (Shopee style, sticky bottom) */}
            <div className='sticky bottom-0 z-30 bg-white border border-slate-100 shadow-lg rounded-2xl py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start'>
                <label className='flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none'>
                  <input
                    type='checkbox'
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className='rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red w-4.5 h-4.5 cursor-pointer'
                  />
                  <span>Chọn Tất Cả ({cartItems.length})</span>
                </label>
                <button
                  onClick={handleRemoveSelected}
                  className='text-xs font-semibold text-slate-500 hover:text-didongviet-red transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none'
                >
                  <Trash2 size={13} />
                  <span>Xóa đã chọn</span>
                </button>
              </div>

              <div className='flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto'>
                <div className='text-right'>
                  <div className='text-xs text-slate-500 font-medium flex items-center gap-1.5 justify-end'>
                    <span>Tổng thanh toán ({selected.length} sản phẩm):</span>
                    <span className='text-lg font-black text-didongviet-red font-mono'>
                      {formatVND(finalPrice)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className='text-[10px] text-green-600 font-bold'>
                      Đã tiết kiệm: {formatVND(discountAmount)}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCheckout}
                  className='bg-didongviet-red hover:bg-red-700 text-white font-black px-8 py-5 text-xs rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.01] h-11 flex items-center justify-center'
                >
                  Mua Hàng
                </Button>
              </div>
            </div>

            <div className='pt-2 flex justify-start'>
              <Button
                asChild
                variant='ghost'
                className='text-[10px] text-didongviet-red font-bold hover:bg-red-50 rounded-lg h-8 px-3 cursor-pointer'
              >
                <Link href='/dien-thoai' className='flex items-center gap-1'>
                  <ArrowRight size={10} className='rotate-180' />
                  <span>Tiếp tục mua sắm</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        <CartSEOAndFAQ seoContent={seoContent} faqs={faqs} />

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
    </div>
  </div>
  );
}
