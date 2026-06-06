'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useCategory } from './useCategory';
import BrandFilters from './_category-components/BrandFilters';
import SortBar from './_category-components/SortBar';
import ProductGrid from './_category-components/ProductGrid';
import SeoContent from './_category-components/SeoContent';
import FaqSection from './_category-components/FaqSection';

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params.categorySlug as string;

  const {
    category,
    products,
    loading,
    loadingMore,
    brandFilter,
    priceSort,
    currentPage,
    totalPages,
    totalProducts,
    availableBrands,
    showFullSeo,
    setShowFullSeo,
    openFaqIndex,
    limitPerPage,
    handleBrandChange,
    handleSortChange,
    loadMoreProducts,
    toggleFaq,
    currentSeo,
  } = useCategory(slug);

  if (loading && currentPage === 1) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
            DĐV
          </div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>
          Đang tải sản phẩm danh mục...
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-16'>
      {/* ─── BREADCRUMB ─── */}
      <nav className='bg-white border-b border-slate-100 py-2.5 shadow-xs'>
        <div className='max-w-[1400px] mx-auto px-[30px] flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>
            {category?.name || 'Danh mục'}
          </span>
        </div>
      </nav>

      {/* ─── LAYOUT CHÍNH (FULL WIDTH, KHÔNG CÓ SIDEBAR) ─── */}
      <div className='max-w-[1400px] mx-auto px-[30px] py-6 space-y-6'>
        {/* ─── TIÊU ĐỀ LỚN SEO ─── */}
        <div className='space-y-1.5'>
          <h1 className='text-sm sm:text-base md:text-lg font-black text-slate-800 uppercase tracking-tight'>
            {currentSeo.seoTitle}
          </h1>
          <div className='h-0.5 w-16 bg-didongviet-red rounded-full' />
        </div>

        {/* ─── DẢI NÚT LỌC THƯƠNG HIỆU NẰM NGANG ─── */}
        {availableBrands.length > 0 && (
          <BrandFilters
            slug={slug}
            brandFilter={brandFilter}
            availableBrands={availableBrands}
            onBrandChange={handleBrandChange}
          />
        )}

        {/* ─── THANH SẮP XẾP SẢN PHẨM ─── */}
        <SortBar
          priceSort={priceSort}
          totalProducts={totalProducts}
          onSortChange={handleSortChange}
        />

        {/* ─── LƯỚI SẢN PHẨM (5 CỘT TRÊN DESKTOP) ─── */}
        <ProductGrid
          products={products}
          totalProducts={totalProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          loadingMore={loadingMore}
          limitPerPage={limitPerPage}
          onLoadMore={loadMoreProducts}
        />

        {/* ─── KHỐI NỘI DUNG CHÍNH (TOC) & BÀI VIẾT SEO ─── */}
        <SeoContent
          currentSeo={currentSeo}
          showFullSeo={showFullSeo}
          onToggleSeo={() => setShowFullSeo(!showFullSeo)}
        />

        {/* ─── KHỐI CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) ─── */}
        <FaqSection
          faqs={currentSeo.faqs}
          openFaqIndex={openFaqIndex}
          onToggleFaq={toggleFaq}
        />
      </div>
    </div>
  );
}
