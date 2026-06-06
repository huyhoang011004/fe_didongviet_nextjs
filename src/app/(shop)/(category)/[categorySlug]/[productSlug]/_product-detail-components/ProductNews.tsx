'use client';

import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchProductNews } from '../product-detail-actions';

interface ProductNewsProps {
    product: any;
}

interface NewsArticle {
    _id: string;
    title: string;
    slug: string;
    featuredImage: string;
    summary: string;
    views: number;
    createdAt: string;
    category?: string;
}

export default function ProductNews({ product }: ProductNewsProps) {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadNews() {
            try {
                setLoading(true);
                const res = await fetchProductNews(product?._id, 6);
                if (res && res.success && res.data) {
                    setNews(res.data);
                }
            } catch (err) {
                console.error('Failed to load news:', err);
            } finally {
                setLoading(false);
            }
        }

        if (product?._id) {
            loadNews();
        }
    }, [product?._id]);

    if (loading) {
        return (
            <div className='bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs space-y-4 h-[500px] flex flex-col'>
                <div className='flex items-center gap-2 border-b border-slate-100 pb-3 flex-shrink-0'>
                    <div className='h-1 w-3.5 bg-blue-500 rounded-full' />
                    <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                        Tin tức & Bài viết liên quan
                    </h3>
                </div>
                <div className='flex-1 flex items-center justify-center text-slate-500'>
                    <div className='inline-flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin' />
                        Đang tải bài viết...
                    </div>
                </div>
            </div>
        );
    }

    if (!news || news.length === 0) {
        return null;
    }

    return (
        <div className='bg-white rounded-2xl p-5 md:p-6 border border-slate-100 shadow-xs space-y-4 h-[500px] flex flex-col'>
            <div className='flex items-center gap-2 border-b border-slate-100 pb-3 flex-shrink-0'>
                <div className='h-1 w-3.5 bg-blue-500 rounded-full' />
                <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
                    Tin tức & Bài viết liên quan
                </h3>
            </div>

            {/* Danh sách cuộn dọc */}
            <div className='flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent'>
                {news.map((article) => (
                    <Link
                        key={article._id}
                        href={`/blogs/${article.slug}`}
                        className='group flex gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all duration-300 bg-white'
                    >
                        {/* Thumbnail */}
                        <div className='relative w-24 h-20 overflow-hidden bg-slate-100 rounded-lg shrink-0'>
                            {article.featuredImage ? (
                                <img
                                    src={article.featuredImage}
                                    alt={article.title}
                                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300'>
                                    <span className='text-slate-500 text-[10px]'>Ảnh</span>
                                </div>
                            )}
                            {article.category && (
                                <div className='absolute top-1 left-1'>
                                    <span className='text-[8px] px-1.5 py-0.5 bg-didongviet-red text-white rounded-full font-bold'>
                                        {article.category}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className='flex-1 flex flex-col justify-between min-w-0'>
                            <div className='space-y-1'>
                                {/* Title */}
                                <h4 className='text-xs font-bold text-slate-800 group-hover:text-didongviet-red transition-colors line-clamp-2 leading-snug'>
                                    {article.title}
                                </h4>

                                {/* Excerpt */}
                                <p className='text-[10px] text-slate-500 line-clamp-2 leading-relaxed'>
                                    {article.summary}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className='flex items-center gap-2 text-[9px] text-slate-400 pt-1'>
                                <div className='flex items-center gap-0.5'>
                                    <Clock size={10} />
                                    <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className='flex items-center gap-0.5 ml-auto'>
                                    <Eye size={10} />
                                    <span>{(article.views || 0).toLocaleString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Xem tất cả */}
            <div className='text-center pt-2 border-t border-slate-100 flex-shrink-0'>
                <Link
                    href={`/blogs?keyword=${encodeURIComponent(product?.name || '')}`}
                    className='inline-block text-xs font-bold text-didongviet-red hover:underline'
                >
                    Xem tất cả bài viết
                </Link>
            </div>
        </div>
    );
}
