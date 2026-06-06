'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface BlogSectionProps {
  loading: boolean;
  blogs: any[];
}

export default function BlogSection({
  loading,
  blogs,
}: BlogSectionProps) {
  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between border-b border-slate-200 pb-3'>
        <div className='flex items-center gap-2'>
          <div className='h-1 w-3.5 bg-purple-600 rounded-full' />
          <h2 className='text-sm sm:text-base font-black text-slate-800 uppercase tracking-tight'>
            TIN TỨC CÔNG NGHỆ
          </h2>
        </div>

        <Button
          asChild
          variant='ghost'
          size='sm'
          className='text-[10px] text-purple-600 font-bold hover:bg-purple-50 rounded-xl cursor-pointer h-7'
        >
          <Link href='/blogs' className='flex items-center gap-1'>
            <span>Xem tất cả</span>
            <ArrowRight size={11} />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='bg-white h-[200px] rounded-xl border border-slate-100'
            />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className='text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white'>
          <Calendar size={36} className='mx-auto text-gray-300 mb-2' />
          <p className='text-xs font-semibold'>
            Chưa có tin công nghệ nào. Quay lại sau!
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {blogs.map((b) => (
            <Link
              key={b._id}
              href={`/blogs/${b.slug || b._id}`}
              className='bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between'
            >
              <div className='space-y-3'>
                <div className='h-40 w-full bg-slate-100 overflow-hidden relative'>
                  <img
                    src={b.featuredImage || '/placeholder-blog.png'}
                    alt={b.title}
                    className='h-full w-full object-cover group-hover:scale-105 transition-transform'
                  />
                  <span className='absolute top-2 left-2 z-10 px-2 py-0.5 bg-purple-600 text-white text-[9px] font-black rounded-md shadow uppercase'>
                    {b.category || 'TIN MỚI'}
                  </span>
                </div>

                <div className='px-4 space-y-1.5'>
                  <span className='text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1'>
                    <Calendar size={9} />
                    <span>
                      {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </span>
                  <span className='font-black text-slate-800 text-xs sm:text-sm group-hover:text-purple-600 block line-clamp-2 leading-snug'>
                    {b.title}
                  </span>
                  <p className='text-[10px] text-gray-500 leading-relaxed font-medium line-clamp-2'>
                    {b.summary}
                  </p>
                </div>
              </div>

              <div className='px-4 pb-4 pt-2'>
                <span className='inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 group-hover:text-purple-700 group-hover:underline'>
                  <span>Đọc bài viết</span>
                  <ArrowRight size={10} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
