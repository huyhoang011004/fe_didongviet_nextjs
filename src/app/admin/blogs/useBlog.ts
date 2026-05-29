'use client';

import { useEffect, useState, useTransition } from 'react';
import { getCurrentUser } from '@/service/Account/accountService';
import { User } from '@/types/auth';
import { Blog } from '@/types/blog';
import {
  getBlogsAction,
  createBlogAction,
  updateBlogAction,
  toggleBlogStatusAction,
  deleteBlogAction,
} from '@/app/admin/blogs/blog-actions';

export function useBlog() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // State Quản lý danh sách Tin tức & Chuyên mục & Phân trang & Tìm kiếm
  const [blogsData, setBlogsData] = useState<Blog[]>([]);
  const [blogsPage, setBlogsPage] = useState(1);
  const [blogsTotalPages, setBlogsTotalPages] = useState(1);
  const [blogsTotalCount, setBlogsTotalCount] = useState(0);
  const [blogsCategoryFilter, setBlogsCategoryFilter] = useState('all');
  const [blogsSearch, setBlogsSearch] = useState('');
  const [blogLoading, setBlogLoading] = useState(false);

  // Modals state
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [showDeleteBlogModal, setShowDeleteBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const [createBlogPending, startCreateBlog] = useTransition();
  const [editBlogPending, startEditBlog] = useTransition();

  // Nạp thông tin người dùng hiện tại
  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    }
    loadCurrentUser();
  }, []);

  // Tự động ẩn alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Tải danh sách bài viết từ database
  const fetchBlogs = async () => {
    setBlogLoading(true);
    const cat = blogsCategoryFilter === 'all' ? '' : blogsCategoryFilter;
    const res = await getBlogsAction(cat, blogsSearch, blogsPage, 8);
    if (res.success) {
      setBlogsData(res.blogs);
      setBlogsTotalPages(res.totalPages);
      setBlogsTotalCount(res.totalBlogs);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách bài viết.',
      });
    }
    setBlogLoading(false);
  };

  // Trigger nạp dữ liệu
  useEffect(() => {
    fetchBlogs();
  }, [blogsPage, blogsCategoryFilter, blogsSearch]);

  // Reset trang về 1 khi lọc hoặc tìm kiếm
  useEffect(() => {
    setBlogsPage(1);
  }, [blogsCategoryFilter, blogsSearch]);

  // 1. Tạo mới Bài viết tin tức
  const handleCreateBlogSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagsRaw = formData.get('tags') as string;

    const blogData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      summary: formData.get('summary') as string,
      content: formData.get('content') as string,
      featuredImage:
        (formData.get('featuredImage') as string) || '/auth-image.webp',
      status: formData.get('status') as string,
      tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : [],
      metaTitle: (formData.get('metaTitle') as string) || undefined,
      metaDescription: (formData.get('metaDescription') as string) || undefined,
    };

    startCreateBlog(async () => {
      const res = await createBlogAction(blogData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateBlogModal(false);
        fetchBlogs();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 2. Chỉnh sửa Bài viết tin tức
  const handleEditBlogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBlog) return;
    const formData = new FormData(e.currentTarget);
    const tagsRaw = formData.get('tags') as string;

    const blogData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      summary: formData.get('summary') as string,
      content: formData.get('content') as string,
      featuredImage:
        (formData.get('featuredImage') as string) || '/auth-image.webp',
      status: formData.get('status') as string,
      tags: tagsRaw ? tagsRaw.split(',').map((t) => t.trim()) : [],
      metaTitle: (formData.get('metaTitle') as string) || undefined,
      metaDescription: (formData.get('metaDescription') as string) || undefined,
    };

    startEditBlog(async () => {
      const res = await updateBlogAction(selectedBlog._id, blogData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditBlogModal(false);
        fetchBlogs();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 3. Bật/Tắt ẩn hiển thị bài viết (isActive Toggle)
  const handleToggleBlogActive = async (id: string) => {
    const res = await toggleBlogStatusAction(id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      fetchBlogs();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 4. Xóa vĩnh viễn bài viết
  const confirmDeleteBlog = async () => {
    if (!selectedBlog) return;
    const res = await deleteBlogAction(selectedBlog._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteBlogModal(false);
      fetchBlogs();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return {
    currentUser,
    alert,
    setAlert,
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
    fetchBlogs,
  };
}
