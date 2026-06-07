import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, submitReturnRequest } from './return-actions';

export function useReturn(orderId: string) {
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('Sản phẩm bị lỗi kỹ thuật');
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      setLoading(true);
      const res = await getOrderById(orderId);
      if (res.success && res.data) {
        setOrder(res.data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setAlert({ type: 'error', message: 'Vui lòng điền chi tiết lý do hoàn trả' });
      return;
    }

    setSubmitting(true);
    try {
      const fullReason = `[${selectedReason}] - ${reason}`;
      const res = await submitReturnRequest(orderId, {
        reason: fullReason,
        images,
        videos,
      });

      if (res.success) {
        setAlert({ type: 'success', message: 'Gửi yêu cầu trả hàng/hoàn tiền thành công!' });
        setTimeout(() => {
          router.replace('/profile/orders');
        }, 1500);
      } else {
        setAlert({ type: 'error', message: res.message || 'Lỗi khi gửi yêu cầu' });
        setSubmitting(false);
      }
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message || 'Lỗi hệ thống khi gửi yêu cầu' });
      setSubmitting(false);
    }
  };

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    if (images.length >= 6) {
      setAlert({ type: 'error', message: 'Tối đa chỉ được đính kèm 6 hình ảnh' });
      return;
    }
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVideo = (url: string) => {
    if (!url.trim()) return;
    if (videos.length >= 1) {
      setAlert({ type: 'error', message: 'Tối đa chỉ được đính kèm 1 video' });
      return;
    }
    setVideos((prev) => [...prev, url]);
  };

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    order,
    loading,
    reason,
    setReason,
    selectedReason,
    setSelectedReason,
    images,
    setImages,
    videos,
    setVideos,
    submitting,
    alert,
    handleSubmit,
    handleAddImage,
    handleRemoveImage,
    handleAddVideo,
    handleRemoveVideo,
  };
}
