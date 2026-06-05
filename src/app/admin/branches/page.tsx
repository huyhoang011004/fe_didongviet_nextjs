'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useBranch } from './useBranch';
import { BranchHeader } from '@/app/admin/branches/_branch-components/BranchHeader';
import { BranchFilters } from '@/app/admin/branches/_branch-components/BranchFilters';
import { BranchTable } from '@/app/admin/branches/_branch-components/BranchTable';
import { CreateBranchModal } from '@/app/admin/branches/_branch-components/CreateBranchModal';
import { EditBranchModal } from '@/app/admin/branches/_branch-components/EditBranchModal';
import { DeleteBranchModal } from '@/app/admin/branches/_branch-components/DeleteBranchModal';

function BranchesAdminContent() {
  const {
    alert,
    branchesData,
    branchLoading,
    branchSearch,
    setBranchSearch,
    branchFilter,
    setBranchFilter,
    filteredBranches,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedBranch,
    setSelectedBranch,
    createPending,
    editPending,
    handleCreateSubmit,
    handleEditSubmit,
    confirmDelete,
  } = useBranch();

  return (
    <div className='space-y-6 relative'>
      {/* THÔNG BÁO TOAST FLOATING */}
      {alert && (
        <div
          className={`
            fixed bottom-5 right-5 z-[9999] p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
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

      {/* TIÊU ĐỀ TRANG */}
      <BranchHeader onAddClick={() => setShowCreateModal(true)} />

      {/* BẢNG CHI NHÁNH */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <BranchFilters
          branchSearch={branchSearch}
          setBranchSearch={setBranchSearch}
          branchFilter={branchFilter}
          setBranchFilter={setBranchFilter}
          filteredCount={filteredBranches.length}
          totalCount={branchesData.length}
        />

        <BranchTable
          branches={filteredBranches}
          loading={branchLoading}
          onEdit={(branch) => {
            setSelectedBranch(branch);
            setShowEditModal(true);
          }}
          onDelete={(branch) => {
            setSelectedBranch(branch);
            setShowDeleteModal(true);
          }}
        />
      </Card>

      {/* MODAL TẠO MỚI */}
      <CreateBranchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
        pending={createPending}
      />

      {/* MODAL CHỈNH SỬA */}
      <EditBranchModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditSubmit}
        pending={editPending}
        branch={selectedBranch}
      />

      {/* MODAL XÁC NHẬN XÓA */}
      <DeleteBranchModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        branchName={selectedBranch?.name || ''}
      />
    </div>
  );
}

export default function BranchesAdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển chi nhánh...
          </span>
        </div>
      }
    >
      <BranchesAdminContent />
    </Suspense>
  );
}
