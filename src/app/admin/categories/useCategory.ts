'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/service/Account/accountService';
import { User } from '@/types/auth';
import { Category } from '@/types/product';
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/app/admin/categories/category-actions';

export function useCategory() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // State Quản lý danh sách danh mục, ô tìm kiếm và bộ lọc
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [parentFilter, setParentFilter] = useState('all');
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Modals state
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [createCategoryPending, startCreateCategory] = useTransition();
  const [editCategoryPending, startEditCategory] = useTransition();

  // Tải thông tin user hiện tại và kiểm tra phân quyền
  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    }
    loadCurrentUser();
  }, []);

  // Chặn nhân viên (staff) truy cập trực tiếp vào mục quản lý danh mục
  useEffect(() => {
    if (currentUser && currentUser.role === 'staff') {
      router.replace('/admin?tab=overview');
    }
  }, [currentUser, router]);

  // Tự động ẩn thông báo alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Nạp danh sách danh mục từ database
  const fetchCategories = async () => {
    setCategoryLoading(true);
    const res = await getCategoriesAction();
    if (res.success) {
      setCategoriesData(res.categories);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách danh mục.',
      });
    }
    setCategoryLoading(false);
  };

  // Trigger nạp dữ liệu khi mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  // Logic lọc danh mục phía client-side
  const filteredCategories = categoriesData.filter((c) => {
    // 1. Lọc theo tìm kiếm tên danh mục
    const matchesSearch = c.name
      .toLowerCase()
      .includes(categorySearch.toLowerCase());

    // 2. Lọc theo danh mục cha
    const pId =
      c.parentCategory && typeof c.parentCategory === 'object'
        ? (c.parentCategory as any)._id
        : c.parentCategory;

    let matchesParent = true;
    if (parentFilter === 'root') {
      matchesParent = !pId;
    } else if (parentFilter !== 'all') {
      matchesParent = pId === parentFilter;
    }

    return matchesSearch && matchesParent;
  });

  // 1. Tạo mới danh mục
  const handleCreateCategorySubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const brandsRaw = formData.get('brands') as string;

    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      parentCategory: (formData.get('parentCategory') as string) || null,
      brands: brandsRaw ? brandsRaw.split(',').map((b) => b.trim()) : [],
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'true',
    };

    startCreateCategory(async () => {
      const res = await createCategoryAction(categoryData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateCategoryModal(false);
        fetchCategories();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 2. Chỉnh sửa danh mục
  const handleEditCategorySubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!selectedCategory) return;
    const formData = new FormData(e.currentTarget);
    const brandsRaw = formData.get('brands') as string;

    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      parentCategory: (formData.get('parentCategory') as string) || null,
      brands: brandsRaw ? brandsRaw.split(',').map((b) => b.trim()) : [],
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'true',
    };

    startEditCategory(async () => {
      const res = await updateCategoryAction(
        selectedCategory._id,
        categoryData,
      );
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditCategoryModal(false);
        fetchCategories();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 3. Xóa vĩnh viễn danh mục
  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    const res = await deleteCategoryAction(selectedCategory._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteCategoryModal(false);
      fetchCategories();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return {
    alert,
    setAlert,
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
    fetchCategories,
  };
}
