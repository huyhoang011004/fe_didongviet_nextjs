'use client';

import { useState, useEffect } from 'react';
import { Layers3, Store, Image as ImageIcon, Video, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  categories: any[];
  branches: any[];
  variants: any[];
  setVariants: React.Dispatch<React.SetStateAction<any[]>>;
  pending: boolean;
}

export function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  branches,
  variants,
  setVariants,
  pending,
}: CreateProductModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [youtubeId, setYoutubeId] = useState<string>('');

  // Quản lý 6 Image Slots (1 ảnh chính + 5 ảnh phụ)
  const [imageSlots, setImageSlots] = useState<Array<{
    id: string;
    file: File | null;
    previewUrl: string | null;
  }>>([
    { id: 'img-0', file: null, previewUrl: null }, // Ảnh chính
    { id: 'img-1', file: null, previewUrl: null }, // Ảnh phụ 1
    { id: 'img-2', file: null, previewUrl: null }, // Ảnh phụ 2
    { id: 'img-3', file: null, previewUrl: null }, // Ảnh phụ 3
    { id: 'img-4', file: null, previewUrl: null }, // Ảnh phụ 4
    { id: 'img-5', file: null, previewUrl: null }, // Ảnh phụ 5
  ]);

  // Quản lý chi nhánh đang được chọn để nhập của từng biến thể
  const [selectedBranchIds, setSelectedBranchIds] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategoryId('');
      setImagePreviewUrl('');
      setVideoUrl('');
      setYoutubeId('');
      setSelectedBranchIds({});
      // Thu hồi các URL preview tránh rò rỉ bộ nhớ
      imageSlots.forEach((slot) => {
        if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
      });
      setImageSlots([
        { id: 'img-0', file: null, previewUrl: null },
        { id: 'img-1', file: null, previewUrl: null },
        { id: 'img-2', file: null, previewUrl: null },
        { id: 'img-3', file: null, previewUrl: null },
        { id: 'img-4', file: null, previewUrl: null },
        { id: 'img-5', file: null, previewUrl: null },
      ]);
    }
  }, [isOpen]);

  // Tự động phân tích ID video YouTube từ link dán vào
  useEffect(() => {
    if (videoUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoUrl.match(regExp);
      if (match && match[2].length === 11) {
        setYoutubeId(match[2]);
      } else {
        setYoutubeId('');
      }
    } else {
      setYoutubeId('');
    }
  }, [videoUrl]);

  // Xử lý Click vào ô ảnh để mở trình chọn tệp
  const handleSlotClick = (index: number) => {
    document.getElementById(`selector-input-${index}`)?.click();
  };

  // Xử lý xóa tệp ảnh khỏi slot
  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageSlots((prev) => {
      const next = [...prev];
      if (next[index].previewUrl) URL.revokeObjectURL(next[index].previewUrl!);
      next[index] = {
        ...next[index],
        file: null,
        previewUrl: null,
      };
      if (index === 0) {
        setImagePreviewUrl('');
      }
      return next;
    });
    const el = document.getElementById(`selector-input-${index}`) as HTMLInputElement;
    if (el) el.value = '';
  };

  // Sự kiện Kéo thả HTML5
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    setImageSlots((prev) => {
      const next = [...prev];
      const temp = next[sourceIndex];
      next[sourceIndex] = next[targetIndex];
      next[targetIndex] = temp;

      if (sourceIndex === 0 || targetIndex === 0) {
        setImagePreviewUrl(next[0].previewUrl || '');
      }
      return next;
    });
  };

  // Quản lý tồn kho biến thể
  const handleBranchSelect = (idx: number, branchId: string) => {
    setSelectedBranchIds((prev) => ({
      ...prev,
      [idx]: branchId,
    }));
  };

  const handleStockChange = (idx: number, branchId: string, value: number) => {
    setVariants((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const inventory = [...(item.inventory || [])];
        const existIdx = inventory.findIndex(
          (inv: any) => (inv.branch?._id || inv.branch) === branchId
        );
        if (existIdx > -1) {
          inventory[existIdx] = { ...inventory[existIdx], stock: value };
        } else {
          inventory.push({ branch: branchId, stock: value });
        }
        return { ...item, inventory };
      })
    );
  };

  if (!isOpen) return null;

  // Hàm kiểm tra xem danh mục có thuộc Điện thoại/Laptop/Macbook không
  const checkShowRamRom = (catId: string) => {
    if (!catId) return false;
    const currentCat = categories.find((c) => c._id === catId);
    if (!currentCat) return false;

    const matchKeywords = (name: string) => {
      const lower = name.toLowerCase();
      return (
        lower.includes('điện thoại') ||
        lower.includes('phone') ||
        lower.includes('laptop') ||
        lower.includes('macbook') ||
        lower.includes('ipad') ||
        lower.includes('tablet') ||
        lower.includes('máy tính bảng')
      );
    };

    if (matchKeywords(currentCat.name)) return true;

    if (currentCat.parentCategory) {
      const parentId =
        typeof currentCat.parentCategory === 'object'
          ? currentCat.parentCategory._id
          : currentCat.parentCategory;
      const parentCat = categories.find((c) => c._id === parentId);
      if (parentCat && matchKeywords(parentCat.name)) {
        return true;
      }
    }

    return false;
  };

  const showRamRom = checkShowRamRom(selectedCategoryId);

  return (
    <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        
        {/* Tiêu đề Modal */}
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
            Khai báo sản phẩm mới
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
          className='p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300'
          encType='multipart/form-data'
        >
          {/* ==========================================
              HÀNG ĐẦU: KHUNG PREVIEW HÌNH ẢNH & VIDEO
              ========================================== */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {/* Preview hình ảnh */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-500 uppercase block'>
                Xem trước hình ảnh chính
              </label>
              <div 
                onClick={() => document.getElementById('main_image_input')?.click()}
                className='h-48 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/50 overflow-hidden cursor-pointer hover:border-didongviet-red transition-colors p-1'
              >
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt='Preview'
                    className='h-full w-full object-contain'
                  />
                ) : (
                  <div className='text-center space-y-2 p-4 text-slate-400'>
                    <ImageIcon size={36} className='mx-auto text-slate-300' />
                    <p className='text-xs font-bold'>Nhấp vào đây để chọn ảnh đại diện sản phẩm</p>
                  </div>
                )}
              </div>
              <input
                id='main_image_input'
                type='file'
                accept='image/*'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageSlots((prev) => {
                      const next = [...prev];
                      if (next[0].previewUrl) URL.revokeObjectURL(next[0].previewUrl!);
                      next[0] = { ...next[0], file, previewUrl: URL.createObjectURL(file) };
                      setImagePreviewUrl(next[0].previewUrl!);
                      return next;
                    });
                  }
                }}
                className='hidden'
              />
            </div>

            {/* Preview video */}
            <div className='space-y-2'>
              <label className='text-xs font-bold text-slate-500 uppercase block'>
                Xem trước video sản phẩm (YouTube)
              </label>
              <div className='h-48 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 overflow-hidden p-1'>
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title='YouTube video player'
                    className='w-full h-full border-none rounded-lg'
                    allowFullScreen
                  />
                ) : (
                  <div className='text-center space-y-2 p-4 text-slate-400'>
                    <Video size={36} className='mx-auto text-slate-300' />
                    <p className='text-xs font-bold'>Dán link video YouTube ở bên dưới để xem trước</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==========================================
              HÀNG 2: Ô NHẬP DÁN LINK VIDEO YOUTUBE
              ========================================== */}
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase flex items-center gap-1'>
              <Video size={14} className='text-red-600' />
              <span>Liên kết video thông số sản phẩm (YouTube Link)</span>
            </label>
            <Input
              name='video'
              placeholder='Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className='py-5 rounded-xl border-slate-200 text-sm'
            />
          </div>

          {/* ==========================================
              CÁC TRƯỜNG THÔNG TIN SẢN PHẨM PHÍA DƯỚI
              ========================================== */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Tên sản phẩm chính
              </label>
              <Input
                name='name'
                placeholder='Ví dụ: iPhone 16 Pro Max'
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Ngành hàng / Danh mục
              </label>
              <select
                name='category'
                required
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'
              >
                <option value=''>-- Chọn Danh Mục --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Thương hiệu
              </label>
              <Input
                name='brand'
                placeholder='Ví dụ: Apple, Samsung'
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Hàng đã qua sử dụng?
              </label>
              <select
                name='isUsed'
                className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'
              >
                <option value='false'>Máy Mới Nguyên Seal (100%)</option>
                <option value='true'>Máy Likenew / Cũ Giá Rẻ</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Ưu đãi thành viên D.Member (%)
              </label>
              <Input
                name='discountDMember'
                type='number'
                defaultValue='1'
                required
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase'>
                Trợ giá thu cũ đổi mới (VNĐ)
              </label>
              <Input
                name='tradeInBonus'
                type='number'
                defaultValue='0'
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-500 uppercase'>
              Mô tả tóm tắt thông số kỹ thuật
            </label>
            <textarea
              name='description'
              placeholder='iPhone 16 Pro Max sở hữu vi xử lý A18 Pro mạnh mẽ, camera zoom quang học 5x...'
              rows={3}
              className='w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs focus:border-didongviet-red outline-none'
            />
          </div>

          {/* Cấu hình các phiên bản biến thể */}
          <div className='space-y-3.5 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5'>
                <Layers3 size={14} className='text-didongviet-red' />
                <span>Cấu hình các phiên bản biến thể ({variants.length})</span>
              </span>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='text-[10px] text-didongviet-red font-bold hover:bg-red-50 border-none cursor-pointer'
                onClick={() =>
                  setVariants((prev) => [
                    ...prev,
                    {
                      color: '',
                      ram: '',
                      rom: '',
                      price: '',
                      salePrice: '',
                      sku: '',
                      variantImage: '',
                      inventory: [],
                    },
                  ])
                }
              >
                + Thêm phiên bản
              </Button>
            </div>

            {variants.map((v, idx) => (
              <div
                key={idx}
                className='p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-250 dark:border-slate-800 space-y-3.5 relative shadow-xs'
              >
                {variants.length > 1 && (
                  <button
                    type='button'
                    onClick={() =>
                      setVariants((prev) =>
                        prev.filter((_, i) => i !== idx),
                      )
                    }
                    className='absolute right-2 top-2 text-xs text-red-500 border-none bg-transparent cursor-pointer'
                  >
                    ✕
                  </button>
                )}

                <div className='grid grid-cols-2 md:grid-cols-6 gap-3'>
                  <div className='space-y-1 col-span-2 md:col-span-1'>
                    <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                      Màu sắc
                    </span>
                    <Input
                      name={`variant_${idx}_color`}
                      defaultValue={v.color}
                      required
                      className='h-8 py-2 rounded-lg text-xs'
                      placeholder='Sa Mạc'
                    />
                  </div>

                  {/* Hiển thị RAM / ROM thông minh dựa theo ngành hàng Điện thoại/Laptop/Macbook */}
                  {showRamRom && (
                    <>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                          RAM
                        </span>
                        <Input
                          name={`variant_${idx}_ram`}
                          defaultValue={v.ram}
                          required
                          className='h-8 py-2 rounded-lg text-xs'
                          placeholder='8GB'
                        />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                          ROM
                        </span>
                        <Input
                          name={`variant_${idx}_rom`}
                          defaultValue={v.rom}
                          required
                          className='h-8 py-2 rounded-lg text-xs'
                          placeholder='256GB'
                        />
                      </div>
                    </>
                  )}

                  <div className='space-y-1 col-span-2 md:col-span-1'>
                    <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                      Mã SKU
                    </span>
                    <Input
                      name={`variant_${idx}_sku`}
                      defaultValue={v.sku}
                      required
                      className='h-8 py-2 rounded-lg text-xs font-mono'
                      placeholder='IP16PM-256'
                    />
                  </div>
                  <div className='space-y-1'>
                    <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                      Giá gốc (VNĐ)
                    </span>
                    <Input
                      name={`variant_${idx}_price`}
                      type='number'
                      defaultValue={v.price}
                      required
                      className='h-8 py-2 rounded-lg text-xs'
                    />
                  </div>
                  <div className='space-y-1'>
                    <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                      Giá KM (VNĐ)
                    </span>
                    <Input
                      name={`variant_${idx}_salePrice`}
                      type='number'
                      defaultValue={v.salePrice}
                      className='h-8 py-2 rounded-lg text-xs'
                    />
                  </div>
                </div>

                {/* Trường variantImage riêng cho phiên bản */}
                <div className='grid grid-cols-1 gap-1.5 max-w-md'>
                  <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                    Đường dẫn ảnh riêng cho phiên bản (Variant Image URL)
                  </span>
                  <Input
                    name={`variant_${idx}_variantImage`}
                    defaultValue={v.variantImage || ''}
                    placeholder='Ví dụ: /uploads/products/variant-gold.png'
                    className='h-8 py-2 rounded-lg text-xs font-mono'
                  />
                </div>

                {/* Phân bổ tồn kho theo chi nhánh */}
                <div className='pt-2.5 border-t border-dashed border-slate-100 dark:border-slate-800 space-y-2'>
                  <span className='text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider'>
                    <Store size={10} className='text-blue-500' />
                    <span>Phân bổ tồn kho theo chi nhánh Di Động Việt</span>
                  </span>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    {branches.map((b) => {
                      const existInv = v.inventory?.find(
                        (inv: any) => inv.branch === b._id,
                      );
                      return (
                        <div
                          key={b._id}
                          className='flex items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80'
                        >
                          <span
                            className='font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[150px]'
                            title={b.name}
                          >
                            {b.name}
                          </span>
                          <Input
                            name={`variant_${idx}_branch_${b._id}`}
                            type='number'
                            defaultValue={existInv ? existInv.stock : '0'}
                            className='w-16 h-7 text-center font-bold py-1 px-1.5 rounded bg-white text-xs border border-slate-200'
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Các nút Submit Form */}
          <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-xs'
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={pending}
              className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs shadow-md'
            >
              {pending ? 'Đang lưu kho...' : 'Đưa lên quầy bán'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
