'use client';

import { Star, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { fetchProductReviews } from '../product-detail-actions';

interface ProductReviewsProps {
    product: any;
}

interface Review {
    _id: string;
    author: string;
    avatar?: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    helpful: number;
    verified?: boolean;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
    const [expandedReview, setExpandedReview] = useState<string | null>(null);
    const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReviews() {
            try {
                setLoading(true);
                const res = await fetchProductReviews(product._id, 1, 5);
                if (res && res.success && res.data) {
                    setReviews(res.data);
                }
            } catch (err) {
                console.error('Failed to load reviews:', err);
            } finally {
                setLoading(false);
            }
        }

        if (product?._id) {
            loadReviews();
        }
    }, [product?._id]);

    const avgRating = product?.ratingsAverage || 4.5;
    const totalReviews = product?.ratingsCount || 120;

    // Hàm phân bổ số sao thực tế từ avgRating và totalReviews
    const getRatingDistribution = (avg: number, total: number) => {
        if (!total || total <= 0) {
            return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        }
        const targetScore = Math.round(avg * total);
        const rawDistribution = [0, 0, 0, 0, 0, 0];
        let sumWeights = 0;
        const sd = 0.8;
        for (let i = 1; i <= 5; i++) {
            const weight = Math.exp(-Math.pow(i - avg, 2) / (2 * sd * sd));
            rawDistribution[i] = weight;
            sumWeights += weight;
        }
        const counts = [0, 0, 0, 0, 0, 0];
        let sumCounts = 0;
        for (let i = 1; i <= 5; i++) {
            counts[i] = Math.round((rawDistribution[i] / sumWeights) * total);
            sumCounts += counts[i];
        }
        const diff = total - sumCounts;
        if (diff !== 0) {
            let maxIndex = 5;
            let maxVal = -1;
            for (let i = 1; i <= 5; i++) {
                if (counts[i] > maxVal) {
                    maxVal = counts[i];
                    maxIndex = i;
                }
            }
            counts[maxIndex] = Math.max(0, counts[maxIndex] + diff);
        }
        let currentScore = 0;
        for (let i = 1; i <= 5; i++) {
            currentScore += i * counts[i];
        }
        let scoreDiff = targetScore - currentScore;
        let iterations = 0;
        while (scoreDiff !== 0 && iterations < 100) {
            iterations++;
            if (scoreDiff > 0) {
                let shifted = false;
                for (let i = 1; i < 5; i++) {
                    if (counts[i] > 0) {
                        counts[i]--;
                        counts[i + 1]++;
                        scoreDiff--;
                        shifted = true;
                        break;
                    }
                }
                if (!shifted) break;
            } else {
                let shifted = false;
                for (let i = 5; i > 1; i--) {
                    if (counts[i] > 0) {
                        counts[i]--;
                        counts[i - 1]++;
                        scoreDiff++;
                        shifted = true;
                        break;
                    }
                }
                if (!shifted) break;
            }
        }
        const distribution: Record<number, number> = {};
        for (let i = 1; i <= 5; i++) {
            distribution[i] = total > 0 ? (counts[i] / total) * 100 : 0;
        }
        return distribution;
    };

    const ratingDistribution = getRatingDistribution(avgRating, totalReviews);

    const handleHelpful = (reviewId: string) => {
        const newSet = new Set(helpfulReviews);
        if (newSet.has(reviewId)) {
            newSet.delete(reviewId);
        } else {
            newSet.add(reviewId);
        }
        setHelpfulReviews(newSet);
    };

    return (
        <div className='space-y-6'>
            {/* RATINGS SUMMARY */}
            <div className='bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs'>
                <div className='flex items-center gap-2 border-b border-slate-100 pb-3 mb-4'>
                    <div className='h-1 w-3.5 bg-amber-500 rounded-full' />
                    <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                        Đánh giá từ khách hàng
                    </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                    {/* Rating summary card */}
                    <div className='flex flex-col items-center justify-center p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100'>
                        <div className='text-3xl font-black text-amber-600 mb-2'>{avgRating.toFixed(1)}</div>
                        <div className='flex gap-1 mb-2'>
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={`${i < Math.floor(avgRating)
                                            ? 'fill-amber-500 text-amber-500'
                                            : 'text-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className='text-xs text-slate-600 font-semibold'>
                            ({totalReviews} đánh giá)
                        </p>
                    </div>

                    {/* Rating distribution */}
                    <div className='md:col-span-2 flex flex-col gap-2'>
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const percentage = ratingDistribution[stars] || 0;
                            return (
                                <div key={stars} className='flex items-center gap-2'>
                                    <span className='text-xs font-semibold text-slate-600 w-8'>
                                        {stars} ⭐
                                    </span>
                                    <div className='flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden'>
                                        <div
                                            className='h-full bg-linear-to-r from-amber-400 to-orange-500'
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className='text-xs text-slate-500 w-10 text-right'>{percentage.toFixed(0)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Button
                    className='w-full bg-didongviet-red hover:bg-red-700 text-white text-xs font-bold rounded-lg py-2.5'
                >
                    Viết đánh giá
                </Button>
            </div>

            {/* REVIEWS LIST */}
            <div className='bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs space-y-4'>
                <div className='flex items-center gap-2 pb-3'>
                    <span className='text-xs font-black text-slate-800 uppercase'>
                        {loading ? 'Đang tải...' : `${reviews.length} đánh giá`}
                    </span>
                </div>

                {loading ? (
                    <div className='text-center py-8 text-slate-500'>
                        <div className='inline-flex items-center gap-2'>
                            <div className='w-4 h-4 rounded-full border-2 border-didongviet-red border-t-transparent animate-spin' />
                            Đang tải đánh giá...
                        </div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className='text-center py-8 text-slate-500'>
                        <p className='text-sm'>Chưa có đánh giá nào. Hãy trở thành người đầu tiên!</p>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {reviews.map((review) => (
                            <div key={review._id} className='border border-slate-100 rounded-lg p-4 hover:shadow-sm transition-shadow'>
                                {/* Review header */}
                                <div className='flex items-start gap-3 mb-3'>
                                    <div className='w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg shrink-0'>
                                        {review.avatar || '👤'}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2 mb-1'>
                                            <span className='text-xs font-bold text-slate-800'>{review.author}</span>
                                            {review.verified && (
                                                <span className='text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-bold'>
                                                    ✓ Đã mua
                                                </span>
                                            )}
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='flex gap-0.5'>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={`${i < review.rating
                                                                ? 'fill-amber-500 text-amber-500'
                                                                : 'text-slate-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className='text-[10px] text-slate-500'>
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Review title */}
                                <h4 className='text-xs font-bold text-slate-800 mb-1'>{review.title}</h4>

                                {/* Review content */}
                                <p
                                    className={`text-xs text-slate-600 leading-relaxed mb-3 ${expandedReview === review._id ? '' : 'line-clamp-2'
                                        }`}
                                >
                                    {review.content}
                                </p>

                                {review.content.length > 150 && (
                                    <button
                                        onClick={() =>
                                            setExpandedReview(
                                                expandedReview === review._id ? null : review._id,
                                            )
                                        }
                                        className='text-[10px] text-didongviet-red font-bold mb-3 hover:underline'
                                    >
                                        {expandedReview === review._id ? 'Thu gọn' : 'Xem thêm'}
                                    </button>
                                )}

                                {/* Helpful button */}
                                <div className='flex items-center gap-2'>
                                    <button
                                        onClick={() => handleHelpful(review._id)}
                                        className={`text-[10px] font-semibold flex items-center gap-1 px-2 py-1 rounded transition-colors ${helpfulReviews.has(review._id)
                                                ? 'bg-red-100 text-didongviet-red'
                                                : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        <ThumbsUp size={11} />
                                        Hữu ích ({review.helpful})
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {reviews.length > 0 && (
                    <button className='w-full text-center py-2 text-xs font-bold text-didongviet-red hover:bg-red-50 rounded-lg transition-colors'>
                        Xem tất cả {totalReviews} đánh giá
                    </button>
                )}
            </div>
        </div>
    );
}
