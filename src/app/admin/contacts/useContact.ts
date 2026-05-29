'use client';

import { useEffect, useState, useTransition } from 'react';
import { getCurrentUser } from '@/service/Account/accountService';
import { User } from '@/types/auth';
import { Contact } from '@/types/contact';
import {
  getContactsAction,
  updateContactStatusAction,
  softDeleteContactAction,
  deleteContactAction,
} from '@/app/admin/contacts/contact-actions';

export function useContact() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // State Quản lý danh sách liên hệ & bộ lọc & phân trang
  const [contactsData, setContactsData] = useState<Contact[]>([]);
  const [contactsPage, setContactsPage] = useState(1);
  const [contactsTotalPages, setContactsTotalPages] = useState(1);
  const [contactsTotalCount, setContactsTotalCount] = useState(0);
  const [contactsStatusFilter, setContactsStatusFilter] = useState('all');
  const [contactSearch, setContactSearch] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  // Modals state
  const [showContactDetailsModal, setShowContactDetailsModal] = useState(false);
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [updateContactStatusPending, startUpdateContactStatus] =
    useTransition();

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

  // Tải danh sách liên hệ khi trang hoặc bộ lọc thay đổi
  const fetchContacts = async () => {
    setContactLoading(true);
    const stat = contactsStatusFilter === 'all' ? '' : contactsStatusFilter;
    const res = await getContactsAction(stat, contactSearch, contactsPage, 8);
    if (res.success) {
      setContactsData(res.contacts);
      setContactsTotalPages(res.totalPages);
      setContactsTotalCount(res.totalContacts);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách liên hệ.',
      });
    }
    setContactLoading(false);
  };

  // Trigger nạp dữ liệu
  useEffect(() => {
    fetchContacts();
  }, [contactsPage, contactsStatusFilter, contactSearch]);

  // 1. Cập nhật tiến trình CSKH (Trạng thái và Ghi chú Notes)
  const handleUpdateContactStatusSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!selectedContact) return;
    const formData = new FormData(e.currentTarget);
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string;

    startUpdateContactStatus(async () => {
      const res = await updateContactStatusAction(selectedContact._id, {
        status,
        notes,
      });
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowContactDetailsModal(false);
        fetchContacts();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 2. Hủy nhanh phiếu liên hệ (soft-delete chuyển trạng thái thành Đã hủy)
  const handleCancelContact = async (id: string) => {
    const res = await softDeleteContactAction(id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowContactDetailsModal(false);
      fetchContacts();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 3. Xóa vĩnh viễn phiếu liên hệ (Chỉ Admin mới có quyền)
  const confirmDeleteContact = async () => {
    if (!selectedContact) return;
    const res = await deleteContactAction(selectedContact._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteContactModal(false);
      setShowContactDetailsModal(false);
      fetchContacts();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return {
    currentUser,
    alert,
    setAlert,
    contactsData,
    contactsPage,
    setContactsPage,
    contactsTotalPages,
    contactsTotalCount,
    contactsStatusFilter,
    setContactsStatusFilter,
    contactSearch,
    setContactSearch,
    contactLoading,
    showContactDetailsModal,
    setShowContactDetailsModal,
    showDeleteContactModal,
    setShowDeleteContactModal,
    selectedContact,
    setSelectedContact,
    updateContactStatusPending,
    handleUpdateContactStatusSubmit,
    handleCancelContact,
    confirmDeleteContact,
    fetchContacts,
  };
}
