'use client';

import { useEffect, useState } from 'react';
import { Layers3, Store, Image as ImageIcon, Trash2, CheckCircle2, RefreshCw, Video } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  product: any;
  categories: any[];
  branches: any[];
  variants: any[];
  setVariants: React.Dispatch<React.SetStateAction<any[]>>;
  pending: boolean;
  mediaLoading: boolean;
  onReplaceImage: (imageId: string, file: File) => void;
  onDeleteImage: (imageId: string) => void;
  onSetThumbnail: (imageId: string) => void;
  onReorderImages: (orders: Array<{ imageId: string; order: number }>) => void;
}

export function EditProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  branches,
  variants,
  setVariants,
  pending,
  mediaLoading,
  onReplaceImage,
  onDeleteImage,
  onSetThumbnail,
  onReorderImages,
}: EditProductModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [youtubeId, setYoutubeId] = useState<string>('');
  const [imageOrders, setImageOrders] = useState<Record<string, number>>({});

  // Tiện ích lấy URL hình ảnh - khai báo trước useEffect để tránh lỗi "before initialization"
  const getFullImageUrl = (url: string) => {
    if (!url) return '/auth-image.webp';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const baseDomain = apiUrl.replace('/api/v1', '');
    return `${baseDomain}${url}`;
  };

  useEffect(() => {
    if (product) {
      setSelectedCategoryId(product.category?._id || product.category || '');
      setVideoUrl(product.video || '');
      
      // Lấy ảnh đại diện làm preview ban đầu
      const mainImg = product.images?.find((img: any) => img.isThumbnail) || product.images?.[0];
      if (mainImg) {
        setImagePreviewUrl(getFullImageUrl(mainImg.url));
      } else {
        setImagePreviewUrl('');
      }

      // Nạp thứ tự ảnh
      const initialOrders: Record<string, number> = {};
      if (product.images) {
        product.images.forEach((img: any) => {
          initialOrders[img._id] = img.order || 0;
        });
      }
      setImageOrders(initialOrders);
    } else {
      setSelectedCategoryId('');
      setImagePreviewUrl('');
      setVideoUrl('');
      setYoutubeId('');
      setImageOrders({});
    }
  }, [product, isOpen]);

  // Phân tích ID video YouTube
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

  if (!isOpen || !product) return null;

  const handleOrderChange = (imageId: string, val: number) => {
    setImageOrders((prev) => ({
      ...prev,
      [imageId]: val,
    }));
  };

  const triggerReorderSubmit = () => {
    const orders = Object.entries(imageOrders).map(([imageId, order]) => ({
      imageId,
      order: Number(order),
    }));
    onReorderImages(orders);
  };



  // Kiểm tra xem danh mục có thuộc Điện thoại/Laptop/Macbook không
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
      <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
        
        {/* Tiêu đề */}
        <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
          <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>
            Sửa sản phẩm: {product.name}
          </h3>
          <button
            onClick={onClose}
            className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
          >
            ✕
          </button>
        </div>

        {/* Lưới 2 cột */}
        <div className='flex-1 overflow-y-auto p-6 md:grid md:grid-cols-5 md:gap-6 space-y-6 md:space-y-0'>
          
          {/* Cột trái Form và biến thể */}
          <form
            onSubmit={onSubmit}
            className='col-span-3 space-y-5 text-sm text-slate-700 dark:text-slate-300'
            encType='multipart/form-data'
          >
            {/* ==========================================
                HÀNG ĐẦU: PREVIEW ẢNH & VIDEO CỦA SẢN PHẨM SỬA
                ========================================== */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              {/* Preview ảnh */}
              <div className='space-y-2'>
                <span className='text-xs font-bold text-slate-500 uppercase block'>
                  Ảnh đại diện chính hiện tại
                </span>
                <div 
                  onClick={() => document.getElementById('edit_main_image_input')?.click()}
                  className='h-48 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 overflow-hidden cursor-pointer hover:border-didongviet-red transition-colors p-1'
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
                      <p className='text-xs font-bold'>Nhấp vào để chọn ảnh đại diện sản phẩm</p>
                    </div>
                  )}
                </div>
                <input
                  id='edit_main_image_input'
                  name='images'
                  type='file'
                  multiple
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImagePreviewUrl(URL.createObjectURL(file));
                  }}
                  className='hidden'
                />
              </div>

              {/* Preview video */}
              <div className='space-y-2'>
                <span className='text-xs font-bold text-slate-500 uppercase block'>
                  Video giới thiệu sản phẩm (YouTube)
                </span>
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

            {/* Link Video YouTube */}
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase flex items-center gap-1'>
                <Video size={14} className='text-red-600' />
                <span>Liên kết video YouTube</span>
              </label>
              <Input
                name='video'
                placeholder='Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className='py-5 rounded-xl border-slate-200 text-sm'
              />
            </div>

            {/* Các trường thông tin cơ bản */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>
                  Tên sản phẩm chính
                </label>
                <Input
                  name='name'
                  defaultValue={product.name}
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
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  required
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

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>
                  Thương hiệu
                </label>
                <Input
                  name='brand'
                  defaultValue={product.brand}
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
                  defaultValue={product.isUsed ? 'true' : 'false'}
                  className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'
                >
                  <option value='false'>Máy Mới Nguyên Seal (100%)</option>
                  <option value='true'>Máy Likenew / Cũ Giá Rẻ</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>
                  Ưu đãi D.Member (%)
                </label>
                <Input
                  name='discountDMember'
                  type='number'
                  defaultValue={product.discountDMember}
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
                  defaultValue={product.tradeInBonus}
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
                defaultValue={product.description || ''}
                rows={3}
                className='w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs focus:border-didongviet-red outline-none'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-slate-500 uppercase block'>
                Tải ảnh phụ mới (Chọn thêm tối đa 6 ảnh)
              </label>
              <Input
                name='images'
                type='file'
                multiple
                accept='image/*'
                className='py-3 border-dashed rounded-xl cursor-pointer w-full text-xs'
              />
            </div>

            {/* Cấu hình các phiên bản biến thể */}
            <div className='space-y-3.5 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1'>
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
                  className='p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-3.5 relative shadow-xs'
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

                  <div className='grid grid-cols-2 md:grid-cols-6 gap-2.5'>
                    <div className='space-y-1 col-span-2 md:col-span-1'>
                      <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                        Màu sắc
                      </span>
                      <Input
                        name={`variant_${idx}_color`}
                        defaultValue={v.color}
                        required
                        className='h-8 py-2 rounded-lg text-xs'
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
                          />
                        </div>
                      </>
                    )}

                    <div className='space-y-1 col-span-2 md:col-span-1'>
                      <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                        SKU
                      </span>
                      <Input
                        name={`variant_${idx}_sku`}
                        defaultValue={v.sku}
                        required
                        className='h-8 py-2 rounded-lg text-xs font-mono'
                      />
                    </div>
                    <div className='space-y-1'>
                      <span className='text-[9px] font-bold text-slate-400 block uppercase'>
                        Giá gốc
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
                        Giá KM
                      </span>
                      <Input
                        name={`variant_${idx}_salePrice`}
                        type='number'
                        defaultValue={v.salePrice}
                        className='h-8 py-2 rounded-lg text-xs'
                      />
                    </div>
                  </div>

                  {/* Ảnh biến thể */}
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

                  {/* Phân bổ tồn kho */}
                  <div className='pt-2 border-t border-dashed border-slate-100 dark:border-slate-800 space-y-2'>
                    <span className='text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider'>
                      <Store size={10} className='text-blue-500' />
                      <span>Phân bổ tồn kho theo chi nhánh</span>
                    </span>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                      {branches.map((b) => {
                        const existInv = v.inventory?.find(
                          (inv: any) =>
                            (inv.branch?._id || inv.branch) === b._id,
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
                {pending ? 'Đang lưu...' : 'Lưu lại thay đổi'}
              </Button>
            </div>
          </form>

          {/* Cột phải Quản lý Media ảnh sản phẩm */}
          <div className='col-span-2 space-y-4 border-t md:border-t-0 md:border-l border-slate-150 dark:border-slate-800/80 pt-6 md:pt-0 md:pl-6 flex flex-col justify-start relative'>
            <div className='flex items-center justify-between'>
              <span className='text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase'>
                <ImageIcon size={15} className='text-didongviet-red' />
                <span>Kho Ảnh sản phẩm ({product.images?.length || 0})</span>
              </span>
              {product.images && product.images.length > 1 && (
                <Button
                  onClick={triggerReorderSubmit}
                  disabled={mediaLoading}
                  variant='outline'
                  size='sm'
                  className='text-[9px] h-7 border-slate-200 hover:text-didongviet-red rounded-lg font-bold flex items-center gap-1'
                >
                  <RefreshCw size={10} />
                  Lưu thứ tự
                </Button>
              )}
            </div>

            {mediaLoading && (
              <div className='absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs z-10 flex items-center justify-center'>
                <div className='flex flex-col items-center gap-2'>
                  <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                  <span className='text-[10px] font-bold text-slate-500'>Đang xử lý media...</span>
                </div>
              </div>
            )}

            {!product.images || product.images.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950/20 border border-dashed border-slate-250 dark:border-slate-850 rounded-xl text-slate-400'>
                <ImageIcon size={32} className='text-slate-300 mb-1.5' />
                <span className='text-xs font-semibold'>Chưa có ảnh nào được cấu hình.</span>
              </div>
            ) : (
              <div className='space-y-3 max-h-[70vh] overflow-y-auto pr-1'>
                {product.images
                  .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                  .map((img: any) => (
                    <div
                      key={img._id}
                      className={`
                        p-3 bg-white dark:bg-slate-900 border rounded-xl flex items-center justify-between gap-3 shadow-xs transition-all
                        ${img.isThumbnail ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-150'}
                      `}
                    >
                      <div className='flex items-center gap-3 overflow-hidden flex-1'>
                        <div className='h-14 w-14 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 p-1 flex items-center justify-center flex-shrink-0'>
                          <img
                            src={getFullImageUrl(img.url)}
                            alt='Sản phẩm'
                            className='h-full w-full object-contain'
                          />
                        </div>

                        <div className='space-y-1 overflow-hidden flex-1'>
                          <div className='flex items-center gap-1.5'>
                            {img.isThumbnail && (
                              <span className='text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5'>
                                <CheckCircle2 size={8} /> Thumbnail
                              </span>
                            )}
                            <span className='text-[8px] font-mono text-slate-400 block truncate'>
                              ID: {img._id}
                            </span>
                          </div>

                          <div className='flex items-center gap-1'>
                            <span className='text-[9px] font-bold text-slate-400 uppercase'>Thứ tự:</span>
                            <Input
                              type='number'
                              value={imageOrders[img._id] ?? 0}
                              onChange={(e) => handleOrderChange(img._id, Number(e.target.value))}
                              className='h-6 w-12 text-center text-[10px] font-bold px-1 border-slate-200'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-col gap-1.5 flex-shrink-0'>
                        {!img.isThumbnail && (
                          <Button
                            type='button'
                            onClick={() => onSetThumbnail(img._id)}
                            variant='ghost'
                            className='h-6 px-1.5 text-[8px] font-bold hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 border-none'
                          >
                            Đại diện
                          </Button>
                        )}

                        <div className='relative'>
                          <input
                            type='file'
                            accept='image/*'
                            id={`replace_${img._id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onReplaceImage(img._id, file);
                            }}
                            className='hidden'
                          />
                          <Button
                            type='button'
                            onClick={() => document.getElementById(`replace_${img._id}`)?.click()}
                            variant='ghost'
                            className='h-6 px-1.5 text-[8px] font-bold hover:bg-blue-50 text-blue-600 hover:text-blue-700 border-none w-full'
                          >
                            Đổi ảnh
                          </Button>
                        </div>

                        <Button
                          type='button'
                          onClick={() => onDeleteImage(img._id)}
                          variant='ghost'
                          className='h-6 px-1.5 text-[8px] font-bold hover:bg-red-50 text-red-500 hover:text-red-600 border-none flex items-center gap-0.5'
                        >
                          <Trash2 size={10} /> Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
