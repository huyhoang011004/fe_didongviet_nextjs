'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, RotateCw, Star, Info, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { fetchShopTradeIn, fetchShopProducts } from '../../shop-actions';

// Chuẩn hóa định dạng hiển thị tiền tệ VNĐ
const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

const STORE_LIST = [
  '79 Đồng Khởi, P. Bến Nghé, Quận 1, TP.HCM',
  '300 Lê Hồng Phong, P.1, Quận 10, TP.HCM',
  '324 Huỳnh Tấn Phát, P. Tân Thuận Tây, Quận 7, TP.HCM',
  '385 Quang Trung, P.10, Q. Gò Vấp, TP.HCM',
  '116 Thái Hà, P. Trung Liệt, Q. Đống Đa, Hà Nội',
  '24B Nguyễn Trãi, P. Thanh Xuân Trung, Q. Thanh Xuân, Hà Nội',
  '16 Nguyễn Văn Linh, P. Nam Dương, Q. Hải Châu, Đà Nẵng',
];

export default function TradeInPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc và sắp xếp
  const [priceSort, setPriceSort] = useState<string>('newest'); // newest, price_asc, price_desc
  const [priceRange, setPriceRange] = useState<string>('all'); // all, under_10m, 10m_20m, over_20m

  // Form đăng ký định giá
  const [gender, setGender] = useState<string>('Anh');
  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [deviceModel, setDeviceModel] = useState<string>('');
  const [deviceCondition, setDeviceCondition] = useState<string>('');
  const [targetDevice, setTargetDevice] = useState<string>('');
  const [storeAddress, setStoreAddress] = useState<string>('');
  const [agreePolicy, setAgreePolicy] = useState<boolean>(true);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadTradeInProducts() {
      try {
        setLoading(true);
        const res = await fetchShopTradeIn();
        if (res && res.success && res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          // Fallback trade-in nếu trống hoặc lỗi
          const productsRes = await fetchShopProducts();
          const fallbackProducts = (
            productsRes?.products ||
            productsRes?.data ||
            []
          ).filter((p: any) => p.tradeInBonus > 0);
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Failed to load trade-in products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTradeInProducts();
  }, []);

  // Áp dụng bộ lọc và sắp xếp khi products, priceSort, hoặc priceRange thay đổi
  useEffect(() => {
    let result = [...products];

    // Lọc theo khoảng giá (priceRange)
    if (priceRange !== 'all') {
      result = result.filter((p) => {
        const minPrice = p.priceRange?.min || 0;
        const activeVariant = p.variants?.[0] || {};
        const salePrice = activeVariant?.salePrice || activeVariant?.price || minPrice;

        if (priceRange === 'under_10m') {
          return salePrice < 10000000;
        } else if (priceRange === '10m_20m') {
          return salePrice >= 10000000 && salePrice <= 20000000;
        } else if (priceRange === 'over_20m') {
          return salePrice > 20000000;
        }
        return true;
      });
    }

    // Sắp xếp theo giá (priceSort)
    if (priceSort === 'price_asc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.salePrice || a.variants?.[0]?.price || a.priceRange?.min || 0;
        const priceB = b.variants?.[0]?.salePrice || b.variants?.[0]?.price || b.priceRange?.min || 0;
        return priceA - priceB;
      });
    } else if (priceSort === 'price_desc') {
      result.sort((a, b) => {
        const priceA = a.variants?.[0]?.salePrice || a.variants?.[0]?.price || a.priceRange?.min || 0;
        const priceB = b.variants?.[0]?.salePrice || b.variants?.[0]?.price || b.priceRange?.min || 0;
        return priceB - priceA;
      });
    }

    setFilteredProducts(result);
  }, [products, priceSort, priceRange]);

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!fullName.trim()) tempErrors.fullName = 'Vui lòng nhập họ tên (*)';
    if (!phoneNumber.trim()) {
      tempErrors.phoneNumber = 'Vui lòng nhập số điện thoại (*)';
    } else if (!/^[0-9]{10,11}$/.test(phoneNumber.trim())) {
      tempErrors.phoneNumber = 'Số điện thoại không hợp lệ (yêu cầu 10-11 chữ số)';
    }
    if (!deviceModel.trim()) tempErrors.deviceModel = 'Vui lòng nhập mẫu máy bạn cần thu (*)';
    if (!deviceCondition.trim()) {
      tempErrors.deviceCondition = 'Mô tả ngắn về ngoại hình và tình trạng thiết bị (*)';
    }
    if (!storeAddress) tempErrors.storeAddress = 'Vui lòng chọn cửa hàng định giá gần nhất (*)';
    if (!agreePolicy) tempErrors.agreePolicy = 'Bạn cần đồng ý cho DDV thu thập thông tin';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Giả lập gửi form thành công
      setFormSubmitted(true);
      // Reset form
      setFullName('');
      setPhoneNumber('');
      setDeviceModel('');
      setDeviceCondition('');
      setTargetDevice('');
      setStoreAddress('');
      setErrors({});
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-16'>
      {/* ─── BREADCRUMB ─── */}
      <nav className='bg-white border-b border-slate-100 py-2.5 shadow-xs'>
        <div className='max-w-[1400px] mx-auto px-[30px] flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Thu cũ đổi mới</span>
        </div>
      </nav>

      {/* ─── BANNER TRÀN VIỀN / CONTAINER CHUYÊN BIỆT ─── */}
      <div className='max-w-[1400px] mx-auto px-[30px] pt-6'>
        <div className='w-full rounded-2xl overflow-hidden shadow-sm aspect-[3/1] sm:aspect-[4.5/1] bg-slate-200 relative'>
          <img
            src='https://didongviet.vn/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fthu-cu-doi-moi-2025-min.f5209a5a.png&w=1920&q=75'
            alt='Thu cũ đổi mới Di Động Việt'
            className='w-full h-full object-cover'
            referrerPolicy='no-referrer'
          />
        </div>
      </div>

      <div className='max-w-[1400px] mx-auto px-[30px] py-8 space-y-8'>
        {/* ─── TIÊU ĐỀ LỚN VÀ THÔNG TIN CHUNG ─── */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs'>
          <div className='space-y-1'>
            <h1 className='text-sm sm:text-base md:text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2'>
              <span className='w-2 h-5 bg-didongviet-red rounded-full inline-block'></span>
              THU CŨ ĐỔI MỚI - TRỢ GIÁ KHỦNG ĐẾN 5 TRIỆU
            </h1>
            <p className='text-[10px] text-slate-400 font-semibold'>
              Di Động Việt độc quyền chính sách Thu cũ đổi mới trợ giá cao nhất thị trường. Thủ tục đơn giản, nhanh chóng chỉ trong 10 phút!
            </p>
          </div>
          <div className='flex items-center gap-2 text-[10px] bg-blue-50 border border-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-xl'>
            <Info size={12} className='shrink-0' />
            <span>Chấp nhận thu cả máy xách tay, máy trầy xước không hộp</span>
          </div>
        </div>

        {/* ─── BỘ LỌC KHOẢNG GIÁ VÀ SẮP XẾP GIÁ (GIỚI HẠN CHỈ BỘ LỌC GIÁ) ─── */}
        <div className='bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs'>
          {/* Lọc khoảng giá */}
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='text-[10px] font-black uppercase text-slate-400 mr-2 tracking-wider'>
              Khoảng giá:
            </span>
            {[
              { label: 'Tất cả', value: 'all' },
              { label: 'Dưới 10 triệu', value: 'under_10m' },
              { label: 'Từ 10 - 20 triệu', value: '10m_20m' },
              { label: 'Trên 20 triệu', value: 'over_20m' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPriceRange(item.value)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold cursor-pointer border transition-all ${
                  priceRange === item.value
                    ? 'bg-didongviet-red border-didongviet-red text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Sắp xếp giá */}
          <div className='flex items-center gap-2.5 shrink-0 self-end md:self-auto'>
            <span className='text-[10px] font-black uppercase text-slate-400 tracking-wider'>
              Sắp xếp:
            </span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className='bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-[10px] font-bold py-2 px-3 text-slate-700 cursor-pointer focus:outline-hidden transition-colors'
            >
              <option value='newest'>Mới nhất</option>
              <option value='price_asc'>Giá thấp đến cao</option>
              <option value='price_desc'>Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* ─── LƯỚI SẢN PHẨM TRADE-IN ─── */}
        {loading ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className='bg-white h-[260px] rounded-2xl border border-slate-100 shadow-xs' />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-white shadow-xs'>
            <ShoppingBag size={42} className='mx-auto text-gray-300 mb-2' />
            <p className='text-xs font-semibold'>
              Không có sản phẩm nào phù hợp với bộ lọc giá hiện tại.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {filteredProducts.map((p) => {
              const minPrice = p.priceRange?.min || 0;
              const activeVariant = p.variants?.[0] || {};
              const originalPrice = activeVariant?.price || minPrice;
              const salePrice = activeVariant?.salePrice || originalPrice;
              const percentOff = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

              return (
                <Link
                  key={p._id}
                  href={`/${p.category?.slug || 'dien-thoai'}/${p.slug}`}
                  className='bg-white border border-slate-100 rounded-2xl p-3.5 flex flex-col justify-between space-y-3 hover:shadow-md hover:border-blue-400 transition-all group relative overflow-hidden'
                >
                  {p.tradeInBonus > 0 && (
                    <span className='absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-blue-600 text-white text-[8px] sm:text-[9px] font-black rounded shadow-sm uppercase tracking-wide'>
                      +{formatVND(p.tradeInBonus)} Trợ Giá
                    </span>
                  )}

                  <div className='space-y-3'>
                    <div className='h-32 w-full rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform relative'>
                      <img
                        src={p.imageUrl || '/placeholder-product.png'}
                        alt={p.name}
                        className='h-full w-full object-contain'
                        referrerPolicy='no-referrer'
                      />
                    </div>

                    <div className='space-y-1 pt-1'>
                      <span className='text-[9px] text-slate-400 font-bold block uppercase tracking-wide'>
                        {p.brand || 'DI ĐỘNG VIỆT'}
                      </span>
                      <span className='font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-blue-600 block line-clamp-2 h-8 leading-snug transition-colors'>
                        {p.name}
                      </span>

                      <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                        <Star size={9} className='fill-amber-500 text-amber-500' />
                        <span>{p.ratingsAverage || 5}</span>
                        <span className='text-slate-400'>({p.ratingsCount || 0})</span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-1.5 pt-2 border-t border-slate-100'>
                    <div className='flex flex-col'>
                      <span className='text-xs sm:text-sm font-black text-blue-600 leading-tight'>
                        {formatVND(salePrice)}
                      </span>
                      {percentOff > 0 && (
                        <span className='text-[9px] font-bold text-slate-400 line-through leading-tight'>
                          {formatVND(originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className='bg-blue-50/60 border border-blue-100 rounded-lg p-1.5 space-y-0.5'>
                      <span className='text-[8px] text-slate-400 font-bold block uppercase tracking-wider leading-none'>
                        Giá sau trợ giá thu đổi:
                      </span>
                      <strong className='text-didongviet-red text-xs font-black block leading-none pt-0.5'>
                        {formatVND(salePrice - (p.tradeInBonus || 0))}
                      </strong>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ─── FORM TƯ VẤN ĐỊNH GIÁ MÁY ─── */}
        <div className='max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden mt-12'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-didongviet-red/5 rounded-full blur-2xl pointer-events-none' />

          <div className='text-center space-y-2 mb-6 relative z-10'>
            <h2 className='text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight'>
              Bạn không tìm thấy sản phẩm cần định giá?
            </h2>
            <p className='text-[11px] font-bold text-slate-400'>
              Để lại thông tin để Di Động Việt tư vấn thêm bạn nhé
            </p>
            <div className='h-0.5 w-16 bg-didongviet-red mx-auto rounded-full mt-2' />
          </div>

          {formSubmitted ? (
            <div className='bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3 relative z-10 animate-fade-in'>
              <div className='h-12 w-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md'>
                <Check size={24} />
              </div>
              <h3 className='font-bold text-green-800 text-xs sm:text-sm'>
                Gửi yêu cầu định giá thành công!
              </h3>
              <p className='text-[10px] text-green-600 font-semibold max-w-sm mx-auto leading-relaxed'>
                Cảm ơn bạn đã quan tâm. Đội ngũ kỹ thuật viên của Di Động Việt sẽ liên hệ tư vấn và thẩm định máy cũ cho bạn trong vòng 15 phút.
              </p>
              <Button
                onClick={() => setFormSubmitted(false)}
                className='bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-bold py-2 px-5 cursor-pointer mt-2 shadow-xs'
              >
                Gửi yêu cầu khác
              </Button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className='space-y-4 relative z-10'>
              {/* Danh xưng */}
              <div className='flex items-center gap-6 pb-1'>
                <span className='text-[10px] font-black uppercase text-slate-400 tracking-wider'>
                  Danh xưng:
                </span>
                <div className='flex items-center gap-4'>
                  {['Anh', 'Chị'].map((g) => (
                    <label
                      key={g}
                      onClick={() => setGender(g)}
                      className='flex items-center gap-2 cursor-pointer group text-[11px] font-bold text-slate-700'
                    >
                      <div
                        className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                          gender === g
                            ? 'border-didongviet-red bg-didongviet-red/10 text-didongviet-red'
                            : 'border-slate-300 group-hover:border-slate-400 bg-white'
                        }`}
                      >
                        {gender === g && <div className='h-2 w-2 rounded-full bg-didongviet-red' />}
                      </div>
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Họ tên & Số điện thoại */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block'>
                    Họ tên (*)
                  </label>
                  <input
                    type='text'
                    placeholder='Vui lòng nhập họ tên (*)'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-didongviet-red transition-all ${
                      errors.fullName ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200'
                    }`}
                  />
                  {errors.fullName && (
                    <p className='text-[9px] font-bold text-red-500 animate-pulse'>{errors.fullName}</p>
                  )}
                </div>

                <div className='space-y-1'>
                  <label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block'>
                    Số điện thoại (*)
                  </label>
                  <input
                    type='tel'
                    placeholder='Vui lòng nhập số điện thoại (*)'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-didongviet-red transition-all ${
                      errors.phoneNumber ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200'
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className='text-[9px] font-bold text-red-500 animate-pulse'>{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* Mẫu máy cần thu & Sản phẩm muốn lên đời */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block'>
                    Mẫu máy bạn cần thu (*)
                  </label>
                  <input
                    type='text'
                    placeholder='Vui lòng nhập mẫu máy bạn cần thu (*)'
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-didongviet-red transition-all ${
                      errors.deviceModel ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200'
                    }`}
                  />
                  {errors.deviceModel && (
                    <p className='text-[9px] font-bold text-red-500 animate-pulse'>{errors.deviceModel}</p>
                  )}
                </div>

                <div className='space-y-1'>
                  <label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block'>
                    Sản phẩm bạn cần tư vấn lên đời (Nếu có)
                  </label>
                  <input
                    type='text'
                    placeholder='Ví dụ: iPhone 16 Pro Max 256GB'
                    value={targetDevice}
                    onChange={(e) => setTargetDevice(e.target.value)}
                    className='w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-didongviet-red transition-all'
                  />
                </div>
              </div>

              {/* Mô tả ngoại hình và tình trạng */}
              <div className='space-y-1'>
                <label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block'>
                  Mô tả ngắn về ngoại hình và tình trạng thiết bị (*)
                </label>
                <textarea
                  rows={3}
                  placeholder='Mô tả ngắn về ngoại hình và tình trạng thiết bị (*). Ví dụ: Máy màu vàng cát, trầy nhẹ viền, màn hình đẹp không ám ố, pin 85%, các chức năng FaceID bình thường...'
                  value={deviceCondition}
                  onChange={(e) => setDeviceCondition(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 text-[11px] font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-didongviet-red transition-all resize-none ${
                    errors.deviceCondition ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200'
                  }`}
                />
                {errors.deviceCondition && (
                  <p className='text-[9px] font-bold text-red-500 animate-pulse'>{errors.deviceCondition}</p>
                )}
              </div>

              {/* Chọn cửa hàng định giá */}
              <div className='space-y-1'>
                <label className='text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block'>
                  Chọn cửa hàng định giá gần nhất (*)
                </label>
                <div className='relative'>
                  <select
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 pr-10 text-[11px] font-semibold text-slate-800 cursor-pointer appearance-none focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-didongviet-red transition-all ${
                      errors.storeAddress ? 'border-red-500 ring-1 ring-red-100' : 'border-slate-200'
                    }`}
                  >
                    <option value=''>Chọn cửa hàng</option>
                    {STORE_LIST.map((store, idx) => (
                      <option key={idx} value={store}>
                        {store}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-[10px] font-bold'>
                    ▼
                  </div>
                </div>
                {errors.storeAddress && (
                  <p className='text-[9px] font-bold text-red-500 animate-pulse'>{errors.storeAddress}</p>
                )}
              </div>

              {/* Checkbox điều khoản */}
              <div className='space-y-1 pt-1'>
                <label className='flex items-start gap-2.5 cursor-pointer group'>
                  <input
                    type='checkbox'
                    checked={agreePolicy}
                    onChange={(e) => setAgreePolicy(e.target.checked)}
                    className='sr-only'
                  />
                  <div
                    className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all ${
                      agreePolicy
                        ? 'border-didongviet-red bg-didongviet-red text-white'
                        : 'border-slate-300 group-hover:border-slate-400 bg-white'
                    }`}
                  >
                    {agreePolicy && <Check size={11} className='stroke-[3px]' />}
                  </div>
                  <span className='text-[10.5px] font-semibold text-slate-500 select-none'>
                    Đồng ý cho DDV thu thập thông tin
                  </span>
                </label>
                {errors.agreePolicy && (
                  <p className='text-[9px] font-bold text-red-500 animate-pulse'>{errors.agreePolicy}</p>
                )}
              </div>

              {/* Nút gửi */}
              <div className='pt-2'>
                <Button
                  type='submit'
                  className='w-full bg-didongviet-red hover:bg-red-700 text-white rounded-xl py-3 px-6 text-xs font-black shadow-md cursor-pointer transition-colors uppercase tracking-wider h-11'
                >
                  Gửi thông tin định giá
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
