import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Category } from '@/types/product';

interface CategoryFiltersProps {
  categoriesData: Category[];
  parentFilter: string;
  setParentFilter: (filter: string) => void;
  categorySearch: string;
  setCategorySearch: (search: string) => void;
}

export function CategoryFilters({
  categoriesData,
  parentFilter,
  setParentFilter,
  categorySearch,
  setCategorySearch,
}: CategoryFiltersProps) {
  // Hàm đệ quy tạo options cho danh mục dạng cây thụt đầu dòng
  const renderTreeOptions = (
    categories: Category[],
    parentId: string | null = null,
    level = 0
  ): React.ReactNode[] => {
    const levelIndicator = level > 0 ? '\u00A0\u00A0'.repeat(level) + '└─ ' : '';
    
    const filtered = categories.filter((c) => {
      const pId =
        c.parentCategory && typeof c.parentCategory === 'object'
          ? (c.parentCategory as any)._id
          : c.parentCategory;
      return parentId === null ? !pId : pId === parentId;
    });

    return filtered.reduce<React.ReactNode[]>((acc, c) => {
      acc.push(
        <option key={c._id} value={c._id} className={level === 0 ? 'font-bold' : ''}>
          {levelIndicator}{c.name}
        </option>
      );
      const children = renderTreeOptions(categories, c._id, level + 1);
      acc.push(...children);
      return acc;
    }, []);
  };

  return (
    <div className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between'>
      {/* Bộ lọc danh mục cha dạng cây bên trái */}
      <div className='flex items-center gap-3 w-full md:w-auto'>
        <span className='text-xs font-bold text-slate-400 uppercase whitespace-nowrap hidden sm:inline'>
          Danh mục cha:
        </span>
        <select
          value={parentFilter}
          onChange={(e) => setParentFilter(e.target.value)}
          className='w-full md:w-64 py-3 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none font-semibold text-slate-700 dark:text-slate-200 cursor-pointer shadow-xs transition-all focus:border-didongviet-red'
        >
          <option value='all'>Tất cả danh mục ngành hàng</option>
          <option value='root'>Chỉ danh mục gốc (Không có cha)</option>
          {renderTreeOptions(categoriesData)}
        </select>
      </div>

      {/* Thanh tìm kiếm bên phải */}
      <div className='relative w-full md:w-72'>
        <Search
          className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          size={16}
        />
        <Input
          placeholder='Tìm kiếm danh mục...'
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
        />
      </div>
    </div>
  );
}
