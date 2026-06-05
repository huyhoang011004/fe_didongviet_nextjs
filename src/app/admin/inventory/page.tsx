'use client';

import { Suspense } from 'react';
import { useInventory } from './useInventory';
import InventoryHeader from './_inventory-components/InventoryHeader';
import InventoryFilters from './_inventory-components/InventoryFilters';
import InventoryTable from './_inventory-components/InventoryTable';
import UpdateStockModal from './_inventory-components/UpdateStockModal';
import CreateReceiptModal from './_inventory-components/CreateReceiptModal';
import ReceiptsListModal from './_inventory-components/ReceiptsListModal';
import ThresholdEditModal from './_inventory-components/ThresholdEditModal';
import { CheckCircle, AlertCircle } from 'lucide-react';

function InventoryAdminContent() {
  const {
    alert,
    inventoryLoading,
    receiptsLoading,
    productsData,
    branchesData,
    receiptsData,
    currentThreshold,
    thresholdFilter,
    setThresholdFilter,

    // Bộ lọc nâng cao
    stockFilterType,
    setStockFilterType,
    categoriesData,
    selectedCategoryFilter,
    setSelectedCategoryFilter,

    // Phân trang
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    receiptsPage,
    setReceiptsPage,
    receiptsTotalPages,
    receiptsTotalCount,
    fetchReceipts,

    // Bộ lọc
    searchQuery,
    setSearchQuery,
    selectedBranchFilter,
    setSelectedBranchFilter,

    // Modals
    showUpdateStockModal,
    setShowUpdateStockModal,
    showCreateReceiptModal,
    setShowCreateReceiptModal,
    showReceiptsListModal,
    setShowReceiptsListModal,
    showThresholdEditModal,
    setShowThresholdEditModal,

    // Target items
    selectedProduct,
    selectedVariantIndex,
    selectedBranchId,
    selectedStockValue,

    // Pendings
    isUpdatePending,
    isReceiptPending,
    isThresholdPending,

    // Actions
    openUpdateStock,
    openCreateReceipt,
    openReceiptsList,
    openThresholdEdit,
    handleUpdateStockSubmit,
    handleCreateReceiptSubmit,
    handleUpdateThresholdSubmit,
    handleCancelReceipt,
  } = useInventory();

  return (
    <div className='space-y-6 relative'>
      {/* THÔNG BÁO TOAST FLOATING GÓC DƯỚI BÊN PHẢI */}
      {alert && (
        <div
          className={`
          fixed bottom-5 right-5 z-[9999] p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
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

      {/* Header Phân hệ kho */}
      <InventoryHeader
        currentThreshold={currentThreshold}
        onOpenThresholdEdit={openThresholdEdit}
        onOpenReceiptsList={openReceiptsList}
      />

      {/* KHỐI CARD CHUNG CHỨA BỘ LỌC TÌM KIẾM & BẢNG TỒN KHO */}
      <div className='border border-slate-200/50 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-slate-900'>
        {/* Thanh bộ lọc */}
        <InventoryFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBranchFilter={selectedBranchFilter}
          setSelectedBranchFilter={setSelectedBranchFilter}
          branches={branchesData}
          thresholdFilter={thresholdFilter}
          setThresholdFilter={setThresholdFilter}
          currentThreshold={currentThreshold}
          stockFilterType={stockFilterType}
          setStockFilterType={setStockFilterType}
          categories={categoriesData}
          selectedCategoryFilter={selectedCategoryFilter}
          setSelectedCategoryFilter={setSelectedCategoryFilter}
        />

        {/* Bảng tồn kho dạng cây cao cấp */}
        <InventoryTable
          products={productsData}
          branches={branchesData}
          currentThreshold={currentThreshold}
          thresholdFilter={thresholdFilter}
          loading={inventoryLoading}
          onOpenUpdateStock={openUpdateStock}
          onOpenCreateReceipt={openCreateReceipt}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          selectedBranchFilter={selectedBranchFilter}
        />
      </div>

      {/* 1. Modal Điều chỉnh số lượng tồn trực tiếp */}
      <UpdateStockModal
        isOpen={showUpdateStockModal}
        onClose={() => setShowUpdateStockModal(false)}
        product={selectedProduct}
        variantIndex={selectedVariantIndex}
        branchId={selectedBranchId}
        branches={branchesData}
        currentStock={selectedStockValue}
        isPending={isUpdatePending}
        onSubmit={handleUpdateStockSubmit}
      />

      {/* 2. Modal Tạo phiếu nhập kho bổ sung */}
      <CreateReceiptModal
        isOpen={showCreateReceiptModal}
        onClose={() => setShowCreateReceiptModal(false)}
        product={selectedProduct}
        variantIndex={selectedVariantIndex}
        branchId={selectedBranchId}
        branches={branchesData}
        isPending={isReceiptPending}
        onSubmit={handleCreateReceiptSubmit}
      />

      {/* 3. Modal Xem lịch sử phiếu nhập kho */}
      <ReceiptsListModal
        isOpen={showReceiptsListModal}
        onClose={() => setShowReceiptsListModal(false)}
        receipts={receiptsData}
        loading={receiptsLoading}
        currentPage={receiptsPage}
        totalPages={receiptsTotalPages}
        totalCount={receiptsTotalCount}
        onPageChange={(page) => {
          setReceiptsPage(page);
          fetchReceipts(page);
        }}
        onCancelReceipt={handleCancelReceipt}
      />

      {/* 4. Modal Điều chỉnh cấu hình ngưỡng cảnh báo hệ thống */}
      <ThresholdEditModal
        isOpen={showThresholdEditModal}
        onClose={() => setShowThresholdEditModal(false)}
        currentThreshold={currentThreshold}
        isPending={isThresholdPending}
        onSubmit={handleUpdateThresholdSubmit}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển tồn kho...
          </span>
        </div>
      }
    >
      <InventoryAdminContent />
    </Suspense>
  );
}
