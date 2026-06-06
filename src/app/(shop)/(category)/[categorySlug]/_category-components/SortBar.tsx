'use client';

interface SortBarProps {
  priceSort: string;
  totalProducts: number;
  onSortChange: (sort: string) => void;
}

export default function SortBar({
  priceSort,
  totalProducts,
  onSortChange,
}: SortBarProps) {
  return (
    <div className='bg-white border border-slate-100 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-bold'>
      <div className='flex items-center gap-2 flex-wrap'>
        <span className='text-slate-400 uppercase tracking-wider'>Sắp xếp theo:</span>
        {[
          { id: 'newest', label: 'Mới nhất' },
          { id: 'best_seller', label: 'Bán chạy nhất' },
          { id: 'price_asc', label: 'Giá thấp - cao' },
          { id: 'price_desc', label: 'Giá cao - thấp' },
        ].map((s) => {
          const isSelected = priceSort === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer
                ${
                  isSelected
                    ? 'border-didongviet-red bg-red-50 text-didongviet-red'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }
              `}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <span className='text-slate-400'>
        Tìm thấy: <strong className='text-didongviet-red text-xs'>{totalProducts}</strong> sản phẩm
      </span>
    </div>
  );
}
