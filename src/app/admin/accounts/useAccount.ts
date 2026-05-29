'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/service/Account/accountService';
import { User } from '@/types/auth';
import {
  getUsersAction,
  createUserByAdminAction,
  updateUserByAdminAction,
  softDeleteUserAction,
  hardDeleteUserAction,
} from '@/app/admin/accounts/account-actions';

export function useAccount() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Thông báo alert toast
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // States Quản lý danh sách Người dùng
  const [usersData, setUsersData] = useState<User[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotalCount, setUsersTotalCount] = useState(0);
  const [usersFilter, setUsersFilter] = useState('all');
  const [usersSearch, setUsersSearch] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  // Modals States
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserPending, startCreateUser] = useTransition();

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUserPending, startEditUser] = useTransition();

  const [showLockUserModal, setShowLockUserModal] = useState(false);
  const [userToLock, setUserToLock] = useState<User | null>(null);

  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // 1. Tải thông tin user hiện tại và kiểm tra phân quyền
  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    }
    loadCurrentUser();
  }, []);

  // Chặn staff truy cập trực tiếp vào mục quản lý thành viên
  useEffect(() => {
    if (currentUser && currentUser.role === 'staff') {
      router.replace('/admin?tab=overview');
    }
  }, [currentUser, router]);

  // Auto-hide alert sau 4s
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Tải danh sách người dùng
  const fetchUsers = async () => {
    setUserLoading(true);
    const res = await getUsersAction(usersFilter, usersPage, usersSearch);
    if (res.success) {
      setUsersData(res.users);
      setUsersTotalPages(res.totalPages);
      setUsersTotalCount(res.totalUsers);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách người dùng.',
      });
    }
    setUserLoading(false);
  };

  // Trigger nạp lại dữ liệu khi đổi filter, trang, search query
  useEffect(() => {
    fetchUsers();
  }, [usersPage, usersFilter, usersSearch]);

  // 2. Tạo mới Người dùng
  const handleCreateUserSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startCreateUser(async () => {
      const res = await createUserByAdminAction(null, formData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateUserModal(false);
        fetchUsers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 3. Chỉnh sửa Người dùng
  const handleEditUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      role: formData.get('role') as string,
      isDeleted: formData.get('isDeleted') === 'true',
    };

    startEditUser(async () => {
      const res = await updateUserByAdminAction(selectedUser._id, updatedData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditUserModal(false);
        fetchUsers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 4. Khóa/Mở khóa người dùng (Soft Delete)
  const confirmLockUser = async () => {
    if (!userToLock) return;
    const res = await softDeleteUserAction(userToLock._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowLockUserModal(false);
      fetchUsers();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 5. Xóa vĩnh viễn người dùng (Hard Delete)
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const res = await hardDeleteUserAction(userToDelete._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteUserModal(false);
      fetchUsers();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return {
    alert,
    setAlert,
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
    fetchUsers,
  };
}
