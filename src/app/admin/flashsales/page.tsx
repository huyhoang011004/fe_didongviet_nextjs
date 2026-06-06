'use client';

import { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Search,
  Check,
  X,
  RefreshCw,
  Eye,
  Settings,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  getFlashSalesAction,
  createFlashSaleAction,
  updateFlashSaleAction,
  deleteFlashSaleAction,
  toggleFlashSaleStatusAction,
  getFlashSaleByIdAction,
} from './flashsale-actions';
import { getProductsAction } from '../products/product-actions';

interface FlashSaleProductInput {
  product: string;
  name: string;
  originalPrice: number;
  flashSalePrice: number;
  flashSaleStock: number;
  userLimit: number;
}

export default function AdminFlashSalesPage() {
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    timeSlots: '9, 12, 15, 21', // Nhập dạng chuỗi ngăn cách bởi dấu phẩy
    duration: 60,
    isActive: true,
  });
  const [selectedProducts, setSelectedProducts] = useState<FlashSaleProductInput[]>([]);

  // Search & Choose Products State
  const [productSearch, setProductSearch] = useState('');
  const [searchedProducts, setSearchedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch Flash Sales List
  const loadFlashSales = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getFlashSalesAction(page, 8);
      if (res.success) {
        setFlashSales(res.data);
        setTotalPages(res.totalPages);
        setTotalCount(res.totalCount);
        setCurrentPage(res.currentPage);
      } else {
        alert(res.message || 'Lỗi khi tải danh sách Flash Sale');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlashSales(currentPage);
  }, [currentPage]);

  // Load Products for Selection
  useEffect(() => {
    if (!isFormOpen) return;

    const timer = setTimeout(async () => {
      setLoadingProducts(true);
      try {
        const res = await getProductsAction(1, 15, productSearch);
        if (res.success) {
          setSearchedProducts(res.products);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [productSearch, isFormOpen]);

  // Handle Action: Toggle Status
  const handleToggleStatus = async (id: string) => {
    try {
      const res = await toggleFlashSaleStatusAction(id);
      if (res.success) {
        setFlashSales(
          flashSales.map((fs) =>
            fs._id === id ? { ...fs, isActive: !fs.isActive } : fs,
          ),
        );
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Action: Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đợt Flash Sale này không?')) return;
    try {
      const res = await deleteFlashSaleAction(id);
      if (res.success) {
        alert(res.message);
        loadFlashSales(currentPage);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Open Form for Editing
  const handleOpenEdit = async (id: string) => {
    setLoading(true);
    try {
      const res = await getFlashSaleByIdAction(id);
      if (res.success && res.data) {
        const fs = res.data;
        // Định dạng ngày sang YYYY-MM-DDThh:mm để điền vào input datetime-local
        const formatDateTime = (dateStr: string) => {
          const d = new Date(dateStr);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setFormData({
          name: fs.name,
          startDate: formatDateTime(fs.startDate),
          endDate: formatDateTime(fs.endDate),
          timeSlots: fs.timeSlots.join(', '),
          duration: fs.duration || 60,
          isActive: fs.isActive,
        });

        // Điền danh sách sản phẩm
        const mappedProducts = fs.products.map((p: any) => ({
          product: p.product?._id || p.product,
          name: p.product?.name || 'Sản phẩm đã bị xóa',
          originalPrice: p.product?.variants?.[0]?.price || p.product?.price || 0,
          flashSalePrice: p.flashSalePrice,
          flashSaleStock: p.flashSaleStock,
          userLimit: p.userLimit || 1,
        }));
        setSelectedProducts(mappedProducts);

        setEditingId(id);
        setIsFormOpen(true);
      } else {
        alert(res.message || 'Không thể lấy thông tin chi tiết đợt Flash Sale');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open Form for Adding
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      timeSlots: '9, 12, 15, 21',
      duration: 60,
      isActive: true,
    });
    setSelectedProducts([]);
    setEditingId(null);
    setIsFormOpen(true);
  };

  // Add Product to Selected List
  const handleSelectProduct = (prod: any) => {
    const isExisted = selectedProducts.some((p) => p.product === prod._id);
    if (isExisted) return;

    const firstVariantPrice = prod.variants?.[0]?.price || 0;

    setSelectedProducts([
      ...selectedProducts,
      {
        product: prod._id,
        name: prod.name,
        originalPrice: firstVariantPrice,
        flashSalePrice: Math.round(firstVariantPrice * 0.9), // Mặc định giảm 10%
        flashSaleStock: 10,
        userLimit: 1,
      },
    ]);
  };

  // Update selected product's values
  const handleUpdateProductVal = (
    productId: string,
    field: 'flashSalePrice' | 'flashSaleStock' | 'userLimit',
    val: number,
  ) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.product === productId ? { ...p, [field]: val } : p,
      ),
    );
  };

  // Remove Product from Selected List
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.product !== productId));
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Chuẩn hóa dữ liệu
    const parsedSlots = formData.timeSlots
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((s) => !isNaN(s) && s >= 0 && s <= 23);

    if (parsedSlots.length === 0) {
      alert('Vui lòng nhập ít nhất một khung giờ hợp lệ (0-23)!');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm tham gia Flash Sale!');
      return;
    }

    const payload = {
      name: formData.name,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      timeSlots: parsedSlots,
      duration: Number(formData.duration),
      isActive: formData.isActive,
      products: selectedProducts.map((p) => ({
        product: p.product,
        flashSalePrice: Number(p.flashSalePrice),
        flashSaleStock: Number(p.flashSaleStock),
        userLimit: Number(p.userLimit),
      })),
    };

    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await updateFlashSaleAction(editingId, payload);
      } else {
        res = await createFlashSaleAction(payload);
      }

      if (res.success) {
        alert(res.message);
        setIsFormOpen(false);
        loadFlashSales(currentPage);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi hệ thống khi lưu đợt Flash Sale.');
    } finally {
      setLoading(false);
    }
  };

  // Format currency VNĐ
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Zap className="text-didongviet-red fill-didongviet-red" size={24} />
            <span>Quản lý chiến dịch Flash Sale</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Thiết lập thời gian và cấu hình các sản phẩm giảm giá cực sốc trong ngày
          </p>
        </div>

        {!isFormOpen && (
          <Button
            onClick={handleOpenAdd}
            className="bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-1.5 rounded-xl text-xs font-bold py-2.5 px-4 shadow-md transition-all border-none"
          >
            <Plus size={16} />
            <span>Tạo Flash Sale mới</span>
          </Button>
        )}
      </div>

      {isFormOpen ? (
        /* FORM TẠO/SỬA FLASH SALE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <h2 className="text-base font-black text-slate-800 dark:text-white uppercase flex items-center gap-1.5">
              <Settings size={18} className="text-didongviet-red" />
              <span>{editingId ? 'Cập nhật chiến dịch' : 'Thêm chiến dịch Flash Sale mới'}</span>
            </h2>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* THÔNG TIN CƠ BẢN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Tên chiến dịch Flash Sale *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Giờ Vàng Giá Sốc Cuối Tuần"
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-didongviet-red focus:ring-1 focus:ring-didongviet-red outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Thời lượng mỗi khung giờ (phút) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-didongviet-red focus:ring-1 focus:ring-didongviet-red outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Thời gian bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-didongviet-red focus:ring-1 focus:ring-didongviet-red outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Thời gian kết thúc *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-didongviet-red focus:ring-1 focus:ring-didongviet-red outline-none"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase">
                  Các khung giờ trong ngày (Ngăn cách bởi dấu phẩy) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.timeSlots}
                  onChange={(e) => setFormData({ ...formData, timeSlots: e.target.value })}
                  placeholder="Ví dụ: 9, 12, 15, 21 (nghĩa là 9h sáng, 12h trưa, 15h chiều, 21h tối)"
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-didongviet-red focus:ring-1 focus:ring-didongviet-red outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Nhập số nguyên từ 0 đến 23 đại diện cho các khung giờ phát sóng Flash Sale hàng ngày.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-didongviet-red focus:ring-didongviet-red cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-slate-750 dark:text-slate-250 cursor-pointer">
                  Kích hoạt chiến dịch ngay lập tức
                </label>
              </div>
            </div>

            {/* CHỌN SẢN PHẨM & CẤU HÌNH GIÁ */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                  Sản phẩm tham gia Flash Sale ({selectedProducts.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel tìm kiếm và chọn sản phẩm */}
                <div className="lg:col-span-1 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-3.5 h-[420px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Tìm nhanh sản phẩm
                    </span>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Nhập tên sản phẩm cần tìm..."
                        className="w-full text-xs font-medium pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-didongviet-red outline-none"
                      />
                    </div>
                  </div>

                  {/* List sản phẩm tìm kiếm */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                    {loadingProducts ? (
                      <div className="text-center py-10">
                        <RefreshCw className="animate-spin text-didongviet-red mx-auto" size={18} />
                        <span className="text-[10px] text-slate-400 mt-1 block">Đang tìm kiếm...</span>
                      </div>
                    ) : searchedProducts.length === 0 ? (
                      <p className="text-[10px] text-center text-slate-400 py-10">Không tìm thấy sản phẩm nào</p>
                    ) : (
                      searchedProducts.map((prod) => {
                        const isAdded = selectedProducts.some((p) => p.product === prod._id);
                        return (
                          <div
                            key={prod._id}
                            className="flex justify-between items-center p-2 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 text-[10px] hover:border-slate-300"
                          >
                            <div className="truncate max-w-[150px] font-semibold text-slate-800 dark:text-slate-200">
                              {prod.name}
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleSelectProduct(prod)}
                              disabled={isAdded}
                              size="sm"
                              className={`py-1 px-2.5 rounded-lg border-none text-[9px] font-black ${
                                isAdded
                                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                                  : 'bg-didongviet-red hover:bg-didongviet-dark-red text-white cursor-pointer'
                              }`}
                            >
                              {isAdded ? 'Đã thêm' : 'Thêm'}
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Danh sách cấu hình chi tiết sản phẩm đã chọn */}
                <div className="lg:col-span-2 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900 space-y-3 h-[420px] overflow-y-auto pr-1 no-scrollbar">
                  {selectedProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Zap size={32} className="stroke-slate-300 mb-2" />
                      <p className="text-[11px] font-semibold">Chưa có sản phẩm nào được chọn.</p>
                      <p className="text-[9px] text-slate-400">Tìm kiếm và chọn sản phẩm ở bảng bên trái để thêm vào Flash Sale.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedProducts.map((p, index) => (
                        <div
                          key={p.product}
                          className="p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3 relative bg-slate-50/20 dark:bg-slate-950/20"
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(p.product)}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-didongviet-red hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="pr-6">
                            <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">
                              Sản phẩm #{index + 1}
                            </span>
                            <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate mt-1">
                              {p.name}
                            </h4>
                            <p className="text-[9px] text-slate-400">
                              Giá gốc: {formatVND(p.originalPrice)}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase">
                                Giá Flash Sale *
                              </label>
                              <input
                                type="number"
                                required
                                min={0}
                                value={p.flashSalePrice}
                                onChange={(e) =>
                                  handleUpdateProductVal(p.product, 'flashSalePrice', Number(e.target.value))
                                }
                                className="w-full text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 outline-none focus:border-didongviet-red"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase">
                                Số lượng sale *
                              </label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={p.flashSaleStock}
                                onChange={(e) =>
                                  handleUpdateProductVal(p.product, 'flashSaleStock', Number(e.target.value))
                                }
                                className="w-full text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 outline-none focus:border-didongviet-red"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase">
                                Giới hạn/User *
                              </label>
                              <input
                                type="number"
                                required
                                min={1}
                                value={p.userLimit}
                                onChange={(e) =>
                                  handleUpdateProductVal(p.product, 'userLimit', Number(e.target.value))
                                }
                                className="w-full text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-950 outline-none focus:border-didongviet-red"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold py-2.5 px-4 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl text-xs font-bold py-2.5 px-5 cursor-pointer border-none shadow-sm"
              >
                {editingId ? 'Cập nhật' : 'Tạo mới chiến dịch'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        /* DANH SÁCH CHIẾN DỊCH FLASH SALE */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-[10px] uppercase font-black border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3.5 px-4">Tên chiến dịch</th>
                  <th className="py-3.5 px-4">Ngày diễn ra</th>
                  <th className="py-3.5 px-4">Khung giờ phát</th>
                  <th className="py-3.5 px-4 text-center">Thời lượng</th>
                  <th className="py-3.5 px-4 text-center">Sản phẩm</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-350">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <RefreshCw className="animate-spin text-didongviet-red mx-auto mb-2" size={20} />
                      <span>Đang tải dữ liệu chiến dịch...</span>
                    </td>
                  </tr>
                ) : flashSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      <Zap size={36} className="text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-xs">Chưa có chiến dịch Flash Sale nào được thiết lập.</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Nhấp nút bên trên để tạo chiến dịch đầu tiên.</p>
                    </td>
                  </tr>
                ) : (
                  flashSales.map((fs) => (
                    <tr key={fs._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 dark:text-white text-xs block">
                          {fs.name}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          ID: {fs._id}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-[10px] space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-slate-400" />
                          <span>Từ: {new Date(fs.startDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="text-slate-400" />
                          <span>Đến: {new Date(fs.endDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {fs.timeSlots?.map((slot: number) => (
                            <span
                              key={slot}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200/50 text-[9px] font-mono font-bold"
                            >
                              <Clock size={8} />
                              <span>{slot}:00</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                        {fs.duration} phút
                      </td>

                      <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">
                        {fs.products?.length || 0}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(fs._id)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border cursor-pointer ${
                            fs.isActive
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {fs.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(fs._id)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-600 border-none bg-transparent cursor-pointer"
                            title="Sửa chiến dịch"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(fs._id)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-didongviet-red border-none bg-transparent cursor-pointer"
                            title="Xóa chiến dịch"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Hiển thị trang {currentPage}/{totalPages} (Tổng số {totalCount} chiến dịch)
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  size="sm"
                  className="rounded-lg text-[10px] font-bold py-1 px-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Trước
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  size="sm"
                  className="rounded-lg text-[10px] font-bold py-1 px-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 cursor-pointer"
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
