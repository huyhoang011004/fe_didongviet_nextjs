import { useState, useEffect } from 'react';
import { getMyOrders, cancelOrder, confirmOrderReceived } from './orders-actions';

export const normalizeOrderStatus = (status?: string) => {
  const statusMap: Record<string, string> = {
    'Đang xử lý': 'Chờ xác nhận',
    'Đã xác nhận': 'Chờ lấy hàng',
    'Đang giao hàng': 'Đang giao',
    'Đã hoàn thành': 'Đã giao',
  };

  return statusMap[status || ''] || status || 'Chờ xác nhận';
};

export const normalizeOrder = (order: any) => ({
  ...order,
  orderStatus: normalizeOrderStatus(order.orderStatus),
});

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [receiveConfirmId, setReceiveConfirmId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      if (data.success) {
        setOrders((data.data || []).map(normalizeOrder));
      }
    } catch (err: any) {
      console.error('Lỗi khi tải đơn hàng:', err);
      setAlert({ type: 'error', message: err.message || 'Lỗi khi tải danh sách đơn hàng' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleCancel = async (orderId: string) => {
    setSubmittingId(orderId);
    setCancelConfirmId(null);
    try {
      const data = await cancelOrder(orderId);
      if (data.success) {
        setAlert({ type: 'success', message: 'Hủy đơn hàng thành công và hoàn trả kho!' });
        fetchOrders();
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể hủy đơn hàng này.' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Lỗi kết nối khi gửi yêu cầu hủy đơn.' });
    } finally {
      setSubmittingId(null);
    }
  };

  const handleConfirmReceipt = async (orderId: string) => {
    setSubmittingId(orderId);
    setReceiveConfirmId(null);
    try {
      const data = await confirmOrderReceived(orderId);
      if (data.success) {
        setAlert({ type: 'success', message: 'Xác nhận đã nhận hàng thành công!' });
        fetchOrders();
      } else {
        setAlert({ type: 'error', message: data.message || 'Không thể xác nhận nhận đơn hàng.' });
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Lỗi kết nối khi xác nhận nhận hàng.' });
    } finally {
      setSubmittingId(null);
    }
  };

  const getFilteredOrders = (tabKey: string) => {
    return tabKey === 'all' ? orders : orders.filter((o) => o.orderStatus === tabKey);
  };

  return {
    orders,
    loading,
    activeTab,
    setActiveTab,
    submittingId,
    alert,
    setAlert,
    cancelConfirmId,
    setCancelConfirmId,
    receiveConfirmId,
    setReceiveConfirmId,
    selectedOrder,
    setSelectedOrder,
    handleCancel,
    handleConfirmReceipt,
    getFilteredOrders,
    fetchOrders
  };
}
