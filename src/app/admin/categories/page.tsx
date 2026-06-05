'use client';

import { Suspense } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { useCategory } from './useCategory';
import { CategoryHeader } from '@/app/admin/categories/_category-components/CategoryHeader';
import { CategoryFilters } from '@/app/admin/categories/_category-components/CategoryFilters';
import { CategoryTable } from '@/app/admin/categories/_category-components/CategoryTable';
import { CreateCategoryModal } from '@/app/admin/categories/_category-components/CreateCategoryModal';
import { EditCategoryModal } from '@/app/admin/categories/_category-components/EditCategoryModal';
import { DeleteCategoryModal } from '@/app/admin/categories/_category-components/DeleteCategoryModal';

function CategoriesAdminContent() {
  const {
    alert,
    categoriesData,
    categorySearch,
    setCategorySearch,
    parentFilter,
    setParentFilter,
    filteredCategories,
    categoryLoading,
    showCreateCategoryModal,
    setShowCreateCategoryModal,
    showEditCategoryModal,
    setShowEditCategoryModal,
    showDeleteCategoryModal,
    setShowDeleteCategoryModal,
    selectedCategory,
    setSelectedCategory,
    createCategoryPending,
    editCategoryPending,
    handleCreateCategorySubmit,
    handleEditCategorySubmit,
    confirmDeleteCategory,
  } = useCategory();

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

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <CategoryHeader
        onAddCategory={() => {
          setSelectedCategory(null);
          setShowCreateCategoryModal(true);
        }}
      />

      {/* DANH SÁCH DANH MỤC */}
      <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
        {/* Bộ lọc dạng cây bên trái và thanh tìm kiếm bên phải */}
        <CategoryFilters
          categoriesData={categoriesData}
          parentFilter={parentFilter}
          setParentFilter={setParentFilter}
          categorySearch={categorySearch}
          setCategorySearch={setCategorySearch}
          filteredCount={filteredCategories.length}
          totalCount={categoriesData.length}
        />

        {/* Bảng danh sách danh mục */}
        <CategoryTable
          categoryLoading={categoryLoading}
          categoriesData={filteredCategories}
          allCategories={categoriesData}
          onEdit={(cat) => {
            setSelectedCategory(cat);
            setShowEditCategoryModal(true);
          }}
          onDelete={(cat) => {
            setSelectedCategory(cat);
            setShowDeleteCategoryModal(true);
          }}
        />
      </Card>

      {/* MODALS HỘP THOẠI */}
      <CreateCategoryModal
        isOpen={showCreateCategoryModal}
        onClose={() => setShowCreateCategoryModal(false)}
        onSubmit={handleCreateCategorySubmit}
        createCategoryPending={createCategoryPending}
        categoriesData={categoriesData}
      />

      <EditCategoryModal
        isOpen={showEditCategoryModal}
        selectedCategory={selectedCategory}
        onClose={() => setShowEditCategoryModal(false)}
        onSubmit={handleEditCategorySubmit}
        editCategoryPending={editCategoryPending}
        categoriesData={categoriesData}
      />

      <DeleteCategoryModal
        isOpen={showDeleteCategoryModal}
        selectedCategory={selectedCategory}
        onClose={() => setShowDeleteCategoryModal(false)}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
}

export default function CategoriesAdminPage() {
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
      <CategoriesAdminContent />
    </Suspense>
  );
}
