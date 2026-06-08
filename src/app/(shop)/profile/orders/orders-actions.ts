export async function getMyOrders() {
  const res = await fetch('/api/orders');
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể tải đơn hàng');
  }
  return res.json();
}

export async function cancelOrder(orderId: string) {
  const res = await fetch(`/api/orders/${orderId}/cancel`, {
    method: 'PUT',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể hủy đơn hàng');
  }
  return res.json();
}

export async function confirmOrderReceived(orderId: string) {
  const res = await fetch(`/api/orders/${orderId}/receive`, {
    method: 'PUT',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể xác nhận nhận hàng');
  }
  return res.json();
}

export async function getReviewsByOrderId(orderId: string) {
  const res = await fetch(`/api/reviews/order/${orderId}`);
  if (!res.ok) {
    return { success: false, data: [] };
  }
  return res.json();
}
