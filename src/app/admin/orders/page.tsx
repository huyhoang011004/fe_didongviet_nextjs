'use client';

import { Suspense, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Search,
  CheckCircle,
  AlertCircle,
  Eye,
  FolderOpen,
  Truck,
  MapPin,
  Clock,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { getUsersAction } from '@/app/admin/accounts/account-actions';
import { getProductsAction } from '@/app/admin/products/product-actions';
import { getCategoriesAction } from '@/app/admin/categories/category-actions';
import { getVouchersAction } from '@/app/admin/vouchers/voucher-actions';
import {
  getOrdersAction,
  updateOrderToDeliveredAction,
  deleteOrderAction,
  getBranchesAction,
} from '@/app/admin/orders/order-actions';
import { getBlogsAction } from '@/app/admin/blogs/blog-actions';
import { getContactsAction } from '@/app/admin/contacts/contact-actions';

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: string;
  isDeleted?: boolean;
  createdAt?: string;
}

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string | Category;
  brand?: string;
  images?: string[];
  variants?: ProductVariant[];
  isDeleted?: boolean;
  priceRange?: { min: number; max: number };
  totalStock?: number;
  imageUrl?: string;
  isActive?: boolean;
}

interface ProductVariant {
  _id?: string;
  id?: string;
  color: string;
  ram?: string;
  rom?: string;
  storage?: string;
  price: number | string;
  salePrice?: number | string;
  stock?: number;
  sku?: string;
  inventory?: Array<{
    branch: string | Branch | any;
    stock: number;
  }>;
}

interface Branch {
  _id: string;
  id: string;
  name: string;
  address: string;
  phone?: string;
  mapUrl?: string;
}

interface Category {
  _id: string;
  id: string;
  name: string;
  description?: string;
  parentCategory?: string | null;
  brands?: string[];
  displayOrder?: number;
  isActive?: boolean;
  slug?: string;
}

interface Voucher {
  _id: string;
  id: string;
  code: string;
  description?: string;
  discountType: string;
  discountValue?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  usageLimit: number;
  maxUsagePerUser?: number;
  startDate: string;
  expiryDate: string;
  isHSSVOnly?: boolean;
  hssvTiers?: Array<{ minOrderValue: number; discountAmount: number }>;
  isActive?: boolean;
}

interface Order {
  _id: string;
  id: string;
  userId?: string | User;
  items: Array<{
    productId: string | Product;
    quantity: number;
    price: number;
    variantId?: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city?: string;
    district?: string;
    ward?: string;
  };
  paymentMethod: string;
  status: string;
  orderStatus: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt?: string;
}

interface Blog {
  _id: string;
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  featuredImage: string;
  status: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
}

interface Contact {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  notes?: string;
  createdAt?: string;
}

