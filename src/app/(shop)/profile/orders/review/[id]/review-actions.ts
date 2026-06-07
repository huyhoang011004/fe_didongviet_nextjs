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

export async function submitProductReview(
  productId: string,
  payload: { rating: number; content: string; orderId: string; reviewImages?: File[]; reviewVideo?: File }
) {
  const formData = new FormData();
  formData.append('rating', payload.rating.toString());
  formData.append('content', payload.content);
  formData.append('orderId', payload.orderId);

  if (payload.reviewImages && payload.reviewImages.length > 0) {
    payload.reviewImages.forEach((imgFile) => {
      formData.append('reviewImages', imgFile);
    });
  }

  if (payload.reviewVideo) {
    formData.append('reviewVideo', payload.reviewVideo);
  }

  const res = await fetch(`/api/reviews/product/${productId}`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể gửi đánh giá');
  }
  return res.json();
}

export async function getReviewsByOrderId(orderId: string) {
  const res = await fetch(`/api/reviews/order/${orderId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể tải thông tin đánh giá');
  }
  return res.json();
}
