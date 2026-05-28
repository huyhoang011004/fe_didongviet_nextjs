'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Clock, User, Eye, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchBlog() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/blogs/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setBlog(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load blog detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8'>
        <div className='relative flex items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-3 border-didongviet-red border-t-transparent' />
          <div className='absolute text-[9px] font-bold text-didongviet-red uppercase tracking-wider animate-pulse'>DĐV</div>
        </div>
        <p className='mt-3 text-xs font-medium text-slate-500 animate-pulse'>Đang tải nội dung...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center'>
        <h2 className='text-sm font-black text-slate-800 uppercase mb-2'>Bài viết không tồn tại</h2>
        <p className='text-[11px] text-gray-500 mb-4'>Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc URL không chính xác.</p>
        <Button onClick={() => router.push('/news')} className='bg-didongviet-red text-white text-xs font-bold rounded-xl h-9'>
          <ArrowLeft size={14} className='mr-1.5' /> Về trang Tin Tức
        </Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-700 pb-12'>
      {/* BREADCRUMB */}
      <nav className='bg-white border-b border-slate-100 py-2.5'>
        <div className='max-w-3xl mx-auto px-4 flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold'>
          <Link href='/' className='hover:text-didongviet-red transition-colors'>Trang chủ</Link>
          <ChevronRight size={10} />
          <Link href='/news' className='hover:text-didongviet-red transition-colors'>Tin tức</Link>
          <ChevronRight size={10} />
          <span className='text-slate-800 font-bold truncate max-w-[200px]'>{blog.title}</span>
        </div>
      </nav>

      <main className='max-w-3xl mx-auto px-4 py-8 bg-white my-6 rounded-2xl border border-slate-100 shadow-xs'>
        
        {/* HEADER */}
        <header className='mb-6'>
          <div className='inline-block px-2.5 py-1 bg-red-50 text-didongviet-red text-[10px] font-black uppercase rounded shadow-xs mb-4'>
            {blog.category}
          </div>
          <h1 className='text-xl sm:text-2xl font-black text-slate-800 leading-tight mb-4'>
            {blog.title}
          </h1>
          
          <div className='flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-semibold pb-4 border-b border-slate-100'>
            <div className='flex items-center gap-1.5'><Clock size={14} className='text-slate-400' /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</div>
            <div className='flex items-center gap-1.5'><User size={14} className='text-slate-400' /> {blog.author?.name || 'Di Động Việt'}</div>
            <div className='flex items-center gap-1.5'><Eye size={14} className='text-slate-400' /> {blog.views} lượt xem</div>
          </div>
        </header>

        {/* SUMMARY */}
        <div className='bg-slate-50 p-4 rounded-xl border-l-4 border-didongviet-red text-xs font-semibold text-slate-700 leading-relaxed mb-8'>
          {blog.summary}
        </div>

        {/* CONTENT */}
        <article 
          className='prose prose-sm sm:prose-base prose-slate max-w-none mb-10 prose-img:rounded-xl prose-img:w-full prose-img:object-cover prose-headings:font-black prose-a:text-didongviet-red'
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* TAGS */}
        {blog.tags && blog.tags.length > 0 && (
          <div className='flex items-center gap-2 pt-6 border-t border-slate-100'>
            <Tag size={16} className='text-slate-400' />
            <div className='flex flex-wrap gap-2'>
              {blog.tags.map((tag: string, idx: number) => (
                <span key={idx} className='px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-colors cursor-pointer'>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
