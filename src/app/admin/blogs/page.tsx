'use client';

import React, { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useBlog } from './useBlog';
import { BlogHeader } from '@/app/admin/_components/blog/BlogHeader';
import { BlogFilters } from '@/app/admin/_components/blog/BlogFilters';
import { BlogTable } from '@/app/admin/_components/blog/BlogTable';
import { CreateBlogModal } from '@/app/admin/_components/blog/CreateBlogModal';
import { EditBlogModal } from '@/app/admin/_components/blog/EditBlogModal';
import { DeleteBlogModal } from '@/app/admin/_components/blog/DeleteBlogModal';

function BlogsAdminContent() {
  const {
    currentUser,
    alert,
    blogsData,
    blogsPage,
    setBlogsPage,
    blogsTotalPages,
    blogsTotalCount,
    blogsCategoryFilter,
    setBlogsCategoryFilter,
    blogsSearch,
    setBlogsSearch,
    blogLoading,
    showCreateBlogModal,
    setShowCreateBlogModal,
    showEditBlogModal,
    setShowEditBlogModal,
    showDeleteBlogModal,
    setShowDeleteBlogModal,
    selectedBlog,
    setSelectedBlog,
    createBlogPending,
    editBlogPending,
    handleCreateBlogSubmit,
    handleEditBlogSubmit,
    handleToggleBlogActive,
    confirmDeleteBlog,
  } = useBlog();

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
            <AlertCircle className='text-red-650 flex-shrink-0' />
          )}
          <span className='text-sm font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <BlogHeader
        onAddBlog={() => {
          setSelectedBlog(null);
          setShowCreateBlogModal(true);
        }}
      />

      {/* DANH SÁCH BÀI VIẾT */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        {/* Bộ lọc chuyên mục, tìm kiếm và thống kê số bài */}
        <BlogFilters
          blogsCategoryFilter={blogsCategoryFilter}
          setBlogsCategoryFilter={setBlogsCategoryFilter}
          blogsSearch={blogsSearch}
          setBlogsSearch={setBlogsSearch}
          blogsTotalCount={blogsTotalCount}
        />

        {/* Bảng danh sách bài viết */}
        <BlogTable
          blogLoading={blogLoading}
          blogsData={blogsData}
          blogsPage={blogsPage}
          blogsTotalPages={blogsTotalPages}
          blogsTotalCount={blogsTotalCount}
          setBlogsPage={setBlogsPage}
          onToggleActive={handleToggleBlogActive}
          onEdit={(b) => {
            setSelectedBlog(b);
            setShowEditBlogModal(true);
          }}
          onDelete={(b) => {
            setSelectedBlog(b);
            setShowDeleteBlogModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <CreateBlogModal
        isOpen={showCreateBlogModal}
        onClose={() => setShowCreateBlogModal(false)}
        onSubmit={handleCreateBlogSubmit}
        createBlogPending={createBlogPending}
      />

      <EditBlogModal
        isOpen={showEditBlogModal}
        selectedBlog={selectedBlog}
        onClose={() => setShowEditBlogModal(false)}
        onSubmit={handleEditBlogSubmit}
        editBlogPending={editBlogPending}
      />

      <DeleteBlogModal
        isOpen={showDeleteBlogModal}
        selectedBlog={selectedBlog}
        onClose={() => setShowDeleteBlogModal(false)}
        onConfirm={confirmDeleteBlog}
      />
    </div>
  );
}

export default function BlogsAdminPage() {
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
      <BlogsAdminContent />
    </Suspense>
  );
}
