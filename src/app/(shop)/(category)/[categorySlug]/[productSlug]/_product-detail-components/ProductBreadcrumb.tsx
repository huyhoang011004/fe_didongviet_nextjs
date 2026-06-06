'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProductBreadcrumbProps {
  product: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const [categoryInfo, setCategoryInfo] = useState<any | null>(null);

  useEffect(() => {
    async function loadCategory() {
      try {
        const slug = product?.category?.slug;
        if (!slug) return setCategoryInfo(null);

        const res = await fetch(`${API_URL}/categories/slug/${slug}`);
        if (!res.ok) return setCategoryInfo(null);
        const data = await res.json();
        if (data && data.success) setCategoryInfo(data.data);
      } catch (err) {
        // ignore
        setCategoryInfo(null);
      }
    }

    loadCategory();
  }, [product?.category?.slug]);

  const parent = categoryInfo?.parentCategory || null;
  const categoryName = categoryInfo?.name || product?.category?.name;
  const categorySlug = categoryInfo?.slug || product?.category?.slug;

  return (
    <nav className='bg-white border-b border-slate-100 py-2.5 shadow-xs'>
      <div className='max-w-[1400px] mx-auto px-[30px] flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold overflow-x-auto whitespace-nowrap'>
        <Link href='/' className='hover:text-didongviet-red transition-colors'>
          Trang chủ
        </Link>
        <ChevronRight size={10} />

        {parent && (
          <>
            <Link
              href={`/${parent.slug || parent._id}`}
              className='hover:text-didongviet-red transition-colors'
            >
              {parent.name}
            </Link>
            <ChevronRight size={10} />
          </>
        )}

        {categoryName && (
          <>
            <Link
              href={`/${categorySlug || 'dien-thoai'}`}
              className='hover:text-didongviet-red transition-colors'
            >
              {categoryName}
            </Link>
            <ChevronRight size={10} />
          </>
        )}

        <span className='text-slate-800 font-bold truncate max-w-[200px]'>
          {product?.name}
        </span>
      </div>
    </nav>
  );
}
