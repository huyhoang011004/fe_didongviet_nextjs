import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, submitProductReview, getReviewsByOrderId } from './review-actions';

export function useReview(orderId: string) {
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  // File upload states per product ID
  const [reviewImages, setReviewImages] = useState<Record<string, File[]>>({});
  const [reviewVideo, setReviewVideo] = useState<Record<string, File | undefined>>({});

  // Preview URLs states per product ID
  const [imagePreviews, setImagePreviews] = useState<Record<string, string[]>>({});
  const [videoPreview, setVideoPreview] = useState<Record<string, string | undefined>>({});

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
        const initialImagePreviews: Record<string, string[]> = {};
        const initialVideoPreviews: Record<string, string | undefined> = {};

        res.data.orderItems?.forEach((item: any) => {
          const productId = typeof item.product === 'object' && item.product ? item.product._id : item.product;

          const matchedReview = existingReviews.find((r) => r.product === productId);
          initialRatings[productId] = matchedReview ? matchedReview.rating : 5; // Mặc định 5 sao hoặc số sao cũ
          initialComments[productId] = matchedReview ? matchedReview.content : ''; // Bình luận cũ hoặc rỗng
          initialImagePreviews[productId] = matchedReview && matchedReview.images ? matchedReview.images : [];
          initialVideoPreviews[productId] = matchedReview && matchedReview.video ? matchedReview.video : undefined;
        });

        setRatings(initialRatings);
        setComments(initialComments);
        setImagePreviews(initialImagePreviews);
        setVideoPreview(initialVideoPreviews);
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

  const handleAddImages = (productId: string, files: FileList | null) => {
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

    setReviewImages((prev) => {
      const currentList = prev[productId] || [];
      const updatedList = [...currentList, ...validFiles].slice(0, 6);

      // Update image previews
      const previews = updatedList.map(f => URL.createObjectURL(f));
      setImagePreviews((prevPreviews) => ({ ...prevPreviews, [productId]: previews }));

      return { ...prev, [productId]: updatedList };
    });
  };

  const handleRemoveImage = (productId: string, index: number) => {
    setReviewImages((prev) => {
      const currentList = prev[productId] || [];
      const updatedList = currentList.filter((_, i) => i !== index);

      // Clean up revoke object url for deleted file
      if (imagePreviews[productId]?.[index] && imagePreviews[productId][index].startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews[productId][index]);
      }

      const previews = (imagePreviews[productId] || []).filter((_, i) => i !== index);
      setImagePreviews((prevPreviews) => ({ ...prevPreviews, [productId]: previews }));

      return { ...prev, [productId]: updatedList };
    });
  };

  const handleAddVideo = (productId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const isVideo = file.type.startsWith('video/');
    if (!isVideo) {
      setAlert({ type: 'error', message: 'Vui lòng chỉ chọn tệp video!' });
      return;
    }

    // Preview and validate duration if possible
    const previewUrl = URL.createObjectURL(file);
    const videoElement = document.createElement('video');
    videoElement.src = previewUrl;
    videoElement.onloadedmetadata = () => {
      if (videoElement.duration > 60) {
        setAlert({ type: 'error', message: 'Thời lượng video tối đa là 1 phút!' });
        URL.revokeObjectURL(previewUrl);
        return;
      }

      setReviewVideo((prev) => ({ ...prev, [productId]: file }));
      setVideoPreview((prev) => ({ ...prev, [productId]: previewUrl }));
    };
  };

  const handleRemoveVideo = (productId: string) => {
    if (videoPreview[productId] && videoPreview[productId]?.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview[productId]!);
    }
    setReviewVideo((prev) => ({ ...prev, [productId]: undefined }));
    setVideoPreview((prev) => ({ ...prev, [productId]: undefined }));
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
        const imagesList = reviewImages[productId] || [];
        const videoFile = reviewVideo[productId];

        return submitProductReview(productId, {
          rating,
          content,
          orderId,
          reviewImages: imagesList,
          reviewVideo: videoFile
        });
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
    imagePreviews,
    videoPreview,
    submitting,
    isExpired,
    alert,
    setAlert,
    updateRating,
    updateComment,
    handleAddImages,
    handleRemoveImage,
    handleAddVideo,
    handleRemoveVideo,
    handleSubmit,
  };
}
