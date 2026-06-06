'use client';

interface BrandFiltersProps {
  slug: string;
  brandFilter: string;
  availableBrands: string[];
  onBrandChange: (brand: string) => void;
}

export default function BrandFilters({
  slug,
  brandFilter,
  availableBrands,
  onBrandChange,
}: BrandFiltersProps) {
  const getBrandDisplayName = (b: string) => {
    const bLower = b.toLowerCase();
    if (bLower === 'apple') {
      if (slug.includes('dien-thoai') || slug.includes('phone')) return 'iPhone';
      if (slug.includes('tablet') || slug.includes('ipad')) return 'iPad';
      if (slug.includes('laptop') || slug.includes('macbook')) return 'MacBook';
    }
    return b;
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-2.5'>
      <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest block'>
        Lọc theo thương hiệu
      </span>
      <div className='flex gap-2 overflow-x-auto no-scrollbar pb-1'>
        <button
          onClick={() => onBrandChange('all')}
          className={`px-4 py-2 text-[11px] font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap
            ${
              brandFilter === 'all'
                ? 'bg-red-50 border-didongviet-red text-didongviet-red shadow-xs shadow-red-100'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }
          `}
        >
          Tất cả hãng
        </button>
        {availableBrands.map((b) => {
          const displayName = getBrandDisplayName(b);
          const isSelected = brandFilter.toLowerCase() === b.toLowerCase();
          const displayLabel = slug.includes('dien-thoai') ? `Điện thoại ${displayName}` : displayName;

          return (
            <button
              key={b}
              onClick={() => onBrandChange(b)}
              className={`px-4 py-2 text-[11px] font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap
                ${
                  isSelected
                    ? 'bg-red-50 border-didongviet-red text-didongviet-red shadow-xs shadow-red-100'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }
              `}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