function OrdersAdminContent() {
  const router = useRouter();
  const currentTab = 'orders' as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkRole() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.user) {
            setCurrentUser(data.data.user);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    checkRole();
  }, []);

  // Chặn staff truy cập trực tiếp vào các tab cấm qua URL query parameter
  useEffect(() => {
    if (currentUser && currentUser.role === 'staff') {
      if (['users', 'categories', 'vouchers'].includes(currentTab)) {
        router.replace('/admin?tab=overview');
      }
    }
  }, [currentUser, currentTab, router]);

  // State Quản lý danh sách Người dùng
  const [usersData, setUsersData] = useState<User[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersTotalCount, setUsersTotalCount] = useState(0);
  const [usersFilter, setUsersFilter] = useState('all');
  const [usersSearch, setUsersSearch] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  // State Quản lý danh sách Sản phẩm
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [productsTotalCount, setProductsTotalCount] = useState(0);
  const [productsSearch, setProductsSearch] = useState('');
  const [productLoading, setProductLoading] = useState(false);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [createProductPending, startCreateProduct] = useTransition();
  const [editProductPending, startEditProduct] = useTransition();

  // State Quản lý danh sách Chi nhánh (Branches)
  const [branchesData, setBranchesData] = useState<Branch[]>([]);

  // State Quản lý danh sách Danh mục (Categories)
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [createCategoryPending, startCreateCategory] = useTransition();
  const [editCategoryPending, startEditCategory] = useTransition();

  // State Quản lý danh sách Voucher (Mã giảm giá)
  const [vouchersData, setVouchersData] = useState<Voucher[]>([]);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [showCreateVoucherModal, setShowCreateVoucherModal] = useState(false);
  const [showEditVoucherModal, setShowEditVoucherModal] = useState(false);
  const [showDeleteVoucherModal, setShowDeleteVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [createVoucherPending, startCreateVoucher] = useTransition();
  const [editVoucherPending, startEditVoucher] = useTransition();
  const [voucherDiscountType, setVoucherDiscountType] = useState('fixed');
  const [hssvTiers, setHssvTiers] = useState<
    Array<{ minOrderValue: number; discountAmount: number }>
  >([{ minOrderValue: 0, discountAmount: 0 }]);

  // State Quản lý danh sách Đơn hàng (Orders)
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // State Quản lý danh sách Tin tức & Tin công nghệ (Blogs)
  const [blogsData, setBlogsData] = useState<Blog[]>([]);
  const [blogsPage, setBlogsPage] = useState(1);
  const [blogsTotalPages, setBlogsTotalPages] = useState(1);
  const [blogsTotalCount, setBlogsTotalCount] = useState(0);
  const [blogsCategoryFilter, setBlogsCategoryFilter] = useState('all');
  const [blogsSearch, setBlogsSearch] = useState('');
  const [blogLoading, setBlogLoading] = useState(false);
  const [showCreateBlogModal, setShowCreateBlogModal] = useState(false);
  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
  const [showDeleteBlogModal, setShowDeleteBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [createBlogPending, startCreateBlog] = useTransition();
  const [editBlogPending, startEditBlog] = useTransition();

  // State Quản lý Yêu cầu Liên hệ / Khiếu nại (Contacts)
  const [contactsData, setContactsData] = useState<Contact[]>([]);
  const [contactsPage, setContactsPage] = useState(1);
  const [contactsTotalPages, setContactsTotalPages] = useState(1);
  const [contactsTotalCount, setContactsTotalCount] = useState(0);
  const [contactsStatusFilter, setContactsStatusFilter] = useState('all');
  const [contactLoading, setContactLoading] = useState(false);
  const [showContactDetailsModal, setShowContactDetailsModal] = useState(false);
  const [showDeleteContactModal, setShowDeleteContactModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [updateContactStatusPending, startUpdateContactStatus] =
    useTransition();

  // State Quản lý Dashboard Tổng quan (Overview stats)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalVouchers: 0,
    totalOrders: 0,
    totalBlogs: 0,
    totalContacts: 0,
    totalRevenue: 0,
    recentOrders: [] as Order[],
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // ==========================================
  // MODALS STATE (TRẠNG THÁI HỘP THOẠI)
  // ==========================================

  // 1. Tạo mới Người dùng
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createUserPending, startCreateUser] = useTransition();

  // 2. Chỉnh sửa Người dùng
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUserPending, startEditUser] = useTransition();

  // 3. Khóa Người dùng (Soft Delete)
  const [showLockUserModal, setShowLockUserModal] = useState(false);
  const [userToLock, setUserToLock] = useState<User | null>(null);

  // 4. Xóa vĩnh viễn Người dùng (Hard Delete)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // 5. Xóa vĩnh viễn Sản phẩm (Hard Delete)
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // 6. Hiệu chỉnh Sản phẩm
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Auto-hide alert sau 4s
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ==========================================
  // FETCH DATA HOOKS
  // ==========================================

  // Tải thống kê dashboard tổng quan
  const fetchOverviewStats = async () => {
    setStatsLoading(true);
    try {
      const [
        usersRes,
        productsRes,
        categoriesRes,
        vouchersRes,
        ordersRes,
        blogsRes,
        contactsRes,
      ] = await Promise.all([
        getUsersAction('all', 1, ''),
        getProductsAction(1, 1, ''),
        getCategoriesAction(),
        getVouchersAction(),
        getOrdersAction(),
        getBlogsAction('', '', 1, 1),
        getContactsAction('', '', 1, 1),
      ]);

      let totalRevenue = 0;
      let recentOrders: any[] = [];

      if (ordersRes.success && ordersRes.orders) {
        totalRevenue = ordersRes.orders
          .filter((o: any) => o.isPaid || o.orderStatus === 'Đã hoàn thành')
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);

        recentOrders = [...ordersRes.orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);
      }

      setStats({
        totalUsers: usersRes.success ? usersRes.totalUsers : 0,
        totalProducts: productsRes.success ? productsRes.totalProducts : 0,
        totalCategories: categoriesRes.success
          ? categoriesRes.categories.length
          : 0,
        totalVouchers: vouchersRes.success ? vouchersRes.vouchers.length : 0,
        totalOrders: ordersRes.success ? ordersRes.orders.length : 0,
        totalBlogs: blogsRes.success ? blogsRes.totalBlogs : 0,
        totalContacts: contactsRes.success ? contactsRes.totalContacts : 0,
        totalRevenue,
        recentOrders,
      });
    } catch (err) {
      console.error('fetchOverviewStats error:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Tải danh sách người dùng
  const fetchUsers = async () => {
    setUserLoading(true);
    const res = await getUsersAction(usersFilter, usersPage, usersSearch);
    if (res.success) {
      setUsersData(res.users);
      setUsersTotalPages(res.totalPages);
      setUsersTotalCount(res.totalUsers);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách người dùng.',
      });
    }
    setUserLoading(false);
  };

  // Tải danh sách sản phẩm
  const fetchProducts = async () => {
    setProductLoading(true);
    const res = await getProductsAction(productsPage, 8, productsSearch);
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

  // Tải danh sách voucher
  const fetchVouchers = async () => {
    setVoucherLoading(true);
    const res = await getVouchersAction();
    if (res.success) {
      setVouchersData(res.vouchers);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách voucher.',
      });
    }
    setVoucherLoading(false);
  };

  // Tải danh sách đơn hàng
  const fetchOrders = async () => {
    setOrderLoading(true);
    const res = await getOrdersAction();
    if (res.success) {
      setOrdersData(res.orders);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách đơn hàng.',
      });
    }
    setOrderLoading(false);
  };

  // Tải danh sách tin tức & bài viết
  const fetchBlogs = async () => {
    setBlogLoading(true);
    const cat = blogsCategoryFilter === 'all' ? '' : blogsCategoryFilter;
    const res = await getBlogsAction(cat, blogsSearch, blogsPage, 8);
    if (res.success) {
      setBlogsData(res.blogs);
      setBlogsTotalPages(res.totalPages);
      setBlogsTotalCount(res.totalBlogs);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách bài viết.',
      });
    }
    setBlogLoading(false);
  };

  // Tải danh sách liên hệ & phản hồi
  const fetchContacts = async () => {
    setContactLoading(true);
    const stat = contactsStatusFilter === 'all' ? '' : contactsStatusFilter;
    const res = await getContactsAction(stat, '', contactsPage, 8);
    if (res.success) {
      setContactsData(res.contacts);
      setContactsTotalPages(res.totalPages);
      setContactsTotalCount(res.totalContacts);
    } else {
      setAlert({
        type: 'error',
        message: res.message || 'Lỗi tải danh sách liên hệ.',
      });
    }
    setContactLoading(false);
  };

  useEffect(() => {
    if (currentTab === 'overview') {
      fetchOverviewStats();
    } else if (currentTab === 'users') {
      fetchUsers();
    } else if (currentTab === 'products') {
      fetchProducts();
      fetchCategories();
      fetchBranches();
    } else if (currentTab === 'categories') {
      fetchCategories();
    } else if (currentTab === 'vouchers') {
      fetchVouchers();
    } else if (currentTab === 'orders') {
      fetchOrders();
    } else if (currentTab === 'blogs') {
      fetchBlogs();
    } else if (currentTab === 'contacts') {
      fetchContacts();
    }
  }, [
    currentTab,
    usersPage,
    usersFilter,
    usersSearch,
    productsPage,
    productsSearch,
    blogsPage,
    blogsCategoryFilter,
    blogsSearch,
    contactsPage,
    contactsStatusFilter,
  ]);

  // ==========================================
  // HANDLERS (TRÌNH XỬ LÝ)
  // ==========================================

  // 1. Tạo mới Người dùng

  // 2. Chỉnh sửa Người dùng

  // 3. Khóa/Mở khóa người dùng

  // 4. Xóa vĩnh viễn người dùng

  // 5. Thay đổi trạng thái hiển thị Sản phẩm (Ẩn/Hiện)

  // 6. Xóa vĩnh viễn sản phẩm

  // 7. Tạo mới Danh mục

  // 8. Chỉnh sửa Danh mục

  // 9. Xóa vĩnh viễn Danh mục

  // 10. Tạo mới Voucher

  // 11. Chỉnh sửa Voucher

  // 12. Xóa Voucher

  // 13. Xác nhận đã giao hàng
  const handleShipOrder = async (id: string) => {
    const res = await updateOrderToDeliveredAction(id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev: any) => ({
          ...prev,
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
          orderStatus: 'Đã hoàn thành',
        }));
      }
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 14. Xóa vĩnh viễn đơn hàng
  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;
    const res = await deleteOrderAction(selectedOrder._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteOrderModal(false);
      setShowOrderDetailsModal(false);
      fetchOrders();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 15. Tạo mới Bài viết tin tức (Blog)

  // 16. Chỉnh sửa Bài viết tin tức (Blog)

  // 17. Bật/Tắt ẩn bài viết (Toggle isActive)

  // 18. Xóa bài viết

  // 19. Cập nhật tiến trình CSKH cho phiếu Liên hệ (Notes & Status)

  // 20. Hủy phiếu liên hệ (soft-delete)

  // 21. Xóa vĩnh viễn liên hệ (hard-delete)

  // 22. Thao tác lưu sản phẩm mới (Tạo Sản Phẩm)

  // 23. Thao tác lưu sản phẩm đã sửa (Cập nhật Sản Phẩm)

  // Định dạng hiển thị tiền tệ VNĐ
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(num);
  };

  // Định dạng ngày hiển thị
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Chưa cập nhật';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Trích lọc đơn hàng theo ô tìm kiếm và trạng thái lọc
  const getFilteredOrders = () => {
    return ordersData.filter((o) => {
      const matchesSearch =
        o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.shippingAddress?.fullName
          .toLowerCase()
          .includes(orderSearch.toLowerCase()) ||
        o.shippingAddress?.phone.includes(orderSearch);

      const matchesStatus =
        orderStatusFilter === 'all'
          ? true
          : orderStatusFilter === 'paid'
            ? o.isPaid
            : orderStatusFilter === 'unpaid'
              ? !o.isPaid
              : orderStatusFilter === 'delivered'
                ? o.isDelivered
                : orderStatusFilter === 'pending'
                  ? !o.isDelivered
                  : o.orderStatus === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className='space-y-6 relative'>
      {/* THÔNG BÁO TOAST FLOATING */}
      {alert && (
        <div
          className={`
          fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}
        >
          {alert.type === 'success' ? (
            <CheckCircle className='text-green-600 flex-shrink-0' />
          ) : (
            <AlertCircle className='text-red-600 flex-shrink-0' />
          )}
          <span className='text-sm font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white'>
            {currentTab === 'orders' && 'Quản lý Hóa đơn & Đơn hàng'}
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            {currentTab === 'orders' &&
              'Kiểm soát hóa đơn giao dịch và cập nhật trạng thái vận chuyển.'}
          </p>
        </div>
      </div>

      {/* ==========================================
          TAB 1: TỔNG QUAN (OVERVIEW)
          ========================================== */}

      {/* ==========================================
          TAB 2: QUẢN LÝ NGƯỜI DÙNG (USERS)
          ========================================== */}

      {/* ==========================================
          TAB 3: QUẢN LÝ SẢN PHẨM (PRODUCTS)
          ========================================== */}

      {/* ==========================================
          TAB 4: QUẢN LÝ DANH MỤC (CATEGORIES)
          ========================================== */}

      {/* ==========================================
          TAB 5: QUẢN LÝ VOUCHER (VOUCHERS)
          ========================================== */}

      {/* ==========================================
          TAB 6: QUẢN LÝ ĐƠN HÀNG (ORDERS)
          ========================================== */}
      {currentTab === 'orders' && (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div className='flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto overflow-x-auto'>
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'Đang xử lý', label: 'Đang xử lý' },
                { key: 'Đang giao hàng', label: 'Đang giao' },
                { key: 'Đã hoàn thành', label: 'Đã hoàn thành' },
                { key: 'paid', label: 'Đã thanh toán' },
                { key: 'unpaid', label: 'Chưa thanh toán' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setOrderStatusFilter(t.key)}
                  className={`
                    flex-shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
                    ${orderStatusFilter === t.key ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-xs' : 'text-slate-500 hover:text-slate-700 bg-transparent'}
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className='relative w-full sm:w-72'>
              <Search
                className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
                size={16}
              />
              <Input
                placeholder='Tìm theo mã đơn, sđt...'
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
              />
            </div>
          </CardHeader>
          <CardContent className='p-0 overflow-x-auto'>
            {orderLoading ? (
              <div className='flex flex-col items-center justify-center p-20'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                <span className='text-xs text-slate-400 mt-2 font-medium'>
                  Đang lấy danh sách hóa đơn đơn hàng...
                </span>
              </div>
            ) : getFilteredOrders().length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>
                  Không có đơn hàng nào khớp với bộ lọc.
                </p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse min-w-[800px]'>
                <thead>
                  <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6'>Mã Đơn Hàng</th>
                    <th className='py-4 px-6'>Khách nhận hàng</th>
                    <th className='py-4 px-6'>Thời gian lập</th>
                    <th className='py-4 px-6'>Tổng tiền hóa đơn</th>
                    <th className='py-4 px-6'>Phương thức</th>
                    <th className='py-4 px-6'>Thanh toán</th>
                    <th className='py-4 px-6'>Vận chuyển</th>
                    <th className='py-4 px-6 text-right'>Chi tiết</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
                  {getFilteredOrders().map((o) => (
                    <tr
                      key={o._id}
                      className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'
                    >
                      <td className='py-4 px-6 font-mono font-bold text-slate-900 dark:text-white truncate max-w-[120px]'>
                        {o._id}
                      </td>
                      <td className='py-4 px-6'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-slate-900 dark:text-white'>
                            {o.shippingAddress?.fullName || 'Khách vãng lai'}
                          </span>
                          <span className='text-xs text-slate-400'>
                            {o.shippingAddress?.phone || 'Chưa có SĐT'}
                          </span>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-xs'>
                        {formatDate(o.createdAt)}
                      </td>
                      <td className='py-4 px-6 font-extrabold text-didongviet-red'>
                        {formatVND(o.totalPrice)}
                      </td>
                      <td className='py-4 px-6'>
                        <span className='px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400'>
                          {o.paymentMethod}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold ${o.isPaid ? 'text-emerald-600' : 'text-amber-500'}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${o.isPaid ? 'bg-emerald-600' : 'bg-amber-500'}`}
                          />
                          <span>
                            {o.isPaid
                              ? `Đã TT (${formatDate(o.paidAt)})`
                              : 'Chờ TT'}
                          </span>
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase
                          ${
                            o.orderStatus === 'Đã hoàn thành'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : o.orderStatus === 'Đang giao hàng'
                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                : o.orderStatus === 'Đã hủy'
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : 'bg-amber-50 text-amber-600 border-amber-200'
                          }
                        `}
                        >
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className='py-4 px-6 text-right whitespace-nowrap'>
                        <Button
                          onClick={() => {
                            setSelectedOrder(o);
                            setShowOrderDetailsModal(true);
                          }}
                          variant='outline'
                          size='sm'
                          className='flex items-center gap-1.5 hover:text-didongviet-red border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-semibold py-4 rounded-xl'
                        >
                          <Eye size={12} />
                          <span>Mở hóa đơn</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* ==========================================
          TAB 7: QUẢN LÝ TIN TỨC (BLOGS)
          ========================================== */}

      {/* ==========================================
          TAB 8: QUẢN LÝ LIÊN HỆ & PHẢN HỒI (CONTACTS)
          ========================================== */}

      {/* ==========================================
          TAB N: THIẾT LẬP PLACEHOLDERS (SETTINGS)
          ========================================== */}

      {/* ==========================================
          MODAL 1: THÊM NGƯỜI DÙNG (CREATE USER MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 2: CHỈNH SỬA NGƯỜI DÙNG (EDIT USER MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 3: XÁC NHẬN KHÓA TÀI KHOẢN (LOCK MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 4: XÁC NHẬN XÓA TÀI KHOẢN (DELETE USER MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 5: XÁC NHẬN XÓA SẢN PHẨM (DELETE PRODUCT MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 6: THÊM DANH MỤC (CREATE CATEGORY MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 7: CHỈNH SỬA DANH MỤC (EDIT CATEGORY MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 8: XÁC NHẬN XÓA DANH MỤC (DELETE CATEGORY MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 9: TẠO VOUCHER MỚI (CREATE VOUCHER MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 10: CHỈNH SỬA VOUCHER (EDIT VOUCHER MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 11: XÁC NHẬN XÓA VOUCHER (DELETE VOUCHER MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 12: CHI TIẾT HÓA ĐƠN ĐƠN HÀNG (ORDER DETAILS DRAWER)
          ========================================== */}
      {showOrderDetailsModal && selectedOrder && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <div>
                <h3 className='font-black text-slate-900 dark:text-white text-base'>
                  Chi tiết hóa đơn mua hàng
                </h3>
                <span className='text-[10px] font-mono text-slate-400 block mt-0.5'>
                  {selectedOrder._id}
                </span>
              </div>
              <button
                onClick={() => setShowOrderDetailsModal(false)}
                className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'
              >
                ✕
              </button>
            </div>

            <div className='p-6 space-y-6 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80'>
                <div className='space-y-1.5'>
                  <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>
                    Người nhận hàng
                  </span>
                  <p className='font-bold text-slate-900 dark:text-white text-sm'>
                    {selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p className='text-xs flex items-center gap-1'>
                    <span className='text-slate-400'>SĐT:</span>{' '}
                    <strong className='text-slate-800 dark:text-slate-200'>
                      {selectedOrder.shippingAddress?.phone}
                    </strong>
                  </p>
                  <p className='text-xs flex items-center gap-1'>
                    <span className='text-slate-400'>Thanh toán:</span>{' '}
                    <strong className='text-slate-800 dark:text-slate-200'>
                      {selectedOrder.paymentMethod}
                    </strong>
                  </p>
                </div>

                <div className='space-y-1.5'>
                  <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>
                    Địa chỉ giao hàng
                  </span>
                  <p className='text-xs font-semibold text-slate-800 dark:text-slate-200 flex gap-1 items-start'>
                    <MapPin
                      size={14}
                      className='text-didongviet-red flex-shrink-0 mt-0.5'
                    />
                    <span>
                      {selectedOrder.shippingAddress?.streetAddress},{' '}
                      {selectedOrder.shippingAddress?.ward},{' '}
                      {selectedOrder.shippingAddress?.district},{' '}
                      {selectedOrder.shippingAddress?.province}
                    </span>
                  </p>
                  <p className='text-xs flex items-center gap-1 mt-1'>
                    <Clock size={12} className='text-slate-400' />
                    <span className='text-slate-400'>Thời gian mua:</span>
                    <strong className='text-slate-800 dark:text-slate-200'>
                      {formatDate(selectedOrder.createdAt)}
                    </strong>
                  </p>
                </div>
              </div>

              <div className='space-y-3.5'>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>
                  Mặt hàng trong giỏ ({selectedOrder.orderItems?.length ?? 0})
                </span>
                <div className='space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4'>
                  {selectedOrder.orderItems?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className='flex items-center justify-between gap-4'
                    >
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className='h-12 w-12 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 overflow-hidden flex items-center justify-center p-1 flex-shrink-0'>
                          <img
                            src={item.image || '/auth-image.webp'}
                            alt={item.name}
                            className='h-full w-full object-contain'
                          />
                        </div>
                        <div className='truncate'>
                          <span className='font-bold text-slate-900 dark:text-white block truncate text-xs sm:text-sm'>
                            {item.name}
                          </span>
                          <span className='text-[10px] text-slate-400 block mt-0.5 font-mono'>
                            Mã sản phẩm: {item.product}
                          </span>
                        </div>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <span className='font-bold text-slate-900 dark:text-white block text-sm'>
                          {formatVND(item.price)}
                        </span>
                        <span className='text-xs text-slate-400 block mt-0.5'>
                          Số lượng: <strong>{item.qty} máy</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
                <div className='flex justify-between text-xs'>
                  <span className='text-slate-400'>Giá gốc sản phẩm:</span>
                  <span className='font-semibold'>
                    {formatVND(selectedOrder.itemsPrice || 0)}
                  </span>
                </div>
                {selectedOrder.discountDMember > 0 && (
                  <div className='flex justify-between text-xs text-purple-600 font-semibold'>
                    <span>Ưu đãi thành viên D.Member:</span>
                    <span>- {formatVND(selectedOrder.discountDMember)}</span>
                  </div>
                )}
                {selectedOrder.tradeInBonus > 0 && (
                  <div className='flex justify-between text-xs text-blue-600 font-semibold'>
                    <span>Trợ giá Thu cũ đổi mới:</span>
                    <span>- {formatVND(selectedOrder.tradeInBonus)}</span>
                  </div>
                )}
                <div className='flex justify-between text-xs'>
                  <span className='text-slate-400'>Phí vận chuyển GHN:</span>
                  <span className='font-semibold'>
                    {formatVND(selectedOrder.shippingPrice || 0)}
                  </span>
                </div>
                <div className='flex justify-between text-base font-black pt-2'>
                  <span className='text-slate-800 dark:text-white'>
                    TỔNG HÓA ĐƠN THỰC THU:
                  </span>
                  <span className='text-didongviet-red'>
                    {formatVND(selectedOrder.totalPrice || 0)}
                  </span>
                </div>
              </div>

              <div className='flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80'>
                <div className='flex items-center gap-2'>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${selectedOrder.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                  <span className='text-xs font-bold text-slate-500 uppercase'>
                    {selectedOrder.isPaid
                      ? 'ĐÃ THANH TOÁN THÀNH CÔNG'
                      : 'CHỜ THANH TOÁN (COD / CỔNG)'}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase
                  ${
                    selectedOrder.orderStatus === 'Đã hoàn thành'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : selectedOrder.orderStatus === 'Đang giao hàng'
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : selectedOrder.orderStatus === 'Đã hủy'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-amber-50 text-amber-600 border-amber-200'
                  }
                `}
                >
                  {selectedOrder.orderStatus}
                </span>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center'>
                <Button
                  onClick={() => setShowDeleteOrderModal(true)}
                  variant='outline'
                  className='border-red-200 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer text-xs font-semibold py-5'
                >
                  Xóa đơn hàng
                </Button>

                <div className='flex gap-2.5'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setShowOrderDetailsModal(false)}
                    className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-xs'
                  >
                    Thoát
                  </Button>

                  {!selectedOrder.isDelivered &&
                    selectedOrder.orderStatus !== 'Đã hủy' && (
                      <Button
                        onClick={() => handleShipOrder(selectedOrder._id)}
                        className='bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs flex items-center gap-1.5 shadow-md'
                      >
                        <Truck size={14} />
                        <span>Xác nhận giao hàng</span>
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 13: XÁC NHẬN XÓA ĐƠN HÀNG (DELETE ORDER CONFIRMATION MODAL)
          ========================================== */}
      {showDeleteOrderModal && selectedOrder && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
              <ShieldAlert size={24} className='animate-pulse' />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>
              Xóa vĩnh viễn Đơn hàng?
            </h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Cảnh báo: Hành động này sẽ gỡ bỏ vĩnh viễn thông tin đơn hàng{' '}
              <strong>{selectedOrder._id}</strong> khỏi hệ thống kế toán.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button
                variant='outline'
                onClick={() => setShowDeleteOrderModal(false)}
                className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={confirmDeleteOrder}
                className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'
              >
                Xóa ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 14: TẠO BÀI VIẾT TIN TỨC MỚI (CREATE BLOG MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 15: CHỈNH SỬA BÀI VIẾT (EDIT BLOG MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 16: XÁC NHẬN XÓA BÀI VIẾT (DELETE BLOG MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 17: CHI TIẾT PHIẾU YÊU CẦU LIÊN HỆ & CSKH NOTES (CONTACT DETAILS MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 18: XÁC NHẬN XÓA PHIẾU LIÊN HỆ (DELETE CONTACT CONFIRMATION MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 19: THÊM MỚI SẢN PHẨM (CREATE PRODUCT MODAL)
          ========================================== */}

      {/* ==========================================
          MODAL 20: HIỆU CHỈNH SẢN PHẨM (EDIT PRODUCT MODAL)
          ========================================== */}
    </div>
  );
}

export default function OrdersAdminPage() {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
          <span className='text-xs text-slate-400 mt-2 font-medium'>
            Đang chuẩn bị bảng điều khiển...
          </span>
        </div>
      }
    >
      <OrdersAdminContent />
    </Suspense>
  );
}
