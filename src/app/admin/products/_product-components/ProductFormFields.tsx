'use client';

import { useEffect, useState } from 'react';
import { Layers3, Image as ImageIcon, Trash2, Video, Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { CategorySelectDropdown } from '@/app/admin/_components/shared/CategorySelectDropdown';

const getBackendUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
    .replace('/api/v1', '');
  return `${backendBase}${url}`;
};

interface ProductFormFieldsProps {
  categories: any[];
  branches: any[];
  variants: any[];
  setVariants: React.Dispatch<React.SetStateAction<any[]>>;
  productData?: any; // Chỉ truyền khi ở chế độ Edit
  isEditMode?: boolean;
}
interface ImageSlotType {
  id: string;
  type: 'url' | 'file';
  url?: string;
  file: File | null;
  previewUrl: string;
}

export function ProductFormFields({
  categories,
  branches,
  variants,
  setVariants,
  productData,
  isEditMode = false,
}: ProductFormFieldsProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [youtubeId, setYoutubeId] = useState<string>('');

  const [urlInputModal, setUrlInputModal] = useState<{
    isOpen: boolean;
    variantIndex: number;
    value: string;
  } | null>(null);
  const [mainSubUrlInputModal, setMainSubUrlInputModal] = useState<{
    isOpen: boolean;
    slotIndex: number;
    value: string;
  } | null>(null);

  const [imageSlots, setImageSlots] = useState<ImageSlotType[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const triggerFileSelector = (idx: number) => {
    setActiveInputIndex(idx);
    const input = document.getElementById(`${isEditMode ? 'edit' : 'create'}-file-uploader`) as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  };

  const [selectedBranchIds, setSelectedBranchIds] = useState<
    Record<number, string>
  >({});

  // Đổ dữ liệu cũ nếu ở Edit Mode
  useEffect(() => {
    if (isEditMode && productData) {
      setSelectedCategoryId(
        productData.category?._id || productData.category || '',
      );
      setVideoUrl(productData.video || '');

      if (productData.images && Array.isArray(productData.images)) {
        const initialSlots = productData.images.map((img: any, idx: number) => ({
          id: img._id || `img-${idx}-${Date.now()}-${Math.random()}`,
          type: 'url',
          url: img.url,
          file: null,
          previewUrl: getBackendUrl(img.url),
        }));
        setImageSlots(initialSlots);
        if (initialSlots[0]?.previewUrl) {
          setImagePreviewUrl(initialSlots[0].previewUrl);
        }
      } else {
        setImageSlots([]);
      }
      setDeletedImages([]);
    }
  }, [isEditMode, productData]);

  // Phân tích ID Youtube khi videoUrl đổi
  useEffect(() => {
    if (videoUrl) {
      const match = videoUrl.match(
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/,
      );
      setYoutubeId(match && match[2].length === 11 ? match[2] : '');
    } else {
      setYoutubeId('');
    }
  }, [videoUrl]);

  // Quản lý kho hàng chi nhánh hiển thị
  useEffect(() => {
    if (branches?.length > 0) {
      const initialBranches: Record<number, string> = {};
      variants.forEach((v, idx) => {
        const firstInv = v.inventory?.[0];
        initialBranches[idx] =
          firstInv?.branch?._id || firstInv?.branch || branches[0]._id;
      });
      setSelectedBranchIds(initialBranches);
    }
  }, [branches, variants.length]);

  // Đóng gói mảng ảnh state & files cục bộ vào DOM ảo trước khi form cha submit
  useEffect(() => {
    const stateInputId = isEditMode
      ? 'edit_hidden_images_state_input'
      : 'hidden_images_state_input';
    const deletedInputId = isEditMode
      ? 'edit_hidden_deleted_images_input'
      : 'hidden_deleted_images_input';
    const fileInputId = isEditMode
      ? 'edit_hidden_images_input'
      : 'hidden_images_input';
    const varInputId = isEditMode
      ? 'edit_hidden_variant_images_input'
      : 'hidden_variant_images_input';

    // 1. Đóng gói imagesState
    const stateEl = document.getElementById(stateInputId) as HTMLInputElement;
    if (stateEl) {
      let fileCounter = 0;
      const stateArr = imageSlots.map((s) => {
        if (s.type === 'url') {
          return { type: 'url', url: s.url };
        } else {
          const res = { type: 'file', fileIndex: fileCounter };
          fileCounter++;
          return res;
        }
      });
      stateEl.value = JSON.stringify(stateArr);
    }

    // 2. Đóng gói deletedImages
    const deletedEl = document.getElementById(deletedInputId) as HTMLInputElement;
    if (deletedEl) {
      deletedEl.value = JSON.stringify(deletedImages);
    }

    // 3. Đóng gói files chính sản phẩm
    const fileEl = document.getElementById(fileInputId) as HTMLInputElement;
    if (fileEl) {
      const dt = new DataTransfer();
      let fileCounter = 0;
      imageSlots.forEach((s) => {
        if (s.type === 'file' && s.file) {
          dt.items.add(
            new File([s.file], `prodimg_${fileCounter}_${s.file.name}`, {
              type: s.file.type,
            })
          );
          fileCounter++;
        }
      });
      fileEl.files = dt.files;
    }

    // 4. Đóng gói files variant
    const varEl = document.getElementById(varInputId) as HTMLInputElement;
    if (varEl) {
      const dt = new DataTransfer();
      variants.forEach(
        (v, i) =>
          v.file &&
          dt.items.add(
            new File([v.file], `variant_${i}_${v.file.name}`, {
              type: v.file.type,
            }),
          ),
      );
      varEl.files = dt.files;
    }
  }, [imageSlots, deletedImages, variants, isEditMode]);

  const handleMainSubUrlConfirm = (slotIndex: number, url: string) => {
    if (!url) return;
    const newSlot: ImageSlotType = {
      id: `url-${Date.now()}-${Math.random()}`,
      type: 'url',
      url,
      file: null,
      previewUrl: url,
    };
    setImageSlots((prev) => {
      const next = [...prev];
      if (slotIndex >= next.length) {
        next.push(newSlot);
      } else {
        if (next[slotIndex].type === 'file' && next[slotIndex].previewUrl) {
          URL.revokeObjectURL(next[slotIndex].previewUrl);
        }
        if (next[slotIndex].type === 'url' && next[slotIndex].url) {
          const isFromDB = productData?.images?.some((img: any) => img.url === next[slotIndex].url);
          if (isFromDB || next[slotIndex].url?.startsWith('/uploads/')) {
            setDeletedImages((d) => [...d, next[slotIndex].url!]);
          }
        }
        next[slotIndex] = newSlot;
      }
      return next;
    });
  };

  const handleRemoveImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageSlots((prev) => {
      const next = [...prev];
      const target = next[index];
      if (target.type === 'file' && target.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      if (target.type === 'url' && target.url) {
        const isFromDB = productData?.images?.some((img: any) => img.url === target.url);
        if (isFromDB || target.url?.startsWith('/uploads/')) {
          setDeletedImages((d) => [...d, target.url!]);
        }
      }
      next.splice(index, 1);
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const srcIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(srcIndex) || srcIndex === targetIndex) return;
    setImageSlots((prev) => {
      const next = [...prev];
      const [draggedItem] = next.splice(srcIndex, 1);
      next.splice(targetIndex, 0, draggedItem);
      return next;
    });
  };

  const handleStockChange = (idx: number, branchId: string, value: number) => {
    setVariants((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const inventory = [...(item.inventory || [])];
        const eIdx = inventory.findIndex(
          (inv: any) => (inv.branch?._id || inv.branch) === branchId,
        );
        if (eIdx > -1) inventory[eIdx] = { ...inventory[eIdx], stock: value };
        else inventory.push({ branch: branchId, stock: value });
        return { ...item, inventory };
      }),
    );
  };

  const formatNumber = (val: any) =>
    val
      ? new Intl.NumberFormat('vi-VN').format(
          parseInt(val.toString().replace(/\D/g, ''), 10),
        )
      : '';

  return (
    <div className='space-y-5'>
      {/* Inputs File Ẩn để hứng Form Data */}
      <input
        id={isEditMode ? 'edit_hidden_images_input' : 'hidden_images_input'}
        type='file'
        name='images'
        multiple
        className='hidden'
      />
      <input
        id={
          isEditMode
            ? 'edit_hidden_variant_images_input'
            : 'hidden_variant_images_input'
        }
        type='file'
        name='variantImages'
        multiple
        className='hidden'
      />
      <input
        id={
          isEditMode
            ? 'edit_hidden_images_state_input'
            : 'hidden_images_state_input'
        }
        type='hidden'
        name='imagesState'
      />
      <input
        id={
          isEditMode
            ? 'edit_hidden_deleted_images_input'
            : 'hidden_deleted_images_input'
        }
        type='hidden'
        name='deletedImages'
      />

      {/* Uploader File ẩn dùng chung */}
      <input
        id={`${isEditMode ? 'edit' : 'create'}-file-uploader`}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && activeInputIndex !== null) {
            const newSlot: ImageSlotType = {
              id: `file-${Date.now()}-${Math.random()}`,
              type: 'file',
              file: f,
              previewUrl: URL.createObjectURL(f),
            };
            setImageSlots((prev) => {
              const next = [...prev];
              if (activeInputIndex >= next.length) {
                next.push(newSlot);
              } else {
                if (next[activeInputIndex].type === 'file' && next[activeInputIndex].previewUrl) {
                  URL.revokeObjectURL(next[activeInputIndex].previewUrl);
                }
                if (next[activeInputIndex].type === 'url' && next[activeInputIndex].url) {
                  const isFromDB = productData?.images?.some((img: any) => img.url === next[activeInputIndex].url);
                  if (isFromDB || next[activeInputIndex].url?.startsWith('/uploads/')) {
                    setDeletedImages((d) => [...d, next[activeInputIndex].url!]);
                  }
                }
                next[activeInputIndex] = newSlot;
              }
              return next;
            });
          }
        }}
      />

      {/* KHUNG MEDIA PREVIEW */}
      <div className='grid grid-cols-1 lg:grid-cols-7 gap-5'>
        <div className='lg:col-span-2 space-y-2'>
          <label className='text-xs font-bold text-slate-500 uppercase block'>
            Video YouTube sản phẩm
          </label>
          <div className='h-44 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 overflow-hidden p-1'>
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title='YouTube'
                className='w-full h-full border-none rounded-lg'
                allowFullScreen
              />
            ) : (
              <div className='text-center text-slate-400 text-[10px]'>
                <Video size={28} className='mx-auto mb-1' />
                Không có video
              </div>
            )}
          </div>
        </div>

        <div className='lg:col-span-2 space-y-2 flex flex-col'>
          <label className='text-xs font-bold text-slate-500 uppercase block'>
            Ảnh đại diện chính
          </label>
          <div
            draggable={imageSlots.length > 0}
            onDragStart={(e) => handleDragStart(e, 0)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 0)}
            onClick={() => {
              if (imageSlots[0]) {
                triggerFileSelector(0);
              } else {
                triggerFileSelector(imageSlots.length);
              }
            }}
            className='relative h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer p-1'
          >
            {imageSlots[0] ? (
              <>
                <img
                  src={imageSlots[0].previewUrl}
                  alt='Main'
                  className='h-full w-full object-contain'
                />
                <button
                  type='button'
                  onClick={(e) => handleRemoveImage(0, e)}
                  className='absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 border-none cursor-pointer z-10'
                >
                  <Trash2 size={12} />
                </button>
              </>
            ) : (
              <div className='text-center text-slate-400 text-[10px]'>
                <ImageIcon size={28} className='mx-auto mb-1' />
                Chọn ảnh chính
              </div>
            )}
          </div>
          <button
            type='button'
            onClick={() =>
              setMainSubUrlInputModal({
                isOpen: true,
                slotIndex: imageSlots[0] ? 0 : imageSlots.length,
                value: imageSlots[0]?.previewUrl || '',
              })
            }
            className='text-[10px] text-slate-400 hover:text-didongviet-red underline self-center font-bold bg-transparent border-none mt-1 cursor-pointer'
          >
            {imageSlots[0] ? 'Đổi URL ảnh' : 'Nhập URL ảnh'}
          </button>
        </div>

        <div className='lg:col-span-3 space-y-2'>
          <label className='text-xs font-bold text-slate-500 uppercase block'>
            5 Ảnh phụ (Kéo thả để đổi vị trí)
          </label>
          <div className='grid grid-cols-5 gap-2 h-44 items-center'>
            {[1, 2, 3, 4, 5].map((index) => {
              const slot = imageSlots[index];
              const isAvailable = index <= imageSlots.length;
              const isPlaceholder = index === imageSlots.length;

              return (
                <div
                  key={index}
                  className='flex flex-col items-center gap-1 w-full'
                >
                  <div
                    draggable={!!slot}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => {
                      if (slot) {
                        triggerFileSelector(index);
                      } else if (isPlaceholder) {
                        triggerFileSelector(imageSlots.length);
                      }
                    }}
                    className={`relative h-28 w-full rounded-xl border border-dashed flex items-center justify-center p-1 ${
                      slot
                        ? 'border-slate-200 bg-white cursor-pointer'
                        : isPlaceholder
                        ? 'border-slate-300 bg-slate-50 cursor-pointer hover:border-slate-400'
                        : 'border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {slot ? (
                      <>
                        <img
                          src={slot.previewUrl}
                          alt={`Sub ${index}`}
                          className='h-full w-full object-contain'
                        />
                        <button
                          type='button'
                          onClick={(e) => handleRemoveImage(index, e)}
                          className='absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 border-none cursor-pointer z-10'
                        >
                          <Trash2 size={10} />
                        </button>
                      </>
                    ) : (
                      <div className='text-center text-slate-400'>
                        <Plus size={16} className='mx-auto' />
                        <span className='text-[8px] block font-bold'>
                          {isPlaceholder ? 'Thêm ảnh' : `Trống ${index}`}
                        </span>
                      </div>
                    )}
                  </div>
                  {isAvailable ? (
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainSubUrlInputModal({
                          isOpen: true,
                          slotIndex: slot ? index : imageSlots.length,
                          value: slot?.previewUrl || '',
                        });
                      }}
                      className='text-[9px] text-slate-400 hover:text-didongviet-red underline font-bold bg-transparent border-none cursor-pointer'
                    >
                      {slot ? 'Đổi URL' : 'Nhập URL'}
                    </button>
                  ) : (
                    <span className='text-[9px] text-slate-300 font-bold select-none'>
                      -
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CÁC TRƯỜNG THÔNG TIN CƠ BẢN */}
      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-slate-500 uppercase flex items-center gap-1'>
          <Video size={14} className='text-red-600' />
          Liên kết video YouTube
        </label>
        <Input
          name='video'
          placeholder='https://www.youtube.com/watch?v=...'
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className='py-5 rounded-xl text-sm'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase'>
            Tên sản phẩm chính
          </label>
          <Input
            name='name'
            defaultValue={productData?.name}
            placeholder='Ví dụ: iPhone 16 Pro Max'
            required
            className='py-5 rounded-xl text-sm'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase'>
            Ngành hàng / Danh mục
          </label>
          <input
            type='hidden'
            name='category'
            value={selectedCategoryId}
            required
          />
          <CategorySelectDropdown
            categoriesData={categories}
            value={selectedCategoryId}
            onChange={(id) => setSelectedCategoryId(id)}
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase'>
            Thương hiệu
          </label>
          <Input
            name='brand'
            defaultValue={productData?.brand}
            placeholder='Ví dụ: Apple, Samsung'
            required
            className='py-5 rounded-xl text-sm'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase'>
            Trạng thái máy
          </label>
          <select
            name='isUsed'
            defaultValue={productData?.isUsed?.toString() || 'false'}
            className='w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-sm outline-hidden'
          >
            <option value='false'>Máy Mới Nguyên Seal (100%)</option>
            <option value='true'>Máy Cũ / Likenew Giá Rẻ</option>
          </select>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase'>
            Ưu đãi D.Member (%)
          </label>
          <Input
            name='discountDMember'
            type='number'
            defaultValue={productData?.discountDMember || '1'}
            required
            className='py-5 rounded-xl text-sm'
          />
        </div>
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-slate-500 uppercase'>
            Trợ giá thu cũ đổi mới (VNĐ)
          </label>
          <Input
            name='tradeInBonus'
            type='number'
            defaultValue={productData?.tradeInBonus || '0'}
            className='py-5 rounded-xl text-sm'
          />
        </div>
      </div>

      <div className='space-y-1.5'>
        <label className='text-xs font-bold text-slate-500 uppercase'>
          Mô tả tóm tắt thông số kỹ thuật
        </label>
        <textarea
          name='description'
          defaultValue={productData?.description}
          placeholder='Mô tả sản phẩm...'
          rows={3}
          className='w-full p-2.5 border border-slate-200 rounded-xl bg-white text-xs outline-hidden'
        />
      </div>

      {/* PHẦN CẤU HÌNH BIẾN THỂ */}
      <div className='space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-black text-slate-700 uppercase flex items-center gap-1.5'>
            <Layers3 size={14} className='text-didongviet-red' />
            Phiên bản biến thể ({variants.length})
          </span>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-[10px] text-didongviet-red font-bold'
            onClick={() =>
              setVariants([
                ...variants,
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

        <div className='space-y-4'>
          {variants.map((v, idx) => {
            const currentBranchId =
              selectedBranchIds[idx] || branches[0]?._id || '';
            const existInv = v.inventory?.find(
              (inv: any) => (inv.branch?._id || inv.branch) === currentBranchId,
            );
            const totalStock =
              v.inventory?.reduce(
                (sum: number, inv: any) => sum + (parseInt(inv.stock) || 0),
                0,
              ) || 0;

            return (
              <div
                key={idx}
                className='flex flex-col lg:flex-row gap-4 p-4 bg-white rounded-xl border border-slate-200 relative shadow-2xs'
              >
                {variants.length > 1 && (
                  <button
                    type='button'
                    onClick={() =>
                      setVariants(variants.filter((_, i) => i !== idx))
                    }
                    className='absolute right-2 top-2 text-xs text-red-500 border-none bg-transparent cursor-pointer'
                  >
                    ✕
                  </button>
                )}

                <div className='flex-shrink-0 flex flex-col items-center justify-center'>
                  <div
                    onClick={() =>
                      document
                        .getElementById(
                          `${isEditMode ? 'edit' : 'create'}-var-file-${idx}`,
                        )
                        ?.click()
                    }
                    className='relative w-24 h-24 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden'
                  >
                    {v.previewUrl || v.variantImage ? (
                      <img
                        src={v.previewUrl || getBackendUrl(v.variantImage)}
                        alt='Var'
                        className='w-full h-full object-contain'
                      />
                    ) : (
                      <div className='text-center text-slate-400 text-[9px]'>
                        <ImageIcon size={20} className='mx-auto' />
                        Ảnh
                      </div>
                    )}
                  </div>
                  <button
                    type='button'
                    onClick={() =>
                      setUrlInputModal({
                        isOpen: true,
                        variantIndex: idx,
                        value: v.variantImage || '',
                      })
                    }
                    className='text-[9px] text-slate-400 hover:text-didongviet-red underline bg-transparent border-none mt-1 cursor-pointer'
                  >
                    Nhập URL
                  </button>
                  <input
                    id={`${isEditMode ? 'edit' : 'create'}-var-file-${idx}`}
                    type='file'
                    accept='image/*'
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file)
                        setVariants(
                          variants.map((item, i) =>
                            i === idx
                              ? {
                                  ...item,
                                  file,
                                  previewUrl: URL.createObjectURL(file),
                                  variantImage: '',
                                }
                              : item,
                          ),
                        );
                    }}
                  />
                  <input
                    type='hidden'
                    name={`variant_${idx}_variantImage`}
                    value={v.variantImage || ''}
                  />
                </div>

                <div className='flex-1 space-y-3.5'>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3'>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        Màu
                      </span>
                      <Input
                        name={`variant_${idx}_color`}
                        defaultValue={v.color}
                        required
                        className='h-8 text-xs'
                      />
                    </div>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        RAM
                      </span>
                      <Input
                        name={`variant_${idx}_ram`}
                        defaultValue={v.ram}
                        required
                        className='h-8 text-xs'
                      />
                    </div>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        ROM
                      </span>
                      <Input
                        name={`variant_${idx}_rom`}
                        defaultValue={v.rom}
                        required
                        className='h-8 text-xs'
                      />
                    </div>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        SKU
                      </span>
                      <Input
                        name={`variant_${idx}_sku`}
                        defaultValue={v.sku}
                        required
                        className='h-8 text-xs font-mono'
                      />
                    </div>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        Giá gốc
                      </span>
                      <Input
                        type='text'
                        value={formatNumber(v.price)}
                        onChange={(e) =>
                          setVariants(
                            variants.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    price: e.target.value.replace(/\D/g, ''),
                                  }
                                : item,
                            ),
                          )
                        }
                        required
                        className='h-8 text-xs font-bold'
                      />
                      <input
                        type='hidden'
                        name={`variant_${idx}_price`}
                        value={v.price || ''}
                      />
                    </div>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        Giá KM
                      </span>
                      <Input
                        type='text'
                        value={formatNumber(v.salePrice)}
                        onChange={(e) =>
                          setVariants(
                            variants.map((item, i) =>
                              i === idx
                                ? {
                                    ...item,
                                    salePrice: e.target.value.replace(
                                      /\D/g,
                                      '',
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                        className='h-8 text-xs font-bold text-didongviet-red'
                      />
                      <input
                        type='hidden'
                        name={`variant_${idx}_salePrice`}
                        value={v.salePrice || ''}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-dashed border-slate-100'>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        Chi nhánh
                      </span>
                      <select
                        value={currentBranchId}
                        onChange={(e) =>
                          setSelectedBranchIds({
                            ...selectedBranchIds,
                            [idx]: e.target.value,
                          })
                        }
                        className='w-full py-1.5 px-2 border border-slate-200 rounded-lg bg-white text-xs outline-hidden'
                      >
                        {branches.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        Tồn kho
                      </span>
                      <Input
                        type='number'
                        value={existInv ? existInv.stock : 0}
                        onChange={(e) =>
                          handleStockChange(
                            idx,
                            currentBranchId,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className='h-8 text-xs font-bold'
                      />
                    </div>
                    <div>
                      <span className='text-[10px] text-slate-400 block uppercase font-bold'>
                        Tổng kho
                      </span>
                      <Input
                        type='text'
                        readOnly
                        value={`${totalStock} sản phẩm`}
                        className='h-8 text-xs bg-slate-50 font-bold text-emerald-600 border-none'
                      />
                    </div>
                    {branches.map((b) => {
                      const invVal = v.inventory?.find(
                        (inv: any) => (inv.branch?._id || inv.branch) === b._id,
                      );
                      return (
                        <input
                          key={b._id}
                          type='hidden'
                          name={`variant_${idx}_branch_${b._id}`}
                          value={invVal ? invVal.stock : '0'}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CÁC SUB-MODALS NHẬP URL */}
      {urlInputModal?.isOpen && (
        <div className='fixed inset-0 z-[60] bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-xs'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl'>
            <h4 className='font-extrabold text-sm flex items-center gap-2'>
              <ImageIcon size={18} className='text-didongviet-red' /> Nhập liên
              kết hình ảnh biến thể
            </h4>
            <Input
              autoFocus
              placeholder='https://...'
              value={urlInputModal.value}
              onChange={(e) =>
                setUrlInputModal({ ...urlInputModal, value: e.target.value })
              }
              className='py-5 text-xs'
            />
            <div className='flex gap-2 justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setUrlInputModal(null)}
                className='h-9 text-xs rounded-xl'
              >
                Hủy
              </Button>
              <Button
                type='button'
                onClick={() => {
                  setVariants(
                    variants.map((item, i) =>
                      i === urlInputModal.variantIndex
                        ? {
                            ...item,
                            file: null,
                            previewUrl: urlInputModal.value,
                            variantImage: urlInputModal.value,
                          }
                        : item,
                    ),
                  );
                  setUrlInputModal(null);
                }}
                className='bg-didongviet-red text-white h-9 text-xs rounded-xl border-none px-4'
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {mainSubUrlInputModal?.isOpen && (
        <div className='fixed inset-0 z-[60] bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-xs'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl'>
            <h4 className='font-extrabold text-sm flex items-center gap-2'>
              <ImageIcon size={18} className='text-didongviet-red' /> Nhập liên
              kết hình ảnh{' '}
              {mainSubUrlInputModal.slotIndex === 0
                ? 'chính'
                : `phụ ${mainSubUrlInputModal.slotIndex}`}
            </h4>
            <Input
              autoFocus
              placeholder='https://...'
              value={mainSubUrlInputModal.value}
              onChange={(e) =>
                setMainSubUrlInputModal({
                  ...mainSubUrlInputModal,
                  value: e.target.value,
                })
              }
              className='py-5 text-xs'
            />
            <div className='flex gap-2 justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setMainSubUrlInputModal(null)}
                className='h-9 text-xs rounded-xl'
              >
                Hủy
              </Button>
              <Button
                type='button'
                onClick={() => {
                  handleMainSubUrlConfirm(
                    mainSubUrlInputModal.slotIndex,
                    mainSubUrlInputModal.value,
                  );
                  setMainSubUrlInputModal(null);
                }}
                className='bg-didongviet-red text-white h-9 text-xs rounded-xl border-none px-4'
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
