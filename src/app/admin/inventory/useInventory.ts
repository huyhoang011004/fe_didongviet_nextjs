'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  getLowStockProductsAction,
  getOutOfStockProductsAction,
  getProductsByBranchAction,
  getThresholdAction,
  updateThresholdAction,
  updateProductStockAction,
  getStockReceiptsAction,
  createStockReceiptAction,
  cancelStockReceiptAction,
  getBranchesAction,
  getProductBySkuAction,
  getProductByIdAction,
  searchProductsAction,
} from './inventory-actions';
import { getCategoriesAction } from '../categories/category-actions';
import { getProductsAction, getProductsByCategoryAction } from '../products/product-actions';

// Hàm phẳng hóa danh mục theo dạng cây phân cấp thụt lề
const buildCategoryTree = (cats: any[]) => {
  const result: Array<{ _id: string; slug: string; name: string; level: number; parentId: string | null }> = [];

  const addChildren = (parentId: string | null, level: number) => {
    const children = cats.filter(c =>
      parentId === null
        ? (!c.parentCategory || c.parentCategory === null)
        : (c.parentCategory?._id === parentId || c.parentCategory === parentId)
    );

    children.forEach(c => {
      result.push({
        _id: c._id,
        slug: c.slug || '',
        name: c.name,
        level: level,
        parentId: parentId
      });
      addChildren(c._id, level + 1);
    });
  };

  addChildren(null, 0);
  return result;
};

