'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/service/Account/accountService';
import { User } from '@/types/auth';
import {
  getProductsAction,
  getProductsByCategoryAction,
  softDeleteProductAction,
  hardDeleteProductAction,
  createProductAction,
  updateProductAction,
  replaceProductImageAction,
  deleteProductImageAction,
  reorderProductImagesAction,
  setProductThumbnailAction,
} from './product-actions';
import { getCategoriesAction } from '../categories/category-actions';
import { getBranchesAction } from '../orders/order-actions';

export function useProduct() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // State Quản lý danh sách Sản phẩm & tìm kiếm & loading
  const [productsData, setProductsData] = useState<any[]>([]);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [productsTotalCount, setProductsTotalCount] = useState(0);
  const [productsSearch, setProductsSearch] = useState('');
  const [productLoading, setProductLoading] = useState(false);

  // State lọc theo danh mục
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');

  // Modals state
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [productVariants, setProductVariants] = useState<any[]>([]);

  const [createProductPending, startCreateProduct] = useTransition();
  const [editProductPending, startEditProduct] = useTransition();

  // State Quản lý danh sách Chi nhánh & Danh mục
  const [branchesData, setBranchesData] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // State Quản lý tải ảnh (media)
  const [mediaLoading, setMediaLoading] = useState(false);

  // Nạp thông tin người dùng hiện tại
  useEffect(() => {
    async function loadCurrentUser() {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    }
    loadCurrentUser();
  }, []);

  // Tự động ẩn alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Tải danh sách sản phẩm (hỗ trợ lọc theo danh mục)
  const fetchProducts = async () => {
    setProductLoading(true);
    let res;
    if (selectedCategorySlug) {
      res = await getProductsByCategoryAction(selectedCategorySlug, productsPage);
    } else {
      res = await getProductsAction(productsPage, 8, productsSearch);
    }

    if (res.success) {
      setProductsData(res.products);
      setProductsTotalPages(res.totalPages);
      setProductsTotalCount(res.totalProducts);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách sản phẩm.',
      });
    }
    setProductLoading(false);
  };

  // Tải danh sách danh mục
  const fetchCategories = async () => {
    setCategoryLoading(true);
    const res = await getCategoriesAction();
    if (res.success) {
      setCategoriesData(res.categories);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách danh mục.',
      });
    }
    setCategoryLoading(false);
  };

  // Tải danh sách chi nhánh
  const fetchBranches = async () => {
    const res = await getBranchesAction();
    if (res.success) {
      setBranchesData(res.branches);
    }
  };

  // Trigger nạp dữ liệu khi trang thay đổi, tìm kiếm hoặc bộ lọc danh mục thay đổi
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBranches();
  }, [productsPage, productsSearch, selectedCategorySlug]);

  // Reset trang về 1 khi tìm kiếm hoặc bộ lọc danh mục thay đổi
  useEffect(() => {
    setProductsPage(1);
  }, [productsSearch, selectedCategorySlug]);

  // Thay đổi trạng thái hiển thị Sản phẩm (Ẩn/Hiện) - Toggle thông minh
  const handleToggleProductStatus = async (id: string, currentActive: boolean) => {
    let res;
    if (currentActive) {
      // Đang hiển thị -> Ẩn (xóa mềm)
      res = await softDeleteProductAction(id);
    } else {
      // Đang ẩn -> Hiện (update isActive = true)
      const formData = new FormData();
      formData.append('isActive', 'true');
      res = await updateProductAction(id, formData);
    }

    if (res.success) {
      setAlert({ type: 'success', message: 'Cập nhật trạng thái sản phẩm thành công!' });
      fetchProducts();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // Xóa vĩnh viễn sản phẩm
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    const res = await hardDeleteProductAction(productToDelete._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteProductModal(false);
      fetchProducts();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // Tạo sản phẩm mới
  const handleCreateProductSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formattedVariants = productVariants.map((v, idx) => {
      const inventory = branchesData.map((b) => {
        const inputVal = form.querySelector(
          `[name="variant_${idx}_branch_${b._id}"]`,
        ) as HTMLInputElement;
        return {
          branch: b._id,
          stock: inputVal ? parseInt(inputVal.value) || 0 : 0,
        };
      });

      const colorInput = form.querySelector(
        `[name="variant_${idx}_color"]`,
      ) as HTMLInputElement;
      const ramInput = form.querySelector(
        `[name="variant_${idx}_ram"]`,
      ) as HTMLInputElement;
      const romInput = form.querySelector(
        `[name="variant_${idx}_rom"]`,
      ) as HTMLInputElement;
      const priceInput = form.querySelector(
        `[name="variant_${idx}_price"]`,
      ) as HTMLInputElement;
      const salePriceInput = form.querySelector(
        `[name="variant_${idx}_salePrice"]`,
      ) as HTMLInputElement;
      const skuInput = form.querySelector(
        `[name="variant_${idx}_sku"]`,
      ) as HTMLInputElement;
      const variantImageInput = form.querySelector(
        `[name="variant_${idx}_variantImage"]`,
      ) as HTMLInputElement;

      return {
        color: colorInput ? colorInput.value : v.color,
        ram: ramInput ? ramInput.value : v.ram,
        rom: romInput ? romInput.value : v.rom,
        price: priceInput ? parseFloat(priceInput.value) || 0 : v.price,
        salePrice:
          salePriceInput && salePriceInput.value
            ? parseFloat(salePriceInput.value)
            : undefined,
        sku: skuInput ? skuInput.value : v.sku,
        variantImage: variantImageInput ? variantImageInput.value : v.variantImage || null,
        inventory,
      };
    });

    formData.delete('variants');
    formData.append('variants', JSON.stringify(formattedVariants));

    startCreateProduct(async () => {
      const res = await createProductAction(formData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateProductModal(false);
        fetchProducts();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // Cập nhật sản phẩm
  const handleEditProductSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formattedVariants = productVariants.map((v, idx) => {
      const inventory = branchesData.map((b) => {
        const inputVal = form.querySelector(
          `[name="variant_${idx}_branch_${b._id}"]`,
        ) as HTMLInputElement;
        return {
          branch: b._id,
          stock: inputVal ? parseInt(inputVal.value) || 0 : 0,
        };
      });

      const colorInput = form.querySelector(
        `[name="variant_${idx}_color"]`,
      ) as HTMLInputElement;
      const ramInput = form.querySelector(
        `[name="variant_${idx}_ram"]`,
      ) as HTMLInputElement;
      const romInput = form.querySelector(
        `[name="variant_${idx}_rom"]`,
      ) as HTMLInputElement;
      const priceInput = form.querySelector(
        `[name="variant_${idx}_price"]`,
      ) as HTMLInputElement;
      const salePriceInput = form.querySelector(
        `[name="variant_${idx}_salePrice"]`,
      ) as HTMLInputElement;
      const skuInput = form.querySelector(
        `[name="variant_${idx}_sku"]`,
      ) as HTMLInputElement;
      const variantImageInput = form.querySelector(
        `[name="variant_${idx}_variantImage"]`,
      ) as HTMLInputElement;

      return {
        color: colorInput ? colorInput.value : v.color,
        ram: ramInput ? ramInput.value : v.ram,
        rom: romInput ? romInput.value : v.rom,
        price: priceInput ? parseFloat(priceInput.value) || 0 : v.price,
        salePrice:
          salePriceInput && salePriceInput.value
            ? parseFloat(salePriceInput.value)
            : undefined,
        sku: skuInput ? skuInput.value : v.sku,
        variantImage: variantImageInput ? variantImageInput.value : v.variantImage || null,
        inventory,
      };
    });

    formData.delete('variants');
    formData.append('variants', JSON.stringify(formattedVariants));

    startEditProduct(async () => {
      const res = await updateProductAction(selectedProduct._id, formData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditProductModal(false);
        fetchProducts();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // Thay thế ảnh cụ thể của sản phẩm
  const handleReplaceProductImage = async (imageId: string, file: File) => {
    if (!selectedProduct) return;
    setMediaLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    const res = await replaceProductImageAction(
      selectedProduct._id,
      imageId,
      formData,
    );
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      if (res.data && res.data.data) {
        setSelectedProduct(res.data.data);
      } else {
        fetchProducts();
      }
    } else {
      setAlert({ type: 'error', message: res.message });
    }
    setMediaLoading(false);
  };

  // Xóa ảnh của sản phẩm
  const handleDeleteProductImage = async (imageId: string) => {
    if (!selectedProduct) return;
    if (selectedProduct.images && selectedProduct.images.length <= 1) {
      setAlert({
        type: 'error',
        message: 'Sản phẩm phải chứa ít nhất 1 hình ảnh!',
      });
      return;
    }
    setMediaLoading(true);
    const res = await deleteProductImageAction(selectedProduct._id, imageId);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      if (res.data && res.data.data) {
        setSelectedProduct(res.data.data);
      } else {
        fetchProducts();
      }
    } else {
      setAlert({ type: 'error', message: res.message });
    }
    setMediaLoading(false);
  };

  // Thiết lập ảnh đại diện (thumbnail)
  const handleSetProductThumbnail = async (imageId: string) => {
    if (!selectedProduct) return;
    setMediaLoading(true);
    const res = await setProductThumbnailAction(selectedProduct._id, imageId);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      if (res.data && res.data.data) {
        setSelectedProduct(res.data.data);
      } else {
        fetchProducts();
      }
    } else {
      setAlert({ type: 'error', message: res.message });
    }
    setMediaLoading(false);
  };

  // Sắp xếp lại thứ tự ảnh sản phẩm
  const handleReorderProductImages = async (
    orders: Array<{ imageId: string; order: number }>,
  ) => {
    if (!selectedProduct) return;
    setMediaLoading(true);
    const res = await reorderProductImagesAction(selectedProduct._id, orders);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      if (res.data && res.data.data) {
        setSelectedProduct(res.data.data);
      } else {
        fetchProducts();
      }
    } else {
      setAlert({ type: 'error', message: res.message });
    }
    setMediaLoading(false);
  };

  return {
    currentUser,
    alert,
    setAlert,
    productsData,
    productsPage,
    setProductsPage,
    productsTotalPages,
    productsTotalCount,
    productsSearch,
    setProductsSearch,
    selectedCategorySlug,
    setSelectedCategorySlug,
    productLoading,
    showCreateProductModal,
    setShowCreateProductModal,
    showEditProductModal,
    setShowEditProductModal,
    showDeleteProductModal,
    setShowDeleteProductModal,
    selectedProduct,
    setSelectedProduct,
    productToDelete,
    setProductToDelete,
    productVariants,
    setProductVariants,
    createProductPending,
    editProductPending,
    branchesData,
    categoriesData,
    categoryLoading,
    mediaLoading,
    handleToggleProductStatus,
    confirmDeleteProduct,
    handleCreateProductSubmit,
    handleEditProductSubmit,
    handleReplaceProductImage,
    handleDeleteProductImage,
    handleSetProductThumbnail,
    handleReorderProductImages,
    fetchProducts,
  };
}
