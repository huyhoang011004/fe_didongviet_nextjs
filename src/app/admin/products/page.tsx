'use client';

import { Suspense } from 'react';
import { useProduct } from './useProduct';
import { ProductHeader } from '../_components/product/ProductHeader';
import { ProductFilters } from '../_components/product/ProductFilters';
import { ProductTable } from '../_components/product/ProductTable';
import { CreateProductModal } from '../_components/product/CreateProductModal';
import { EditProductModal } from '../_components/product/EditProductModal';
import { DeleteProductModal } from '../_components/product/DeleteProductModal';
import { CheckCircle, AlertCircle } from 'lucide-react';

function ProductsAdminContent() {
  const {
    currentUser,
    alert,
    productsData,
    productsPage,
    setProductsPage,
    productsTotalPages,
    productsTotalCount,
    productsSearch,
    setProductsSearch,
    selectedCategorySlug,
    setSelectedCategorySlug,
    productLoading,
    showCreateProductModal,
    setShowCreateProductModal,
    showEditProductModal,
    setShowEditProductModal,
    showDeleteProductModal,
    setShowDeleteProductModal,
    selectedProduct,
    setSelectedProduct,
    productToDelete,
    setProductToDelete,
    productVariants,
    setProductVariants,
    createProductPending,
    editProductPending,
    branchesData,
    categoriesData,
    mediaLoading,
    handleToggleProductStatus,
    confirmDeleteProduct,
    handleCreateProductSubmit,
    handleEditProductSubmit,
    handleReplaceProductImage,
    handleDeleteProductImage,
    handleSetProductThumbnail,
    handleReorderProductImages,
  } = useProduct();

  return (
    <div className='space-y-6 relative'>
      {/* THÔNG BÁO TOAST FLOATING */}
      {alert && (
        <div
          className={`
          fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}
        >
          {alert.type === 'success' ? (
            <CheckCircle className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-sm font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* TIÊU ĐỀ TRANG VÀ NÚT TẠO MỚI */}
      <ProductHeader
        onAddClick={() => {
          setSelectedProduct(null);
          setProductVariants([
            {
              color: '',
              ram: '',
              rom: '',
              price: '',
              salePrice: '',
              sku: '',
              variantImage: '',
              inventory: [],
            },
          ]);
          setShowCreateProductModal(true);
        }}
      />

      {/* BẢNG TỒN KHO & BỘ LỌC TÌM KIẾM */}
      <div className='border border-slate-200/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900'>
        <ProductFilters
          searchQuery={productsSearch}
          onSearchChange={setProductsSearch}
          filteredCount={productsData.length}
          totalCount={productsTotalCount}
          categories={categoriesData}
          selectedCategorySlug={selectedCategorySlug}
          onCategorySelect={setSelectedCategorySlug}
        />

        <ProductTable
          products={productsData}
          loading={productLoading}
          currentPage={productsPage}
          totalPages={productsTotalPages}
          totalProducts={productsTotalCount}
          onPageChange={setProductsPage}
          onToggleStatus={handleToggleProductStatus}
          onEditClick={(p) => {
            setSelectedProduct(p);
            setProductVariants(p.variants || []);
            setShowEditProductModal(true);
          }}
          onDeleteClick={(p) => {
            setProductToDelete(p);
            setShowDeleteProductModal(true);
          }}
          currentUserRole={currentUser?.role}
        />
      </div>

      {/* MODAL 1: THÊM MỚI SẢN PHẨM */}
      <CreateProductModal
        isOpen={showCreateProductModal}
        onClose={() => setShowCreateProductModal(false)}
        onSubmit={handleCreateProductSubmit}
        categories={categoriesData}
        branches={branchesData}
        variants={productVariants}
        setVariants={setProductVariants}
        pending={createProductPending}
      />

      {/* MODAL 2: HIỆU CHỈNH SẢN PHẨM & MEDIA NÂNG CAO */}
      <EditProductModal
        isOpen={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        onSubmit={handleEditProductSubmit}
        product={selectedProduct}
        categories={categoriesData}
        branches={branchesData}
        variants={productVariants}
        setVariants={setProductVariants}
        pending={editProductPending}
        mediaLoading={mediaLoading}
        onReplaceImage={handleReplaceProductImage}
        onDeleteImage={handleDeleteProductImage}
        onSetThumbnail={handleSetProductThumbnail}
        onReorderImages={handleReorderProductImages}
      />

      {/* MODAL 3: XÁC NHẬN XÓA VĨNH VIỄN */}
      <DeleteProductModal
        isOpen={showDeleteProductModal}
        onClose={() => setShowDeleteProductModal(false)}
        onConfirm={confirmDeleteProduct}
        productName={productToDelete?.name || ''}
      />
    </div>
  );
}

export default function ProductsAdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển...
          </span>
        </div>
      }
    >
      <ProductsAdminContent />
    </Suspense>
  );
}
