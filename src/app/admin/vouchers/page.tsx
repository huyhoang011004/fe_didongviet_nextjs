'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useVoucher } from './useVoucher';
import { VoucherFilters } from '@/app/admin/_components/voucher/VoucherFilters';
import { VoucherHeader } from '@/app/admin/_components/voucher/VoucherHeader';
import { VoucherTable } from '@/app/admin/_components/voucher/VoucherTable';
import { CreateVoucherModal } from '@/app/admin/_components/voucher/CreateVoucherModal';
import { EditVoucherModal } from '@/app/admin/_components/voucher/EditVoucherModal';
import { DeleteVoucherModal } from '@/app/admin/_components/voucher/DeleteVoucherModal';

function VouchersAdminContent() {
  const {
    alert,
    vouchersData,
    voucherSearch,
    setVoucherSearch,
    vouchersFilter,
    setVouchersFilter,
    filteredVouchers,
    voucherLoading,
    showCreateVoucherModal,
    setShowCreateVoucherModal,
    showEditVoucherModal,
    setShowEditVoucherModal,
    showDeleteVoucherModal,
    setShowDeleteVoucherModal,
    selectedVoucher,
    setSelectedVoucher,
    createVoucherPending,
    editVoucherPending,
    voucherDiscountType,
    setVoucherDiscountType,
    hssvTiers,
    setHssvTiers,
    handleCreateVoucherSubmit,
    handleEditVoucherSubmit,
    confirmDeleteVoucher,
  } = useVoucher();

  return (
    <div className='space-y-6 relative'>
      {/* THÔNG BÁO TOAST FLOATING */}
      {alert && (
        <div
          className={`
            fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
            ${
              alert.type === 'success'
                ? 'bg-green-50/95 border-green-200 text-green-800'
                : 'bg-red-50/95 border-red-200 text-red-800'
            }
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

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <VoucherHeader
        onAddVoucher={() => {
          setSelectedVoucher(null);
          setVoucherDiscountType('fixed');
          setHssvTiers([{ minOrderValue: 0, discountAmount: 0 }]);
          setShowCreateVoucherModal(true);
        }}
      />

      {/* DANH SÁCH VOUCHERS */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <VoucherFilters
          vouchersFilter={vouchersFilter}
          setVouchersFilter={setVouchersFilter}
          voucherSearch={voucherSearch}
          setVoucherSearch={setVoucherSearch}
          filteredCount={filteredVouchers.length}
          totalCount={vouchersData.length}
        />

        <VoucherTable
          voucherLoading={voucherLoading}
          vouchersData={filteredVouchers}
          onEdit={(v) => {
            setSelectedVoucher(v);
            setVoucherDiscountType(v.discountType);
            setHssvTiers(v.hssvTiers || []);
            setShowEditVoucherModal(true);
          }}
          onDelete={(v) => {
            setSelectedVoucher(v);
            setShowDeleteVoucherModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <CreateVoucherModal
        isOpen={showCreateVoucherModal}
        onClose={() => setShowCreateVoucherModal(false)}
        onSubmit={handleCreateVoucherSubmit}
        createVoucherPending={createVoucherPending}
        voucherDiscountType={voucherDiscountType}
        setVoucherDiscountType={setVoucherDiscountType}
        hssvTiers={hssvTiers}
        setHssvTiers={setHssvTiers}
      />

      <EditVoucherModal
        isOpen={showEditVoucherModal}
        selectedVoucher={selectedVoucher}
        onClose={() => setShowEditVoucherModal(false)}
        onSubmit={handleEditVoucherSubmit}
        editVoucherPending={editVoucherPending}
        voucherDiscountType={voucherDiscountType}
        setVoucherDiscountType={setVoucherDiscountType}
        hssvTiers={hssvTiers}
        setHssvTiers={setHssvTiers}
      />

      <DeleteVoucherModal
        isOpen={showDeleteVoucherModal}
        selectedVoucher={selectedVoucher}
        onClose={() => setShowDeleteVoucherModal(false)}
        onConfirm={confirmDeleteVoucher}
      />
    </div>
  );
}

export default function VouchersAdminPage() {
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
      <VouchersAdminContent />
    </Suspense>
  );
}
