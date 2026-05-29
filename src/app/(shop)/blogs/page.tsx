'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  ChevronRight,
  Clock,
  User,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function NewsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/blogs`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setBlogs(data.data || []);
          }
        }
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>
            DĐV
          </div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>
          Đang tải tin tức 24h...
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-12'>
      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-6xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link
            href='/'
            className='hover:text-didongviet-red transition-colors'
          >
            Trang chủ
          </Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold'>Tin tức 24h</span>
        </div>
      </nav>

      {/* HEADER BANNER */}
      <section className='bg-white py-8 border-b border-slate-100 mb-8'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='h-10 w-10 rounded-xl bg-red-50 text-didongviet-red flex items-center justify-center'>
              <Newspaper size={20} />
            </div>
            <h1 className='text-xl sm:text-2xl font-black tracking-tight text-slate-800 uppercase'>
              TIN TỨC CÔNG NGHỆ 24H
            </h1>
          </div>
          <p className='text-xs text-slate-500 font-medium max-w-2xl'>
            Cập nhật liên tục những thông tin công nghệ mới nhất, đánh giá sản
            phẩm chuyên sâu và các chương trình khuyến mãi hấp dẫn từ Di Động
            Việt.
          </p>
        </div>
      </section>

      {/* BLOG LIST */}
      <div className='max-w-6xl mx-auto px-4'>
        {blogs.length === 0 ? (
          <div className='bg-white rounded-2xl border border-slate-100 p-12 text-center'>
            <Newspaper size={40} className='mx-auto text-slate-300 mb-3' />
            <h2 className='text-sm font-black text-slate-800 uppercase'>
              Chưa có bài viết nào
            </h2>
            <p className='text-xs text-slate-500 mt-2'>
              Hãy quay lại sau để cập nhật tin tức mới nhất nhé!
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className='bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col'
              >
                {/* Thumbnail */}
                <Link
                  href={`/news/${blog.slug}`}
                  className='relative aspect-[16/9] overflow-hidden block bg-slate-100'
                >
                  <img
                    src={blog.featuredImage || '/placeholder-product.png'}
                    alt={blog.title}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute top-3 left-3 px-2.5 py-1 bg-didongviet-red text-white text-[9px] font-black uppercase rounded shadow-sm'>
                    {blog.category}
                  </div>
                </Link>

                {/* Content */}
                <div className='p-5 flex-1 flex flex-col'>
                  <div className='flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-3'>
                    <div className='flex items-center gap-1'>
                      <Clock size={12} />{' '}
                      {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <div className='flex items-center gap-1'>
                      <User size={12} /> {blog.author?.name || 'Admin'}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Eye size={12} /> {blog.views} lượt xem
                    </div>
                  </div>

                  <Link
                    href={`/news/${blog.slug}`}
                    className='block group-hover:text-didongviet-red transition-colors'
                  >
                    <h3 className='text-sm font-black text-slate-800 leading-snug mb-2 line-clamp-2'>
                      {blog.title}
                    </h3>
                  </Link>

                  <p className='text-[11px] text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1'>
                    {blog.summary}
                  </p>

                  <Button
                    asChild
                    variant='ghost'
                    className='w-full justify-between px-0 h-auto font-bold text-xs text-didongviet-red hover:text-didongviet-dark-red hover:bg-transparent'
                  >
                    <Link href={`/news/${blog.slug}`}>
                      <span>Xem chi tiết</span>
                      <ArrowRight
                        size={14}
                        className='transition-transform group-hover:translate-x-1'
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