export function useInventory() {
  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Loading states
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Core Data states
  const [productsData, setProductsData] = useState<any[]>([]);
  const [branchesData, setBranchesData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [receiptsData, setReceiptsData] = useState<any[]>([]);
  const [currentThreshold, setCurrentThreshold] = useState(5);

  // Pagination states for Low stock table
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Pagination states for Receipts List Modal
  const [receiptsPage, setReceiptsPage] = useState(1);
  const [receiptsTotalPages, setReceiptsTotalPages] = useState(1);
  const [receiptsTotalCount, setReceiptsTotalCount] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('');
  const [thresholdFilter, setThresholdFilter] = useState<number | undefined>(undefined);

  // Bộ lọc nâng cao: Tất cả vs Sắp hết hàng vs Đã hết hàng & Lọc theo Danh mục
  const [stockFilterType, setStockFilterType] = useState<'all' | 'low-stock' | 'out-of-stock'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');

  // Modals state
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [showCreateReceiptModal, setShowCreateReceiptModal] = useState(false);
  const [showReceiptsListModal, setShowReceiptsListModal] = useState(false);
  const [showThresholdEditModal, setShowThresholdEditModal] = useState(false);

  // Target item states (when updating stock or creating receipt)
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [selectedStockValue, setSelectedStockValue] = useState<number>(0);

  // Pending transitions
  const [isUpdatePending, startUpdateStock] = useTransition();
  const [isReceiptPending, startCreateReceipt] = useTransition();
  const [isThresholdPending, startUpdateThreshold] = useTransition();

  // Tự động ẩn alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Nạp ngưỡng tồn kho hiện tại từ hệ thống
  const fetchThreshold = async () => {
    const res = await getThresholdAction();
    if (res.success) {
      setCurrentThreshold(res.threshold);
      if (thresholdFilter === undefined) {
        setThresholdFilter(res.threshold);
      }
    }
  };

  // Nạp danh sách chi nhánh
  const fetchBranches = async () => {
    setBranchesLoading(true);
    const res = await getBranchesAction();
    if (res.success) {
      setBranchesData(res.branches);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách chi nhánh.',
      });
    }
    setBranchesLoading(false);
  };

  // Nạp danh sách danh mục sản phẩm
  const fetchCategories = async () => {
    setCategoryLoading(true);
    const res = await getCategoriesAction();
    if (res.success) {
      setCategoriesData(res.categories || []);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách danh mục.',
      });
    }
    setCategoryLoading(false);
  };

  // Nạp danh sách sản phẩm tồn kho
  const fetchInventory = async () => {
    setInventoryLoading(true);
    try {
      // A. Nếu có searchQuery, gọi API tìm kiếm nâng cao trực tiếp từ Backend
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.trim();

        // 1. Kiểm tra nếu là MongoDB ObjectId (24 ký tự hex)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
        if (isObjectId) {
          const res = await getProductByIdAction(query);
          if (res.success && res.data) {
            setProductsData([res.data]);
            setTotalPages(1);
            setTotalItems(1);
            setInventoryLoading(false);
            return;
          }
        }

        // 2. Kiểm tra nếu là dạng mã SKU (viết liền chữ và số, tối thiểu 3 ký tự)
        const isSku = /^[a-zA-Z0-9_\-]+$/.test(query) && query.length >= 3;
        if (isSku) {
          const res = await getProductBySkuAction(query);
          if (res.success && res.data) {
            setProductsData([res.data]);
            setTotalPages(1);
            setTotalItems(1);
            setInventoryLoading(false);
            return;
          }
        }

        // 3. Tìm kiếm tương đối Atlas Search /search
        const res = await searchProductsAction(query);
        if (res.success && res.data) {
          setProductsData(res.data);
          setTotalPages(1);
          setTotalItems(res.data.length);
          setInventoryLoading(false);
          return;
        }
      }

      // B. Nếu không tìm kiếm, tải danh sách theo bộ lọc tồn kho hoặc danh mục

      // Kiểm tra xem có lọc chi nhánh không
      if (selectedBranchFilter) {
        const res = await getProductsByBranchAction(selectedBranchFilter, currentPage, 10, selectedCategoryFilter, stockFilterType);
        if (res.success) {
          setProductsData(res.products);
          setTotalPages(res.totalPages);
          setTotalItems(res.totalItems);
        }
      } else if (stockFilterType === 'low-stock') {
        const activeThreshold = thresholdFilter !== undefined ? thresholdFilter : currentThreshold;
        const res = await getLowStockProductsAction(activeThreshold, currentPage, 10, selectedCategoryFilter);
        if (res.success) {
          setProductsData(res.products);
          setTotalPages(res.totalPages);
          setTotalItems(res.totalItems);
          setCurrentThreshold(res.currentThreshold);
        }
      } else if (stockFilterType === 'out-of-stock') {
        const res = await getOutOfStockProductsAction(currentPage, 10, selectedCategoryFilter);
        if (res.success) {
          setProductsData(res.products);
          setTotalPages(res.totalPages);
          setTotalItems(res.totalItems);
        }
      } else {
        // Tab "Tất cả":
        if (selectedCategoryFilter) {
          // Tìm kiếm đệ quy trong cây danh mục để tìm được cả danh mục con
          const findCatById = (cats: any[], id: string): any => {
            for (const c of cats) {
              if (c._id === id) return c;
              if (c.children && c.children.length > 0) {
                const found = findCatById(c.children, id);
                if (found) return found;
              }
            }
            return null;
          };
          const cat = findCatById(categoriesData, selectedCategoryFilter);
          const slug = cat ? cat.slug : '';

          if (slug) {
            const res = await getProductsByCategoryAction(slug, currentPage, 10);
            if (res.success) {
              setProductsData(res.products);
              setTotalPages(res.totalPages);
              setTotalItems(res.totalProducts);
            }
          } else {
            const res = await getProductsAction(currentPage, 10);
            if (res.success) {
              setProductsData(res.products);
              setTotalPages(res.totalPages);
              setTotalItems(res.totalProducts);
            }
          }
        } else {
          // Lấy toàn bộ sản phẩm không giới hạn danh mục
          const res = await getProductsAction(currentPage, 10);
          if (res.success) {
            setProductsData(res.products);
            setTotalPages(res.totalPages);
            setTotalItems(res.totalProducts);
          }
        }
      }
    } catch (error) {
      console.error('fetchInventory error:', error);
    } finally {
      setInventoryLoading(false);
    }
  };

  // Nạp danh sách lịch sử nhập kho
  const fetchReceipts = async (page: number = 1) => {
    setReceiptsLoading(true);
    const res = await getStockReceiptsAction(page, 8);
    if (res.success) {
      setReceiptsData(res.receipts);
      setReceiptsPage(res.currentPage);
      setReceiptsTotalPages(res.totalPages);
      setReceiptsTotalCount(res.totalItems);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải lịch sử nhập kho.',
      });
    }
    setReceiptsLoading(false);
  };

  // Kích hoạt nạp dữ liệu ban đầu
  useEffect(() => {
    fetchThreshold();
    fetchBranches();
    fetchCategories();
  }, []);

  // Reset trang về 1 khi bất kỳ tiêu chí lọc nào thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [thresholdFilter, searchQuery, selectedBranchFilter, stockFilterType, selectedCategoryFilter]);

  // Tự động tải lại bảng tồn kho khi thay đổi trang hoặc thay đổi bộ lọc
  useEffect(() => {
    fetchInventory();
  }, [currentPage, thresholdFilter, stockFilterType, selectedCategoryFilter, selectedBranchFilter]);

  // Các hàm kích hoạt Modals thao tác nhanh
  const openUpdateStock = (product: any, variantIndex: number, branchId: string, currentStock: number) => {
    setSelectedProduct(product);
    setSelectedVariantIndex(variantIndex);
    setSelectedBranchId(branchId);
    setSelectedVariant(product.variants[variantIndex]);
    setSelectedStockValue(currentStock);
    setShowUpdateStockModal(true);
  };

  const openCreateReceipt = (product: any, variantIndex: number, branchId: string) => {
    setSelectedProduct(product);
    setSelectedVariantIndex(variantIndex);
    setSelectedBranchId(branchId);
    setSelectedVariant(product.variants[variantIndex]);
    setShowCreateReceiptModal(true);
  };

  const openReceiptsList = () => {
    fetchReceipts(1);
    setShowReceiptsListModal(true);
  };

  const openThresholdEdit = () => {
    setShowThresholdEditModal(true);
  };

  // 1. Cập nhật trực tiếp số lượng tồn kho
  const handleUpdateStockSubmit = async (newStock: number) => {
    if (!selectedProduct || selectedVariantIndex === null || !selectedBranchId) return;

    startUpdateStock(async () => {
      const res = await updateProductStockAction(
        selectedProduct._id,
        selectedVariantIndex,
        selectedBranchId,
        newStock
      );

      if (res.success) {
        setAlert({
          type: 'success',
          message: res.message || 'Cập nhật tồn kho chi nhánh thành công!',
        });
        setShowUpdateStockModal(false);
        fetchInventory(); // Tải lại bảng tồn kho
      } else {
        setAlert({
          type: 'error',
          message: res.message || 'Cập nhật thất bại.',
        });
      }
    });
  };

  // 2. Tạo phiếu nhập kho bổ sung hàng
  const handleCreateReceiptSubmit = async (quantity: number, notes?: string) => {
    if (!selectedProduct || selectedVariantIndex === null || !selectedBranchId) return;

    startCreateReceipt(async () => {
      const res = await createStockReceiptAction(
        selectedProduct._id,
        selectedVariantIndex,
        selectedBranchId,
        quantity,
        notes
      );

      if (res.success) {
        setAlert({
          type: 'success',
          message: res.message || 'Đã tạo phiếu nhập kho và tăng số lượng tồn thành công!',
        });
        setShowCreateReceiptModal(false);
        fetchInventory(); // Tải lại bảng tồn kho
      } else {
        setAlert({
          type: 'error',
          message: res.message || 'Nhập kho thất bại.',
        });
      }
    });
  };

  // 3. Cập nhật cấu hình ngưỡng cảnh báo tồn kho tối thiểu
  const handleUpdateThresholdSubmit = async (newThreshold: number) => {
    startUpdateThreshold(async () => {
      const res = await updateThresholdAction(newThreshold);
      if (res.success) {
        setAlert({
          type: 'success',
          message: 'Đã cập nhật ngưỡng cảnh báo tồn tối thiểu toàn hệ thống!',
        });
        setCurrentThreshold(newThreshold);
        setThresholdFilter(newThreshold); // Đồng bộ lại bộ lọc ngoài bảng
        setShowThresholdEditModal(false);
      } else {
        setAlert({
          type: 'error',
          message: res.message || 'Cập nhật ngưỡng thất bại.',
        });
      }
    });
  };

  // 4. Hủy phiếu nhập kho bổ sung (và hoàn lại tồn kho giảm đi tương ứng)
  const handleCancelReceipt = async (receiptId: string) => {
    const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy phiếu nhập kho này? Số lượng tồn kho tương ứng sẽ bị giảm đi.');
    if (!confirmCancel) return;

    const res = await cancelStockReceiptAction(receiptId);
    if (res.success) {
      setAlert({
        type: 'success',
        message: 'Đã hủy phiếu nhập kho và hoàn lại số lượng tồn kho thành công!',
      });
      fetchReceipts(receiptsPage); // Tải lại lịch sử phiếu
      fetchInventory(); // Tải lại bảng tồn kho
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Không thể hủy phiếu nhập kho.',
      });
    }
  };

  // Hàm lọc danh sách sản phẩm ở Frontend (giờ backend đã xử lý lọc chi nhánh)
  const getFilteredProducts = () => {
    return productsData;
  };

  return {
    alert,
    setAlert,
    inventoryLoading,
    receiptsLoading,
    branchesLoading,
    categoryLoading,
    productsData: getFilteredProducts(),
    allProductsRaw: productsData,
    branchesData,
    categoriesData,
    receiptsData,
    currentThreshold,
    thresholdFilter,
    setThresholdFilter,

    // Bộ lọc nâng cao
    stockFilterType,
    setStockFilterType,
    selectedCategoryFilter,
    setSelectedCategoryFilter,

    // Phân trang
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    receiptsPage,
    setReceiptsPage,
    receiptsTotalPages,
    receiptsTotalCount,
    fetchReceipts,

    // Bộ lọc
    searchQuery,
    setSearchQuery,
    selectedBranchFilter,
    setSelectedBranchFilter,

    // Modals
    showUpdateStockModal,
    setShowUpdateStockModal,
    showCreateReceiptModal,
    setShowCreateReceiptModal,
    showReceiptsListModal,
    setShowReceiptsListModal,
    showThresholdEditModal,
    setShowThresholdEditModal,

    // Target items
    selectedProduct,
    selectedVariantIndex,
    selectedBranchId,
    selectedVariant,
    selectedStockValue,

    // Pendings
    isUpdatePending,
    isReceiptPending,
    isThresholdPending,

    // Actions
    openUpdateStock,
    openCreateReceipt,
    openReceiptsList,
    openThresholdEdit,
    handleUpdateStockSubmit,
    handleCreateReceiptSubmit,
    handleUpdateThresholdSubmit,
    handleCancelReceipt,
    fetchInventory,
  };
}
