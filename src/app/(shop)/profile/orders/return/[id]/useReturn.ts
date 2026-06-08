import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, submitReturnRequest } from './return-actions';

export function useReturn(orderId: string) {
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('Sản phẩm bị lỗi kỹ thuật');

  // File upload states (up to 6 images and 1 video)
  const [returnImages, setReturnImages] = useState<File[]>([]);
  const [returnVideo, setReturnVideo] = useState<File | undefined>(undefined);

  // Local blob previews
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | undefined>(undefined);

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
        returnImages,
        returnVideo,
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

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const incomingFiles = Array.from(files);

    // Validate image files and max limit (6 images)
    const validFiles = incomingFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnder2MB = file.size <= 2 * 1024 * 1024;
      if (!isImage) {
        setAlert({ type: 'error', message: 'Vui lòng chỉ chọn tệp hình ảnh!' });
        return false;
      }
      if (!isUnder2MB) {
        setAlert({ type: 'error', message: 'Kích thước ảnh không quá 2MB!' });
        return false;
      }
      return true;
    });

    setReturnImages((prev) => {
      const updatedList = [...prev, ...validFiles].slice(0, 6);
      const previews = updatedList.map(f => URL.createObjectURL(f));
      setImagePreviews(previews);
      return updatedList;
    });
  };

  const handleRemoveImage = (index: number) => {
    setReturnImages((prev) => {
      const updatedList = prev.filter((_, i) => i !== index);
      if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
      const previews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(previews);
      return updatedList;
    });
  };

  const handleAddVideo = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const isVideo = file.type.startsWith('video/');
    if (!isVideo) {
      setAlert({ type: 'error', message: 'Vui lòng chỉ chọn tệp video!' });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const videoElement = document.createElement('video');
    videoElement.src = previewUrl;
    videoElement.onloadedmetadata = () => {
      if (videoElement.duration > 60) {
        setAlert({ type: 'error', message: 'Thời lượng video tối đa là 1 phút!' });
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setReturnVideo(file);
      setVideoPreview(previewUrl);
    };
  };

  const handleRemoveVideo = () => {
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
    setReturnVideo(undefined);
    setVideoPreview(undefined);
  };

  return {
    order,
    loading,
    reason,
    setReason,
    selectedReason,
    setSelectedReason,
    imagePreviews,
    videoPreview,
    submitting,
    alert,
    handleSubmit,
    handleAddImages,
    handleRemoveImage,
    handleAddVideo,
    handleRemoveVideo,
  };
}
