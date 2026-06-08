import { getMyOrders } from '../../orders-actions';

export async function getOrderById(orderId: string) {
  try {
    const data = await getMyOrders();
    if (data.success && Array.isArray(data.data)) {
      const order = data.data.find((o: any) => o._id === orderId);
      if (order) return { success: true, data: order };
    }
    return { success: false, message: 'Không tìm thấy đơn hàng' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Không thể lấy thông tin đơn hàng' };
  }
}

export async function submitReturnRequest(
  orderId: string,
  payload: { reason: string; returnImages?: File[]; returnVideo?: File }
) {
  const formData = new FormData();
  formData.append('reason', payload.reason);

  if (payload.returnImages && payload.returnImages.length > 0) {
    payload.returnImages.forEach((imgFile) => {
      formData.append('returnImages', imgFile);
    });
  }

  if (payload.returnVideo) {
    formData.append('returnVideo', payload.returnVideo);
  }

  const res = await fetch(`/api/orders/${orderId}/return`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể gửi yêu cầu trả hàng');
  }
  return res.json();
}
