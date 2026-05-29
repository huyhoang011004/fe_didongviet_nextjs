'use client';

import { useEffect, useState, useTransition } from 'react';
import { getCurrentUser } from '@/service/Account/accountService';
import { User } from '@/types/auth';
import { StudentProfile } from '@/types/student';
import {
  getPendingHSSVAction,
  verifyHSSVStatusAction,
} from '@/app/admin/student-verifications/student-verification-actions';

export function useStudentVerification() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // State Quản lý danh sách hồ sơ & tìm kiếm & loading
  const [pendingProfiles, setPendingProfiles] = useState<StudentProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<StudentProfile | null>(null);

  const [verifyPending, startVerify] = useTransition();

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

  // Tải danh sách hồ sơ HSSV đang chờ phê duyệt
  const fetchPendingProfiles = async () => {
    setLoading(true);
    const res = await getPendingHSSVAction();
    if (res.success) {
      setPendingProfiles(res.data);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách hồ sơ HSSV.',
      });
    }
    setLoading(false);
  };

  // Trigger nạp dữ liệu khi mounted
  useEffect(() => {
    fetchPendingProfiles();
  }, []);

  // Logic lọc danh sách hồ sơ khách hàng tại client-side
  const filteredProfiles = pendingProfiles.filter((p) => {
    const user =
      p._id && typeof p._id === 'object'
        ? (p._id as any)
        : { name: '', email: '', phone: '' };

    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query) ||
      (p.schoolName || '').toLowerCase().includes(query) ||
      (p.studentIdCard || '').toLowerCase().includes(query)
    );
  });

  // Xử lý Phê duyệt / Từ chối hồ sơ thẻ sinh viên
  const handleVerifySubmit = async (data: {
    status: 'Đã xác thực' | 'Bị từ chối';
    studentIdCard?: string;
    schoolName?: string;
    rejectedReason?: string;
  }) => {
    if (!selectedProfile) return;

    startVerify(async () => {
      const res = await verifyHSSVStatusAction(selectedProfile._id, data);
      if (res.success) {
        setAlert({
          type: 'success',
          message: res.message + (res.instruction ? ` (${res.instruction})` : ''),
        });
        setShowDetailsModal(false);
        fetchPendingProfiles();
      } else {
        setAlert({
          type: 'error',
          message: res.message,
        });
      }
    });
  };

  return {
    currentUser,
    alert,
    setAlert,
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
    fetchPendingProfiles,
  };
}
