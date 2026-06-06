'use client';

interface ProductSpecsProps {
  product: any;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  return (
    <div className='lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-3'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
        <div className='h-1 w-3.5 bg-blue-500 rounded-full' />
        <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
          Thông số kỹ thuật
        </h3>
      </div>

      <div className='overflow-hidden rounded-lg border border-slate-100 text-[11px]'>
        <table className='w-full border-collapse'>
          <tbody>
            {[
              {
                label: 'Thương hiệu',
                value: product.brand || 'Di Động Việt',
              },
              {
                label: 'Ngành hàng',
                value: product.category?.name || 'Sản phẩm',
              },
              {
                label: 'Màu sắc',
                value: product.variants
                  ? Array.from(
                      new Set(product.variants.map((v: any) => v.color)),
                    ).join(', ')
                  : 'N/A',
              },
              {
                label: 'RAM',
                value: product.variants
                  ? Array.from(
                      new Set(product.variants.map((v: any) => v.ram)),
                    ).join(', ')
                  : 'N/A',
              },
              {
                label: 'ROM',
                value: product.variants
                  ? Array.from(
                      new Set(product.variants.map((v: any) => v.rom)),
                    ).join(', ')
                  : 'N/A',
              },
              {
                label: 'Độ mới',
                value: product.isUsed ? 'Likenew 99%' : 'Nguyên seal 100%',
              },
            ].map((row, idx) => (
              <tr
                key={idx}
                className={`${idx % 2 === 0 ? 'bg-slate-50/50' : ''} hover:bg-slate-50 transition-colors`}
              >
                <td className='py-2.5 px-3 font-bold text-gray-500 w-1/3 border-b border-slate-100'>
                  {row.label}
                </td>
                <td className='py-2.5 px-3 font-semibold text-slate-800 border-b border-slate-100'>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
