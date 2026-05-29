'use client';

import React, { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useStudentVerification } from './useStudentVerification';
import { StudentVerificationHeader } from '@/app/admin/_components/student-verification/StudentVerificationHeader';
import { StudentVerificationFilters } from '@/app/admin/_components/student-verification/StudentVerificationFilters';
import { StudentVerificationTable } from '@/app/admin/_components/student-verification/StudentVerificationTable';
import { StudentVerificationDetailsModal } from '@/app/admin/_components/student-verification/StudentVerificationDetailsModal';

function StudentVerificationsAdminContent() {
  const {
    alert,
    pendingProfiles,
    searchQuery,
    setSearchQuery,
    filteredProfiles,
    loading,
    showDetailsModal,
    setShowDetailsModal,
    selectedProfile,
    setSelectedProfile,
    verifyPending,
    handleVerifySubmit,
  } = useStudentVerification();

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
      <StudentVerificationHeader />

      {/* DANH SÁCH HỒ SƠ CHỜ DUYỆT */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        {/* Bộ lọc số lượng chờ duyệt & Thanh tìm kiếm */}
        <StudentVerificationFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          pendingCount={pendingProfiles.length}
        />

        {/* Bảng danh sách hồ sơ HSSV */}
        <StudentVerificationTable
          loading={loading}
          profilesData={filteredProfiles}
          onOpenDetails={(p) => {
            setSelectedProfile(p);
            setShowDetailsModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI XÉT DUYỆT */}
      <StudentVerificationDetailsModal
        isOpen={showDetailsModal}
        selectedProfile={selectedProfile}
        onClose={() => setShowDetailsModal(false)}
        onSubmit={handleVerifySubmit}
        verifyPending={verifyPending}
      />
    </div>
  );
}

export default function StudentVerificationsAdminPage() {
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
      <StudentVerificationAdminContent />
    </Suspense>
  );
}

// Rename component inside file to match correctly
const StudentVerificationAdminContent = StudentVerificationsAdminContent;
