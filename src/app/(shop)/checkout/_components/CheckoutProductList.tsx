'use client';

import React, { useState } from 'react';
import { Package, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CheckoutProductListProps {
  cartItems: any[];
  formatVND: (num: number) => string;
  branches: any[];
  productDetails: Record<string, any>;
  selectedBranchId: string;
}

export default function CheckoutProductList({
  cartItems,
  formatVND,
  branches,
  productDetails,
  selectedBranchId,
}: CheckoutProductListProps) {
  // Trạng thái hiển thị tồn kho chi tiết cho từng sản phẩm (dựa trên index)
  const [showStockFor, setShowStockFor] = useState<Record<number, boolean>>({});

  const toggleStockFor = (index: number) => {
    setShowStockFor((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5'>
      <h2 className='text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 border-b border-slate-50 pb-3'>
        <Package size={15} className='text-didongviet-red' />
        Sản phẩm đặt mua ({cartItems.length})
      </h2>

      {/* Danh sách sản phẩm được điều chỉnh thoáng và dễ quan sát */}
      <div className='space-y-4.5 max-h-[495px] overflow-y-auto pr-1.5 custom-scrollbar'>
        {cartItems.map((item, idx) => {
          // Lấy thông tin chi tiết sản phẩm để kiểm tra tồn kho
          const productDetail = productDetails[item.product];
          const variant =
            productDetail?.variants?.find((v: any) => v._id === item.variant) ||
            productDetail?.variants?.[0];

          // Kiểm tra tồn kho tại chi nhánh hiện tại đang chọn
          const selectedBranchInv = variant?.inventory?.find(
            (inv: any) => (inv.branch?._id || inv.branch) === selectedBranchId,
          );
          const selectedBranchStock = selectedBranchInv
            ? selectedBranchInv.stock
            : 0;
          const isSelectedBranchStockSufficient =
            selectedBranchStock >= item.quantity;

          return (
            <div
              key={idx}
              className='flex flex-col gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-200/50 transition-all duration-200'
            >
              {/* Phần thông tin cơ bản sản phẩm */}
              <div className='flex gap-3.5 items-center'>
                {/* Ảnh sản phẩm được điều chỉnh nhỏ lại một chút */}
                <div className='h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-white border border-slate-100 flex-shrink-0 flex items-center justify-center p-1.5 shadow-sm'>
                  <img
                    src={item.imageUrl || '/placeholder-product.png'}
                    alt={item.name}
                    className='h-full w-full object-contain hover:scale-105 transition-transform duration-300'
                    referrerPolicy='no-referrer'
                  />
                </div>

                {/* Thông tin chi tiết */}
                <div className='flex-1 min-w-0 space-y-1.5'>
                  {/* Tên sản phẩm */}
                  <h4 className='text-xs sm:text-sm font-bold text-slate-800 leading-snug hover:text-didongviet-red transition-colors line-clamp-2'>
                    {item.name}
                  </h4>

                  {/* Tag phân loại */}
                  {(item.selectedColor || item.selectedStorage) && (
                    <div className='inline-flex items-center text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md uppercase tracking-wide'>
                      <span>Phân loại: </span>
                      <span className='ml-1 text-slate-800 font-extrabold'>
                        {item.selectedColor}
                        {item.selectedStorage
                          ? ` - ${item.selectedStorage}`
                          : ''}
                      </span>
                    </div>
                  )}

                  {/* Số lượng và giá bán hiển thị rõ ràng */}
                  <div className='flex items-center justify-between pt-1 border-t border-slate-100/50 mt-1'>
                    <span className='text-[10px] sm:text-xs text-slate-500 font-bold bg-slate-100/50 px-1.5 py-0.5 rounded'>
                      Số lượng:{' '}
                      <span className='text-slate-800 font-black'>
                        {item.quantity}
                      </span>
                    </span>
                    <span className='text-xs sm:text-sm font-extrabold text-didongviet-red font-mono bg-red-50/50 px-1.5 py-0.5 rounded'>
                      {formatVND(item.salePrice || item.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phần kiểm tra và hiển thị tồn kho của các chi nhánh */}
              <div className='border-t border-dashed border-slate-150 pt-2 space-y-1.5'>
                {!productDetail ? (
                  <div className='text-[10px] text-slate-400 font-semibold flex items-center gap-1.5 animate-pulse'>
                    <div className='w-3 h-3 rounded-full border border-slate-350 border-t-transparent animate-spin' />
                    Đang kiểm tra tồn kho tại các chi nhánh...
                  </div>
                ) : (
                  <div className='space-y-1.5'>
                    {/* Trạng thái tại chi nhánh đang chọn */}
                    <div className='flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold'>
                      <span className='text-slate-500'>
                        Tại chi nhánh đang chọn:
                      </span>
                      {selectedBranchStock > 0 ? (
                        isSelectedBranchStockSufficient ? (
                          <span className='text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1'>
                            <span>🟢 Sẵn hàng</span>
                            <span className='font-extrabold'>
                              (Tồn: {selectedBranchStock})
                            </span>
                          </span>
                        ) : (
                          <span className='text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 flex items-center gap-1'>
                            <span>⚠️ Chỉ còn {selectedBranchStock} máy</span>
                            <span className='font-medium'>
                              (Thiếu: {item.quantity - selectedBranchStock})
                            </span>
                          </span>
                        )
                      ) : (
                        <span className='text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 font-extrabold'>
                          🔴 Hết hàng
                        </span>
                      )}
                    </div>

                    {/* Nút bấm toggle danh sách tồn kho toàn hệ thống */}
                    <button
                      type='button'
                      onClick={() => toggleStockFor(idx)}
                      className='w-full flex items-center justify-between text-[9px] font-black text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border-none cursor-pointer transition-colors'
                    >
                      <span className='flex items-center gap-1'>
                        <HelpCircle size={10} />
                        Kiểm tra các chi nhánh khác
                      </span>
                      {showStockFor[idx] ? (
                        <ChevronUp size={10} />
                      ) : (
                        <ChevronDown size={10} />
                      )}
                    </button>

                    {/* Bảng danh sách tồn kho các chi nhánh */}
                    {showStockFor[idx] && (
                      <div className='p-2 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[9px] font-semibold animate-in fade-in slide-in-from-top-1 duration-150 max-h-[150px] overflow-y-auto custom-scrollbar'>
                        {branches.length === 0 ? (
                          <div className='text-center py-2 text-slate-450'>
                            Không tìm thấy chi nhánh nào trên hệ thống
                          </div>
                        ) : (
                          branches.map((b) => {
                            const bInv = variant?.inventory?.find(
                              (invItem: any) =>
                                (invItem.branch?._id || invItem.branch) ===
                                b._id,
                            );
                            const bStock = bInv ? bInv.stock : 0;
                            const isCurrent = b._id === selectedBranchId;

                            return (
                              <div
                                key={b._id}
                                className={`flex items-center justify-between py-1 px-1.5 rounded-md last:border-b-0
                                  ${isCurrent ? 'bg-blue-50/30 border border-blue-100/40' : 'border-b border-slate-100/50'}
                                `}
                              >
                                <span
                                  className={`truncate max-w-[170px] ${isCurrent ? 'text-blue-600 font-black' : 'text-slate-650'}`}
                                >
                                  {b.name} {isCurrent && '(Đang chọn)'}
                                </span>
                                <span className='shrink-0 ml-2'>
                                  {bStock > 0 ? (
                                    <span className='text-emerald-600 font-black'>
                                      🟢 Còn hàng ({bStock})
                                    </span>
                                  ) : (
                                    <span className='text-slate-400 font-black'>
                                      🔴 Hết hàng
                                    </span>
                                  )}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
