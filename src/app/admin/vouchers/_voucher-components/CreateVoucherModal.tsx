import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { HSSVTier } from '@/types/voucher';

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  createVoucherPending: boolean;
  voucherDiscountType: string;
  setVoucherDiscountType: (type: string) => void;
  hssvTiers: HSSVTier[];
  setHssvTiers: React.Dispatch<React.SetStateAction<HSSVTier[]>>;
}

export function CreateVoucherModal({
  isOpen,
  onClose,
  onSubmit,
  createVoucherPending,
  voucherDiscountType,
  setVoucherDiscountType,
  hssvTiers,
  setHssvTiers,
}: CreateVoucherModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
            Phát hành mã voucher mới
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
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Mã Voucher (In Hoa)
              </label>
              <Input
                name='code'
                placeholder='VÍ DỤ: DDV500K'
                required
                className='py-5 rounded-xl border-slate-200 text-sm font-mono'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Loại ưu đãi
              </label>
              <select
                name='discountType'
                value={voucherDiscountType}
                onChange={(e) => setVoucherDiscountType(e.target.value)}
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none focus:border-didongviet-red'
              >
                <option value='fixed'>Giảm giá tiền cố định </option>
                <option value='percentage'>Phần trăm hóa đơn </option>
                <option value='hssv_tiered'>Dành riêng cho Học sinh SV</option>
              </select>
            </div>

            <div className='space-y-1.5 md:col-span-2'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Mô tả nội dung
              </label>
              <Input
                name='description'
                placeholder='Giảm ngay 500K cho toàn bộ iPhone 15 Series...'
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>

            {voucherDiscountType !== 'hssv_tiered' ? (
              <>
                <div className='space-y-1.5 animate-in fade-in duration-200'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>
                    Mức giảm {voucherDiscountType === 'percentage' ? '(%)' : '(VNĐ)'}
                  </label>
                  <Input
                    name='discountValue'
                    type='number'
                    placeholder={voucherDiscountType === 'percentage' ? '10' : '200000'}
                    required
                    className='py-5 rounded-xl border-slate-200 text-sm'
                  />
                </div>
                <div className='space-y-1.5 animate-in fade-in duration-200'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>
                    Giảm tối đa (Nếu là %)
                  </label>
                  <Input
                    name='maxDiscount'
                    type='number'
                    placeholder='500000 (Để trống nếu ko giới hạn)'
                    className='py-5 rounded-xl border-slate-200 text-sm'
                  />
                </div>
              </>
            ) : (
              <div className='md:col-span-2 space-y-3 bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50 animate-in fade-in duration-200'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-bold text-purple-700 dark:text-purple-400'>
                    Cấu hình tầng giảm HSSV
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
                defaultValue='0'
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Chỉ riêng HSSV áp dụng?
              </label>
              <select
                name='isHSSVOnly'
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none focus:border-didongviet-red'
              >
                <option value='false'>Tất cả khách hàng</option>
                <option value='true'>Chỉ HSSV đã duyệt thẻ</option>
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Tổng lượt phát hành
              </label>
              <Input
                name='usageLimit'
                type='number'
                defaultValue='100'
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Lượt dùng / Khách hàng
              </label>
              <Input
                name='maxUsagePerUser'
                type='number'
                defaultValue='1'
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
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
          </div>

          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
            >
              Hủy bỏ
            </Button>
            <Button
              type='submit'
              disabled={createVoucherPending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
            >
              {createVoucherPending ? 'Đang tạo...' : 'Kích hoạt'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
