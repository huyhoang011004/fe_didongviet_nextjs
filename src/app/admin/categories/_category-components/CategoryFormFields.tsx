'use client';

import { useEffect, useState, useMemo } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Category } from '@/types/product';
import { CategorySelectDropdown } from '@/app/admin/_components/shared/CategorySelectDropdown'; // Đường dẫn có thể điều chỉnh tùy thuộc thư mục thực tế của bạn

interface CategoryFormFieldsProps {
  categoriesData: Category[];
  selectedCategory?: Category | null; // Chỉ truyền khi ở chế độ Edit
  isOpen: boolean;
}

export function CategoryFormFields({
  categoriesData,
  selectedCategory,
  isOpen,
}: CategoryFormFieldsProps) {
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Xử lý đồng bộ / reset trạng thái danh mục cha khi đóng mở modal
  useEffect(() => {
    if (isOpen) {
      if (selectedCategory) {
        const pId =
          selectedCategory.parentCategory &&
          typeof selectedCategory.parentCategory === 'object'
            ? (selectedCategory.parentCategory as any)._id
            : selectedCategory.parentCategory;
        setSelectedParentId(pId || null);
      } else {
        setSelectedParentId(null);
      }
    }
  }, [isOpen, selectedCategory]);

  // Tìm danh sách ID bị cấm (chính nó và con cháu của nó) để tránh tạo vòng lặp vô hạn (chỉ áp dụng khi Edit)
  const forbiddenParentIds = useMemo(() => {
    if (!selectedCategory || !isOpen) return [];

    const ids: string[] = [selectedCategory._id];

    const findChildren = (parentId: string) => {
      categoriesData
        .filter((c) => {
          const pId =
            c.parentCategory && typeof c.parentCategory === 'object'
              ? (c.parentCategory as any)._id
              : c.parentCategory;
          return String(pId) === String(parentId);
        })
        .forEach((child) => {
          ids.push(child._id);
          findChildren(child._id);
        });
    };

    findChildren(selectedCategory._id);
    return ids;
  }, [categoriesData, selectedCategory, isOpen]);

  // Lọc bỏ các danh mục bị cấm trước khi truyền dữ liệu vào Dropdown
  const validCategoriesData = useMemo(() => {
    if (forbiddenParentIds.length === 0) return categoriesData;
    return categoriesData.filter(
      (cat) => !forbiddenParentIds.includes(cat._id),
    );
  }, [categoriesData, forbiddenParentIds]);

  return (
    <div className='space-y-4 flex-1 overflow-y-auto text-sm'>
      {/* Tên Danh Mục */}
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
          Tên Danh Mục
        </label>
        <Input
          name='name'
          defaultValue={selectedCategory?.name || ''}
          placeholder='Ví dụ: iPhone 17 Series'
          required
          className='py-5 rounded-xl border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-red-500'
        />
      </div>

      {/* Mô tả ngành hàng */}
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
          Mô tả ngành hàng
        </label>
        <Input
          name='description'
          defaultValue={selectedCategory?.description || ''}
          placeholder='Thiết bị di động đỉnh cao từ nhà Táo...'
          className='py-5 rounded-xl border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-red-500'
        />
      </div>

      {/* URL Ảnh */}
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
          Đường dẫn Ảnh danh mục (URL)
        </label>
        <Input
          name='image'
          defaultValue={selectedCategory?.image || ''}
          placeholder='Ví dụ: https://example.com/image.png'
          className='py-5 rounded-xl border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-red-500'
        />
      </div>

      {/* Chọn Danh mục cha dùng chung component với cơ chế thụt lề tab trắng mới */}
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
          Danh mục cha
        </label>
        {/* Input ẩn để gửi giá trị lên Form Action / Handler */}
        <input
          type='hidden'
          name='parentCategory'
          value={selectedParentId || ''}
        />
        <CategorySelectDropdown
          categoriesData={validCategoriesData}
          value={selectedParentId || 'root'} // Nếu null nghĩa là đang chọn danh mục gốc (root)
          onChange={(id) => setSelectedParentId(id === 'root' ? null : id)}
          showSpecialOptions={false} // Không cần hiện các tùy chọn 'Tất cả danh mục' trong Form Tạo/Sửa
          showNoneOption={true}
        />
      </div>

      {/* Thương hiệu */}
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
          Thương hiệu (Ngăn cách bằng dấu phẩy)
        </label>
        <Input
          name='brands'
          defaultValue={
            selectedCategory?.brands ? selectedCategory.brands.join(', ') : ''
          }
          placeholder='Ví dụ: Apple, Samsung, Xiaomi'
          className='py-5 rounded-xl border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-red-500'
        />
      </div>

      {/* Thứ tự & Active */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
            Thứ tự hiển thị
          </label>
          <Input
            name='displayOrder'
            type='number'
            defaultValue={selectedCategory?.displayOrder || '0'}
            className='py-5 rounded-xl border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-red-500'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase tracking-wide'>
            Kích hoạt ngay
          </label>
          <select
            name='isActive'
            defaultValue={
              selectedCategory?.isActive !== false ? 'true' : 'false'
            }
            className='w-full h-10 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs md:text-sm outline-none font-bold text-slate-600 dark:text-slate-300 focus:border-red-500 transition-colors shadow-2xs'
          >
            <option value='true'>Hiển thị trên Menu</option>
            <option value='false'>Ẩn tạm thời</option>
          </select>
        </div>
      </div>
    </div>
  );
}
