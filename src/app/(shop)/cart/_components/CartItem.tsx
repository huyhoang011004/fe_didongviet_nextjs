'use client';
import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ChevronDown } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function CartItem({
  item,
  onUpdateQty,
  onRemove,
  selected,
  onToggleSelect,
  onChangeVariant,
}: any) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const unitPrice = item.salePrice || item.price;
  const totalPrice = unitPrice * item.quantity;

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  // Tải danh sách phân loại (variants) khi mở dropdown
  useEffect(() => {
    if (showDropdown && variants.length === 0) {
      async function loadVariants() {
        try {
          setLoadingVariants(true);
          const res = await fetch(`${API_URL}/products/${item.product}`).then((r) => r.json());
          if (res && res.success && res.data && res.data.variants) {
            setVariants(res.data.variants);
          }
        } catch (err) {
          console.error('Failed to load variants in cart item:', err);
        } finally {
          setLoadingVariants(false);
        }
      }
      loadVariants();
    }
  }, [showDropdown, item.product, variants.length]);

  return (
    <>
      {/* DESKTOP ROW: hiển thị trên màn hình lớn (lg) */}
      <div className={`hidden lg:grid lg:grid-cols-[50px_1fr_180px_120px_130px_120px_80px] gap-4 items-center bg-white px-6 py-4 border-b border-slate-100 hover:bg-slate-50/30 transition-colors relative ${showDropdown ? 'z-50' : 'z-10'}`}>
        {/* 1. Checkbox */}
        <div className='flex justify-center'>
          <input
            type='checkbox'
            checked={selected}
            onChange={() => onToggleSelect(item.product, item.variant)}
            className='rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red w-4 h-4 cursor-pointer'
          />
        </div>

        {/* 2. Thông tin sản phẩm */}
        <div className='flex items-center gap-3 min-w-0'>
          <div className='h-20 w-20 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center p-1.5 shrink-0'>
            <img
              src={item.imageUrl}
              alt={item.name}
              className='h-full w-full object-contain'
              referrerPolicy='no-referrer'
            />
          </div>
          <div className='min-w-0 space-y-1'>
            <div className='font-bold text-slate-800 text-xs line-clamp-2 leading-snug hover:text-didongviet-red transition-colors'>
              {item.name}
            </div>
            <div className='flex gap-1 items-center'>
              <span className='bg-red-50 text-didongviet-red text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 origin-left'>
                Chính hãng
              </span>
            </div>
          </div>
        </div>

        {/* 3. Phân Loại Hàng */}
        <div className='text-xs text-slate-500 font-medium relative'>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className='flex items-center justify-between text-left p-2 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer w-full group'
          >
            <div className='space-y-0.5 min-w-[110px] max-w-[130px] min-h-[28px] flex flex-col justify-center'>
              <span className='block text-slate-400 text-[8px] uppercase font-bold tracking-wider'>
                Phân loại:
              </span>
              <span className='font-bold text-slate-700 text-[10px] block truncate group-hover:text-didongviet-red transition-colors'>
                {item.selectedColor || 'Mặc định'}
                {item.selectedStorage ? ` - ${item.selectedStorage}` : ''}
              </span>
            </div>
            <ChevronDown size={11} className={`text-slate-400 shrink-0 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className='absolute left-0 mt-1.5 w-64 bg-white border border-slate-100 shadow-xl rounded-xl p-3 z-50 space-y-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150'>
              <div className='text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1.5'>
                Chọn phân loại khác:
              </div>
              {loadingVariants ? (
                <div className='text-center py-4 text-[10px] text-slate-400 flex items-center justify-center gap-1.5'>
                  <div className='w-3 h-3 rounded-full border border-didongviet-red border-t-transparent animate-spin' />
                  Đang tải...
                </div>
              ) : variants.length === 0 ? (
                <div className='text-center py-4 text-[10px] text-slate-400'>
                  Không có phân loại khác
                </div>
              ) : (
                <div className='space-y-1.5'>
                  {variants.map((v: any) => {
                    const isCurrent = v._id === item.variant;
                    return (
                      <button
                        key={v._id}
                        disabled={isCurrent}
                        onClick={() => {
                          onChangeVariant(item.product, item.variant, v._id, item.quantity);
                          setShowDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all text-[10px]
                          ${isCurrent 
                            ? 'border-didongviet-red bg-red-50/10 text-didongviet-red font-bold' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer'
                          }
                        `}
                      >
                        {v.variantImage && (
                          <img 
                            src={v.variantImage.startsWith('http') ? v.variantImage : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}${v.variantImage}`} 
                            alt={v.color} 
                            className='w-7 h-7 object-contain rounded bg-slate-50 border border-slate-100 shrink-0'
                          />
                        )}
                        <div className='flex-1 min-w-0'>
                          <div className='font-semibold truncate'>
                            {v.color}{v.ram && v.rom ? ` - ${v.ram}/${v.rom}` : v.storage ? ` - ${v.storage}` : ''}
                          </div>
                          <div className='font-mono font-bold text-slate-500 scale-90 origin-left mt-0.5'>
                            {formatVND(v.salePrice || v.price)}
                          </div>
                        </div>
                        {isCurrent && (
                          <span className='text-[8px] bg-didongviet-red text-white px-1.5 py-0.5 rounded font-black uppercase scale-90 shrink-0'>
                            Đang chọn
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Đơn Giá */}
        <div className='text-center text-xs font-bold text-slate-700 font-mono'>
          {formatVND(unitPrice)}
        </div>

        {/* 5. Số Lượng */}
        <div className='flex justify-center'>
          <div className='flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs'>
            <button
              disabled={item.quantity <= 1}
              onClick={() =>
                onUpdateQty(item.product, item.variant, item.quantity - 1)
              }
              className='px-2 py-1.5 hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-40 text-slate-800'
            >
              <Minus size={10} />
            </button>
            <span className='px-2.5 py-1 text-[10px] font-black text-slate-800 text-center min-w-[24px] border-x border-slate-200'>
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQty(item.product, item.variant, item.quantity + 1)
              }
              className='px-2 py-1.5 hover:bg-slate-50 border-none bg-transparent cursor-pointer text-slate-800'
            >
              <Plus size={10} />
            </button>
          </div>
        </div>

        {/* 6. Số Tiền */}
        <div className='text-center text-xs font-black text-didongviet-red font-mono'>
          {formatVND(totalPrice)}
        </div>

        {/* 7. Thao Tác (Icon xóa) */}
        <div className='flex justify-center'>
          <button
            onClick={() => onRemove(item.product, item.variant)}
            className='h-7 w-7 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-didongviet-red hover:border-red-200 hover:bg-red-50 cursor-pointer transition-all shadow-2xs'
            title='Xóa sản phẩm'
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* MOBILE CARD: hiển thị trên màn hình nhỏ dưới lg */}
      <div className={`lg:hidden bg-white rounded-xl border border-slate-100 shadow-xs p-4 flex gap-3 items-start transition-all relative ${showDropdown ? 'z-50' : 'z-10'}`}>
        <div className='flex items-start gap-1 mt-1.5'>
          <input
            type='checkbox'
            checked={selected}
            onChange={() => onToggleSelect(item.product, item.variant)}
            className='rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red w-4 h-4 cursor-pointer'
          />
        </div>

        <div className='h-16 w-16 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center p-1 shrink-0'>
          <img
            src={item.imageUrl}
            alt={item.name}
            className='h-full w-full object-contain'
            referrerPolicy='no-referrer'
          />
        </div>

        <div className='flex-1 min-w-0 space-y-1.5 relative'>
          <div className='font-bold text-slate-800 text-xs line-clamp-2 leading-snug'>
            {item.name}
          </div>

          <div className='relative inline-block'>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors px-1.5 py-0.5 rounded uppercase tracking-wider cursor-pointer'
            >
              <span>
                Phân loại: {item.selectedColor || 'Mặc định'}
                {item.selectedStorage ? ` - ${item.selectedStorage}` : ''}
              </span>
              <ChevronDown size={10} className='text-slate-400 shrink-0' />
            </button>

            {showDropdown && (
              <div className='absolute left-0 mt-1 w-56 bg-white border border-slate-100 shadow-xl rounded-xl p-2 z-50 space-y-1.5 max-h-48 overflow-y-auto'>
                <div className='text-[8px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1'>
                  Chọn phân loại:
                </div>
                {loadingVariants ? (
                  <div className='text-center py-2 text-[9px] text-slate-400 flex items-center justify-center gap-1'>
                    <div className='w-2.5 h-2.5 rounded-full border border-didongviet-red border-t-transparent animate-spin' />
                    Đang tải...
                  </div>
                ) : variants.length === 0 ? (
                  <div className='text-center py-2 text-[9px] text-slate-400'>
                    Không có phân loại khác
                  </div>
                ) : (
                  <div className='space-y-1'>
                    {variants.map((v: any) => {
                      const isCurrent = v._id === item.variant;
                      return (
                        <button
                          key={v._id}
                          disabled={isCurrent}
                          onClick={() => {
                            onChangeVariant(item.product, item.variant, v._id, item.quantity);
                            setShowDropdown(false);
                          }}
                          className={`w-full flex items-center gap-1.5 p-1 rounded border text-left transition-all text-[9px]
                            ${isCurrent 
                              ? 'border-didongviet-red bg-red-50/10 text-didongviet-red font-bold' 
                              : 'border-slate-50 hover:border-slate-100 text-slate-600 bg-white hover:bg-slate-50'
                            }
                          `}
                        >
                          <div className='flex-1 min-w-0'>
                            <div className='font-semibold truncate'>
                              {v.color}{v.ram && v.rom ? ` - ${v.ram}/${v.rom}` : v.storage ? ` - ${v.storage}` : ''}
                            </div>
                            <div className='font-mono font-bold text-slate-400 scale-90 origin-left mt-0.5'>
                              {formatVND(v.salePrice || v.price)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='flex items-center justify-between pt-1'>
            <span className='text-xs font-bold text-didongviet-red font-mono'>
              {formatVND(unitPrice)}
            </span>

            <div className='flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs scale-90 origin-right'>
              <button
                disabled={item.quantity <= 1}
                onClick={() =>
                  onUpdateQty(item.product, item.variant, item.quantity - 1)
                }
                className='px-2 py-1 hover:bg-slate-50 border-none bg-transparent cursor-pointer disabled:opacity-40 text-slate-800'
              >
                <Minus size={10} />
              </button>
              <span className='px-2 py-0.5 text-[10px] font-bold text-slate-800 text-center min-w-[20px] border-x border-slate-200'>
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  onUpdateQty(item.product, item.variant, item.quantity + 1)
                }
                className='px-2 py-1 hover:bg-slate-50 border-none bg-transparent cursor-pointer text-slate-800'
              >
                <Plus size={10} />
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between pt-1 border-t border-slate-50 text-[10px] text-slate-400'>
            <div>
              Tổng:{' '}
              <strong className='text-slate-600 font-mono'>
                {formatVND(totalPrice)}
              </strong>
            </div>
            <button
              onClick={() => onRemove(item.product, item.variant)}
              className='text-slate-400 hover:text-didongviet-red transition-colors cursor-pointer bg-transparent border-none'
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
