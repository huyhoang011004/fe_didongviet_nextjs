'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCw,
  Heart,
  Share2,
  MapPin,
  BadgeCheck,
  Layers,
  Store,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Info,
  PlayCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [activeImage, setActiveImage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [cartQty, setCartQty] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

        const [productRes, branchesRes] = await Promise.all([
          fetch(`${apiUrl}/products/${id}`).then((r) =>
            r.ok ? r.json() : null,
          ),
          fetch(`${apiUrl}/branches`).then((r) => (r.ok ? r.json() : null)),
        ]);

        if (productRes && productRes.success) {
          const prod = productRes.data;
          setProduct(prod);

          const mainThumb =
            prod.images?.find((img: any) => img.isThumbnail)?.url ||
            prod.imageUrl ||
            '';
          setActiveImage(mainThumb);

          const relatedRes = await fetch(
            `${apiUrl}/products/${prod._id}/related`,
          ).then((r) => (r.ok ? r.json() : null));
          if (relatedRes && relatedRes.success) {
            setRelatedProducts(relatedRes.data || []);
          }
        }

        if (branchesRes && branchesRes.success) {
          setBranches(branchesRes.branches || branchesRes.data || []);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !product.variants || product.variants.length === 0) return;

    const activeVariant = product.variants[selectedVariantIdx];
    if (!activeVariant) return;

    setIsAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          variantId: activeVariant._id,
          quantity: cartQty,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        setAlert({
          type: 'error',
          message: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
        });
        setTimeout(() => router.push('/login'), 1500);
        return;
      }

      if (data.success) {
        setAlert({
          type: 'success',
          message: `Đã thêm ${cartQty} sản phẩm vào giỏ hàng!`,
        });
      } else {
        setAlert({
          type: 'error',
          message: data.message || 'Không thể thêm vào giỏ hàng',
        });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Lỗi kết nối khi thêm vào giỏ hàng' });
    } finally {
      setIsAddingToCart(false);
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
          Đang tải thông tin sản phẩm...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center'>
        <div className='h-12 w-12 rounded-full bg-red-50 text-didongviet-red flex items-center justify-center mb-3 border border-red-200'>
          <Info size={22} />
        </div>
        <h2 className='text-sm font-black text-slate-800 uppercase'>
          Không tìm thấy sản phẩm
        </h2>
        <p className='text-[10px] text-gray-500 max-w-sm mt-1 mb-4 leading-relaxed'>
          Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.
        </p>
        <Button
          onClick={() => router.push('/')}
          className='bg-didongviet-red hover:bg-didongviet-dark-red text-white py-2.5 px-5 text-xs font-semibold rounded-xl border-none shadow-sm'
        >
          Quay lại Trang chủ
        </Button>
      </div>
    );
  }

  const activeVariant = product.variants?.[selectedVariantIdx] || {};
  const originalPrice = activeVariant.price || product.priceRange?.min || 0;
  const salePrice = activeVariant.salePrice || originalPrice;
  const percentOff = Math.round(
    ((originalPrice - salePrice) / originalPrice) * 100,
  );
  const currentVariantStock =
    activeVariant.inventory?.reduce(
      (sum: number, inv: any) => sum + (inv.stock || 0),
      0,
    ) || 0;

  const allImages = [...(product.images || [])];
  if (
    activeVariant.variantImage &&
    !allImages.some((img: any) => img.url === activeVariant.variantImage)
  ) {
    allImages.push({
      url: activeVariant.variantImage,
      alt: activeVariant.color,
    });
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700'>
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

      {/* BREADCRUMBS */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-6xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold overflow-x-auto whitespace-nowrap'>
          <Link
            href='/'
            className='hover:text-didongviet-red transition-colors'
          >
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <Link
            href={`/category/${product.category?.slug || 'products'}`}
            className='hover:text-didongviet-red transition-colors'
          >
            {product.category?.name || 'Sản phẩm'}
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold truncate max-w-[200px]'>
            {product.name}
          </span>
        </div>
      </nav>

      <div className='max-w-6xl mx-auto px-4 py-5 space-y-6'>
        {/* MAIN PRODUCT INFO */}
        <section className='bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 relative overflow-hidden'>
          <div className='absolute top-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none' />

          {/* MEDIA GALLERY - 5 cột */}
          <div className='lg:col-span-5 space-y-3 relative z-10'>
            {/* Ảnh chính */}
            <div className='aspect-square w-full rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-4 relative group overflow-hidden'>
              {percentOff > 0 && (
                <span className='absolute top-3 left-3 z-10 px-2 py-0.5 bg-didongviet-red text-white text-[9px] font-black rounded-md shadow uppercase animate-pulse'>
                  -{percentOff}%
                </span>
              )}

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full border border-slate-100 bg-white flex items-center justify-center shadow-sm cursor-pointer transition-all hover:scale-110 ${isLiked ? 'text-didongviet-red' : 'text-gray-400'}`}
              >
                <Heart
                  size={14}
                  className={isLiked ? 'fill-didongviet-red' : ''}
                />
              </button>

              <img
                src={activeImage || '/placeholder-product.png'}
                alt={product.name}
                className='h-full w-full object-contain transition-transform duration-500 group-hover:scale-105'
              />
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className='flex gap-2 overflow-x-auto py-0.5'>
                {allImages.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.url)}
                    className={`h-14 w-14 rounded-lg border-2 flex items-center justify-center p-0.5 bg-white flex-shrink-0 cursor-pointer transition-all hover:border-didongviet-red/50 ${activeImage === img.url ? 'border-didongviet-red shadow-sm' : 'border-slate-100'}`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className='h-full w-full object-contain'
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Cam kết dịch vụ */}
            <div className='bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2.5 text-[10px]'>
              <span className='font-black text-slate-800 uppercase block tracking-wider text-[9px]'>
                Cam kết Di Động Việt
              </span>
              <div className='grid grid-cols-2 gap-2 text-gray-500 font-medium'>
                {[
                  {
                    icon: ShieldCheck,
                    color: 'text-emerald-600',
                    label: 'Bảo hành 12-24T',
                  },
                  {
                    icon: RotateCw,
                    color: 'text-blue-500',
                    label: '1 đổi 1 trong 30 ngày',
                  },
                  {
                    icon: Truck,
                    color: 'text-purple-600',
                    label: 'Giao hỏa tốc 2h',
                  },
                  {
                    icon: BadgeCheck,
                    color: 'text-amber-500',
                    label: 'Trả góp 0% lãi',
                  },
                ].map((item, idx) => (
                  <div key={idx} className='flex items-center gap-1.5'>
                    <item.icon
                      size={13}
                      className={`${item.color} flex-shrink-0`}
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS - 7 cột */}
          <div className='lg:col-span-7 space-y-4 relative z-10 flex flex-col justify-between'>
            {/* Tiêu đề & Brand */}
            <div className='space-y-2'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[9px] font-black text-didongviet-red uppercase tracking-wider'>
                  {product.brand || 'CHÍNH HÃNG'}
                </span>
                {product.isUsed && (
                  <span className='px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[9px] font-black text-amber-600 uppercase tracking-wider'>
                    MÁY CŨ (LIKE NEW)
                  </span>
                )}
              </div>

              <h1 className='text-lg sm:text-xl md:text-2xl font-black text-slate-800 leading-snug tracking-tight'>
                {product.name}
              </h1>

              {/* Rating & SKU */}
              <div className='flex flex-wrap items-center gap-3 text-[10px] font-semibold text-gray-500'>
                <div className='flex items-center gap-0.5 text-amber-500'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < Math.round(product.ratingsAverage || 5)
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-gray-200'
                      }
                    />
                  ))}
                  <span className='ml-1 font-bold text-slate-800'>
                    {product.ratingsAverage || 5.0}
                  </span>
                  <span className='text-gray-400'>
                    ({product.ratingsCount || 0} đánh giá)
                  </span>
                </div>

                <span className='h-3 w-px bg-gray-200' />
                <span className='font-mono'>
                  SKU:{' '}
                  <strong className='text-slate-800'>
                    {activeVariant.sku || 'N/A'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Giá cả */}
            <div className='bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3'>
              <div className='flex items-baseline flex-wrap gap-2'>
                <span className='text-xl sm:text-2xl font-black text-didongviet-red'>
                  {formatVND(salePrice)}
                </span>
                {percentOff > 0 && (
                  <span className='text-xs font-bold text-gray-400 line-through'>
                    {formatVND(originalPrice)}
                  </span>
                )}
              </div>

              {product.discountDMember > 0 && (
                <div className='p-2.5 bg-purple-50/50 border border-purple-100 rounded-lg flex items-center justify-between text-[10px] font-bold text-purple-700'>
                  <div className='flex items-center gap-1.5'>
                    <Sparkles
                      size={13}
                      className='text-purple-600 animate-pulse'
                    />
                    <span>Đặc quyền D.Member</span>
                  </div>
                  <span className='bg-purple-600 text-white font-black px-1.5 py-0.5 rounded text-[9px] uppercase'>
                    Giảm thêm {product.discountDMember}%
                  </span>
                </div>
              )}

              {product.tradeInBonus > 0 && (
                <div className='p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center justify-between text-[10px] font-bold text-blue-700'>
                  <div className='flex items-center gap-1.5'>
                    <RotateCw size={13} className='text-blue-500' />
                    <span>Thu cũ đổi mới - Trợ giá khủng</span>
                  </div>
                  <span className='bg-blue-600 text-white font-black px-1.5 py-0.5 rounded text-[9px] uppercase'>
                    +{formatVND(product.tradeInBonus)}
                  </span>
                </div>
              )}
            </div>

            {/* Chọn phiên bản */}
            {product.variants && product.variants.length > 0 && (
              <div className='space-y-2.5'>
                <span className='text-[10px] font-black text-slate-800 uppercase block tracking-wider flex items-center gap-1.5'>
                  <Layers size={12} className='text-didongviet-red' />
                  <span>Chọn phiên bản ({product.variants.length})</span>
                </span>

                <div className='grid grid-cols-2 gap-2'>
                  {product.variants.map((v: any, idx: number) => {
                    const vPrice = v.salePrice || v.price || 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedVariantIdx(idx);
                          if (v.variantImage) setActiveImage(v.variantImage);
                        }}
                        className={`p-2.5 rounded-lg border text-left flex flex-col justify-between space-y-0.5 cursor-pointer transition-all hover:border-didongviet-red/50 hover:shadow-xs
                          ${
                            idx === selectedVariantIdx
                              ? 'border-didongviet-red bg-red-50/20 shadow-xs'
                              : 'border-slate-200 bg-white'
                          }
                        `}
                      >
                        <div className='flex items-center justify-between text-[11px] font-bold'>
                          <span
                            className={`${idx === selectedVariantIdx ? 'text-didongviet-red' : 'text-slate-800'}`}
                          >
                            {v.color} - {v.ram}/{v.rom}
                          </span>
                          {idx === selectedVariantIdx && (
                            <span className='h-1.5 w-1.5 rounded-full bg-didongviet-red' />
                          )}
                        </div>
                        <span className='text-[10px] font-extrabold text-slate-500 font-mono'>
                          {formatVND(vPrice)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mua hàng */}
            <div className='pt-3 border-t border-slate-100 space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white'>
                  <button
                    disabled={cartQty <= 1}
                    onClick={() => setCartQty(cartQty - 1)}
                    className='px-3 py-2 font-bold hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-50 text-slate-800 text-xs'
                  >
                    -
                  </button>
                  <span className='px-3 py-1.5 text-xs font-black text-slate-800 text-center'>
                    {cartQty}
                  </span>
                  <button
                    disabled={cartQty >= currentVariantStock}
                    onClick={() => setCartQty(cartQty + 1)}
                    className='px-3 py-2 font-bold hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-50 text-slate-800 text-xs'
                  >
                    +
                  </button>
                </div>

                <span className='text-[10px] font-semibold text-gray-500'>
                  {currentVariantStock > 0 ? (
                    <span>
                      Tồn kho:{' '}
                      <strong className='text-emerald-600 font-black'>
                        {currentVariantStock} máy
                      </strong>
                    </span>
                  ) : (
                    <span className='text-red-500 font-black'>
                      Hết hàng tạm thời
                    </span>
                  )}
                </span>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <Button
                  disabled={currentVariantStock <= 0 || isAddingToCart}
                  className='bg-didongviet-red hover:bg-didongviet-dark-red text-white py-5 rounded-xl font-bold border-none shadow-md cursor-pointer text-[11px] flex items-center justify-center gap-1.5 group transition-transform hover:scale-[1.01] disabled:opacity-70'
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <Loader2 size={15} className='animate-spin' />
                  ) : (
                    <ShoppingBag
                      size={15}
                      className='group-hover:animate-bounce'
                    />
                  )}
                  <div className='text-left leading-tight'>
                    <span className='block font-black'>MUA NGAY GIAO 2H</span>
                    <span className='block text-[8px] font-normal text-white/80'>
                      Hoặc nhận tại cửa hàng
                    </span>
                  </div>
                </Button>

                <Button
                  variant='outline'
                  disabled={currentVariantStock <= 0}
                  className='border-slate-200 text-slate-800 hover:bg-slate-50 py-5 rounded-xl font-bold cursor-pointer text-[11px] flex flex-col justify-center items-center leading-tight transition-transform hover:scale-[1.01]'
                  onClick={() =>
                    setAlert({
                      type: 'success',
                      message: 'Chuyển hướng trả góp 0%...',
                    })
                  }
                >
                  <span className='font-black'>TRẢ GÓP 0%</span>
                  <span className='text-[8px] font-normal text-slate-500 mt-0.5'>
                    Duyệt online 5 phút
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* TỒN KHO CHI NHÁNH */}
        {activeVariant.inventory && activeVariant.inventory.length > 0 && (
          <section className='bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3'>
            <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5'>
              <Store size={14} className='text-blue-500' />
              <span>Hệ thống siêu thị còn hàng</span>
            </h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5'>
              {activeVariant.inventory.map((inv: any) => {
                const branchObj = branches.find(
                  (b) => b._id === (inv.branch?._id || inv.branch),
                );
                if (!branchObj) return null;

                return (
                  <div
                    key={inv.branch}
                    className='p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between gap-2 text-[10px]'
                  >
                    <div className='space-y-0.5 truncate'>
                      <span
                        className='font-bold text-slate-800 block truncate'
                        title={branchObj.name}
                      >
                        {branchObj.name}
                      </span>
                      <span
                        className='text-[9px] text-gray-400 block truncate'
                        title={branchObj.address}
                      >
                        {branchObj.address}
                      </span>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-bold uppercase text-[8px] border flex-shrink-0
                      ${
                        inv.stock > 0
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-red-50 text-red-500 border-red-200'
                      }
                    `}
                    >
                      {inv.stock > 0 ? `Còn ${inv.stock} máy` : 'Hết hàng'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MÔ TẢ & THÔNG SỐ KỸ THUẬT */}
        <section className='grid grid-cols-1 lg:grid-cols-12 gap-5 items-start'>
          {/* Mô tả - 7 cột */}
          <div className='lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4'>
            <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
              <div className='h-1 w-3.5 bg-didongviet-red rounded-full' />
              <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                Bài viết đánh giá chi tiết
              </h3>
            </div>

            <div
              className={`relative overflow-hidden text-xs text-gray-600 leading-relaxed font-medium transition-all duration-300
              ${isDescExpanded ? 'max-h-none' : 'max-h-[250px]'}
            `}
            >
              <div className='space-y-3 whitespace-pre-line'>
                {product.description ||
                  `Sản phẩm ${product.name} chính hãng hiện đang được bán tại hệ thống Di Động Việt với mức giá vô cùng cạnh tranh. 
                Sở hữu cấu hình đỉnh cao, camera độ phân giải sắc nét, pin dung lượng lớn cùng thiết kế sang trọng, đây sẽ là người bạn đồng hành hoàn hảo cho công việc và giải trí hàng ngày.`}
              </div>

              {!isDescExpanded && (
                <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none' />
              )}
            </div>

            <div className='text-center pt-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className='border-red-200 text-didongviet-red hover:bg-red-50 rounded-lg cursor-pointer text-[10px] font-bold py-2 px-4 h-8'
              >
                {isDescExpanded ? 'Thu gọn' : 'Xem thêm chi tiết'}
              </Button>
            </div>
          </div>

          {/* Thông số - 5 cột */}
          <div className='lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3'>
            <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
              <div className='h-1 w-3.5 bg-blue-500 rounded-full' />
              <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                Thông số kỹ thuật
              </h3>
            </div>

            <div className='overflow-hidden rounded-lg border border-slate-100 text-[11px]'>
              <table className='w-full border-collapse'>
                <tbody>
                  {[
                    {
                      label: 'Thương hiệu',
                      value: product.brand || 'Di Động Việt',
                    },
                    {
                      label: 'Ngành hàng',
                      value: product.category?.name || 'Sản phẩm',
                    },
                    {
                      label: 'Màu sắc',
                      value: product.variants
                        ? Array.from(
                            new Set(product.variants.map((v: any) => v.color)),
                          ).join(', ')
                        : 'N/A',
                    },
                    {
                      label: 'RAM',
                      value: product.variants
                        ? Array.from(
                            new Set(product.variants.map((v: any) => v.ram)),
                          ).join(', ')
                        : 'N/A',
                    },
                    {
                      label: 'ROM',
                      value: product.variants
                        ? Array.from(
                            new Set(product.variants.map((v: any) => v.rom)),
                          ).join(', ')
                        : 'N/A',
                    },
                    {
                      label: 'Độ mới',
                      value: product.isUsed
                        ? 'Likenew 99%'
                        : 'Nguyên seal 100%',
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 0 ? 'bg-slate-50/50' : ''} hover:bg-slate-50 transition-colors`}
                    >
                      <td className='py-2.5 px-3 font-bold text-gray-500 w-1/3 border-b border-slate-100'>
                        {row.label}
                      </td>
                      <td className='py-2.5 px-3 font-semibold text-slate-800 border-b border-slate-100'>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {product.video && (
              <div className='pt-1'>
                <Link
                  href={product.video}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center justify-center gap-1.5 p-2.5 bg-red-50 hover:bg-red-100 text-didongviet-red border border-red-200 rounded-lg text-[10px] font-bold transition-all shadow-xs'
                >
                  <PlayCircle size={13} />
                  <span>Xem video trải nghiệm</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* SẢN PHẨM LIÊN QUAN */}
        {relatedProducts.length > 0 && (
          <section className='space-y-4'>
            <div className='flex items-center gap-2 border-b border-slate-200 pb-3'>
              <div className='h-1 w-3.5 bg-emerald-500 rounded-full' />
              <h3 className='text-sm font-black text-slate-800 uppercase tracking-tight'>
                Sản phẩm tương tự
              </h3>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
              {relatedProducts.slice(0, 5).map((p) => {
                const minPrice = p.priceRange?.min || 0;
                const activeVariant = p.variants?.[0] || {};
                const originalPrice = activeVariant?.price || minPrice;
                const salePrice = activeVariant?.salePrice || originalPrice;
                const percentOff = Math.round(
                  ((originalPrice - salePrice) / originalPrice) * 100,
                );

                return (
                  <div
                    key={p._id}
                    className='bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between space-y-3 hover:shadow-md hover:border-slate-200 transition-all group relative overflow-hidden'
                  >
                    {percentOff > 0 && (
                      <span className='absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-didongviet-red text-white text-[9px] font-black rounded-md shadow uppercase'>
                        -{percentOff}%
                      </span>
                    )}

                    <div className='space-y-2'>
                      <div className='h-28 w-full rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform'>
                        <img
                          src={p.imageUrl || '/placeholder-product.png'}
                          alt={p.name}
                          className='h-full w-full object-contain'
                        />
                      </div>

                      <div className='space-y-0.5'>
                        <span className='text-[9px] text-slate-400 font-bold block uppercase'>
                          {p.brand || 'DI ĐỘNG VIỆT'}
                        </span>
                        <Link
                          href={`/product/${p.slug || p._id}`}
                          className='font-bold text-slate-800 text-[11px] sm:text-xs hover:text-didongviet-red block truncate leading-snug'
                        >
                          {p.name}
                        </Link>

                        <div className='flex items-center gap-1 text-[9px] text-amber-500 font-semibold'>
                          <Star
                            size={9}
                            className='fill-amber-500 text-amber-500'
                          />
                          <span>{p.ratingsAverage || 5}</span>
                          <span className='text-slate-400'>
                            ({p.ratingsCount || 0})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='space-y-1 pt-1 border-t border-slate-100'>
                      <span className='text-xs sm:text-sm font-black text-didongviet-red'>
                        {formatVND(salePrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
