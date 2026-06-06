'use client';

import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';

interface ProductDescriptionProps {
  product: any;
  isDescExpanded: boolean;
  setIsDescExpanded: (expanded: boolean) => void;
}

export default function ProductDescription({
  product,
  isDescExpanded,
  setIsDescExpanded,
}: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'benefits'>('overview');

  return (
    <div className='lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-xs space-y-4'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-3'>
        <div className='h-1 w-3.5 bg-didongviet-red rounded-full' />
        <h3 className='text-xs font-black text-slate-800 uppercase tracking-tight'>
          Thông tin sản phẩm
        </h3>
      </div>

      {/* Tabs */}
      <div className='flex gap-2 border-b border-slate-100 overflow-x-auto'>
        {[
          { id: 'overview', label: 'Tổng quan' },
          { id: 'details', label: 'Chi tiết' },
          { id: 'benefits', label: 'Ưu điểm' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-bold px-3 py-2 whitespace-nowrap transition-colors border-b-2 -mb-0.5 ${activeTab === tab.id
                ? 'border-didongviet-red text-didongviet-red'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={`relative overflow-hidden text-xs text-gray-600 leading-relaxed font-medium transition-all duration-300
        ${isDescExpanded ? 'max-h-none' : 'max-h-[300px]'}
      `}
      >
        {activeTab === 'overview' && (
          <div className='space-y-3 whitespace-pre-line'>
            {product.description ||
              `Sản phẩm ${product.name} chính hãng hiện đang được bán tại hệ thống Di Động Việt với mức giá vô cùng cạnh tranh. 
Sở hữu cấu hình đỉnh cao, camera độ phân giải sắc nét, pin dung lượng lớn cùng thiết kế sang trọng, đây sẽ là người bạn đồng hành hoàn hảo cho công việc và giải trí hàng ngày.`}
          </div>
        )}

        {activeTab === 'details' && (
          <div className='space-y-3'>
            <p>
              <strong>Thương hiệu:</strong> {product.brand || 'Di Động Việt'}
            </p>
            <p>
              <strong>Tình trạng:</strong> {product.condition || 'Nguyên seal 100%'}
            </p>
            <p>
              <strong>Bảo hành:</strong> {product.warrantyPeriod || '12 tháng'}
            </p>
            <p>
              <strong>Danh mục:</strong> {product.category?.name || 'Sản phẩm'}
            </p>
            {product.variants && product.variants.length > 0 && (
              <>
                <p>
                  <strong>Các phiên bản:</strong>
                </p>
                <ul className='ml-4 space-y-1'>
                  {product.variants.slice(0, 3).map((v: any, idx: number) => (
                    <li key={idx}>
                      • {v.color} - {v.ram ? `${v.ram}GB RAM` : ''}{' '}
                      {v.rom ? `${v.rom}GB Storage` : ''}
                    </li>
                  ))}
                  {product.variants.length > 3 && (
                    <li>• +{product.variants.length - 3} phiên bản khác</li>
                  )}
                </ul>
              </>
            )}
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className='space-y-2'>
            <p>✓ Chính hãng 100% với hóa đơn đầy đủ</p>
            <p>✓ Bảo hành chính thức từ nhà sản xuất</p>
            <p>✓ Giá cạnh tranh nhất thị trường</p>
            <p>✓ Hỗ trợ trả góp 0% lãi suất</p>
            <p>✓ Chương trình Thu cũ đổi mới với trợ giá cao</p>
            <p>✓ Giao hàng nhanh toàn quốc</p>
            <p>✓ Ưu đãi D.Member - Giảm thêm 1% trên mọi đơn hàng</p>
            <p>✓ Hỗ trợ khách hàng 24/7</p>
          </div>
        )}

        {!isDescExpanded && (
          <div className='absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none' />
        )}
      </div>

      <div className='text-center pt-1'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className='border-red-200 text-didongviet-red hover:bg-red-50 rounded-lg cursor-pointer text-[10px] font-bold py-2 px-4 h-8'
        >
          {isDescExpanded ? 'Thu gọn' : 'Xem thêm chi tiết'}
        </Button>
      </div>
    </div>
  );
}
