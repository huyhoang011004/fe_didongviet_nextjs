'use client';

import {
  Star,
  Sparkles,
  RotateCw,
  Layers,
  Loader2,
  ShoppingBag,
  ShoppingCart,
  Percent,
  Tag,
  Gift,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ProductInfoProps {
  product: any;
  selectedVariantIdx: number;
  setSelectedVariantIdx: (idx: number) => void;
  setActiveImage: (url: string) => void;
  cartQty: number;
  setCartQty: (qty: number) => void;
  isAddingToCart: boolean;
  isBuyingNow: boolean;
  handleAddToCart: () => Promise<boolean>;
  handleBuyNow: () => Promise<void>;
  setAlert: (alert: any) => void;
}

const formatVND = (num: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(num);
};

export default function ProductInfo({
  product,
  selectedVariantIdx,
  setSelectedVariantIdx,
  setActiveImage,
  cartQty,
  setCartQty,
  isAddingToCart,
  isBuyingNow,
  handleAddToCart,
  handleBuyNow,
  setAlert,
}: ProductInfoProps) {
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

  return (
    <div className='lg:col-span-6 space-y-3 relative z-10 flex flex-col justify-between'>
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

          {/* <span className='h-3 w-px bg-gray-200' />
          <span className='font-mono'>
            SKU:{' '}
            <strong className='text-slate-800'>
              {activeVariant.sku || 'N/A'}
            </strong>
          </span> */}
        </div>
      </div>

      {/* Giá cả (Không có bất kỳ banner ảnh quảng cáo nào bên dưới phần này) */}
      <div className='bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 shadow-2xs'>
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
              <Sparkles size={13} className='text-purple-600 animate-pulse' />
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

      {/* Khuyến mãi đi kèm */}
      <div className='border border-amber-200 bg-amber-50/40 rounded-xl p-3 space-y-1.5'>
        <div className='flex items-center gap-1.5 mb-2'>
          <Tag size={12} className='text-amber-500' />
          <span className='text-[10px] font-black text-amber-700 uppercase tracking-wider'>
            Khuyến mãi đi kèm
          </span>
        </div>
        {[
          {
            icon: Gift,
            text: 'Tặng kèm ốp lưng chính hãng trị giá 250.000đ',
            color: 'text-pink-600 bg-pink-50',
          },
          {
            icon: Zap,
            text: 'Giảm thêm 200.000đ khi thanh toán qua VNPAY / MoMo',
            color: 'text-blue-600 bg-blue-50',
          },
          {
            icon: Layers,
            text: 'Phụ kiện mua kèm Combo bán kèm Phụ Kiện giảm thêm 3%',
            color: 'text-emerald-600 bg-emerald-50',
          },

        ].map((promo, idx) => (
          <div
            key={idx}
            className='flex items-start gap-2 cursor-pointer group'
          >
            <span
              className={`mt-0.5 h-5 w-5 rounded flex items-center justify-center flex-shrink-0 ${promo.color}`}
            >
              <promo.icon size={11} />
            </span>
            <span className='text-[10px] font-semibold text-slate-700 leading-snug flex-1 translate-y-[5px]'>
              {promo.text}
            </span>
            <ChevronRight
              size={11}
              className='text-slate-300 group-hover:text-amber-500 flex-shrink-0 mt-0.5 transition-colors'
            />
          </div>
        ))}
      </div>

      {/* Chọn cấu hình RAM/ROM và Màu sắc riêng biệt */}
      {product.variants &&
        product.variants.length > 0 &&
        (() => {
          const ramRoms = Array.from(
            new Set(
              product.variants
                .filter((v: any) => v.ram !== undefined && v.rom !== undefined)
                .map((v: any) => `${v.ram}/${v.rom}`))
          );
          const colors = Array.from(
            new Set(product.variants.map((v: any) => v.color)),
          );
          const currentRamRom = `${activeVariant.ram}/${activeVariant.rom}`;
          const currentColor = activeVariant.color;

          const updateImageForVariant = (v: any) => {
            if (v.variantImage) {
              const imgUrl = v.variantImage.startsWith('http')
                ? v.variantImage
                : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${v.variantImage}`;
              setActiveImage(imgUrl);
            }
          };

          const handleSelectRamRom = (rr: string) => {
            let matchIdx = product.variants.findIndex(
              (v: any) =>
                `${v.ram}/${v.rom}` === rr && v.color === currentColor,
            );
            if (matchIdx === -1) {
              matchIdx = product.variants.findIndex(
                (v: any) => `${v.ram}/${v.rom}` === rr,
              );
            }
            if (matchIdx !== -1) {
              setSelectedVariantIdx(matchIdx);
              updateImageForVariant(product.variants[matchIdx]);
            }
          };

          const handleSelectColor = (col: string) => {
            let matchIdx = product.variants.findIndex(
              (v: any) =>
                v.color === col && `${v.ram}/${v.rom}` === currentRamRom,
            );
            if (matchIdx === -1) {
              matchIdx = product.variants.findIndex(
                (v: any) => v.color === col,
              );
            }
            if (matchIdx !== -1) {
              setSelectedVariantIdx(matchIdx);
              updateImageForVariant(product.variants[matchIdx]);
            }
          };

          return (
            <div className='space-y-3.5'>
              {/* Chọn Cấu hình RAM/ROM */}
              {ramRoms.length > 0 && ramRoms[0] !== 'undefined/undefined' && (
                <div className='space-y-1.5'>
                  <span className='text-[10px] font-black text-slate-800 uppercase block tracking-wider flex items-center gap-1.5'>
                    <Layers size={12} className='text-didongviet-red' />
                    <span>Chọn cấu hình / dung lượng</span>
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {ramRoms.map((rr: any, idx: number) => {
                      const isSelected = rr === currentRamRom;
                      const matchingVariants = product.variants.filter(
                        (v: any) => `${v.ram}/${v.rom}` === rr,
                      );
                      const minValPrice = Math.min(
                        ...matchingVariants.map(
                          (v: any) => v.salePrice || v.price || 0,
                        ),
                      );

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectRamRom(rr)}
                          className={`px-3 py-2 rounded-lg border text-left cursor-pointer transition-all text-xs font-bold flex flex-col justify-between min-w-[100px]
                        ${isSelected
                              ? 'border-didongviet-red bg-red-50/20 text-didongviet-red shadow-2xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }
                      `}
                        >
                          <span>{rr}</span>
                          <span className='text-[9px] font-semibold text-slate-400 font-mono mt-0.5'>
                            Từ {formatVND(minValPrice)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chọn Màu sắc */}
              <div className='space-y-1.5'>
                <span className='text-[10px] font-black text-slate-800 uppercase block tracking-wider flex items-center gap-1.5'>
                  <div className='h-3 w-3 rounded-full bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 shadow-3xs' />
                  <span>Chọn màu sắc</span>
                </span>
                <div className='flex flex-wrap gap-2'>
                  {colors.map((col: any, idx: number) => {
                    const isSelected = col === currentColor;
                    const matchingVariants = product.variants.filter(
                      (v: any) => v.color === col,
                    );
                    const minValPrice = Math.min(
                      ...matchingVariants.map(
                        (v: any) => v.salePrice || v.price || 0,
                      ),
                    );

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectColor(col)}
                        className={`px-3 py-2 rounded-lg border text-left cursor-pointer transition-all text-xs font-bold flex flex-col justify-between min-w-[100px]
                        ${isSelected
                            ? 'border-didongviet-red bg-red-50/20 text-didongviet-red shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }
                      `}
                      >
                        <span>{col}</span>
                        <span className='text-[9px] font-semibold text-slate-400 font-mono mt-0.5'>
                          {formatVND(minValPrice)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      {/* Mua hàng & Các nút chức năng */}
      <div className='pt-2 border-t border-slate-100 space-y-3'>
        {/* Điều chỉnh số lượng */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-3xs'>
            <button
              disabled={cartQty <= 1}
              onClick={() => setCartQty(cartQty - 1)}
              className='px-3 py-2 font-bold hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-50 text-slate-800 text-xs transition-colors'
            >
              -
            </button>
            <span className='px-3 py-1.5 text-xs font-black text-slate-800 text-center border-x border-slate-100 min-w-[24px]'>
              {cartQty}
            </span>
            <button
              disabled={cartQty >= currentVariantStock}
              onClick={() => setCartQty(cartQty + 1)}
              className='px-3 py-2 font-bold hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-50 text-slate-800 text-xs transition-colors'
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
              <span className='text-red-500 font-black'>Hết hàng tạm thời</span>
            )}
          </span>
        </div>

        <div className='flex flex-col gap-2.5'>
          <div className='flex gap-2.5'>
            {/* Nút Thêm vào giỏ */}
            <Button
              disabled={currentVariantStock <= 0 || isAddingToCart}
              variant='outline'
              className='flex-1 border-didongviet-red text-didongviet-red hover:bg-red-50 rounded-xl font-bold cursor-pointer text-[11px] flex items-center justify-center gap-2 transition-all hover:scale-[1.005] h-12 shadow-3xs'
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <ShoppingCart size={16} className='shrink-0' />
              )}
              <span className='font-black uppercase tracking-wide'>Thêm giỏ hàng</span>
            </Button>

            {/* Nút MUA NGAY */}
            <Button
              disabled={currentVariantStock <= 0 || isBuyingNow}
              className='flex-[1.5] bg-didongviet-red hover:bg-red-700 text-white rounded-xl font-bold border-none shadow-md cursor-pointer text-[11px] flex items-center justify-center gap-2 group transition-all hover:scale-[1.005] disabled:opacity-70 h-12'
              onClick={handleBuyNow}
            >
              {isBuyingNow ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <ShoppingBag size={16} className='group-hover:animate-bounce shrink-0' />
              )}
              <span className='font-black uppercase tracking-wide'>MUA NGAY</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
