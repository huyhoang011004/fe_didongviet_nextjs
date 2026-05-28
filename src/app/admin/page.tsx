'use client';

import { Suspense, useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Users, 
  ShoppingBag, 
  ShieldAlert, 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertTriangle,
  FolderOpen,
  FolderTree,
  Ticket,
  Calendar,
  Layers,
  DollarSign,
  Truck,
  Check,
  CreditCard,
  UserCheck,
  TrendingUp,
  MapPin,
  Clock,
  Newspaper,
  Mail,
  FileText,
  Globe,
  Tag,
  BookOpen,
  MessageSquare,
  Sparkles,
  Layers3,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getUsersAction,
  createUserByAdminAction,
  updateUserByAdminAction,
  softDeleteUserAction,
  hardDeleteUserAction,
  getProductsAction,
  softDeleteProductAction,
  hardDeleteProductAction,
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  getVouchersAction,
  createVoucherAction,
  updateVoucherAction,
  deleteVoucherAction,
  getOrdersAction,
  updateOrderToDeliveredAction,
  deleteOrderAction,
  getBlogsAction,
  createBlogAction,
  updateBlogAction,
  toggleBlogStatusAction,
  deleteBlogAction,
  getContactsAction,
  updateContactStatusAction,
  softDeleteContactAction,
  deleteContactAction,
  getBranchesAction,
  createProductAction,
  updateProductAction
} from './admin-actions';

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

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
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
  const [hssvTiers, setHssvTiers] = useState<Array<{ minOrderValue: number; discountAmount: number }>>([
    { minOrderValue: 0, discountAmount: 0 }
  ]);

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
  const [updateContactStatusPending, startUpdateContactStatus] = useTransition();

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
    recentOrders: [] as Order[]
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Trạng thái thông báo Toast/Alert
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
      const [usersRes, productsRes, categoriesRes, vouchersRes, ordersRes, blogsRes, contactsRes] = await Promise.all([
        getUsersAction('all', 1, ''),
        getProductsAction(1, 1, ''),
        getCategoriesAction(),
        getVouchersAction(),
        getOrdersAction(),
        getBlogsAction('', '', 1, 1),
        getContactsAction('', '', 1, 1)
      ]);

      let totalRevenue = 0;
      let recentOrders: any[] = [];

      if (ordersRes.success && ordersRes.orders) {
        totalRevenue = ordersRes.orders
          .filter((o: any) => o.isPaid || o.orderStatus === 'Đã hoàn thành')
          .reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
        
        recentOrders = [...ordersRes.orders]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
      }

      setStats({
        totalUsers: usersRes.success ? usersRes.totalUsers : 0,
        totalProducts: productsRes.success ? productsRes.totalProducts : 0,
        totalCategories: categoriesRes.success ? categoriesRes.categories.length : 0,
        totalVouchers: vouchersRes.success ? vouchersRes.vouchers.length : 0,
        totalOrders: ordersRes.success ? ordersRes.orders.length : 0,
        totalBlogs: blogsRes.success ? blogsRes.totalBlogs : 0,
        totalContacts: contactsRes.success ? contactsRes.totalContacts : 0,
        totalRevenue,
        recentOrders
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
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách người dùng.' });
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
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách sản phẩm.' });
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
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách danh mục.' });
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
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách voucher.' });
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
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách đơn hàng.' });
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
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách bài viết.' });
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
      setAlert({ type: 'error', message: res.message || 'Lỗi tải danh sách liên hệ.' });
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
    usersPage, usersFilter, usersSearch, 
    productsPage, productsSearch,
    blogsPage, blogsCategoryFilter, blogsSearch,
    contactsPage, contactsStatusFilter
  ]);

  // ==========================================
  // HANDLERS (TRÌNH XỬ LÝ)
  // ==========================================

  // 1. Tạo mới Người dùng
  const handleCreateUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startCreateUser(async () => {
      const res = await createUserByAdminAction(null, formData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateUserModal(false);
        fetchUsers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 2. Chỉnh sửa Người dùng
  const handleEditUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      role: formData.get('role') as string,
      isDeleted: formData.get('isDeleted') === 'true',
    };

    startEditUser(async () => {
      const res = await updateUserByAdminAction(selectedUser._id, updatedData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditUserModal(false);
        fetchUsers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 3. Khóa/Mở khóa người dùng
  const confirmLockUser = async () => {
    if (!userToLock) return;
    const res = await softDeleteUserAction(userToLock._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowLockUserModal(false);
      fetchUsers();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 4. Xóa vĩnh viễn người dùng
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const res = await hardDeleteUserAction(userToDelete._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteUserModal(false);
      fetchUsers();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 5. Thay đổi trạng thái hiển thị Sản phẩm (Ẩn/Hiện)
  const handleToggleProductStatus = async (id: string) => {
    const res = await softDeleteProductAction(id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      fetchProducts();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 6. Xóa vĩnh viễn sản phẩm
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

  // 7. Tạo mới Danh mục
  const handleCreateCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const brandsRaw = formData.get('brands') as string;

    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      parentCategory: formData.get('parentCategory') as string || null,
      brands: brandsRaw ? brandsRaw.split(',').map(b => b.trim()) : [],
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'true'
    };

    startCreateCategory(async () => {
      const res = await createCategoryAction(categoryData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateCategoryModal(false);
        fetchCategories();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 8. Chỉnh sửa Danh mục
  const handleEditCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCategory) return;
    const formData = new FormData(e.currentTarget);
    const brandsRaw = formData.get('brands') as string;

    const categoryData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      parentCategory: formData.get('parentCategory') as string || null,
      brands: brandsRaw ? brandsRaw.split(',').map(b => b.trim()) : [],
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
      isActive: formData.get('isActive') === 'true'
    };

    startEditCategory(async () => {
      const res = await updateCategoryAction(selectedCategory._id, categoryData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditCategoryModal(false);
        fetchCategories();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 9. Xóa vĩnh viễn Danh mục
  const confirmDeleteCategory = async () => {
    if (!selectedCategory) return;
    const res = await deleteCategoryAction(selectedCategory._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteCategoryModal(false);
      fetchCategories();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 10. Tạo mới Voucher
  const handleCreateVoucherSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const discountType = formData.get('discountType') as string;
    
    const parsedTiers: Array<{ minOrderValue: number; discountAmount: number }> = [];
    if (discountType === 'hssv_tiered') {
      const minValInputs = formData.getAll('tierMinOrderValue');
      const discountValInputs = formData.getAll('tierDiscountAmount');
      for (let i = 0; i < minValInputs.length; i++) {
        if (minValInputs[i] && discountValInputs[i]) {
          parsedTiers.push({
            minOrderValue: parseFloat(minValInputs[i] as string) || 0,
            discountAmount: parseFloat(discountValInputs[i] as string) || 0
          });
        }
      }
    }

    const voucherData = {
      code: (formData.get('code') as string).toUpperCase(),
      description: formData.get('description') as string,
      discountType,
      discountValue: discountType === 'hssv_tiered' ? undefined : parseFloat(formData.get('discountValue') as string) || 0,
      maxDiscount: formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount') as string) : undefined,
      minOrderAmount: parseFloat(formData.get('minOrderAmount') as string) || 0,
      usageLimit: parseInt(formData.get('usageLimit') as string) || 100,
      maxUsagePerUser: parseInt(formData.get('maxUsagePerUser') as string) || 1,
      startDate: formData.get('startDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      isHSSVOnly: formData.get('isHSSVOnly') === 'true',
      hssvTiers: discountType === 'hssv_tiered' ? parsedTiers : []
    };

    startCreateVoucher(async () => {
      const res = await createVoucherAction(voucherData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateVoucherModal(false);
        fetchVouchers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 11. Chỉnh sửa Voucher
  const handleEditVoucherSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVoucher) return;
    const formData = new FormData(e.currentTarget);
    const discountType = formData.get('discountType') as string;

    const parsedTiers: Array<{ minOrderValue: number; discountAmount: number }> = [];
    if (discountType === 'hssv_tiered') {
      const minValInputs = formData.getAll('tierMinOrderValue');
      const discountValInputs = formData.getAll('tierDiscountAmount');
      for (let i = 0; i < minValInputs.length; i++) {
        if (minValInputs[i] && discountValInputs[i]) {
          parsedTiers.push({
            minOrderValue: parseFloat(minValInputs[i] as string) || 0,
            discountAmount: parseFloat(discountValInputs[i] as string) || 0
          });
        }
      }
    }

    const voucherData = {
      description: formData.get('description') as string,
      discountType,
      discountValue: discountType === 'hssv_tiered' ? undefined : parseFloat(formData.get('discountValue') as string) || 0,
      maxDiscount: formData.get('maxDiscount') ? parseFloat(formData.get('maxDiscount') as string) : undefined,
      minOrderAmount: parseFloat(formData.get('minOrderAmount') as string) || 0,
      usageLimit: parseInt(formData.get('usageLimit') as string) || 100,
      maxUsagePerUser: parseInt(formData.get('maxUsagePerUser') as string) || 1,
      startDate: formData.get('startDate') as string,
      expiryDate: formData.get('expiryDate') as string,
      isHSSVOnly: formData.get('isHSSVOnly') === 'true',
      hssvTiers: discountType === 'hssv_tiered' ? parsedTiers : [],
      isActive: formData.get('isActive') === 'true'
    };

    startEditVoucher(async () => {
      const res = await updateVoucherAction(selectedVoucher._id, voucherData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditVoucherModal(false);
        fetchVouchers();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 12. Xóa Voucher
  const confirmDeleteVoucher = async () => {
    if (!selectedVoucher) return;
    const res = await deleteVoucherAction(selectedVoucher._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteVoucherModal(false);
      fetchVouchers();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

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
          orderStatus: 'Đã hoàn thành'
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
  const handleCreateBlogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const tagsRaw = formData.get('tags') as string;

    const blogData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      summary: formData.get('summary') as string,
      content: formData.get('content') as string,
      featuredImage: formData.get('featuredImage') as string || '/auth-image.webp',
      status: formData.get('status') as string,
      tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
      metaTitle: formData.get('metaTitle') as string || undefined,
      metaDescription: formData.get('metaDescription') as string || undefined
    };

    startCreateBlog(async () => {
      const res = await createBlogAction(blogData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowCreateBlogModal(false);
        fetchBlogs();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 16. Chỉnh sửa Bài viết tin tức (Blog)
  const handleEditBlogSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedBlog) return;
    const formData = new FormData(e.currentTarget);
    const tagsRaw = formData.get('tags') as string;

    const blogData = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      summary: formData.get('summary') as string,
      content: formData.get('content') as string,
      featuredImage: formData.get('featuredImage') as string || '/auth-image.webp',
      status: formData.get('status') as string,
      tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [],
      metaTitle: formData.get('metaTitle') as string || undefined,
      metaDescription: formData.get('metaDescription') as string || undefined
    };

    startEditBlog(async () => {
      const res = await updateBlogAction(selectedBlog._id, blogData);
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowEditBlogModal(false);
        fetchBlogs();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 17. Bật/Tắt ẩn bài viết (Toggle isActive)
  const handleToggleBlogActive = async (id: string) => {
    const res = await toggleBlogStatusAction(id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      fetchBlogs();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 18. Xóa bài viết
  const confirmDeleteBlog = async () => {
    if (!selectedBlog) return;
    const res = await deleteBlogAction(selectedBlog._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteBlogModal(false);
      fetchBlogs();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 19. Cập nhật tiến trình CSKH cho phiếu Liên hệ (Notes & Status)
  const handleUpdateContactStatusSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedContact) return;
    const formData = new FormData(e.currentTarget);
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string;

    startUpdateContactStatus(async () => {
      const res = await updateContactStatusAction(selectedContact._id, { status, notes });
      if (res.success) {
        setAlert({ type: 'success', message: res.message });
        setShowContactDetailsModal(false);
        fetchContacts();
      } else {
        setAlert({ type: 'error', message: res.message });
      }
    });
  };

  // 20. Hủy phiếu liên hệ (soft-delete)
  const handleCancelContact = async (id: string) => {
    const res = await softDeleteContactAction(id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      fetchContacts();
      setShowContactDetailsModal(false);
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 21. Xóa vĩnh viễn liên hệ (hard-delete)
  const confirmDeleteContact = async () => {
    if (!selectedContact) return;
    const res = await deleteContactAction(selectedContact._id);
    if (res.success) {
      setAlert({ type: 'success', message: res.message });
      setShowDeleteContactModal(false);
      setShowContactDetailsModal(false);
      fetchContacts();
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  // 22. Thao tác lưu sản phẩm mới (Tạo Sản Phẩm)
  const handleCreateProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formattedVariants = productVariants.map((v, idx) => {
      const inventory = branchesData.map(b => {
        const inputVal = form.querySelector(`[name="variant_${idx}_branch_${b._id}"]`) as HTMLInputElement;
        return {
          branch: b._id,
          stock: inputVal ? parseInt(inputVal.value) || 0 : 0
        };
      });

      const colorInput = form.querySelector(`[name="variant_${idx}_color"]`) as HTMLInputElement;
      const ramInput = form.querySelector(`[name="variant_${idx}_ram"]`) as HTMLInputElement;
      const romInput = form.querySelector(`[name="variant_${idx}_rom"]`) as HTMLInputElement;
      const priceInput = form.querySelector(`[name="variant_${idx}_price"]`) as HTMLInputElement;
      const salePriceInput = form.querySelector(`[name="variant_${idx}_salePrice"]`) as HTMLInputElement;
      const skuInput = form.querySelector(`[name="variant_${idx}_sku"]`) as HTMLInputElement;

      return {
        color: colorInput ? colorInput.value : v.color,
        ram: ramInput ? ramInput.value : v.ram,
        rom: romInput ? romInput.value : v.rom,
        price: priceInput ? parseFloat(priceInput.value) || 0 : v.price,
        salePrice: salePriceInput && salePriceInput.value ? parseFloat(salePriceInput.value) : undefined,
        sku: skuInput ? skuInput.value : v.sku,
        inventory
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

  // 23. Thao tác lưu sản phẩm đã sửa (Cập nhật Sản Phẩm)
  const handleEditProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    const formattedVariants = productVariants.map((v, idx) => {
      const inventory = branchesData.map(b => {
        const inputVal = form.querySelector(`[name="variant_${idx}_branch_${b._id}"]`) as HTMLInputElement;
        return {
          branch: b._id,
          stock: inputVal ? parseInt(inputVal.value) || 0 : 0
        };
      });

      const colorInput = form.querySelector(`[name="variant_${idx}_color"]`) as HTMLInputElement;
      const ramInput = form.querySelector(`[name="variant_${idx}_ram"]`) as HTMLInputElement;
      const romInput = form.querySelector(`[name="variant_${idx}_rom"]`) as HTMLInputElement;
      const priceInput = form.querySelector(`[name="variant_${idx}_price"]`) as HTMLInputElement;
      const salePriceInput = form.querySelector(`[name="variant_${idx}_salePrice"]`) as HTMLInputElement;
      const skuInput = form.querySelector(`[name="variant_${idx}_sku"]`) as HTMLInputElement;

      return {
        color: colorInput ? colorInput.value : v.color,
        ram: ramInput ? ramInput.value : v.ram,
        rom: romInput ? romInput.value : v.rom,
        price: priceInput ? parseFloat(priceInput.value) || 0 : v.price,
        salePrice: salePriceInput && salePriceInput.value ? parseFloat(salePriceInput.value) : undefined,
        sku: skuInput ? skuInput.value : v.sku,
        inventory
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

  // Định dạng hiển thị tiền tệ VNĐ
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Định dạng ngày hiển thị
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Chưa cập nhật';
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Trích lọc đơn hàng theo ô tìm kiếm và trạng thái lọc
  const getFilteredOrders = () => {
    return ordersData.filter(o => {
      const matchesSearch = 
        o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.shippingAddress?.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.shippingAddress?.phone.includes(orderSearch);
      
      const matchesStatus = 
        orderStatusFilter === 'all' ? true :
        orderStatusFilter === 'paid' ? o.isPaid :
        orderStatusFilter === 'unpaid' ? !o.isPaid :
        orderStatusFilter === 'delivered' ? o.isDelivered :
        orderStatusFilter === 'pending' ? !o.isDelivered :
        o.orderStatus === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className='space-y-6 relative'>
      
      {/* THÔNG BÁO TOAST FLOATING */}
      {alert && (
        <div className={`
          fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${alert.type === 'success' ? 'bg-green-50/95 border-green-200 text-green-800' : 'bg-red-50/95 border-red-200 text-red-800'}
        `}>
          {alert.type === 'success' ? <CheckCircle className='text-green-600 flex-shrink-0' /> : <AlertCircle className='text-red-600 flex-shrink-0' />}
          <span className='text-sm font-semibold'>{alert.message}</span>
        </div>
      )}

      {/* TIÊU ĐỀ TRANG DYNAMIC */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white'>
            {currentTab === 'overview' && 'Chào mừng trở lại, Ban Quản Trị'}
            {currentTab === 'users' && 'Quản lý Tài khoản & Nhân viên'}
            {currentTab === 'products' && 'Quản lý Kho sản phẩm'}
            {currentTab === 'categories' && 'Quản lý Danh mục Ngành hàng'}
            {currentTab === 'vouchers' && 'Quản lý Mã giảm giá & Ưu đãi'}
            {currentTab === 'orders' && 'Quản lý Hóa đơn & Đơn hàng'}
            {currentTab === 'blogs' && 'Quản lý Tin tức công nghệ'}
            {currentTab === 'contacts' && 'Kênh tiếp nhận hỗ trợ CSKH'}
            {currentTab === 'settings' && 'Thiết lập hệ thống'}
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            {currentTab === 'overview' && 'Quản lý toàn bộ hiệu suất bán hàng của hệ thống Di Động Việt.'}
            {currentTab === 'users' && 'Cấp tài khoản, thăng/hạ chức, tạm khóa và dọn dẹp lịch sử thành viên.'}
            {currentTab === 'products' && 'Quản lý trạng thái ẩn hiển thị, cấu hình tồn kho chi nhánh và các ảnh đa dạng.'}
            {currentTab === 'categories' && 'Phân chia nhóm hàng điện thoại, tablet, macbook cha-con và thương hiệu liên kết.'}
            {currentTab === 'vouchers' && 'Thiết lập ưu đãi giảm giá cố định, phần trăm, đặc quyền HSSV chống spam.'}
            {currentTab === 'orders' && 'Kiểm soát hóa đơn giao dịch và cập nhật trạng thái vận chuyển.'}
            {currentTab === 'blogs' && 'Xuất bản các tin khuyến mãi, đánh giá công nghệ, tin rò rỉ Di Động Việt.'}
            {currentTab === 'contacts' && 'Hỗ trợ khách hàng gửi yêu cầu tư vấn, thu cũ đổi mới, kỹ thuật, khiếu nại dịch vụ.'}
            {currentTab === 'settings' && 'Thay đổi các cấu hình lõi hệ thống và tham số cổng thanh toán.'}
          </p>
        </div>
        
        {currentTab === 'users' && (
          <Button 
            onClick={() => setShowCreateUserModal(true)} 
            className='bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-2 rounded-xl py-5 px-4 font-semibold shadow-md border-none cursor-pointer'
          >
            <Plus size={16} />
            <span>Thêm tài khoản</span>
          </Button>
        )}

        {currentTab === 'products' && (
          <Button 
            onClick={() => {
              setSelectedProduct(null);
              setProductVariants([{ color: '', ram: '', rom: '', price: '', salePrice: '', sku: '', inventory: [] }]);
              setShowCreateProductModal(true);
            }} 
            className='bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-2 rounded-xl py-5 px-4 font-semibold shadow-md border-none cursor-pointer'
          >
            <Plus size={16} />
            <span>Thêm sản phẩm</span>
          </Button>
        )}

        {currentTab === 'categories' && (
          <Button 
            onClick={() => setShowCreateCategoryModal(true)} 
            className='bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-2 rounded-xl py-5 px-4 font-semibold shadow-md border-none cursor-pointer'
          >
            <Plus size={16} />
            <span>Thêm Danh mục</span>
          </Button>
        )}

        {currentTab === 'vouchers' && (
          <Button 
            onClick={() => {
              setSelectedVoucher(null);
              setVoucherDiscountType('fixed');
              setHssvTiers([{ minOrderValue: 0, discountAmount: 0 }]);
              setShowCreateVoucherModal(true);
            }} 
            className='bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-2 rounded-xl py-5 px-4 font-semibold shadow-md border-none cursor-pointer'
          >
            <Plus size={16} />
            <span>Tạo Voucher</span>
          </Button>
        )}

        {currentTab === 'blogs' && (
          <Button 
            onClick={() => {
              setSelectedBlog(null);
              setShowCreateBlogModal(true);
            }} 
            className='bg-didongviet-red hover:bg-didongviet-dark-red text-white flex items-center gap-2 rounded-xl py-5 px-4 font-semibold shadow-md border-none cursor-pointer'
          >
            <Plus size={16} />
            <span>Viết bài mới</span>
          </Button>
        )}
      </div>

      {/* ==========================================
          TAB 1: TỔNG QUAN (OVERVIEW)
          ========================================== */}
      {currentTab === 'overview' && (
        <div className='space-y-6'>
          {/* STATS CARDS */}
          {statsLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='h-32 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 space-y-4'>
                  <div className='h-4 bg-slate-200 rounded w-2/3'></div>
                  <div className='h-8 bg-slate-200 rounded w-1/2'></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-xs font-bold text-slate-400 uppercase'>Doanh thu (Thực tế)</CardTitle>
                    <DollarSign className='text-emerald-500 h-4 w-4' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-black text-slate-800 dark:text-white'>{formatVND(stats.totalRevenue)}</div>
                    <p className='text-[10px] text-emerald-600 mt-1 font-semibold flex items-center gap-1'>
                      <TrendingUp size={10} />
                      <span>Đơn hàng thanh toán thành công</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-xs font-bold text-slate-400 uppercase'>Đơn hàng hệ thống</CardTitle>
                    <ShoppingBag className='text-blue-500 h-4 w-4' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-black text-slate-800 dark:text-white'>{stats.totalOrders} đơn hàng</div>
                    <p className='text-[10px] text-blue-600 mt-1 font-semibold'>Bao gồm COD và cổng VNPAY</p>
                  </CardContent>
                </Card>

                <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-xs font-bold text-slate-400 uppercase'>Bài viết công nghệ</CardTitle>
                    <Newspaper className='text-purple-500 h-4 w-4' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-black text-slate-800 dark:text-white'>{stats.totalBlogs} bài viết</div>
                    <p className='text-[10px] text-purple-600 mt-1 font-semibold'>Lưu nháp & đã xuất bản</p>
                  </CardContent>
                </Card>

                <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-xs font-bold text-slate-400 uppercase'>Yêu cầu hỗ trợ CSKH</CardTitle>
                    <Mail className='text-didongviet-red h-4 w-4' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-black text-slate-800 dark:text-white'>{stats.totalContacts} phản hồi</div>
                    <p className='text-[10px] text-red-600 mt-1 font-semibold'>Tư vấn, khiếu nại, thu cũ đổi mới</p>
                  </CardContent>
                </Card>
              </div>

              {/* CARD PHỤ GHI THÔNG TIN NGƯỜI DÙNG & DANH MỤC */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-xs'>
                <div className='flex items-center gap-2.5 px-3 py-1 border-r border-slate-100 dark:border-slate-850 last:border-none'>
                  <Users size={16} className='text-slate-400' />
                  <span>Tổng số: <strong>{stats.totalUsers}</strong> Thành viên hệ thống</span>
                </div>
                <div className='flex items-center gap-2.5 px-3 py-1 border-r border-slate-100 dark:border-slate-850 last:border-none'>
                  <FolderTree size={16} className='text-slate-400' />
                  <span>Tổng số: <strong>{stats.totalCategories}</strong> Danh mục ngành hàng</span>
                </div>
                <div className='flex items-center gap-2.5 px-3 py-1 border-r border-slate-100 dark:border-slate-850 last:border-none'>
                  <Ticket size={16} className='text-slate-400' />
                  <span>Tổng số: <strong>{stats.totalVouchers}</strong> Voucher khuyến mại</span>
                </div>
                <div className='flex items-center gap-2.5 px-3 py-1 last:border-none'>
                  <Sparkles size={16} className='text-didongviet-red animate-pulse' />
                  <span className='font-semibold text-slate-800 dark:text-slate-200'>Vận hành Di Động Việt ổn định...</span>
                </div>
              </div>
            </>
          )}

          {/* HÓA ĐƠN GIAO DỊCH VÀ LỐI TẮT */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 shadow-sm flex flex-col justify-start min-h-[350px]'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-base font-bold text-slate-800 dark:text-white'>Hóa đơn giao dịch mới nhất</h3>
                <Button onClick={() => router.push('/admin?tab=orders')} variant='ghost' size='sm' className='text-xs text-didongviet-red font-semibold cursor-pointer'>
                  Xem tất cả
                </Button>
              </div>
              
              {statsLoading ? (
                <div className='flex-1 flex items-center justify-center p-8'>
                  <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                </div>
              ) : stats.recentOrders.length === 0 ? (
                <div className='flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/20 text-slate-400 p-8 text-center'>
                  <FolderOpen size={48} className='text-slate-300 mb-2' />
                  <p className='text-sm font-semibold'>Chưa có giao dịch nào được lưu.</p>
                </div>
              ) : (
                <div className='overflow-x-auto w-full'>
                  <table className='w-full text-left border-collapse text-xs sm:text-sm'>
                    <thead>
                      <tr className='border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-2'>
                        <th className='py-2'>Mã Đơn</th>
                        <th className='py-2'>Khách hàng</th>
                        <th className='py-2'>Phương thức</th>
                        <th className='py-2'>Tổng tiền</th>
                        <th className='py-2'>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300'>
                      {stats.recentOrders.map((o: any) => (
                        <tr key={o._id} className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'>
                          <td className='py-3 font-mono font-bold text-slate-900 dark:text-white truncate max-w-[100px]'>{o._id}</td>
                          <td className='py-3 font-semibold'>{o.shippingAddress?.fullName || 'Khách vãng lai'}</td>
                          <td className='py-3'><span className='px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold'>{o.paymentMethod}</span></td>
                          <td className='py-3 font-bold text-didongviet-red'>{formatVND(o.totalPrice)}</td>
                          <td className='py-3'>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase
                              ${o.orderStatus === 'Đã hoàn thành' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                o.orderStatus === 'Đang giao hàng' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                o.orderStatus === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}
                            `}>
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className='bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 shadow-sm flex flex-col justify-between'>
              <div>
                <h3 className='text-base font-bold text-slate-800 dark:text-white mb-4'>Lối tắt Quản trị</h3>
                <p className='text-xs text-slate-400 leading-relaxed mb-6'>
                  Truy cập nhanh các phân khu nghiệp vụ để phê duyệt hóa đơn, viết tin công nghệ hoặc phản hồi ca hỗ trợ khiếu nại.
                </p>
              </div>
              <div className='space-y-3'>
                <Button onClick={() => router.push('/admin?tab=orders')} className='w-full justify-start py-6 rounded-xl hover:text-didongviet-red cursor-pointer' variant='outline'>
                  <ShoppingBag size={16} className='mr-2 text-didongviet-red' />
                  Xử lý Đơn hàng ({stats.totalOrders})
                </Button>
                <Button onClick={() => router.push('/admin?tab=blogs')} className='w-full justify-start py-6 rounded-xl hover:text-didongviet-red cursor-pointer' variant='outline'>
                  <Newspaper size={16} className='mr-2 text-purple-600' />
                  Viết bài công nghệ ({stats.totalBlogs})
                </Button>
                <Button onClick={() => router.push('/admin?tab=contacts')} className='w-full justify-start py-6 rounded-xl hover:text-didongviet-red cursor-pointer' variant='outline'>
                  <Mail size={16} className='mr-2 text-blue-500' />
                  Hỗ trợ Khách hàng ({stats.totalContacts})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: QUẢN LÝ NGƯỜI DÙNG (USERS)
          ========================================== */}
      {currentTab === 'users' && (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div className='flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto'>
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'active', label: 'Hoạt động' },
                { key: 'deleted', label: 'Bị tạm khóa' }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => { setUsersFilter(t.key); setUsersPage(1); }}
                  className={`
                    flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
                    ${usersFilter === t.key ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-xs' : 'text-slate-500 hover:text-slate-700 bg-transparent'}
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className='relative w-full sm:w-72'>
              <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
              <Input
                placeholder='Tìm theo tên, email...'
                value={usersSearch}
                onChange={(e) => { setUsersSearch(e.target.value); setUsersPage(1); }}
                className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
              />
            </div>
          </CardHeader>
          <CardContent className='p-0 overflow-x-auto'>
            {userLoading ? (
              <div className='flex flex-col items-center justify-center p-20'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                <span className='text-xs text-slate-400 mt-2 font-medium'>Đang lấy dữ liệu tài khoản...</span>
              </div>
            ) : usersData.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>Không tìm thấy người dùng phù hợp.</p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse min-w-[700px]'>
                <thead>
                  <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6'>Họ và Tên</th>
                    <th className='py-4 px-6'>Email</th>
                    <th className='py-4 px-6'>Số điện thoại</th>
                    <th className='py-4 px-6'>Vai trò</th>
                    <th className='py-4 px-6'>Trạng thái</th>
                    <th className='py-4 px-6 text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
                  {usersData.map((u) => (
                    <tr key={u._id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'>
                      <td className='py-4 px-6 font-semibold text-slate-900 dark:text-white'>{u.name}</td>
                      <td className='py-4 px-6'>{u.email}</td>
                      <td className='py-4 px-6'>{u.phone || 'Chưa cập nhật'}</td>
                      <td className='py-4 px-6'>
                        <span className={`
                          text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase
                          ${u.role === 'admin' && 'bg-purple-50 text-purple-600 border-purple-200'}
                          ${u.role === 'staff' && 'bg-blue-50 text-blue-600 border-blue-200'}
                          ${u.role === 'user' && 'bg-slate-100 text-slate-600 border-slate-200'}
                        `}>
                          {u.role === 'admin' ? 'Quản trị' : u.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span className={`
                          flex items-center gap-1.5 text-xs font-semibold
                          ${u.isDeleted ? 'text-red-500' : 'text-emerald-600'}
                        `}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.isDeleted ? 'bg-red-500' : 'bg-emerald-600'}`} />
                          <span>{u.isDeleted ? 'Bị tạm khóa' : 'Hoạt động'}</span>
                        </span>
                      </td>
                      <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                        <Button 
                          onClick={() => { setSelectedUser(u); setShowEditUserModal(true); }}
                          variant='outline' 
                          size='icon' 
                          className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                        >
                          <Edit size={14} />
                        </Button>
                        
                        {u.email !== 'admin@gmail.com' && (
                          <>
                            <Button 
                              onClick={() => { setUserToLock(u); setShowLockUserModal(true); }}
                              variant='outline' 
                              size='icon' 
                              className={`h-8 w-8 border-slate-200 cursor-pointer ${u.isDeleted ? 'hover:text-emerald-600 hover:bg-emerald-50' : 'hover:text-amber-600 hover:bg-amber-50'}`}
                            >
                              {u.isDeleted ? <Unlock size={14} /> : <Lock size={14} />}
                            </Button>
                            
                            <Button 
                              onClick={() => { setUserToDelete(u); setShowDeleteUserModal(true); }}
                              variant='outline' 
                              size='icon' 
                              className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>

          {/* Phân trang */}
          {!userLoading && usersTotalPages > 1 && (
            <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <span className='text-xs text-slate-400 font-medium'>
                Trang <strong className='text-slate-700 dark:text-slate-300'>{usersPage}</strong> trên <strong className='text-slate-700 dark:text-slate-300'>{usersTotalPages}</strong> (Tổng {usersTotalCount} thành viên)
              </span>
              <div className='flex gap-1.5'>
                <Button 
                  disabled={usersPage <= 1} 
                  onClick={() => setUsersPage(usersPage - 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  <ChevronLeft size={16} className='mr-1' /> Trước
                </Button>
                <Button 
                  disabled={usersPage >= usersTotalPages} 
                  onClick={() => setUsersPage(usersPage + 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  Sau <ChevronRight size={16} className='ml-1' />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ==========================================
          TAB 3: QUẢN LÝ SẢN PHẨM (PRODUCTS)
          ========================================== */}
      {currentTab === 'products' && (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <h3 className='text-base font-bold text-slate-800 dark:text-white'>Tồn kho sản phẩm công khai</h3>
            
            <div className='relative w-full sm:w-72'>
              <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
              <Input
                placeholder='Tìm sản phẩm...'
                value={productsSearch}
                onChange={(e) => { setProductsSearch(e.target.value); setProductsPage(1); }}
                className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
              />
            </div>
          </CardHeader>
          <CardContent className='p-0 overflow-x-auto'>
            {productLoading ? (
              <div className='flex flex-col items-center justify-center p-20'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                <span className='text-xs text-slate-400 mt-2 font-medium'>Đang lấy danh mục sản phẩm từ MongoDB...</span>
              </div>
            ) : productsData.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>Không có sản phẩm nào trong cửa hàng.</p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse min-w-[700px]'>
                <thead>
                  <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6'>Sản phẩm</th>
                    <th className='py-4 px-6'>Thương hiệu</th>
                    <th className='py-4 px-6'>Giá (Khoảng)</th>
                    <th className='py-4 px-6'>Tổng tồn kho</th>
                    <th className='py-4 px-6'>Trạng thái</th>
                    <th className='py-4 px-6 text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
                  {productsData.map((p) => {
                    const minP = p.priceRange?.min || 0;
                    const maxP = p.priceRange?.max || 0;
                    const stock = p.totalStock ?? 0;
                    const thumbUrl = p.imageUrl || '/auth-image.webp';

                    return (
                      <tr key={p._id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'>
                        <td className='py-4 px-6 flex items-center gap-3 min-w-[280px]'>
                          <div className='h-12 w-12 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center p-1 flex-shrink-0'>
                            <img src={thumbUrl} alt={p.name} className='h-full w-full object-contain' />
                          </div>
                          <div>
                            <span className='font-bold text-slate-900 dark:text-white block leading-tight'>{p.name}</span>
                            <span className='text-[10px] text-slate-400 font-mono mt-0.5 block'>{p._id}</span>
                          </div>
                        </td>
                        <td className='py-4 px-6 font-semibold text-slate-600 dark:text-slate-400'>{p.brand || 'Di Động Việt'}</td>
                        <td className='py-4 px-6 font-bold text-didongviet-red'>
                          {minP === maxP ? formatVND(minP) : `${formatVND(minP)} - ${formatVND(maxP)}`}
                        </td>
                        <td className='py-4 px-6 font-bold text-slate-800 dark:text-slate-200'>{stock} máy</td>
                        <td className='py-4 px-6'>
                          <span className={`
                            flex items-center gap-1.5 text-xs font-semibold
                            ${p.isActive ? 'text-emerald-600' : 'text-slate-400'}
                          `}>
                            <span className={`h-1.5 w-1.5 rounded-full ${p.isActive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            <span>{p.isActive ? 'Đang hiển thị' : 'Đã ẩn'}</span>
                          </span>
                        </td>
                        <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                          <Button 
                            onClick={() => handleToggleProductStatus(p._id)}
                            variant='outline' 
                            size='icon' 
                            className={`h-8 w-8 border-slate-200 cursor-pointer ${p.isActive ? 'hover:text-slate-500 hover:bg-slate-50' : 'hover:text-emerald-600 hover:bg-emerald-50'}`}
                            title={p.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                          >
                            {p.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              setSelectedProduct(p);
                              setProductVariants(p.variants || []);
                              setShowEditProductModal(true);
                            }}
                            variant='outline' 
                            size='icon' 
                            className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                            title='Chỉnh sửa'
                          >
                            <Edit size={14} />
                          </Button>

                          {currentUser?.role === 'admin' && (
                            <Button 
                              onClick={() => { setProductToDelete(p); setShowDeleteProductModal(true); }}
                              variant='outline' 
                              size='icon' 
                              className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                              title='Xóa vĩnh viễn'
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>

          {/* Phân trang */}
          {!productLoading && productsTotalPages > 1 && (
            <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <span className='text-xs text-slate-400 font-medium'>
                Trang <strong className='text-slate-700 dark:text-slate-300'>{productsPage}</strong> trên <strong className='text-slate-700 dark:text-slate-300'>{productsTotalPages}</strong> (Tổng {productsTotalCount} sản phẩm)
              </span>
              <div className='flex gap-1.5'>
                <Button 
                  disabled={productsPage <= 1} 
                  onClick={() => setProductsPage(productsPage - 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  <ChevronLeft size={16} className='mr-1' /> Trước
                </Button>
                <Button 
                  disabled={productsPage >= productsTotalPages} 
                  onClick={() => setProductsPage(productsPage + 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  Sau <ChevronRight size={16} className='ml-1' />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ==========================================
          TAB 4: QUẢN LÝ DANH MỤC (CATEGORIES)
          ========================================== */}
      {currentTab === 'categories' && (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
            <h3 className='text-base font-bold text-slate-800 dark:text-white'>Cấu trúc ngành hàng Di Động Việt</h3>
            <span className='text-xs text-slate-400'>Tổng số: {categoriesData.length} danh mục</span>
          </CardHeader>
          <CardContent className='p-0 overflow-x-auto'>
            {categoryLoading ? (
              <div className='flex flex-col items-center justify-center p-20'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                <span className='text-xs text-slate-400 mt-2 font-medium'>Đang lấy danh mục ngành hàng...</span>
              </div>
            ) : categoriesData.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>Chưa có danh mục nào được khởi tạo.</p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse min-w-[700px]'>
                <thead>
                  <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6'>Tên Danh Mục</th>
                    <th className='py-4 px-6'>Đường dẫn (Slug)</th>
                    <th className='py-4 px-6'>Danh mục cha</th>
                    <th className='py-4 px-6'>Thương hiệu</th>
                    <th className='py-4 px-6'>Sắp xếp</th>
                    <th className='py-4 px-6'>Trạng thái</th>
                    <th className='py-4 px-6 text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
                  {categoriesData.map((c) => {
                    const parent = categoriesData.find(p => p._id === c.parentCategory);
                    return (
                      <tr key={c._id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'>
                        <td className='py-4 px-6 font-bold text-slate-900 dark:text-white'>{c.name}</td>
                        <td className='py-4 px-6 font-mono text-xs'>{c.slug}</td>
                        <td className='py-4 px-6'>
                          {parent ? (
                            <span className='px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300'>
                              {parent.name}
                            </span>
                          ) : (
                            <span className='text-slate-400 text-xs italic'>Ngành hàng gốc</span>
                          )}
                        </td>
                        <td className='py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                          {c.brands && c.brands.length > 0 ? c.brands.join(', ') : 'Chưa thiết lập'}
                        </td>
                        <td className='py-4 px-6 font-mono font-bold'>{c.displayOrder}</td>
                        <td className='py-4 px-6'>
                          <span className={`flex items-center gap-1.5 text-xs font-semibold ${c.isActive !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${c.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                            <span>{c.isActive !== false ? 'Hiển thị' : 'Đang ẩn'}</span>
                          </span>
                        </td>
                        <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                          <Button 
                            onClick={() => { setSelectedCategory(c); setShowEditCategoryModal(true); }}
                            variant='outline' 
                            size='icon' 
                            className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            onClick={() => { setSelectedCategory(c); setShowDeleteCategoryModal(true); }}
                            variant='outline' 
                            size='icon' 
                            className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* ==========================================
          TAB 5: QUẢN LÝ VOUCHER (VOUCHERS)
          ========================================== */}
      {currentTab === 'vouchers' && (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
            <h3 className='text-base font-bold text-slate-800 dark:text-white'>Cổng phát hành voucher & ưu đãi</h3>
            <span className='text-xs text-slate-400'>Tổng số: {vouchersData.length} mã giảm giá</span>
          </CardHeader>
          <CardContent className='p-0 overflow-x-auto'>
            {voucherLoading ? (
              <div className='flex flex-col items-center justify-center p-20'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                <span className='text-xs text-slate-400 mt-2 font-medium'>Đang lấy danh sách mã giảm giá...</span>
              </div>
            ) : vouchersData.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>Chưa phát hành bất kỳ mã voucher nào.</p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse min-w-[750px]'>
                <thead>
                  <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6'>Mã Voucher</th>
                    <th className='py-4 px-6'>Loại giảm</th>
                    <th className='py-4 px-6'>Giá trị giảm</th>
                    <th className='py-4 px-6'>Đã dùng/Tổng</th>
                    <th className='py-4 px-6'>Thời gian áp dụng</th>
                    <th className='py-4 px-6'>Đối tượng</th>
                    <th className='py-4 px-6'>Kích hoạt</th>
                    <th className='py-4 px-6 text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
                  {vouchersData.map((v) => (
                    <tr key={v._id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'>
                      <td className='py-4 px-6 font-mono font-bold text-slate-900 dark:text-white'>{v.code}</td>
                      <td className='py-4 px-6'>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase
                          ${v.discountType === 'fixed' && 'bg-blue-50 text-blue-600 border-blue-200'}
                          ${v.discountType === 'percentage' && 'bg-amber-50 text-amber-600 border-amber-200'}
                          ${v.discountType === 'hssv_tiered' && 'bg-purple-50 text-purple-600 border-purple-200'}
                        `}>
                          {v.discountType === 'fixed' ? 'Tiền mặt' : v.discountType === 'percentage' ? 'Phần trăm' : 'Phân tầng HSSV'}
                        </span>
                      </td>
                      <td className='py-4 px-6 font-bold text-didongviet-red'>
                        {v.discountType === 'hssv_tiered' ? (
                          <span className='text-xs text-purple-600 underline cursor-help animate-pulse' title={JSON.stringify(v.hssvTiers)}>Chi tiết bậc</span>
                        ) : v.discountType === 'percentage' ? (
                          `${v.discountValue}% (Tối đa ${formatVND(v.maxDiscount || 0)})`
                        ) : (
                          formatVND(v.discountValue || 0)
                        )}
                      </td>
                      <td className='py-4 px-6 font-semibold'>{v.usedCount ?? 0} / {v.usageLimit}</td>
                      <td className='py-4 px-6 text-xs text-slate-500 leading-normal'>
                        <div className='flex flex-col'>
                          <span>Bắt đầu: {formatDate(v.startDate)}</span>
                          <span>Kết thúc: {formatDate(v.expiryDate)}</span>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-xs'>
                        {v.isHSSVOnly ? (
                          <span className='bg-red-50 text-red-600 border border-red-200 font-bold px-2 py-0.5 rounded-full uppercase text-[9px]'>Học sinh SV</span>
                        ) : (
                          <span className='text-slate-400'>Mọi thành viên</span>
                        )}
                      </td>
                      <td className='py-4 px-6'>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${v.isActive !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${v.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                          <span>{v.isActive !== false ? 'Kích hoạt' : 'Tạm khóa'}</span>
                        </span>
                      </td>
                      <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                        <Button 
                          onClick={() => { setSelectedVoucher(v); setVoucherDiscountType(v.discountType); setHssvTiers(v.hssvTiers || []); setShowEditVoucherModal(true); }}
                          variant='outline' 
                          size='icon' 
                          className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          onClick={() => { setSelectedVoucher(v); setShowDeleteVoucherModal(true); }}
                          variant='outline' 
                          size='icon' 
                          className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                        >
                          <Trash2 size={14} />
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
                { key: 'unpaid', label: 'Chưa thanh toán' }
              ].map(t => (
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
              <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
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
                <span className='text-xs text-slate-400 mt-2 font-medium'>Đang lấy danh sách hóa đơn đơn hàng...</span>
              </div>
            ) : getFilteredOrders().length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>Không có đơn hàng nào khớp với bộ lọc.</p>
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
                    <tr key={o._id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'>
                      <td className='py-4 px-6 font-mono font-bold text-slate-900 dark:text-white truncate max-w-[120px]'>{o._id}</td>
                      <td className='py-4 px-6'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-slate-900 dark:text-white'>{o.shippingAddress?.fullName || 'Khách vãng lai'}</span>
                          <span className='text-xs text-slate-400'>{o.shippingAddress?.phone || 'Chưa có SĐT'}</span>
                        </div>
                      </td>
                      <td className='py-4 px-6 text-xs'>{formatDate(o.createdAt)}</td>
                      <td className='py-4 px-6 font-extrabold text-didongviet-red'>{formatVND(o.totalPrice)}</td>
                      <td className='py-4 px-6'><span className='px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400'>{o.paymentMethod}</span></td>
                      <td className='py-4 px-6'>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${o.isPaid ? 'text-emerald-600' : 'text-amber-500'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${o.isPaid ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                          <span>{o.isPaid ? `Đã TT (${formatDate(o.paidAt)})` : 'Chờ TT'}</span>
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase
                          ${o.orderStatus === 'Đã hoàn thành' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                            o.orderStatus === 'Đang giao hàng' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            o.orderStatus === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}
                        `}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className='py-4 px-6 text-right whitespace-nowrap'>
                        <Button 
                          onClick={() => { setSelectedOrder(o); setShowOrderDetailsModal(true); }}
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
      {currentTab === 'blogs' && (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div className='flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto overflow-x-auto'>
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'Công nghệ', label: 'Công nghệ' },
                { key: 'Đánh giá', label: 'Đánh giá' },
                { key: 'Khuyến mãi', label: 'Khuyến mãi' },
                { key: 'Tư vấn', label: 'Tư vấn' }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => { setBlogsCategoryFilter(t.key); setBlogsPage(1); }}
                  className={`
                    flex-shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
                    ${blogsCategoryFilter === t.key ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-xs' : 'text-slate-500 hover:text-slate-700 bg-transparent'}
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className='relative w-full sm:w-72'>
              <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
              <Input
                placeholder='Tìm bài viết...'
                value={blogsSearch}
                onChange={(e) => { setBlogsSearch(e.target.value); setBlogsPage(1); }}
                className='pl-10 pr-4 py-5 rounded-xl border-slate-200 w-full text-sm'
              />
            </div>
          </CardHeader>
          <CardContent className='p-0 overflow-x-auto'>
            {blogLoading ? (
              <div className='flex flex-col items-center justify-center p-20'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                <span className='text-xs text-slate-400 mt-2 font-medium'>Đang lấy danh sách tin tức công nghệ...</span>
              </div>
            ) : blogsData.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>Không có bài viết nào phù hợp.</p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse min-w-[750px]'>
                <thead>
                  <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6'>Bài viết</th>
                    <th className='py-4 px-6'>Chuyên mục</th>
                    <th className='py-4 px-6'>Tác giả</th>
                    <th className='py-4 px-6'>Lượt xem</th>
                    <th className='py-4 px-6'>Trạng thái bài</th>
                    <th className='py-4 px-6'>Hiển thị</th>
                    <th className='py-4 px-6 text-right'>Hành động</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
                  {blogsData.map((b) => (
                    <tr key={b._id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'>
                      <td className='py-4 px-6 flex items-center gap-3 min-w-[280px]'>
                        <div className='h-12 w-20 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center p-1 flex-shrink-0'>
                          <img src={b.featuredImage || '/auth-image.webp'} alt={b.title} className='h-full w-full object-cover' />
                        </div>
                        <div>
                          <span className='font-bold text-slate-900 dark:text-white block leading-tight'>{b.title}</span>
                          <span className='text-[10px] text-slate-400 font-mono mt-0.5 block truncate max-w-[200px]'>{b.slug}</span>
                        </div>
                      </td>
                      <td className='py-4 px-6 font-semibold text-slate-600 dark:text-slate-400'>{b.category}</td>
                      <td className='py-4 px-6 font-bold text-slate-800 dark:text-slate-200'>{b.author?.name || 'Vận hành'}</td>
                      <td className='py-4 px-6 font-mono'>{b.views ?? 0} view</td>
                      <td className='py-4 px-6'>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase
                          ${b.status === 'Đã xuất bản' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}
                        `}>
                          {b.status}
                        </span>
                      </td>
                      <td className='py-4 px-6'>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${b.isActive !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${b.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                          <span>{b.isActive !== false ? 'Đang hiện' : 'Đã ẩn'}</span>
                        </span>
                      </td>
                      <td className='py-4 px-6 text-right space-x-1.5 whitespace-nowrap'>
                        <Button 
                          onClick={() => handleToggleBlogActive(b._id)}
                          variant='outline' 
                          size='icon' 
                          className={`h-8 w-8 border-slate-200 cursor-pointer ${b.isActive !== false ? 'hover:text-slate-550 hover:bg-slate-50' : 'hover:text-emerald-600 hover:bg-emerald-50'}`}
                          title={b.isActive !== false ? 'Ẩn bài viết' : 'Hiện bài viết'}
                        >
                          {b.isActive !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button 
                          onClick={() => { setSelectedBlog(b); setShowEditBlogModal(true); }}
                          variant='outline' 
                          size='icon' 
                          className='h-8 w-8 hover:text-blue-600 hover:bg-blue-50 border-slate-200 cursor-pointer'
                          title='Chỉnh sửa'
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          onClick={() => { setSelectedBlog(b); setShowDeleteBlogModal(true); }}
                          variant='outline' 
                          size='icon' 
                          className='h-8 w-8 hover:text-red-600 hover:bg-red-50 border-slate-200 cursor-pointer'
                          title='Xóa'
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>

          {/* Phân trang */}
          {!blogLoading && blogsTotalPages > 1 && (
            <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <span className='text-xs text-slate-400 font-medium'>
                Trang <strong className='text-slate-700 dark:text-slate-300'>{blogsPage}</strong> trên <strong className='text-slate-700 dark:text-slate-300'>{blogsTotalPages}</strong> (Tổng {blogsTotalCount} bài viết)
              </span>
              <div className='flex gap-1.5'>
                <Button 
                  disabled={blogsPage <= 1} 
                  onClick={() => setBlogsPage(blogsPage - 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  <ChevronLeft size={16} className='mr-1' /> Trước
                </Button>
                <Button 
                  disabled={blogsPage >= blogsTotalPages} 
                  onClick={() => setBlogsPage(blogsPage + 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  Sau <ChevronRight size={16} className='ml-1' />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ==========================================
          TAB 8: QUẢN LÝ LIÊN HỆ & PHẢN HỒI (CONTACTS)
          ========================================== */}
      {currentTab === 'contacts' && (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl overflow-hidden'>
          <CardHeader className='p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between'>
            <div className='flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto overflow-x-auto'>
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'Chưa xử lý', label: 'Chưa xử lý' },
                { key: 'Đang xử lý', label: 'Đang xử lý' },
                { key: 'Đã xử lý', label: 'Đã xử lý' },
                { key: 'Đã hủy', label: 'Đã hủy' }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => { setContactsStatusFilter(t.key); setContactsPage(1); }}
                  className={`
                    flex-shrink-0 px-4 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer
                    ${contactsStatusFilter === t.key ? 'bg-white dark:bg-slate-900 text-didongviet-red shadow-xs' : 'text-slate-500 hover:text-slate-700 bg-transparent'}
                  `}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className='text-xs text-slate-400'>Tổng nhận: {contactsTotalCount} phản hồi</span>
          </CardHeader>
          <CardContent className='p-0 overflow-x-auto'>
            {contactLoading ? (
              <div className='flex flex-col items-center justify-center p-20'>
                <div className='h-10 w-10 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
                <span className='text-xs text-slate-400 mt-2 font-medium'>Đang lấy danh sách yêu cầu khiếu nại...</span>
              </div>
            ) : contactsData.length === 0 ? (
              <div className='flex flex-col items-center justify-center p-20 text-slate-400'>
                <FolderOpen size={48} className='text-slate-300 mb-2' />
                <p className='text-sm font-semibold'>Không có phiếu khiếu nại/yêu cầu nào khớp.</p>
              </div>
            ) : (
              <table className='w-full text-left border-collapse min-w-[800px]'>
                <thead>
                  <tr className='bg-slate-50/50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider'>
                    <th className='py-4 px-6'>Khách gửi phản hồi</th>
                    <th className='py-4 px-6'>Chủ đề tiếp nhận</th>
                    <th className='py-4 px-6'>Thời gian gửi</th>
                    <th className='py-4 px-6'>Nội dung tóm lược</th>
                    <th className='py-4 px-6'>CSKH Phụ trách</th>
                    <th className='py-4 px-6'>Trạng thái</th>
                    <th className='py-4 px-6 text-right'>Chi tiết</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100/70 dark:divide-slate-800/70 text-sm text-slate-700 dark:text-slate-300'>
                  {contactsData.map((c) => (
                    <tr key={c._id} className='hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors'>
                      <td className='py-4 px-6'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-slate-900 dark:text-white'>{c.fullName}</span>
                          <span className='text-xs text-slate-400'>{c.phone} / {c.email}</span>
                        </div>
                      </td>
                      <td className='py-4 px-6'>
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border uppercase
                          ${c.subject === 'Khiếu nại dịch vụ' ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 
                            c.subject === 'Thu cũ đổi mới' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}
                        `}>
                          {c.subject}
                        </span>
                      </td>
                      <td className='py-4 px-6 text-xs'>{formatDate(c.createdAt)}</td>
                      <td className='py-4 px-6 text-xs truncate max-w-[200px] text-slate-500 dark:text-slate-400'>{c.message}</td>
                      <td className='py-4 px-6 font-bold text-xs'>
                        {c.processedBy ? (
                          <span className='text-purple-600'>{c.processedBy.name} ({c.processedBy.role === 'admin' ? 'Quản trị' : 'Staff'})</span>
                        ) : (
                          <span className='text-slate-400 italic font-normal'>Đang chờ nhận ca</span>
                        )}
                      </td>
                      <td className='py-4 px-6'>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase
                          ${c.status === 'Đã xử lý' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                            c.status === 'Đang xử lý' ? 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse' :
                            c.status === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}
                        `}>
                          {c.status}
                        </span>
                      </td>
                      <td className='py-4 px-6 text-right whitespace-nowrap'>
                        <Button 
                          onClick={() => { setSelectedContact(c); setShowContactDetailsModal(true); }}
                          variant='outline' 
                          size='sm' 
                          className='flex items-center gap-1.5 hover:text-didongviet-red border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-semibold py-4 rounded-xl'
                        >
                          <Eye size={12} />
                          <span>Mở phiếu</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>

          {/* Phân trang */}
          {!contactLoading && contactsTotalPages > 1 && (
            <div className='p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
              <span className='text-xs text-slate-400 font-medium'>
                Trang <strong className='text-slate-700 dark:text-slate-300'>{contactsPage}</strong> trên <strong className='text-slate-700 dark:text-slate-300'>{contactsTotalPages}</strong> (Tổng {contactsTotalCount} phản hồi)
              </span>
              <div className='flex gap-1.5'>
                <Button 
                  disabled={contactsPage <= 1} 
                  onClick={() => setContactsPage(contactsPage - 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  <ChevronLeft size={16} className='mr-1' /> Trước
                </Button>
                <Button 
                  disabled={contactsPage >= contactsTotalPages} 
                  onClick={() => setContactsPage(contactsPage + 1)} 
                  variant='outline' 
                  size='sm' 
                  className='rounded-xl border-slate-200 cursor-pointer'
                >
                  Sau <ChevronRight size={16} className='ml-1' />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ==========================================
          TAB N: THIẾT LẬP PLACEHOLDERS (SETTINGS)
          ========================================== */}
      {currentTab === 'settings' && (
        <Card className='border-slate-200/50 p-12 text-center rounded-2xl max-w-xl mx-auto border border-dashed'>
          <div className='inline-flex items-center justify-center w-14 h-14 bg-slate-100 text-slate-400 rounded-full mb-4'>
            <AlertTriangle size={24} />
          </div>
          <h3 className='text-lg font-bold text-slate-800 mb-2'>Chức năng đang phát triển</h3>
          <p className='text-sm text-slate-400 leading-relaxed mb-6'>
            Trang nghiệp vụ này đã được cấu hình sườn layout và liên kết sẵn sàng trong Sidebar. Hệ thống sẽ tích hợp dữ liệu thật của các cổng dịch vụ khi cấu hình các module liên quan tiếp theo.
          </p>
          <Button onClick={() => router.push('/admin?tab=overview')} className='py-5 bg-slate-900 text-white rounded-xl font-semibold cursor-pointer border-none hover:bg-slate-800'>
            Quay lại Tổng quan
          </Button>
        </Card>
      )}

      {/* ==========================================
          MODAL 1: THÊM NGƯỜI DÙNG (CREATE USER MODAL)
          ========================================== */}
      {showCreateUserModal && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 text-base'>Thêm tài khoản vận hành</h3>
              <button onClick={() => setShowCreateUserModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleCreateUserSubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Họ và Tên</label>
                <Input name='name' placeholder='Ví dụ: Nguyễn Văn Hoàng' required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Số điện thoại</label>
                  <Input name='phone' type='tel' placeholder='0987654321' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Vai trò</label>
                  <select name='role' required className='w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:border-didongviet-red outline-none'>
                    <option value='user'>Khách hàng</option>
                    <option value='staff'>Nhân viên</option>
                    <option value='admin'>Quản trị</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Địa chỉ Email</label>
                <Input name='email' type='email' placeholder='hoang@gmail.com' required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mật khẩu khởi tạo</label>
                <Input name='password' type='password' placeholder='******' required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <p className='text-[10px] text-slate-400 italic bg-slate-50 border border-slate-100 rounded-lg p-2.5'>
                * Hệ thống sẽ tự động tạo mã OTP kích hoạt và gửi email hướng dẫn về Gmail của tài khoản được tạo ngay khi ấn xác nhận.
              </p>

              <div className='pt-4 border-t border-slate-100 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowCreateUserModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy bỏ
                </Button>
                <Button type='submit' disabled={createUserPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {createUserPending ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: CHỈNH SỬA NGƯỜI DÙNG (EDIT USER MODAL)
          ========================================== */}
      {showEditUserModal && selectedUser && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 text-base'>Sửa hồ sơ người dùng</h3>
              <button onClick={() => setShowEditUserModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleEditUserSubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Họ và Tên</label>
                <Input name='name' defaultValue={selectedUser.name} required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Số điện thoại</label>
                  <Input name='phone' defaultValue={selectedUser.phone} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Vai trò</label>
                  <select name='role' defaultValue={selectedUser.role} required className='w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:border-didongviet-red outline-none'>
                    <option value='user'>Khách hàng</option>
                    <option value='staff'>Nhân viên</option>
                    <option value='admin'>Quản trị</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Địa chỉ Email</label>
                <Input name='email' type='email' defaultValue={selectedUser.email} required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Địa chỉ cư trú</label>
                <Input name='address' defaultValue={selectedUser.address || ''} placeholder='Ví dụ: Quận 1, Tp. Hồ Chí Minh' className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Trạng thái khóa tài khoản</label>
                <select name='isDeleted' defaultValue={selectedUser.isDeleted ? 'true' : 'false'} required className='w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-sm focus:border-didongviet-red outline-none'>
                  <option value='false'>Hoạt động bình thường</option>
                  <option value='true'>Tạm khóa (Soft-Deleted)</option>
                </select>
              </div>

              <div className='pt-4 border-t border-slate-100 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowEditUserModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy
                </Button>
                <Button type='submit' disabled={editUserPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {editUserPending ? 'Đang cập nhật...' : 'Lưu lại'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: XÁC NHẬN KHÓA TÀI KHOẢN (LOCK MODAL)
          ========================================== */}
      {showLockUserModal && userToLock && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-500 mb-4 border border-amber-200'>
              <AlertTriangle size={24} />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2'>
              {userToLock.isDeleted ? 'Mở khóa tài khoản?' : 'Tạm khóa tài khoản?'}
            </h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Bạn có chắc chắn muốn {userToLock.isDeleted ? 'MỞ KHÓA' : 'TẠM KHÓA'} tài khoản của <strong>{userToLock.name}</strong> ({userToLock.email})? Người dùng sẽ {userToLock.isDeleted ? 'có thể đăng nhập bình thường.' : 'bị từ chối đăng nhập và đưa vào trạng thái chờ xóa cứng 60 ngày.'}
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowLockUserModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy bỏ
              </Button>
              <Button onClick={confirmLockUser} className='w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Xác nhận
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 4: XÁC NHẬN XÓA TÀI KHOẢN (DELETE USER MODAL)
          ========================================== */}
      {showDeleteUserModal && userToDelete && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
              <ShieldAlert size={24} className='animate-pulse' />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>Xóa vĩnh viễn tài khoản?</h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              ⚠️ <strong>CẢNH BÁO NGUY HIỂM!</strong> Hành động xóa vĩnh viễn tài khoản của <strong>{userToDelete.name}</strong> sẽ dọn sạch giỏ hàng, hồ sơ và khóa vĩnh viễn địa chỉ email này. Đây là thao tác <strong>không thể đảo ngược</strong>.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowDeleteUserModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy
              </Button>
              <Button onClick={confirmDeleteUser} className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Thanh trừng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 5: XÁC NHẬN XÓA SẢN PHẨM (DELETE PRODUCT MODAL)
          ========================================== */}
      {showDeleteProductModal && productToDelete && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
              <ShieldAlert size={24} />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>Xóa vĩnh viễn sản phẩm?</h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm <strong>{productToDelete.name}</strong> khỏi kho hàng của Di Động Việt? Thao tác này sẽ gỡ bỏ máy và tất cả các ảnh biến thể liên quan.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowDeleteProductModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy
              </Button>
              <Button onClick={confirmDeleteProduct} className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Xóa bỏ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 6: THÊM DANH MỤC (CREATE CATEGORY MODAL)
          ========================================== */}
      {showCreateCategoryModal && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Tạo danh mục mới</h3>
              <button onClick={() => setShowCreateCategoryModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleCreateCategorySubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Tên Danh Mục</label>
                <Input name='name' placeholder='Ví dụ: iPhone 17 Series' required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả ngành hàng</label>
                <Input name='description' placeholder='Thiết bị di động đỉnh cao từ nhà Táo...' className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Danh mục cha</label>
                <select name='parentCategory' className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                  <option value=''>Không có (Là Danh mục gốc)</option>
                  {categoriesData.filter(c => !c.parentCategory).map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Thương hiệu (Ngăn cách bằng dấu phẩy)</label>
                <Input name='brands' placeholder='Ví dụ: Apple, Samsung, Xiaomi' className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Thứ tự hiển thị</label>
                  <Input name='displayOrder' type='number' defaultValue='0' className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Kích hoạt ngay</label>
                  <select name='isActive' className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='true'>Hiển thị trên Menu</option>
                    <option value='false'>Ẩn tạm thời</option>
                  </select>
                </div>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowCreateCategoryModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy bỏ
                </Button>
                <Button type='submit' disabled={createCategoryPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {createCategoryPending ? 'Đang tạo...' : 'Xác nhận'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 7: CHỈNH SỬA DANH MỤC (EDIT CATEGORY MODAL)
          ========================================== */}
      {showEditCategoryModal && selectedCategory && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Sửa danh mục</h3>
              <button onClick={() => setShowEditCategoryModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleEditCategorySubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Tên Danh Mục</label>
                <Input name='name' defaultValue={selectedCategory.name} required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả ngành hàng</label>
                <Input name='description' defaultValue={selectedCategory.description || ''} className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Danh mục cha</label>
                <select name='parentCategory' defaultValue={selectedCategory.parentCategory || ''} className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                  <option value=''>Không có (Là Danh mục gốc)</option>
                  {categoriesData.filter(c => !c.parentCategory && c._id !== selectedCategory._id).map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Thương hiệu (Ngăn cách bằng dấu phẩy)</label>
                <Input name='brands' defaultValue={selectedCategory.brands ? selectedCategory.brands.join(', ') : ''} placeholder='Ví dụ: Apple, Samsung' className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Thứ tự hiển thị</label>
                  <Input name='displayOrder' type='number' defaultValue={selectedCategory.displayOrder || '0'} className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Kích hoạt ngay</label>
                  <select name='isActive' defaultValue={selectedCategory.isActive !== false ? 'true' : 'false'} className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='true'>Hiển thị trên Menu</option>
                    <option value='false'>Ẩn tạm thời</option>
                  </select>
                </div>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowEditCategoryModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy bỏ
                </Button>
                <Button type='submit' disabled={editCategoryPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {editCategoryPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 8: XÁC NHẬN XÓA DANH MỤC (DELETE CATEGORY MODAL)
          ========================================== */}
      {showDeleteCategoryModal && selectedCategory && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
              <ShieldAlert size={24} />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>Xóa Danh mục?</h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Bạn có chắc chắn muốn xóa danh mục <strong>{selectedCategory.name}</strong>? Thao tác này sẽ gỡ bỏ liên kết nhóm hàng của các sản phẩm đang nằm trong danh mục này.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowDeleteCategoryModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy bỏ
              </Button>
              <Button onClick={confirmDeleteCategory} className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Xóa ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 9: TẠO VOUCHER MỚI (CREATE VOUCHER MODAL)
          ========================================== */}
      {showCreateVoucherModal && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Phát hành mã voucher mới</h3>
              <button onClick={() => setShowCreateVoucherModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleCreateVoucherSubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Mã Voucher (In Hoa)</label>
                  <Input name='code' placeholder='VÍ DỤ: DDV500K' required className='py-5 rounded-xl border-slate-200 text-sm font-mono' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Loại ưu đãi</label>
                  <select 
                    name='discountType' 
                    value={voucherDiscountType}
                    onChange={(e) => setVoucherDiscountType(e.target.value)}
                    className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'
                  >
                    <option value='fixed'>Tiền mặt cố định (fixed)</option>
                    <option value='percentage'>Phần trăm hóa đơn (percentage)</option>
                    <option value='hssv_tiered'>Phân tầng Học sinh SV (hssv_tiered)</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả nội dung</label>
                <Input name='description' placeholder='Giảm ngay 500K cho toàn bộ iPhone 15 Series...' className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              {voucherDiscountType !== 'hssv_tiered' ? (
                <div className='grid grid-cols-2 gap-4 animate-in fade-in duration-200'>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-bold text-slate-500 uppercase'>Mức giảm {voucherDiscountType === 'percentage' ? '(%)' : '(VNĐ)'}</label>
                    <Input name='discountValue' type='number' placeholder={voucherDiscountType === 'percentage' ? '10' : '200000'} required className='py-5 rounded-xl border-slate-200 text-sm' />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-bold text-slate-500 uppercase'>Giảm tối đa (Phần trăm)</label>
                    <Input name='maxDiscount' type='number' placeholder='500000 (Để trống nếu ko giới hạn)' className='py-5 rounded-xl border-slate-200 text-sm' />
                  </div>
                </div>
              ) : (
                <div className='space-y-3 bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50 animate-in fade-in duration-200'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold text-purple-700 dark:text-purple-400'>Cấu hình tầng giảm HSSV</span>
                    <Button 
                      type='button' 
                      variant='ghost' 
                      size='sm' 
                      className='text-[10px] text-purple-600 font-bold hover:bg-purple-100 border-none cursor-pointer'
                      onClick={() => setHssvTiers(prev => [...prev, { minOrderValue: 0, discountAmount: 0 }])}
                    >
                      + Thêm tầng
                    </Button>
                  </div>
                  
                  {hssvTiers.map((t, idx) => (
                    <div key={idx} className='grid grid-cols-2 gap-3 items-center'>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Đơn tối thiểu (VNĐ)</span>
                        <Input 
                          name='tierMinOrderValue' 
                          type='number' 
                          defaultValue={t.minOrderValue}
                          required
                          className='py-2 h-8 rounded-lg border-slate-200 text-xs' 
                        />
                      </div>
                      <div className='space-y-1 relative'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Số tiền giảm (VNĐ)</span>
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
                            onClick={() => setHssvTiers(prev => prev.filter((_, i) => i !== idx))}
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

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Giá trị đơn tối thiểu (VNĐ)</label>
                  <Input name='minOrderAmount' type='number' defaultValue='0' className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Chỉ riêng HSSV áp dụng?</label>
                  <select name='isHSSVOnly' className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='false'>Tất cả khách hàng</option>
                    <option value='true'>Chỉ HSSV đã duyệt thẻ</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tổng lượt phát hành</label>
                  <Input name='usageLimit' type='number' defaultValue='100' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Lượt dùng / Khách hàng</label>
                  <Input name='maxUsagePerUser' type='number' defaultValue='1' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ngày bắt đầu</label>
                  <Input name='startDate' type='date' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ngày hết hạn</label>
                  <Input name='expiryDate' type='date' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowCreateVoucherModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy bỏ
                </Button>
                <Button type='submit' disabled={createVoucherPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {createVoucherPending ? 'Đang tạo...' : 'Kích hoạt'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 10: CHỈNH SỬA VOUCHER (EDIT VOUCHER MODAL)
          ========================================== */}
      {showEditVoucherModal && selectedVoucher && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Cấu hình lại Voucher: {selectedVoucher.code}</h3>
              <button onClick={() => setShowEditVoucherModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleEditVoucherSubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Loại ưu đãi (Không khuyến khích đổi)</label>
                <select 
                  name='discountType' 
                  value={voucherDiscountType}
                  onChange={(e) => setVoucherDiscountType(e.target.value)}
                  className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'
                >
                  <option value='fixed'>Tiền mặt cố định (fixed)</option>
                  <option value='percentage'>Phần trăm hóa đơn (percentage)</option>
                  <option value='hssv_tiered'>Phân tầng Học sinh SV (hssv_tiered)</option>
                </select>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả nội dung</label>
                <Input name='description' defaultValue={selectedVoucher.description || ''} required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              {voucherDiscountType !== 'hssv_tiered' ? (
                <div className='grid grid-cols-2 gap-4 animate-in fade-in duration-200'>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-bold text-slate-500 uppercase'>Mức giảm</label>
                    <Input name='discountValue' type='number' defaultValue={selectedVoucher.discountValue || '0'} required className='py-5 rounded-xl border-slate-200 text-sm' />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-bold text-slate-500 uppercase'>Giảm tối đa</label>
                    <Input name='maxDiscount' type='number' defaultValue={selectedVoucher.maxDiscount || ''} className='py-5 rounded-xl border-slate-200 text-sm' />
                  </div>
                </div>
              ) : (
                <div className='space-y-3 bg-purple-50/50 dark:bg-purple-950/20 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50 animate-in fade-in duration-200'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold text-purple-700 dark:text-purple-400'>Hiệu chỉnh tầng giảm HSSV</span>
                    <Button 
                      type='button' 
                      variant='ghost' 
                      size='sm' 
                      className='text-[10px] text-purple-600 font-bold hover:bg-purple-100 border-none cursor-pointer'
                      onClick={() => setHssvTiers(prev => [...prev, { minOrderValue: 0, discountAmount: 0 }])}
                    >
                      + Thêm tầng
                    </Button>
                  </div>
                  
                  {hssvTiers.map((t, idx) => (
                    <div key={idx} className='grid grid-cols-2 gap-3 items-center'>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Đơn tối thiểu (VNĐ)</span>
                        <Input 
                          name='tierMinOrderValue' 
                          type='number' 
                          defaultValue={t.minOrderValue}
                          required
                          className='py-2 h-8 rounded-lg border-slate-200 text-xs' 
                        />
                      </div>
                      <div className='space-y-1 relative'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Số tiền giảm (VNĐ)</span>
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
                            onClick={() => setHssvTiers(prev => prev.filter((_, i) => i !== idx))}
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

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Giá trị đơn tối thiểu (VNĐ)</label>
                  <Input name='minOrderAmount' type='number' defaultValue={selectedVoucher.minOrderAmount || '0'} className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Đối tượng</label>
                  <select name='isHSSVOnly' defaultValue={selectedVoucher.isHSSVOnly ? 'true' : 'false'} className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='false'>Tất cả khách hàng</option>
                    <option value='true'>Chỉ HSSV đã duyệt thẻ</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tổng lượt dùng</label>
                  <Input name='usageLimit' type='number' defaultValue={selectedVoucher.usageLimit || '100'} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Lượt dùng / User</label>
                  <Input name='maxUsagePerUser' type='number' defaultValue={selectedVoucher.maxUsagePerUser || '1'} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ngày bắt đầu</label>
                  <Input name='startDate' type='date' defaultValue={selectedVoucher.startDate ? selectedVoucher.startDate.split('T')[0] : ''} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ngày hết hạn</label>
                  <Input name='expiryDate' type='date' defaultValue={selectedVoucher.expiryDate ? selectedVoucher.expiryDate.split('T')[0] : ''} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Trạng thái Voucher</label>
                <select name='isActive' defaultValue={selectedVoucher.isActive !== false ? 'true' : 'false'} className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                  <option value='true'>Đang mở kích hoạt</option>
                  <option value='false'>Tạm dừng / Hết hạn sớm</option>
                </select>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowEditVoucherModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy
                </Button>
                <Button type='submit' disabled={editVoucherPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {editVoucherPending ? 'Đang lưu...' : 'Lưu lại'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 11: XÁC NHẬN XÓA VOUCHER (DELETE VOUCHER MODAL)
          ========================================== */}
      {showDeleteVoucherModal && selectedVoucher && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
              <ShieldAlert size={24} />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>Xóa vĩnh viễn Voucher?</h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Bạn có chắc chắn muốn xóa mã voucher <strong>{selectedVoucher.code}</strong>? Mã này sẽ biến mất khỏi bộ nhớ ưu đãi và các tài khoản khách hàng không thể dùng tiếp.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowDeleteVoucherModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy bỏ
              </Button>
              <Button onClick={confirmDeleteVoucher} className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Xóa bỏ
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 12: CHI TIẾT HÓA ĐƠN ĐƠN HÀNG (ORDER DETAILS DRAWER)
          ========================================== */}
      {showOrderDetailsModal && selectedOrder && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <div>
                <h3 className='font-black text-slate-900 dark:text-white text-base'>Chi tiết hóa đơn mua hàng</h3>
                <span className='text-[10px] font-mono text-slate-400 block mt-0.5'>{selectedOrder._id}</span>
              </div>
              <button onClick={() => setShowOrderDetailsModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <div className='p-6 space-y-6 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80'>
                <div className='space-y-1.5'>
                  <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>Người nhận hàng</span>
                  <p className='font-bold text-slate-900 dark:text-white text-sm'>{selectedOrder.shippingAddress?.fullName}</p>
                  <p className='text-xs flex items-center gap-1'><span className='text-slate-400'>SĐT:</span> <strong className='text-slate-800 dark:text-slate-200'>{selectedOrder.shippingAddress?.phone}</strong></p>
                  <p className='text-xs flex items-center gap-1'><span className='text-slate-400'>Thanh toán:</span> <strong className='text-slate-800 dark:text-slate-200'>{selectedOrder.paymentMethod}</strong></p>
                </div>
                
                <div className='space-y-1.5'>
                  <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>Địa chỉ giao hàng</span>
                  <p className='text-xs font-semibold text-slate-800 dark:text-slate-200 flex gap-1 items-start'>
                    <MapPin size={14} className='text-didongviet-red flex-shrink-0 mt-0.5' />
                    <span>
                      {selectedOrder.shippingAddress?.streetAddress}, {selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.province}
                    </span>
                  </p>
                  <p className='text-xs flex items-center gap-1 mt-1'>
                    <Clock size={12} className='text-slate-400' />
                    <span className='text-slate-400'>Thời gian mua:</span> 
                    <strong className='text-slate-800 dark:text-slate-200'>{formatDate(selectedOrder.createdAt)}</strong>
                  </p>
                </div>
              </div>

              <div className='space-y-3.5'>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider block'>Mặt hàng trong giỏ ({selectedOrder.orderItems?.length ?? 0})</span>
                <div className='space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4'>
                  {selectedOrder.orderItems?.map((item: any, idx: number) => (
                    <div key={idx} className='flex items-center justify-between gap-4'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className='h-12 w-12 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 overflow-hidden flex items-center justify-center p-1 flex-shrink-0'>
                          <img src={item.image || '/auth-image.webp'} alt={item.name} className='h-full w-full object-contain' />
                        </div>
                        <div className='truncate'>
                          <span className='font-bold text-slate-900 dark:text-white block truncate text-xs sm:text-sm'>{item.name}</span>
                          <span className='text-[10px] text-slate-400 block mt-0.5 font-mono'>Mã sản phẩm: {item.product}</span>
                        </div>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <span className='font-bold text-slate-900 dark:text-white block text-sm'>{formatVND(item.price)}</span>
                        <span className='text-xs text-slate-400 block mt-0.5'>Số lượng: <strong>{item.qty} máy</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4'>
                <div className='flex justify-between text-xs'>
                  <span className='text-slate-400'>Giá gốc sản phẩm:</span>
                  <span className='font-semibold'>{formatVND(selectedOrder.itemsPrice || 0)}</span>
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
                  <span className='font-semibold'>{formatVND(selectedOrder.shippingPrice || 0)}</span>
                </div>
                <div className='flex justify-between text-base font-black pt-2'>
                  <span className='text-slate-800 dark:text-white'>TỔNG HÓA ĐƠN THỰC THU:</span>
                  <span className='text-didongviet-red'>{formatVND(selectedOrder.totalPrice || 0)}</span>
                </div>
              </div>

              <div className='flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80'>
                <div className='flex items-center gap-2'>
                  <span className={`h-2.5 w-2.5 rounded-full ${selectedOrder.isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className='text-xs font-bold text-slate-500 uppercase'>
                    {selectedOrder.isPaid ? 'ĐÃ THANH TOÁN THÀNH CÔNG' : 'CHỜ THANH TOÁN (COD / CỔNG)'}
                  </span>
                </div>
                
                <span className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border uppercase
                  ${selectedOrder.orderStatus === 'Đã hoàn thành' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                    selectedOrder.orderStatus === 'Đang giao hàng' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    selectedOrder.orderStatus === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}
                `}>
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

                  {!selectedOrder.isDelivered && selectedOrder.orderStatus !== 'Đã hủy' && (
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
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>Xóa vĩnh viễn Đơn hàng?</h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Cảnh báo: Hành động này sẽ gỡ bỏ vĩnh viễn thông tin đơn hàng <strong>{selectedOrder._id}</strong> khỏi hệ thống kế toán.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowDeleteOrderModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy bỏ
              </Button>
              <Button onClick={confirmDeleteOrder} className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Xóa ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 14: TẠO BÀI VIẾT TIN TỨC MỚI (CREATE BLOG MODAL)
          ========================================== */}
      {showCreateBlogModal && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Viết bài tin tức công nghệ mới</h3>
              <button onClick={() => setShowCreateBlogModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleCreateBlogSubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tiêu đề bài viết</label>
                  <Input name='title' placeholder='Ví dụ: Đánh giá iPhone 16 Pro Max...' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Chuyên mục tin</label>
                  <select name='category' required className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='Công nghệ'>Công nghệ</option>
                    <option value='Đánh giá'>Đánh giá</option>
                    <option value='Khuyến mãi'>Khuyến mãi</option>
                    <option value='Tư vấn'>Tư vấn</option>
                    <option value='Tin mới'>Tin mới</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả ngắn (Summary - Tối đa 300 ký tự)</label>
                <Input name='summary' maxLength={300} placeholder='Mô tả tóm tắt nội dung bài viết hiển thị ở trang tin...' required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Ảnh đại diện bài viết (Featured Image URL)</label>
                <Input name='featuredImage' placeholder='Ví dụ: /uploads/blogs/iphone16.jpg hoặc url ngoài...' className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Nội dung bài viết (Định dạng HTML hoặc Text)</label>
                <textarea name='content' placeholder='Nhập nội dung đầy đủ của bài viết...' required rows={8} className='w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:border-didongviet-red outline-none' />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tags (Ngăn cách bằng dấu phẩy)</label>
                  <Input name='tags' placeholder='iphone16, apple, review' className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Trạng thái xuất bản</label>
                  <select name='status' className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='Lưu nháp'>Lưu nháp (Draft)</option>
                    <option value='Đã xuất bản'>Đã xuất bản (Publish)</option>
                  </select>
                </div>
              </div>

              <div className='bg-slate-50 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3'>
                <span className='text-xs font-bold text-slate-600 dark:text-slate-400 block'>Cấu hình SEO Meta nâng cao (Tùy chọn)</span>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <span className='text-[10px] font-semibold text-slate-400 block uppercase'>Meta Title</span>
                    <Input name='metaTitle' placeholder='Đánh giá chi tiết iPhone 16...' className='py-3 h-9 rounded-lg border-slate-200 text-xs' />
                  </div>
                  <div className='space-y-1'>
                    <span className='text-[10px] font-semibold text-slate-400 block uppercase'>Meta Description</span>
                    <Input name='metaDescription' placeholder='iPhone 16 Pro Max có thực sự đáng tiền...' className='py-3 h-9 rounded-lg border-slate-200 text-xs' />
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowCreateBlogModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy bỏ
                </Button>
                <Button type='submit' disabled={createBlogPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {createBlogPending ? 'Đang tạo...' : 'Lưu bài viết'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 15: CHỈNH SỬA BÀI VIẾT (EDIT BLOG MODAL)
          ========================================== */}
      {showEditBlogModal && selectedBlog && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Sửa bài viết: {selectedBlog.title}</h3>
              <button onClick={() => setShowEditBlogModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleEditBlogSubmit} className='p-6 space-y-4 overflow-y-auto flex-1'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tiêu đề bài viết</label>
                  <Input name='title' defaultValue={selectedBlog.title} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Chuyên mục tin</label>
                  <select name='category' defaultValue={selectedBlog.category} required className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='Công nghệ'>Công nghệ</option>
                    <option value='Đánh giá'>Đánh giá</option>
                    <option value='Khuyến mãi'>Khuyến mãi</option>
                    <option value='Tư vấn'>Tư vấn</option>
                    <option value='Tin mới'>Tin mới</option>
                  </select>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả ngắn (Summary - Tối đa 300 ký tự)</label>
                <Input name='summary' defaultValue={selectedBlog.summary} maxLength={300} required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Ảnh đại diện bài viết (Featured Image URL)</label>
                <Input name='featuredImage' defaultValue={selectedBlog.featuredImage} required className='py-5 rounded-xl border-slate-200 text-sm' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Nội dung bài viết (Định dạng HTML hoặc Text)</label>
                <textarea name='content' defaultValue={selectedBlog.content} required rows={8} className='w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm focus:border-didongviet-red outline-none' />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tags (Ngăn cách bằng dấu phẩy)</label>
                  <Input name='tags' defaultValue={selectedBlog.tags ? selectedBlog.tags.join(', ') : ''} placeholder='iphone16, review' className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Trạng thái xuất bản</label>
                  <select name='status' defaultValue={selectedBlog.status} className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='Lưu nháp'>Lưu nháp (Draft)</option>
                    <option value='Đã xuất bản'>Đã xuất bản (Publish)</option>
                  </select>
                </div>
              </div>

              <div className='bg-slate-50 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3'>
                <span className='text-xs font-bold text-slate-600 dark:text-slate-400 block'>Cấu hình SEO Meta nâng cao (Tùy chọn)</span>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <span className='text-[10px] font-semibold text-slate-400 block uppercase'>Meta Title</span>
                    <Input name='metaTitle' defaultValue={selectedBlog.metaTitle || ''} className='py-3 h-9 rounded-lg border-slate-200 text-xs' />
                  </div>
                  <div className='space-y-1'>
                    <span className='text-[10px] font-semibold text-slate-400 block uppercase'>Meta Description</span>
                    <Input name='metaDescription' defaultValue={selectedBlog.metaDescription || ''} className='py-3 h-9 rounded-lg border-slate-200 text-xs' />
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end'>
                <Button type='button' variant='outline' onClick={() => setShowEditBlogModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                  Hủy
                </Button>
                <Button type='submit' disabled={editBlogPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                  {editBlogPending ? 'Đang lưu...' : 'Lưu bài viết'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 16: XÁC NHẬN XÓA BÀI VIẾT (DELETE BLOG MODAL)
          ========================================== */}
      {showDeleteBlogModal && selectedBlog && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
              <ShieldAlert size={24} />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>Xóa bài viết?</h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Bạn có chắc chắn muốn xóa vĩnh viễn bài viết <strong>{selectedBlog.title}</strong>? Thao tác này sẽ gỡ bài viết khỏi cơ sở dữ liệu và không thể hoàn tác.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowDeleteBlogModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy bỏ
              </Button>
              <Button onClick={confirmDeleteBlog} className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Xóa ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 17: CHI TIẾT PHIẾU YÊU CẦU LIÊN HỆ & CSKH NOTES (CONTACT DETAILS MODAL)
          ========================================== */}
      {showContactDetailsModal && selectedContact && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <div>
                <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Phiếu yêu cầu khách hàng</h3>
                <span className='text-[10px] text-slate-400 block font-mono mt-0.5'>{selectedContact._id}</span>
              </div>
              <button onClick={() => setShowContactDetailsModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleUpdateContactStatusSubmit} className='p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-100 dark:border-slate-850'>
                <div className='space-y-1'>
                  <span className='text-[9px] font-bold text-slate-400 block uppercase'>Họ tên khách hàng</span>
                  <p className='font-bold text-slate-900 dark:text-white'>{selectedContact.fullName}</p>
                  <span className='text-[9px] font-bold text-slate-400 block uppercase pt-2'>Số điện thoại / Email</span>
                  <p className='text-xs font-semibold text-slate-800 dark:text-slate-200'>{selectedContact.phone} / {selectedContact.email}</p>
                </div>
                <div className='space-y-1'>
                  <span className='text-[9px] font-bold text-slate-400 block uppercase'>Chủ đề liên hệ</span>
                  <p className='text-xs font-bold text-didongviet-red uppercase'>{selectedContact.subject}</p>
                  <span className='text-[9px] font-bold text-slate-400 block uppercase pt-2'>Thời gian tiếp nhận</span>
                  <p className='text-xs font-semibold text-slate-800 dark:text-slate-200'>{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase block'>Nội dung tin nhắn khiếu nại/Tư vấn</label>
                <div className='bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-250 dark:border-slate-800/80 leading-relaxed text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium whitespace-pre-wrap'>
                  {selectedContact.message}
                </div>
              </div>

              <div className='space-y-3.5 bg-purple-50/20 dark:bg-purple-950/10 p-4 rounded-xl border border-purple-100 dark:border-purple-950/50'>
                <span className='text-xs font-bold text-purple-700 dark:text-purple-400 block'>Nghiệp vụ nội bộ CSKH</span>
                
                <div className='grid grid-cols-2 gap-4 items-center'>
                  <div className='space-y-1.5'>
                    <span className='text-[10px] font-bold text-slate-400 block uppercase'>Trạng thái xử lý</span>
                    <select name='status' defaultValue={selectedContact.status} className='w-full py-2 px-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs outline-none'>
                      <option value='Chưa xử lý'>Chưa xử lý (New)</option>
                      <option value='Đang xử lý'>Đang xử lý (Processing)</option>
                      <option value='Đã xử lý'>Đã xử lý (Resolved)</option>
                      <option value='Đã hủy'>Đã hủy (Cancelled)</option>
                    </select>
                  </div>
                  <div className='space-y-1.5'>
                    <span className='text-[10px] font-bold text-slate-400 block uppercase'>Người chịu trách nhiệm</span>
                    <p className='text-xs font-bold text-purple-600 pt-1'>
                      {selectedContact.processedBy?.name ? selectedContact.processedBy.name : 'Đang chờ nhận xử lý'}
                    </p>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <span className='text-[10px] font-bold text-slate-400 block uppercase'>Ghi chú tiến trình xử lý (Notes)</span>
                  <textarea name='notes' defaultValue={selectedContact.notes || ''} placeholder='Đã gọi điện lúc 10h tư vấn hỗ trợ đổi trả máy cho khách...' rows={3} className='w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-xs focus:border-didongviet-red outline-none' />
                </div>
              </div>

              <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 justify-between items-center'>
                <div className='flex gap-2'>
                  <Button 
                    type='button' 
                    onClick={() => handleCancelContact(selectedContact._id)} 
                    variant='outline'
                    className='border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl cursor-pointer text-xs font-semibold py-5'
                  >
                    Hủy phiếu
                  </Button>
                  <Button 
                    type='button' 
                    onClick={() => setShowDeleteContactModal(true)} 
                    variant='outline'
                    className='border-red-200 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer text-xs font-semibold py-5'
                  >
                    Xóa phiếu
                  </Button>
                </div>

                <div className='flex gap-2.5'>
                  <Button type='button' variant='outline' onClick={() => setShowContactDetailsModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-xs'>
                    Thoát
                  </Button>
                  <Button type='submit' disabled={updateContactStatusPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs shadow-md'>
                    {updateContactStatusPending ? 'Đang cập nhật...' : 'Cập nhật phiếu'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 18: XÁC NHẬN XÓA PHIẾU LIÊN HỆ (DELETE CONTACT CONFIRMATION MODAL)
          ========================================== */}
      {showDeleteContactModal && selectedContact && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200'>
            <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4 border border-red-200'>
              <ShieldAlert size={24} className='animate-pulse' />
            </div>
            <h3 className='font-extrabold text-slate-900 text-base mb-2 text-red-600'>Xóa phiếu liên hệ?</h3>
            <p className='text-xs text-slate-500 leading-relaxed mb-6'>
              Cảnh báo: Hành động này sẽ xóa vĩnh viễn phiếu yêu cầu của khách hàng <strong>{selectedContact.fullName}</strong> khỏi cơ sở dữ liệu. Thao tác không thể thu hồi.
            </p>
            <div className='flex gap-3 justify-end'>
              <Button variant='outline' onClick={() => setShowDeleteContactModal(false)} className='w-full rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold'>
                Hủy bỏ
              </Button>
              <Button onClick={confirmDeleteContact} className='w-full bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold shadow-md'>
                Xóa ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 19: THÊM MỚI SẢN PHẨM (CREATE PRODUCT MODAL)
          ========================================== */}
      {showCreateProductModal && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Khai báo sản phẩm mới</h3>
              <button onClick={() => setShowCreateProductModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleCreateProductSubmit} className='p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300' encType='multipart/form-data'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tên sản phẩm chính</label>
                  <Input name='name' placeholder='Ví dụ: iPhone 16 Pro Max' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ngành hàng / Danh mục</label>
                  <select name='category' required className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value=''>-- Chọn Danh Mục --</option>
                    {categoriesData.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Thương hiệu</label>
                  <Input name='brand' placeholder='Ví dụ: Apple, Samsung' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Hàng đã qua sử dụng?</label>
                  <select name='isUsed' className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='false'>Máy Mới Nguyên Seal (100%)</option>
                    <option value='true'>Máy Likenew / Cũ Giá Rẻ</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ưu đãi D.Member (%)</label>
                  <Input name='discountDMember' type='number' defaultValue='1' required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Trợ giá thu cũ đổi mới (VNĐ)</label>
                  <Input name='tradeInBonus' type='number' defaultValue='0' className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả video (Link YouTube)</label>
                  <Input name='video' placeholder='https://youtube.com/watch?v=...' className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả tóm tắt thông số kỹ thuật</label>
                <textarea name='description' placeholder='iPhone 16 Pro Max sở hữu vi xử lý A18 Pro mạnh mẽ, camera zoom quang học 5x...' rows={3} className='w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs focus:border-didongviet-red outline-none' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase block'>Ảnh sản phẩm chính (Chọn tối đa 6 ảnh)</label>
                <Input name='images' type='file' multiple accept='image/*' className='py-3 border-dashed rounded-xl cursor-pointer w-full text-xs' />
              </div>

              {/* DYNAMIC PRODUCT VARIANTS CONFIGURATION */}
              <div className='space-y-3.5 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1'>
                    <Layers3 size={14} className='text-didongviet-red' />
                    <span>Cấu hình các phiên bản biến thể ({productVariants.length})</span>
                  </span>
                  <Button 
                    type='button' 
                    variant='ghost' 
                    size='sm' 
                    className='text-[10px] text-didongviet-red font-bold hover:bg-red-50 border-none cursor-pointer'
                    onClick={() => setProductVariants(prev => [...prev, { color: '', ram: '', rom: '', price: '', salePrice: '', sku: '', inventory: [] }])}
                  >
                    + Thêm phiên bản
                  </Button>
                </div>

                {productVariants.map((v, idx) => (
                  <div key={idx} className='p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-3 relative animate-in fade-in duration-200'>
                    {productVariants.length > 1 && (
                      <button 
                        type='button' 
                        onClick={() => setProductVariants(prev => prev.filter((_, i) => i !== idx))}
                        className='absolute right-2 top-2 text-xs text-red-500 border-none bg-transparent cursor-pointer'
                      >
                        ✕
                      </button>
                    )}
                    
                    <div className='grid grid-cols-2 sm:grid-cols-6 gap-3'>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Màu sắc</span>
                        <Input name={`variant_${idx}_color`} defaultValue={v.color} required className='h-8 py-2 rounded-lg text-xs' placeholder='Sa Mạc' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Bộ nhớ RAM</span>
                        <Input name={`variant_${idx}_ram`} defaultValue={v.ram} required className='h-8 py-2 rounded-lg text-xs' placeholder='8GB' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Dung lượng ROM</span>
                        <Input name={`variant_${idx}_rom`} defaultValue={v.rom} required className='h-8 py-2 rounded-lg text-xs' placeholder='256GB' />
                      </div>
                      <div className='space-y-1 col-span-2 sm:col-span-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Mã SKU</span>
                        <Input name={`variant_${idx}_sku`} defaultValue={v.sku} required className='h-8 py-2 rounded-lg text-xs font-mono' placeholder='IP16PM-256' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Giá gốc (VNĐ)</span>
                        <Input name={`variant_${idx}_price`} type='number' defaultValue={v.price} required className='h-8 py-2 rounded-lg text-xs' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Giá khuyến mại (VNĐ)</span>
                        <Input name={`variant_${idx}_salePrice`} type='number' defaultValue={v.salePrice} className='h-8 py-2 rounded-lg text-xs' />
                      </div>
                    </div>

                    {/* ALLOCATE STOCKS FOR THIS VARIANT AT BRANCHES */}
                    <div className='pt-2.5 border-t border-dashed border-slate-100 dark:border-slate-800 space-y-2'>
                      <span className='text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider'>
                        <Store size={10} className='text-blue-500' />
                        <span>Phân bổ tồn kho theo chi nhánh Di Động Việt</span>
                      </span>
                      
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {branchesData.map(b => {
                          const existInv = v.inventory?.find((inv: any) => inv.branch === b._id);
                          return (
                            <div key={b._id} className='flex items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80'>
                              <span className='font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[150px]' title={b.name}>{b.name}</span>
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
                <Button type='button' variant='outline' onClick={() => setShowCreateProductModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-xs'>
                  Hủy
                </Button>
                <Button type='submit' disabled={createProductPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs shadow-md'>
                  {createProductPending ? 'Đang lưu kho...' : 'Đưa lên quầy bán'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 20: HIỆU CHỈNH SẢN PHẨM (EDIT PRODUCT MODAL)
          ========================================== */}
      {showEditProductModal && selectedProduct && (
        <div className='fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200'>
            <div className='p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between'>
              <h3 className='font-extrabold text-slate-900 dark:text-white text-base'>Sửa sản phẩm: {selectedProduct.name}</h3>
              <button onClick={() => setShowEditProductModal(false)} className='text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1'>✕</button>
            </div>
            
            <form onSubmit={handleEditProductSubmit} className='p-6 space-y-5 overflow-y-auto flex-1 text-sm text-slate-700 dark:text-slate-300' encType='multipart/form-data'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Tên sản phẩm chính</label>
                  <Input name='name' defaultValue={selectedProduct.name} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ngành hàng / Danh mục</label>
                  <select name='category' defaultValue={selectedProduct.category?._id || selectedProduct.category} required className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value=''>-- Chọn Danh Mục --</option>
                    {categoriesData.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Thương hiệu</label>
                  <Input name='brand' defaultValue={selectedProduct.brand} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Hàng đã qua sử dụng?</label>
                  <select name='isUsed' defaultValue={selectedProduct.isUsed ? 'true' : 'false'} className='w-full py-2.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-sm outline-none'>
                    <option value='false'>Máy Mới Nguyên Seal (100%)</option>
                    <option value='true'>Máy Likenew / Cũ Giá Rẻ</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Ưu đãi D.Member (%)</label>
                  <Input name='discountDMember' type='number' defaultValue={selectedProduct.discountDMember} required className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Trợ giá thu cũ đổi mới (VNĐ)</label>
                  <Input name='tradeInBonus' type='number' defaultValue={selectedProduct.tradeInBonus} className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả video (Link YouTube)</label>
                  <Input name='video' defaultValue={selectedProduct.video || ''} className='py-5 rounded-xl border-slate-200 text-sm' />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase'>Mô tả tóm tắt thông số kỹ thuật</label>
                <textarea name='description' defaultValue={selectedProduct.description || ''} rows={3} className='w-full p-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs focus:border-didongviet-red outline-none' />
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-slate-500 uppercase block'>Thay đổi ảnh sản phẩm chính (Chọn tối đa 6 ảnh - Sẽ ghi đè ảnh cũ)</label>
                <Input name='images' type='file' multiple accept='image/*' className='py-3 border-dashed rounded-xl cursor-pointer w-full text-xs' />
              </div>

              {/* DYNAMIC PRODUCT VARIANTS CONFIGURATION */}
              <div className='space-y-3.5 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1'>
                    <Layers3 size={14} className='text-didongviet-red' />
                    <span>Cấu hình các phiên bản biến thể ({productVariants.length})</span>
                  </span>
                  <Button 
                    type='button' 
                    variant='ghost' 
                    size='sm' 
                    className='text-[10px] text-didongviet-red font-bold hover:bg-red-50 border-none cursor-pointer'
                    onClick={() => setProductVariants(prev => [...prev, { color: '', ram: '', rom: '', price: '', salePrice: '', sku: '', inventory: [] }])}
                  >
                    + Thêm phiên bản
                  </Button>
                </div>

                {productVariants.map((v, idx) => (
                  <div key={idx} className='p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-3 relative animate-in fade-in duration-200'>
                    {productVariants.length > 1 && (
                      <button 
                        type='button' 
                        onClick={() => setProductVariants(prev => prev.filter((_, i) => i !== idx))}
                        className='absolute right-2 top-2 text-xs text-red-500 border-none bg-transparent cursor-pointer'
                      >
                        ✕
                      </button>
                    )}
                    
                    <div className='grid grid-cols-2 sm:grid-cols-6 gap-3'>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Màu sắc</span>
                        <Input name={`variant_${idx}_color`} defaultValue={v.color} required className='h-8 py-2 rounded-lg text-xs' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Bộ nhớ RAM</span>
                        <Input name={`variant_${idx}_ram`} defaultValue={v.ram} required className='h-8 py-2 rounded-lg text-xs' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Dung lượng ROM</span>
                        <Input name={`variant_${idx}_rom`} defaultValue={v.rom} required className='h-8 py-2 rounded-lg text-xs' />
                      </div>
                      <div className='space-y-1 col-span-2 sm:col-span-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Mã SKU</span>
                        <Input name={`variant_${idx}_sku`} defaultValue={v.sku} required className='h-8 py-2 rounded-lg text-xs font-mono' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Giá gốc (VNĐ)</span>
                        <Input name={`variant_${idx}_price`} type='number' defaultValue={v.price} required className='h-8 py-2 rounded-lg text-xs' />
                      </div>
                      <div className='space-y-1'>
                        <span className='text-[9px] font-bold text-slate-400 block uppercase'>Giá khuyến mại (VNĐ)</span>
                        <Input name={`variant_${idx}_salePrice`} type='number' defaultValue={v.salePrice} className='h-8 py-2 rounded-lg text-xs' />
                      </div>
                    </div>

                    {/* ALLOCATE STOCKS FOR THIS VARIANT AT BRANCHES */}
                    <div className='pt-2.5 border-t border-dashed border-slate-100 dark:border-slate-800 space-y-2'>
                      <span className='text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider'>
                        <Store size={10} className='text-blue-500' />
                        <span>Phân bổ tồn kho theo chi nhánh Di Động Việt</span>
                      </span>
                      
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        {branchesData.map(b => {
                          const existInv = v.inventory?.find((inv: any) => (inv.branch?._id || inv.branch) === b._id);
                          return (
                            <div key={b._id} className='flex items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80'>
                              <span className='font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[150px]' title={b.name}>{b.name}</span>
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
                <Button type='button' variant='outline' onClick={() => setShowEditProductModal(false)} className='rounded-xl border-slate-200 cursor-pointer py-5 px-4 font-semibold text-xs'>
                  Hủy
                </Button>
                <Button type='submit' disabled={editProductPending} className='bg-didongviet-red hover:bg-didongviet-dark-red text-white rounded-xl cursor-pointer border-none py-5 px-4 font-semibold text-xs shadow-md'>
                  {editProductPending ? 'Đang lưu...' : 'Lưu lại thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
        <span className='text-xs text-slate-400 mt-2 font-medium'>Đang chuẩn bị bảng điều khiển...</span>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}
