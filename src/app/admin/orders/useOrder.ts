'use client';

import { useEffect, useState } from 'react';
import {
  getOrdersAction,
  updateOrderToDeliveredAction,
  deleteOrderAction,
} from './order-actions';

export function useOrder() {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Tự động ẩn alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Tải danh sách đơn hàng
  const fetchOrders = async () => {
    setOrderLoading(true);
    const res = await getOrdersAction();
    if (res.success) {
      setOrdersData(res.orders);
    } else {
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách đơn hàng.' });
    }
    setOrderLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Lọc đơn hàng phía client
  const filteredOrders = ordersData.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(orderSearch);

    const matchesStatus =
      orderStatusFilter === 'all'
        ? true
        : orderStatusFilter === 'paid'
          ? o.isPaid
          : orderStatusFilter === 'unpaid'
            ? !o.isPaid
            : orderStatusFilter === 'delivered'
              ? o.isDelivered
              : orderStatusFilter === 'pending'
                ? !o.isDelivered
                : o.orderStatus === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Xác nhận đã giao hàng
  const handleShipOrder = async (id: string) => {
    const res = await updateOrderToDeliveredAction(id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev: any) => ({
          ...prev,
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
          orderStatus: 'Đã hoàn thành',
        }));
      }
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // Xóa đơn hàng
  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;
    const res = await deleteOrderAction(selectedOrder._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteOrderModal(false);
      setShowOrderDetailsModal(false);
      fetchOrders();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return {
    alert,
    ordersData,
    orderLoading,
    filteredOrders,
    selectedOrder,
    setSelectedOrder,
    showOrderDetailsModal,
    setShowOrderDetailsModal,
    showDeleteOrderModal,
    setShowDeleteOrderModal,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    handleShipOrder,
    confirmDeleteOrder,
    fetchOrders,
  };
}
