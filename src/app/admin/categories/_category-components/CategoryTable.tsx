import { Edit, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Category } from '@/types/product';

interface CategoryTableProps {
  categoryLoading: boolean;
  categoriesData: Category[];
  allCategories: Category[]; // Dùng để tìm kiếm tên danh mục cha từ ID
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categoryLoading,
  categoriesData,
  allCategories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className='p-0 overflow-x-auto'>
      {categoryLoading ? (
        <div className='flex flex-col items-center justify-center p-20'>
          <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang lấy danh mục ngành hàng...
          </span>
        </div>
      ) : categoriesData.length === 0 ? (
        <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
          <FolderOpen size={48} className='text-slate-300 mb-2' />
          <p className='text-sm font-semibold'>
            Chưa có danh mục nào phù hợp hoặc được khởi tạo.
          </p>
        </div>
      ) : (
        <table className='w-full text-left border-collapse min-w-[700px]'>
          <thead>
            <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
              <th className='py-4 px-6'>Tên Danh Mục</th>
              <th className='py-4 px-6'>Đường dẫn (Slug)</th>
              <th className='py-4 px-6'>Danh mục cha</th>
              <th className='py-4 px-6'>Thương hiệu</th>
              <th className='py-4 px-6'>Sắp xếp</th>
              <th className='py-4 px-6'>Trạng thái</th>
              <th className='py-4 px-6 text-right'>Hành động</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
            {categoriesData.map((c) => {
              // Tìm danh mục cha từ allCategories
              const parentId =
                c.parentCategory && typeof c.parentCategory === 'object'
                  ? (c.parentCategory as any)._id
                  : c.parentCategory;

              const parent = allCategories.find((p) => p._id === parentId);

              return (
                <tr
                  key={c._id}
                  className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                >
                  <td className='py-4 px-6 font-bold text-slate-900 dark:text-white'>
                    <div className='flex items-center gap-3'>
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className='w-8 h-8 rounded-lg object-cover border border-slate-100 dark:border-slate-800'
                          onError={(e) => {
                            (e.target as any).src =
                              'https://placehold.co/40x40/e2e8f0/64748b?text=CAT';
                          }}
                        />
                      ) : (
                        <div className='w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700/50 text-[10px] font-bold shrink-0'>
                          N/A
                        </div>
                      )}
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className='py-4 px-6 font-mono text-xs text-slate-500 dark:text-slate-400'>
                    {c.slug}
                  </td>
                  <td className='py-4 px-6'>
                    {parent ? (
                      <span className='px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50'>
                        {parent.name}
                      </span>
                    ) : (
                      <span className='text-slate-400 text-xs italic'>
                        Ngành hàng gốc
                      </span>
                    )}
                  </td>
                  <td className='py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-[200px] truncate'>
                    {c.brands && c.brands.length > 0
                      ? c.brands.join(', ')
                      : 'Chưa thiết lập'}
                  </td>
                  <td className='py-4 px-6 font-mono font-bold text-slate-600 dark:text-slate-300'>
                    {c.displayOrder}
                  </td>
                  <td className='py-4 px-6'>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        c.isActive !== false
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          c.isActive !== false
                            ? 'bg-emerald-600'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span>
                        {c.isActive !== false ? 'Hiển thị' : 'Đang ẩn'}
                      </span>
                    </span>
                  </td>
                  <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                    <Button
                      onClick={() => onEdit(c)}
                      variant='outline'
                      size='icon'
                      className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 border-slate-200 dark:border-slate-700 cursor-pointer transition-all'
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      onClick={() => onDelete(c)}
                      variant='outline'
                      size='icon'
                      className='h-8 w-8 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-slate-200 dark:border-slate-700 cursor-pointer transition-all'
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
