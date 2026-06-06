'use client';
 
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MdClose } from 'react-icons/md';
import { SearchIcon } from 'lucide-react';
 
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/shared/components/ui/command';
 
// Định nghĩa kiểu dữ liệu gợi ý sản phẩm
interface ProductSuggestion {
  _id: string;
  name: string;
  slug?: string;
  thumbnail?: string;
  price?: number;
  oldPrice?: number;
  type?: string;
  category?: { name: string; slug: string };
}
 
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
 
export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
 
  const [searchValue, setSearchValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
 
  const containerRef = useRef<HTMLDivElement>(null);
 
  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      setOpenDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };
 
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    if (pathname === '/search') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      setSearchValue(q);
    } else {
      setSearchValue('');
      setSuggestions([]);
      setOpenDropdown(false);
    }
  }, [pathname]);
 
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        setOpenDropdown(false);
        setLoading(false);
        return;
      }
 
      setLoading(true);
      setOpenDropdown(true);
      try {
        const response = await fetch(
          `${API_URL}/products/search?q=${encodeURIComponent(searchValue.trim())}&limit=5`,
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
          const data: ProductSuggestion[] = resData.data || [];
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Lỗi fetch gợi ý tìm kiếm:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
 
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
            className='rounded-full bg-white text-slate-900 shadow-sm border border-slate-100 h-9 overflow-visible flex flex-col justify-center [&_[data-slot=command-input-wrapper]]:p-[0.5px] [&_[data-slot=command-input-wrapper]]:h-full [&_[data-slot=command-input-wrapper]_>_div]:h-full! [&_[data-slot=command-input-wrapper]_>_div]:rounded-full! [&_[data-slot=input-group-addon]]:hidden!'
          >
            <CommandInput
              value={searchValue}
              onValueChange={(v) => setSearchValue(v)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchValue.trim() && setOpenDropdown(true)}
              placeholder='Bạn muốn mua gì?'
              className='w-full h-full border-none bg-transparent text-xs md:text-sm text-slate-900 placeholder:text-slate-400 pr-20 md:pr-24'
            />
 
            {openDropdown && (
              <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-[380px] overflow-y-auto w-full'>
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
                              `/${product.category?.slug || 'dien-thoai'}/${product.slug}`,
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
                              referrerPolicy="no-referrer"
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
          </Command>
 
          {searchValue && (
            <button
              type='button'
              onClick={() => {
                setSearchValue('');
                setSuggestions([]);
                setOpenDropdown(false);
              }}
              className='absolute right-10 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer z-20'
              title='Xóa từ khóa'
            >
              <MdClose size={13} />
            </button>
          )}
 
          <button
            type='button'
            onClick={handleSearchSubmit}
            className='absolute right-1.5 top-1/2 -translate-y-1/2 bg-didongviet-red hover:bg-red-700 text-white h-7 w-7 rounded-full flex items-center justify-center transition cursor-pointer z-20 shadow-sm shadow-red-100 hover:shadow-red-200'
            title='Tìm kiếm'
          >
            <SearchIcon size={13} className='text-white' />
          </button>
        </div>
      </div>
    </div>
  );
}
