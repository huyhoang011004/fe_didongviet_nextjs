'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/service/Account/accountService';
import { User } from '@/types/auth';
import { Voucher, HSSVTier } from '@/types/voucher';
import {
  getVouchersAction,
  createVoucherAction,
  updateVoucherAction,
  deleteVoucherAction,
  getVoucherByCodeAction,
} from '@/app/admin/vouchers/voucher-actions';

export function useVoucher() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // State Quản lý danh sách Voucher và ô tìm kiếm
  const [vouchersData, setVouchersData] = useState<Voucher[]>([]);
  const [voucherSearch, setVoucherSearch] = useState('');
  const [vouchersFilter, setVouchersFilter] = useState('all');
  const [voucherLoading, setVoucherLoading] = useState(false);

  // Lọc voucher phía client theo bộ lọc
  const filteredVouchers = vouchersData.filter((v) => {
    const isExpired = v.expiryDate
      ? new Date(v.expiryDate) < new Date()
      : false;
    const isLocked = v.isActive === false;

    if (vouchersFilter === 'active') {
      return !isLocked && !isExpired;
    }
    if (vouchersFilter === 'expired') {
      return isExpired;
    }
    if (vouchersFilter === 'locked') {
      return isLocked;
    }
    return true; // 'all'
  });

  // Modals state
  const [showCreateVoucherModal, setShowCreateVoucherModal] = useState(false);
  const [showEditVoucherModal, setShowEditVoucherModal] = useState(false);
  const [showDeleteVoucherModal, setShowDeleteVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const [createVoucherPending, startCreateVoucher] = useTransition();
  const [editVoucherPending, startEditVoucher] = useTransition();

  const [voucherDiscountType, setVoucherDiscountType] = useState('fixed');
  const [hssvTiers, setHssvTiers] = useState<HSSVTier[]>([
    { minOrderValue: 0, discountAmount: 0 },
  ]);

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

  // Chặn staff truy cập trực tiếp vào mục quản lý mã giảm giá
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

  // Tải danh sách voucher hoặc tìm kiếm theo mã code
  const fetchVouchers = async () => {
    setVoucherLoading(true);
    if (voucherSearch.trim()) {
      const res = await getVoucherByCodeAction(
        voucherSearch.trim().toUpperCase(),
      );
      if (res.success && res.voucher) {
        setVouchersData([res.voucher]);
      } else {
        setVouchersData([]);
      }
    } else {
      const res = await getVouchersAction();
      if (res.success) {
        setVouchersData(res.vouchers);
      } else {
        setAlert({
          type: 'error',
          message: res.message || 'Lỗi tải danh sách voucher.',
        });
      }
    }
    setVoucherLoading(false);
  };

  // Trigger nạp lại dữ liệu voucher khi mounted hoặc khi search query thay đổi
  useEffect(() => {
    fetchVouchers();
  }, [voucherSearch]);

  // 1. Tạo mới Voucher
  const handleCreateVoucherSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const discountType = formData.get('discountType') as string;

    const parsedTiers: HSSVTier[] = [];
    if (discountType === 'hssv_tiered') {
      const minValInputs = formData.getAll('tierMinOrderValue');
      const discountValInputs = formData.getAll('tierDiscountAmount');
      for (let i = 0; i < minValInputs.length; i++) {
        if (minValInputs[i] && discountValInputs[i]) {
          parsedTiers.push({
            minOrderValue: parseFloat(minValInputs[i] as string) || 0,
            discountAmount: parseFloat(discountValInputs[i] as string) || 0,
          });
        }
      }
    }

    const voucherData = {
      code: (formData.get('code') as string).toUpperCase(),
      description: formData.get('description') as string,
      discountType,
      discountValue:
        discountType === 'hssv_tiered'
          ? undefined
          : parseFloat(formData.get('discountValue') as string) || 0,
      maxDiscount: formData.get('maxDiscount')
        ? parseFloat(formData.get('maxDiscount') as string)
        : undefined,
      minOrderAmount: parseFloat(formData.get('minOrderAmount') as string) || 0,
      usageLimit: parseInt(formData.get('usageLimit') as string) || 100,
      maxUsagePerUser: parseInt(formData.get('maxUsagePerUser') as string) || 1,
      startDate: formData.get('startDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      isHSSVOnly: formData.get('isHSSVOnly') === 'true',
      hssvTiers: discountType === 'hssv_tiered' ? parsedTiers : [],
    };

    startCreateVoucher(async () => {
      const res = await createVoucherAction(voucherData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateVoucherModal(false);
        fetchVouchers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 2. Chỉnh sửa Voucher
  const handleEditVoucherSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!selectedVoucher) return;
    const formData = new FormData(e.currentTarget);
    const discountType = formData.get('discountType') as string;
    const isActive = formData.get('isActive') === 'true';
    const expiryDate = formData.get('expiryDate') as string;

    // NGHIỆP VỤ: Nếu voucher đã hết hạn thì không cho phép kích hoạt (isActive = true)
    const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false;
    if (isExpired && isActive) {
      setAlert({
        type: 'error',
        message:
          'Mã voucher đã quá ngày hết hạn sử dụng, không thể chuyển sang trạng thái kích hoạt!',
      });
      return;
    }

    const parsedTiers: HSSVTier[] = [];
    if (discountType === 'hssv_tiered') {
      const minValInputs = formData.getAll('tierMinOrderValue');
      const discountValInputs = formData.getAll('tierDiscountAmount');
      for (let i = 0; i < minValInputs.length; i++) {
        if (minValInputs[i] && discountValInputs[i]) {
          parsedTiers.push({
            minOrderValue: parseFloat(minValInputs[i] as string) || 0,
            discountAmount: parseFloat(discountValInputs[i] as string) || 0,
          });
        }
      }
    }

    const voucherData = {
      description: formData.get('description') as string,
      discountType,
      discountValue:
        discountType === 'hssv_tiered'
          ? undefined
          : parseFloat(formData.get('discountValue') as string) || 0,
      maxDiscount: formData.get('maxDiscount')
        ? parseFloat(formData.get('maxDiscount') as string)
        : undefined,
      minOrderAmount: parseFloat(formData.get('minOrderAmount') as string) || 0,
      usageLimit: parseInt(formData.get('usageLimit') as string) || 100,
      maxUsagePerUser: parseInt(formData.get('maxUsagePerUser') as string) || 1,
      startDate: formData.get('startDate') as string,
      expiryDate: expiryDate,
      isHSSVOnly: formData.get('isHSSVOnly') === 'true',
      hssvTiers: discountType === 'hssv_tiered' ? parsedTiers : [],
      isActive: isActive,
    };

    startEditVoucher(async () => {
      const res = await updateVoucherAction(selectedVoucher._id, voucherData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditVoucherModal(false);
        fetchVouchers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 3. Xóa Voucher
  const confirmDeleteVoucher = async () => {
    if (!selectedVoucher) return;
    const res = await deleteVoucherAction(selectedVoucher._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteVoucherModal(false);
      fetchVouchers();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return {
    alert,
    setAlert,
    vouchersData,
    voucherSearch,
    setVoucherSearch,
    vouchersFilter,
    setVouchersFilter,
    filteredVouchers,
    voucherLoading,
    showCreateVoucherModal,
    setShowCreateVoucherModal,
    showEditVoucherModal,
    setShowEditVoucherModal,
    showDeleteVoucherModal,
    setShowDeleteVoucherModal,
    selectedVoucher,
    setSelectedVoucher,
    createVoucherPending,
    editVoucherPending,
    voucherDiscountType,
    setVoucherDiscountType,
    hssvTiers,
    setHssvTiers,
    handleCreateVoucherSubmit,
    handleEditVoucherSubmit,
    confirmDeleteVoucher,
    fetchVouchers,
  };
}
