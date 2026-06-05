'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
  Edit3,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface InventoryTableProps {
  products: any[];
  branches: any[];
  currentThreshold: number;
  thresholdFilter: number | undefined;
  loading: boolean;
  onOpenUpdateStock: (product: any, variantIndex: number, branchId: string, currentStock: number) => void;
  onOpenCreateReceipt: (product: any, variantIndex: number, branchId: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  selectedBranchFilter?: string; // Mới
}

export default function InventoryTable({
  products,
  branches,
  currentThreshold,
  thresholdFilter,
  loading,
  onOpenUpdateStock,
  onOpenCreateReceipt,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  selectedBranchFilter, // Mới
}: InventoryTableProps) {
  // Quản lý các hàng sản phẩm đang mở rộng
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (productId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const getProductThumbnail = (product: any) => {
    // 1. Kiểm tra nếu có trường thumbnail trực tiếp (dạng chuỗi URL)
    if (product.thumbnail) {
      return product.thumbnail.startsWith('http') ? product.thumbnail : `http://localhost:5000${product.thumbnail}`;
    }
    // 2. Tìm ảnh có isThumbnail hoặc lấy ảnh đầu tiên từ mảng images
    if (product.images && product.images.length > 0) {
      const thumb = product.images.find((img: any) => img.isThumbnail) || product.images[0];
      return thumb.url.startsWith('http') ? thumb.url : `http://localhost:5000${thumb.url}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900'>
        <span className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
        <p className='text-xs text-slate-400 mt-2 font-medium animate-pulse'>
          Đang nạp dữ liệu tồn kho hàng...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 text-center px-4'>
        <div className='p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full mb-4'>
          <Package size={40} />
        </div>
        <h3 className='text-lg font-bold text-slate-800 dark:text-slate-200 mb-1'>Không tìm thấy sản phẩm cảnh báo</h3>
        <p className='text-sm text-slate-400 max-w-sm'>
          Tất cả sản phẩm đều có mức tồn kho an toàn hoặc không khớp với bộ lọc hiện tại.
        </p>
      </div>
    );
  }

  const activeThreshold = thresholdFilter !== undefined ? thresholdFilter : currentThreshold;

  return (
    <div className='bg-white dark:bg-slate-900 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400'>
          <thead>
            <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
              <th className='py-4 px-6 w-10'></th>
              <th className='py-4 px-6 min-w-[240px]'>Sản phẩm</th>
              <th className='py-4 px-6'>Danh mục</th>
              <th className='py-4 px-6'>Thương hiệu</th>
              <th className='py-4 px-6 text-center'>Số biến thể</th>
              <th className='py-4 px-6 text-center'>Tổng tồn kho</th>
              <th className='py-4 px-6 text-center'>Trạng thái tổng</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900'>
            {products.map((product) => {
              const isExpanded = !!expandedRows[product._id];
              const thumbUrl = getProductThumbnail(product);

              // Tính toán trạng thái tổng hợp tồn kho của sản phẩm (thấp nhất trong các chi nhánh)
              let hasOutOfStock = false;
              let hasLowStock = false;
              let totalStock = 0;

              // Quét qua tất cả chi nhánh để xác định trạng thái tổng
              branches.forEach((branch) => {
                product.variants.forEach((v: any) => {
                  const invItem = v.inventory?.find(
                    (inv: any) => (inv.branch?._id || inv.branch) === branch._id
                  );
                  const stock = invItem ? invItem.stock : 0;
                  
                  // Nếu đang lọc chi nhánh, ta chỉ cộng totalStock của chi nhánh đang lọc
                  if (!selectedBranchFilter || branch._id === selectedBranchFilter) {
                    totalStock += stock;
                  }
                  
                  // Trạng thái tổng luôn là trạng thái thấp nhất trong các chi nhánh (hoặc của chi nhánh đang lọc)
                  if (!selectedBranchFilter || branch._id === selectedBranchFilter) {
                    if (stock === 0) hasOutOfStock = true;
                    else if (stock <= activeThreshold) hasLowStock = true;
                  }
                });
              });

              return (
                <Fragment key={product._id}>
                  {/* Hàng sản phẩm chính */}
                  <tr
                    key={product._id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-red-500/[0.02] dark:bg-red-500/[0.02]' : ''
                    }`}
                    onClick={() => toggleRow(product._id)}
                  >
                    <td className='px-6 py-4 text-center' onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleRow(product._id)}
                        className='p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 cursor-pointer border-none bg-transparent'
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                    <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                      <div className='flex items-center gap-3'>
                        {thumbUrl ? (
                          <div className='relative w-12 h-12 rounded-lg border border-slate-100 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800 flex-shrink-0'>
                            <Image
                              src={thumbUrl}
                              alt={product.name}
                              fill
                              sizes='48px'
                              className='object-cover'
                            />
                          </div>
                        ) : (
                          <div className='w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center flex-shrink-0'>
                            <Smartphone size={20} />
                          </div>
                        )}
                        <div>
                          <p className='font-bold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-didongviet-red transition-colors'>
                            {product.name}
                          </p>
                          <p className='text-xs text-slate-400 mt-0.5 font-mono select-all' title='Mã ID MongoDB đầy đủ'>
                            ID: {product._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700'>
                        {product.category?.name || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td className='px-6 py-4 font-semibold text-slate-700 dark:text-slate-300'>
                      {product.brand}
                    </td>
                    <td className='px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200'>
                      {product.variants?.length || 0} bản
                    </td>
                    <td className='px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200'>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        totalStock === 0 
                          ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' 
                          : totalStock <= activeThreshold 
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {totalStock} máy
                      </span>
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {hasOutOfStock ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20'>
                          <XCircle size={12} /> Hết hàng
                        </span>
                      ) : hasLowStock ? (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'>
                          <AlertTriangle size={12} /> Cần bổ sung
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'>
                          <CheckCircle2 size={12} /> Đủ hàng
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Phần mở rộng hiển thị các Biến thể & Tồn kho tại Chi nhánh */}
                  {isExpanded && (
                    <tr className='bg-slate-50/30 dark:bg-slate-900/30'>
                      <td colSpan={7} className='px-6 py-4 border-t border-slate-100 dark:border-slate-800'>
                        <div className='pl-4 border-l-2 border-didongviet-red py-2'>
                          <h4 className='text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3'>
                            Chi tiết phiên bản sản phẩm & Tồn kho tại chi nhánh:
                          </h4>
                          <div className='overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs bg-white dark:bg-slate-950'>
                            <table className='w-full border-collapse text-left text-xs text-slate-500 dark:text-slate-400'>
                              <thead>
                                <tr className='bg-slate-50/80 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                                  <th className='py-3 px-4'>Phiên bản (RAM/ROM/Màu)</th>
                                  <th className='py-3 px-4'>Mã SKU</th>
                                  <th className='py-3 px-4 text-right'>Giá bán</th>
                                  {branches
                                    .filter((b) => !selectedBranchFilter || b._id === selectedBranchFilter)
                                    .map((b) => (
                                      <th key={b._id} className='py-3 px-4 text-center bg-slate-100/50 dark:bg-slate-900/50 border-x border-slate-100 dark:border-slate-800'>
                                        {b.name}
                                      </th>
                                    ))
                                  }
                                </tr>
                              </thead>
                              <tbody className='divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950 font-medium'>
                                {product.variants.map((v: any, vIdx: number) => (
                                  <tr key={v.sku || vIdx} className='hover:bg-slate-50/30 dark:hover:bg-slate-900/35 transition-colors'>
                                    <td className='px-4 py-3 text-slate-900 dark:text-slate-100 font-bold'>
                                      {v.ram && `${v.ram} / `}{v.rom && `${v.rom} / `}{v.color}
                                    </td>
                                    <td className='px-4 py-3 text-slate-500 dark:text-slate-450 font-mono font-semibold'>
                                      {v.sku || 'N/A'}
                                    </td>
                                    <td className='px-4 py-3 text-right font-bold text-didongviet-red'>
                                      {v.salePrice ? (
                                        <div className='flex flex-col items-end'>
                                          <span>{v.salePrice.toLocaleString('vi-VN')}đ</span>
                                          <span className='text-[10px] text-slate-400 dark:text-slate-500 line-through font-normal'>
                                            {v.price.toLocaleString('vi-VN')}đ
                                          </span>
                                        </div>
                                      ) : (
                                        <span>{v.price.toLocaleString('vi-VN')}đ</span>
                                      )}
                                    </td>
                                    {branches
                                      .filter((b) => !selectedBranchFilter || b._id === selectedBranchFilter)
                                      .map((branch) => {
                                        const invItem = v.inventory?.find(
                                          (inv: any) => inv.branch === branch._id
                                        );
                                        const stock = invItem ? invItem.stock : 0;

                                        // Tính màu sắc cảnh báo tồn kho
                                        let badgeClass = 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
                                        let StatusIcon = CheckCircle2;

                                        if (stock === 0) {
                                          badgeClass = 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20 font-bold';
                                          StatusIcon = XCircle;
                                        } else if (stock <= activeThreshold) {
                                          badgeClass = 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
                                          StatusIcon = AlertTriangle;
                                        }

                                        return (
                                          <td
                                            key={branch._id}
                                            className='px-4 py-3 text-center border-x border-slate-100 dark:border-slate-800 bg-slate-50/10 dark:bg-slate-900/10'
                                          >
                                            <div className='flex flex-col items-center gap-1.5'>
                                              {/* Badge số lượng tồn */}
                                              <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${badgeClass}`}
                                              >
                                                <StatusIcon size={11} />
                                                {stock} máy
                                              </span>

                                              {/* Bộ nút hành động nhanh */}
                                              <div className='flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity'>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOpenUpdateStock(product, vIdx, branch._id, stock);
                                                  }}
                                                  className='p-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors cursor-pointer border-none bg-transparent'
                                                  title='Điều chỉnh số lượng tồn trực tiếp'
                                                >
                                                  <Edit3 size={12} />
                                                </button>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOpenCreateReceipt(product, vIdx, branch._id);
                                                  }}
                                                  className='p-1 text-slate-500 dark:text-slate-400 hover:text-didongviet-red hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer border-none bg-transparent'
                                                  title='Tạo phiếu nhập thêm hàng vào kho'
                                                >
                                                  <PlusCircle size={12} />
                                                </button>
                                              </div>
                                            </div>
                                          </td>
                                        );
                                      })
                                    }
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phân trang đồng bộ ở chân bảng */}
      {totalPages > 1 && (
        <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
          <span className='text-xs text-slate-400 font-medium'>
            Trang{' '}
            <strong className='text-slate-700 dark:text-slate-350'>
              {currentPage}
            </strong>{' '}
            trên{' '}
            <strong className='text-slate-700 dark:text-slate-350'>
              {totalPages}
            </strong>{' '}
            (Tổng {totalItems} sản phẩm)
          </span>
          <div className='flex gap-1.5'>
            <Button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              variant='outline'
              size='sm'
              className='rounded-xl border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:text-slate-300'
            >
              <ChevronLeft size={16} className='mr-1' /> Trước
            </Button>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              variant='outline'
              size='sm'
              className='rounded-xl border-slate-200 dark:border-slate-800 cursor-pointer dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:text-slate-300'
            >
              Sau <ChevronRight size={16} className='ml-1' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

