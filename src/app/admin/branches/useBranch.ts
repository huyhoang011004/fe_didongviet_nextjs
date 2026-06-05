'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  getBranchesAction,
  createBranchAction,
  updateBranchAction,
  deleteBranchAction,
} from './branch-actions';

export function useBranch() {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [branchesData, setBranchesData] = useState<any[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any | null>(null);

  const [createPending, startCreate] = useTransition();
  const [editPending, startEdit] = useTransition();

  // Tự động ẩn alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Tải danh sách chi nhánh
  const fetchBranches = async () => {
    setBranchLoading(true);
    const res = await getBranchesAction();
    if (res.success) {
      setBranchesData(res.branches);
    } else {
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách chi nhánh.' });
    }
    setBranchLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Lọc + tìm kiếm phía client
  const filteredBranches = branchesData.filter((b) => {
    const matchSearch =
      !branchSearch ||
      b.name?.toLowerCase().includes(branchSearch.toLowerCase()) ||
      b.address?.toLowerCase().includes(branchSearch.toLowerCase()) ||
      b.phone?.toLowerCase().includes(branchSearch.toLowerCase()) ||
      b.managerName?.toLowerCase().includes(branchSearch.toLowerCase());

    const matchFilter =
      branchFilter === 'all' ||
      (branchFilter === 'active' && b.isActive) ||
      (branchFilter === 'inactive' && !b.isActive);

    return matchSearch && matchFilter;
  });

  // Tạo chi nhánh mới
  const handleCreateSubmit = async (formData: {
    name: string;
    address: string;
    phone: string;
    managerName?: string;
    isActive: boolean;
  }) => {
    startCreate(async () => {
      const res = await createBranchAction(formData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateModal(false);
        fetchBranches();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // Cập nhật chi nhánh
  const handleEditSubmit = async (formData: {
    name: string;
    address: string;
    phone: string;
    managerName?: string;
    isActive: boolean;
  }) => {
    if (!selectedBranch) return;
    startEdit(async () => {
      const res = await updateBranchAction(selectedBranch._id, formData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditModal(false);
        fetchBranches();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // Xóa chi nhánh
  const confirmDelete = async () => {
    if (!selectedBranch) return;
    const res = await deleteBranchAction(selectedBranch._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteModal(false);
      fetchBranches();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return {
    alert,
    branchesData,
    branchLoading,
    branchSearch,
    setBranchSearch,
    branchFilter,
    setBranchFilter,
    filteredBranches,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedBranch,
    setSelectedBranch,
    createPending,
    editPending,
    handleCreateSubmit,
    handleEditSubmit,
    confirmDelete,
    fetchBranches,
  };
}
