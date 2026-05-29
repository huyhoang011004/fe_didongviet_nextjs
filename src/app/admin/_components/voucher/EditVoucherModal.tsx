import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Voucher, HSSVTier } from '@/types/voucher';

interface EditVoucherModalProps {
  isOpen: boolean;
  selectedVoucher: Voucher | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editVoucherPending: boolean;
  voucherDiscountType: string;
  setVoucherDiscountType: (type: string) => void;
  hssvTiers: HSSVTier[];
  setHssvTiers: React.Dispatch<React.SetStateAction<HSSVTier[]>>;
}

export function EditVoucherModal({
  isOpen,
  selectedVoucher,
  onClose,
  onSubmit,
  editVoucherPending,
  voucherDiscountType,
  setVoucherDiscountType,
  hssvTiers,
  setHssvTiers,
}: EditVoucherModalProps) {
  if (!isOpen || !selectedVoucher) return null;

  // Kiểm tra xem voucher đã hết hạn hay chưa
  const isExpired = selectedVoucher.expiryDate
    ? new Date(selectedVoucher.expiryDate) < new Date()
    : false;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
            Cấu hình lại Voucher: {selectedVoucher.code}
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className='p-6 space-y-4 overflow-y-auto flex-1 text-sm'
        >
          {isExpired && (
            <div className='bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3.5 rounded-xl border border-red-100 dark:border-red-900/50 text-xs font-semibold leading-relaxed flex flex-col gap-1'>
              <span>⚠️ <strong>CẢNH BÁO HẾT HẠN!</strong></span>
              <span>Mã voucher này đã quá ngày hết hạn ({new Date(selectedVoucher.expiryDate).toLocaleDateString('vi-VN')}). Giao diện đã khóa kích hoạt và bạn không thể chuyển sang trạng thái kích hoạt lại voucher này.</span>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Loại ưu đãi (Không khuyến khích đổi)
              </label>
              <select
                name='discountType'
                value={voucherDiscountType}
                onChange={(e) => setVoucherDiscountType(e.target.value)}
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none focus:border-didongviet-red'
              >
                <option value='fixed'>Tiền mặt cố định (fixed)</option>
                <option value='percentage'>Phần trăm hóa đơn (percentage)</option>
                <option value='hssv_tiered'>Phân tầng Học sinh SV (hssv_tiered)</option>
              </select>
            </div>

            <div className='space-y-1.5 md:col-span-2'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Mô tả nội dung
              </label>
              <Input
                name='description'
                defaultValue={selectedVoucher.description || ''}
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>

            {voucherDiscountType !== 'hssv_tiered' ? (
              <>
                <div className='space-y-1.5 animate-in fade-in duration-200'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>
                    Mức giảm
                  </label>
                  <Input
                    name='discountValue'
                    type='number'
                    defaultValue={selectedVoucher.discountValue || '0'}
                    required
                    className='py-5 rounded-xl border-slate-200 text-sm'
                  />
                </div>
                <div className='space-y-1.5 animate-in fade-in duration-200'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>
                    Giảm tối đa
                  </label>
                  <Input
                    name='maxDiscount'
                    type='number'
                    defaultValue={selectedVoucher.maxDiscount || ''}
                    className='py-5 rounded-xl border-slate-200 text-sm'
                  />
                </div>
              </>
            ) : (
              <div className='md:col-span-2 space-y-3 bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50 animate-in fade-in duration-200'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-purple-700 dark:text-purple-400'>
                    Hiệu chỉnh tầng giảm HSSV
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='text-[10px] text-purple-600 font-bold hover:bg-purple-100 border-none cursor-pointer'
                    onClick={() =>
                      setHssvTiers((prev) => [
                        ...prev,
                        { minOrderValue: 0, discountAmount: 0 },
                      ])
                    }
                  >
                    + Thêm tầng
                  </Button>
                </div>

                {hssvTiers.map((t, idx) => (
                  <div key={idx} className='grid grid-cols-1 md:grid-cols-2 gap-3 items-center'>
                    <div className='space-y-1'>
                      <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                        Đơn tối thiểu (VNĐ)
                      </span>
                      <Input
                        name='tierMinOrderValue'
                        type='number'
                        defaultValue={t.minOrderValue}
                        required
                        className='py-2 h-8 rounded-lg border-slate-200 text-xs'
                      />
                    </div>
                    <div className='space-y-1 relative'>
                      <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                        Số tiền giảm (VNĐ)
                      </span>
                      <Input
                        name='tierDiscountAmount'
                        type='number'
                        defaultValue={t.discountAmount}
                        required
                        className='py-2 h-8 rounded-lg border-slate-200 text-xs pr-6'
                      />
                      {hssvTiers.length > 1 && (
                        <button
                          type='button'
                          onClick={() =>
                            setHssvTiers((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className='absolute right-1 bottom-1.5 text-xs text-red-500 border-none bg-transparent cursor-pointer'
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Giá trị đơn tối thiểu (VNĐ)
              </label>
              <Input
                name='minOrderAmount'
                type='number'
                defaultValue={selectedVoucher.minOrderAmount || '0'}
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Đối tượng
              </label>
              <select
                name='isHSSVOnly'
                defaultValue={selectedVoucher.isHSSVOnly ? 'true' : 'false'}
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none focus:border-didongviet-red'
              >
                <option value='false'>Tất cả khách hàng</option>
                <option value='true'>Chỉ HSSV đã duyệt thẻ</option>
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Tổng lượt dùng
              </label>
              <Input
                name='usageLimit'
                type='number'
                defaultValue={selectedVoucher.usageLimit || '100'}
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Lượt dùng / User
              </label>
              <Input
                name='maxUsagePerUser'
                type='number'
                defaultValue={selectedVoucher.maxUsagePerUser || '1'}
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Ngày bắt đầu
              </label>
              <Input
                name='startDate'
                type='date'
                defaultValue={
                  selectedVoucher.startDate
                    ? selectedVoucher.startDate.split('T')[0]
                    : ''
                }
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Ngày hết hạn
              </label>
              <Input
                name='expiryDate'
                type='date'
                defaultValue={
                  selectedVoucher.expiryDate
                    ? selectedVoucher.expiryDate.split('T')[0]
                    : ''
                }
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>

            <div className='space-y-1.5 md:col-span-2'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Trạng thái Voucher
              </label>
              <select
                name='isActive'
                disabled={isExpired}
                value={isExpired ? 'false' : undefined}
                defaultValue={selectedVoucher.isActive !== false ? 'true' : 'false'}
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none focus:border-didongviet-red disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400'
              >
                {!isExpired && <option value='true'>Đang mở kích hoạt</option>}
                <option value='false'>Tạm dừng / Hết hạn sớm</option>
              </select>
              {isExpired && (
                <input type='hidden' name='isActive' value='false' />
              )}
            </div>
          </div>

          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={editVoucherPending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
            >
              {editVoucherPending ? 'Đang lưu...' : 'Lưu lại'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
