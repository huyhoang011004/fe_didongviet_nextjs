import React from 'react';
import { Eye, EyeOff, Edit, Trash2, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Blog } from '@/types/blog';

interface BlogTableProps {
  blogLoading: boolean;
  blogsData: Blog[];
  blogsPage: number;
  blogsTotalPages: number;
  blogsTotalCount: number;
  setBlogsPage: (page: number) => void;
  onToggleActive: (id: string) => void;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}

export function BlogTable({
  blogLoading,
  blogsData,
  blogsPage,
  blogsTotalPages,
  blogsTotalCount,
  setBlogsPage,
  onToggleActive,
  onEdit,
  onDelete,
}: BlogTableProps) {
  return (
    <div className='p-0 overflow-x-auto'>
      {blogLoading ? (
        <div className='flex flex-col items-center justify-center p-20'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang lấy danh sách tin tức công nghệ...
          </span>
        </div>
      ) : blogsData.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
          <FolderOpen size={48} className='text-slate-300 mb-2' />
          <p className='text-sm font-semibold'>
            Không có bài viết nào phù hợp.
          </p>
        </div>
      ) : (
        <>
          <table className='w-full text-left border-collapse min-w-[750px]'>
            <thead>
              <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                <th className='py-4 px-6'>Bài viết</th>
                <th className='py-4 px-6'>Chuyên mục</th>
                <th className='py-4 px-6'>Tác giả</th>
                <th className='py-4 px-6'>Lượt xem</th>
                <th className='py-4 px-6'>Trạng thái bài</th>
                <th className='py-4 px-6'>Hiển thị</th>
                <th className='py-4 px-6 text-right'>Hành động</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
              {blogsData.map((b) => {
                const authorName =
                  b.author && typeof b.author === 'object'
                    ? (b.author as any).name
                    : 'Vận hành';

                return (
                  <tr
                    key={b._id}
                    className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                  >
                    <td className='py-4 px-6 flex items-center gap-3 min-w-[280px]'>
                      <div className='h-12 w-20 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-1 flex-shrink-0'>
                        <img
                          src={b.featuredImage || '/auth-image.webp'}
                          alt={b.title}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div>
                        <span className='font-bold text-slate-900 dark:text-white block leading-tight'>
                          {b.title}
                        </span>
                        <span className='text-[10px] text-slate-400 font-mono mt-0.5 block truncate max-w-[200px]'>
                          {b.slug}
                        </span>
                      </div>
                    </td>
                    <td className='py-4 px-6 font-semibold text-slate-600 dark:text-slate-400'>
                      {b.category}
                    </td>
                    <td className='py-4 px-6 font-bold text-slate-800 dark:text-slate-200'>
                      {authorName}
                    </td>
                    <td className='py-4 px-6 font-mono text-xs'>
                      {b.views ?? 0} view
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase
                        ${
                          b.status === 'Đã xuất bản'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border-amber-200'
                        }
                      `}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className='py-4 px-6'>
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold ${
                          b.isActive !== false ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            b.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        />
                        <span>
                          {b.isActive !== false ? 'Đang hiện' : 'Đã ẩn'}
                        </span>
                      </span>
                    </td>
                    <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                      <Button
                        onClick={() => onToggleActive(b._id)}
                        variant='outline'
                        size='icon'
                        className={`h-8 w-8 border-slate-200 dark:border-slate-700 cursor-pointer ${
                          b.isActive !== false
                            ? 'hover:text-slate-550 hover:bg-slate-50 dark:hover:bg-slate-800'
                            : 'hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                        }`}
                        title={b.isActive !== false ? 'Ẩn bài viết' : 'Hiện bài viết'}
                      >
                        {b.isActive !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>
                      <Button
                        onClick={() => onEdit(b)}
                        variant='outline'
                        size='icon'
                        className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-slate-200 dark:border-slate-700 cursor-pointer'
                        title='Chỉnh sửa'
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        onClick={() => onDelete(b)}
                        variant='outline'
                        size='icon'
                        className='h-8 w-8 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-slate-200 dark:border-slate-700 cursor-pointer'
                        title='Xóa'
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Phân trang */}
          {blogsTotalPages > 1 && (
            <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <span className='text-xs text-slate-400 font-medium'>
                Trang{' '}
                <strong className='text-slate-700 dark:text-slate-300'>
                  {blogsPage}
                </strong>{' '}
                trên{' '}
                <strong className='text-slate-700 dark:text-slate-300'>
                  {blogsTotalPages}
                </strong>{' '}
                (Tổng {blogsTotalCount} bài viết)
              </span>
              <div className='flex gap-1.5'>
                <Button
                  disabled={blogsPage <= 1}
                  onClick={() => setBlogsPage(blogsPage - 1)}
                  variant='outline'
                  size='sm'
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  <ChevronLeft size={16} className='mr-1' /> Trước
                </Button>
                <Button
                  disabled={blogsPage >= blogsTotalPages}
                  onClick={() => setBlogsPage(blogsPage + 1)}
                  variant='outline'
                  size='sm'
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  Sau <ChevronRight size={16} className='ml-1' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
