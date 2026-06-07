import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, submitProductReview, getReviewsByOrderId } from './review-actions';

export function useReview(orderId: string) {
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setLoading(true);
      const res = await getOrderById(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
        
        // Kiểm tra thời hạn 30 ngày kể từ lúc giao thành công (deliveredAt)
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const isPast30Days = res.data.deliveredAt
          ? Date.now() - new Date(res.data.deliveredAt).getTime() > thirtyDays
          : false;

        if (isPast30Days) {
          setIsExpired(true);
        }

        // Tải các đánh giá cũ nếu có
        let existingReviews: any[] = [];
        try {
          const revRes = await getReviewsByOrderId(orderId);
          if (revRes.success && Array.isArray(revRes.data)) {
            existingReviews = revRes.data;
          }
        } catch (e) {
          console.error('Lỗi khi tải đánh giá cũ:', e);
        }

        // Khởi tạo rating và bình luận cho mỗi sản phẩm
        const initialRatings: Record<string, number> = {};
        const initialComments: Record<string, string> = {};
        res.data.orderItems?.forEach((item: any) => {
          const productId = typeof item.product === 'object' && item.product ? item.product._id : item.product;
          
          const matchedReview = existingReviews.find((r) => r.product === productId);
          initialRatings[productId] = matchedReview ? matchedReview.rating : 5; // Mặc định 5 sao hoặc số sao cũ
          initialComments[productId] = matchedReview ? matchedReview.content : ''; // Bình luận cũ hoặc rỗng
        });
        setRatings(initialRatings);
        setComments(initialComments);
      } else {
        setAlert({ type: 'error', message: res.message || 'Không tìm thấy đơn hàng' });
      }
      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const updateRating = (productId: string, rating: number) => {
    if (isExpired) return;
    setRatings((prev) => ({ ...prev, [productId]: rating }));
  };

  const updateComment = (productId: string, comment: string) => {
    if (isExpired) return;
    setComments((prev) => ({ ...prev, [productId]: comment }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !order.orderItems || order.orderItems.length === 0) return;
    if (isExpired) {
      setAlert({ type: 'error', message: 'Đã quá thời hạn 30 ngày kể từ khi nhận hàng, không thể gửi hoặc sửa đánh giá.' });
      return;
    }

    setSubmitting(true);
    try {
      // Gửi đánh giá cho từng sản phẩm trong đơn hàng
      const reviewPromises = order.orderItems.map((item: any) => {
        const productId = typeof item.product === 'object' && item.product ? item.product._id : item.product;
        const rating = ratings[productId] || 5;
        const content = comments[productId]?.trim() || 'Sản phẩm tuyệt vời!';
        
        return submitProductReview(productId, { rating, content, orderId });
      });

      const results = await Promise.allSettled(reviewPromises);
      const failed = results.filter(r => r.status === 'rejected');
      
      if (failed.length > 0) {
        setAlert({ type: 'error', message: 'Gửi một số đánh giá thất bại.' });
      } else {
        setAlert({ type: 'success', message: 'Đã lưu đánh giá sản phẩm thành công!' });
        setTimeout(() => {
          router.replace('/profile/orders');
        }, 1500);
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Lỗi hệ thống khi gửi đánh giá' });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    order,
    loading,
    ratings,
    comments,
    submitting,
    isExpired,
    alert,
    setAlert,
    updateRating,
    updateComment,
    handleSubmit,
  };
}
