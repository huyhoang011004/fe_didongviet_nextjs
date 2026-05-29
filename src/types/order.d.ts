import { Product } from './product';
import { User } from './auth';

export interface OrderItem {
  _id?: string;
  name: string;
  qty: number;
  userId?: any;
  items: Array<{
    productId: any;
  }>;
  image: string;
  price: number;
  product: string | Product;
  variantId?: string | Product;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
}

export interface PaymentResult {
  id?: string;
  status?: string;
  update_time?: string;
}

export interface Order {
  _id: string;
  id?: string;
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'VNPAY' | 'Trả góp 0%' | string;
  paymentResult?: PaymentResult;
  itemsPrice: number;
  discountDMember?: number | any;
  tradeInBonus?: number | any;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string | Date;
  isDelivered: boolean;
  deliveredAt?: string | Date;
  orderStatus: 'Đang xử lý' | 'Đã xác nhận' | 'Đang giao hàng' | 'Đã hoàn thành' | 'Đã hủy' | string;
  createdAt?: string;
  updatedAt?: string;
}
