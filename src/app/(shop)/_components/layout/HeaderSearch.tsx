'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MdClose } from 'react-icons/md'; // Đảm bảo đúng thư viện icon bạn dùng (ví dụ: react-icons/md)

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/shared/components/ui/command';

// 1. Định nghĩa chặt chẽ kiểu dữ liệu trả về từ Backend Aggregate của bạn
interface ProductSuggestion {
  _id: string;
  name: string;
  slug?: string;
  thumbnail?: string;
  price?: number;
  oldPrice?: number;
  type?: string;
}

export default function HeaderSearch() {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState<string>('');
  // Khai báo rõ ràng State là một mảng ProductSuggestion
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  // Sửa lỗi Type cho Ref
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      setOpenDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        setOpenDropdown(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(searchValue.trim())}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Không thể kết nối máy chủ');
        }

        const resData = await response.json();

        if (resData?.success) {
          // Ép kiểu hoặc fallback về mảng rỗng chuẩn format
          const data: ProductSuggestion[] = resData.data || [];
          setSuggestions(data);
          setOpenDropdown(data.length > 0);
        }
      } catch (error) {
        console.error('Lỗi fetch dữ liệu preview:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className='flex-1 min-w-0 md:justify-center relative z-50'
    >
      <div className='w-full md:max-w-2xl md:mx-auto'>
        <div className='relative'>
          <Command
            shouldFilter={false}
            className='rounded-full bg-white text-slate-900 shadow-sm border border-slate-100'
          >
            <CommandInput
              value={searchValue}
              onValueChange={(v) => setSearchValue(v)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchValue.trim() && setOpenDropdown(true)}
              placeholder='Bạn muốn mua gì?'
              className='w-full border-none bg-transparent text-xs md:text-sm text-slate-900 placeholder:text-slate-400 pr-10 md:pr-12'
            />
          </Command>

          {searchValue && (
            <button
              type='button'
              onClick={() => {
                setSearchValue('');
                setSuggestions([]); // Reset mảng an toàn
                setOpenDropdown(false);
              }}
              className='absolute right-2 md:right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 p-1 text-slate-600 transition hover:bg-slate-300 hover:text-slate-900 z-10'
            >
              <MdClose size={14} />
            </button>
          )}

          {openDropdown && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-[380px] overflow-y-auto'>
              <CommandList>
                {loading && (
                  <div className='p-4 text-center text-xs text-slate-500 animate-pulse'>
                    Đang tìm kiếm sản phẩm phù hợp...
                  </div>
                )}

                {!loading && suggestions.length === 0 && (
                  <CommandEmpty className='p-4 text-center text-xs text-slate-400'>
                    Không tìm thấy sản phẩm nào phù hợp.
                  </CommandEmpty>
                )}

                {!loading && suggestions.length > 0 && (
                  <div className='p-2'>
                    <div className='px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                      Gợi ý sản phẩm tìm được
                    </div>

                    {suggestions.map((product) => (
                      <CommandItem
                        key={product._id}
                        value={product._id}
                        onSelect={() => {
                          setOpenDropdown(false);
                          router.push(
                            `/products/${product.slug || product._id}`,
                          );
                        }}
                        className='flex items-center gap-3 p-2 rounded-lg cursor-pointer transition hover:bg-slate-50'
                      >
                        <div className='w-10 h-10 rounded-md border border-slate-100 overflow-hidden flex-shrink-0 bg-slate-50 relative'>
                          <img
                            src={
                              product.thumbnail || '/placeholder-product.png'
                            }
                            alt={product.name}
                            className='w-full h-full object-cover'
                          />
                        </div>

                        <div className='flex-1 min-w-0'>
                          <h4 className='text-xs md:text-sm font-medium text-slate-800 truncate'>
                            {product.name}
                          </h4>
                          <div className='flex items-center gap-2 mt-0.5'>
                            <span className='text-xs font-semibold text-red-600'>
                              {product.price
                                ? `${product.price.toLocaleString('vi-VN')}đ`
                                : 'Liên hệ'}
                            </span>
                            {product.oldPrice &&
                              product.oldPrice > (product.price || 0) && (
                                <span className='text-[10px] text-slate-400 line-through'>
                                  {product.oldPrice.toLocaleString('vi-VN')}đ
                                </span>
                              )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                )}
              </CommandList>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
