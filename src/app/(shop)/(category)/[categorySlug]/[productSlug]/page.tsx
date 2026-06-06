'use client';

import { useParams, useRouter } from 'next/navigation';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useProductDetail } from './useProductDetail';
import ProductBreadcrumb from './_product-detail-components/ProductBreadcrumb';
import ProductGallery from './_product-detail-components/ProductGallery';
import ProductInfo from './_product-detail-components/ProductInfo';
import StoreStock from './_product-detail-components/StoreStock';
import ProductDescription from './_product-detail-components/ProductDescription';
import ProductSpecs from './_product-detail-components/ProductSpecs';
import ProductFAQ from './_product-detail-components/ProductFAQ';
import ProductReviews from './_product-detail-components/ProductReviews';
import ProductNews from './_product-detail-components/ProductNews';
import RelatedProducts from './_product-detail-components/RelatedProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.productSlug as string;

  const {
    product,
    relatedProducts,
    branches,
    loading,
    selectedVariantIdx,
    setSelectedVariantIdx,
    activeImage,
    setActiveImage,
    isLiked,
    setIsLiked,
    isDescExpanded,
    setIsDescExpanded,
    cartQty,
    setCartQty,
    isAddingToCart,
    isBuyingNow,
    alert,
    setAlert,
    handleAddToCart,
    handleBuyNow,
  } = useProductDetail(id);

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
          className='bg-didongviet-red hover:bg-red-700 text-white py-2.5 px-5 text-xs font-semibold rounded-xl border-none shadow-sm'
        >
          Quay lại Trang chủ
        </Button>
      </div>
    );
  }

  const activeVariant = product.variants?.[selectedVariantIdx] || {};
  const minPrice = product.priceRange?.min || 0;
  const originalPrice = activeVariant.price || minPrice;
  const salePrice = activeVariant.salePrice || originalPrice;
  const percentOff = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

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
      <ProductBreadcrumb product={product} />

      <div className='max-w-[1400px] mx-auto px-[30px] py-5 space-y-6'>
        {/* MAIN PRODUCT INFO */}
        <section className='bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 relative overflow-hidden'>
          <div className='absolute top-0 left-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none' />

          {/* MEDIA GALLERY */}
          <ProductGallery
            product={product}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            percentOff={percentOff}
          />

          {/* PRODUCT DETAILS */}
          <ProductInfo
            product={product}
            selectedVariantIdx={selectedVariantIdx}
            setSelectedVariantIdx={setSelectedVariantIdx}
            setActiveImage={setActiveImage}
            cartQty={cartQty}
            setCartQty={setCartQty}
            isAddingToCart={isAddingToCart}
            isBuyingNow={isBuyingNow}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
            setAlert={setAlert}
          />
        </section>

        {/* TỒN KHO CHI NHÁNH */}
        <StoreStock activeVariant={activeVariant} branches={branches} />

        {/* MÔ TẢ & THÔNG SỐ KỸ THUẬT */}
        <section className='grid grid-cols-1 lg:grid-cols-12 gap-5 items-start'>
          <ProductDescription
            product={product}
            isDescExpanded={isDescExpanded}
            setIsDescExpanded={setIsDescExpanded}
          />
          <ProductSpecs product={product} />
        </section>
        {/* CÂU HỎI THƯỜNG GẶP & TIN TỨC LIÊN QUAN */}
        <section className='grid grid-cols-1 lg:grid-cols-12 gap-5 items-start'>
          <div className='lg:col-span-7'>
            <ProductFAQ product={product} />
          </div>
          <div className='lg:col-span-5'>
            <ProductNews product={product} />
          </div>
        </section>

        {/* ĐÁNH GIÁ KHÁCH HÀNG */}
        <ProductReviews product={product} />

        {/* SẢN PHẨM TƯƠNG TỰ */}
        <RelatedProducts productId={product?._id} title="Sản phẩm tương tự" isUsed={false} />

        {/* THAM KHẢO HÀNG CŨ */}
        <RelatedProducts productId={product?._id} title="Tham khảo hàng cũ" isUsed={true} />
      </div>
    </div>
  );
}
