'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useAccount } from './useAccount';
import { AccountHeader } from '@/app/admin/accounts/_account-components/AccountHeader';
import { AccountFilters } from '@/app/admin/accounts/_account-components/AccountFilters';
import { AccountTable } from '@/app/admin/accounts/_account-components/AccountTable';
import { CreateUserModal } from '@/app/admin/accounts/_account-components/CreateUserModal';
import { EditUserModal } from '@/app/admin/accounts/_account-components/EditUserModal';
import { LockUserModal } from '@/app/admin/accounts/_account-components/LockUserModal';
import { DeleteUserModal } from '@/app/admin/accounts/_account-components/DeleteUserModal';

function AccountsAdminContent() {
  const {
    alert,
    usersData,
    usersPage,
    setUsersPage,
    usersTotalPages,
    usersTotalCount,
    usersFilter,
    setUsersFilter,
    usersSearch,
    setUsersSearch,
    userLoading,
    showCreateUserModal,
    setShowCreateUserModal,
    createUserPending,
    showEditUserModal,
    setShowEditUserModal,
    selectedUser,
    setSelectedUser,
    editUserPending,
    showLockUserModal,
    setShowLockUserModal,
    userToLock,
    setUserToLock,
    showDeleteUserModal,
    setShowDeleteUserModal,
    userToDelete,
    setUserToDelete,
    handleCreateUserSubmit,
    handleEditUserSubmit,
    confirmLockUser,
    confirmDeleteUser,
  } = useAccount();

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
      <AccountHeader onAddAccount={() => setShowCreateUserModal(true)} />

      {/* BẢNG DANH SÁCH & BỘ LỌC */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        <AccountFilters
          usersFilter={usersFilter}
          setUsersFilter={setUsersFilter}
          usersSearch={usersSearch}
          setUsersSearch={setUsersSearch}
          setUsersPage={setUsersPage}
          usersTotalCount={usersTotalCount}
        />
        <AccountTable
          userLoading={userLoading}
          usersData={usersData}
          usersPage={usersPage}
          usersTotalPages={usersTotalPages}
          usersTotalCount={usersTotalCount}
          setUsersPage={setUsersPage}
          onEdit={(user) => {
            setSelectedUser(user);
            setShowEditUserModal(true);
          }}
          onLock={(user) => {
            setUserToLock(user);
            setShowLockUserModal(true);
          }}
          onDelete={(user) => {
            setUserToDelete(user);
            setShowDeleteUserModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onSubmit={handleCreateUserSubmit}
        createUserPending={createUserPending}
      />

      <EditUserModal
        isOpen={showEditUserModal}
        selectedUser={selectedUser}
        onClose={() => setShowEditUserModal(false)}
        onSubmit={handleEditUserSubmit}
        editUserPending={editUserPending}
      />

      <LockUserModal
        isOpen={showLockUserModal}
        userToLock={userToLock}
        onClose={() => setShowLockUserModal(false)}
        onConfirm={confirmLockUser}
      />

      <DeleteUserModal
        isOpen={showDeleteUserModal}
        userToDelete={userToDelete}
        onClose={() => setShowDeleteUserModal(false)}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}

export default function AccountsAdminPage() {
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
      <AccountsAdminContent />
    </Suspense>
  );
}
