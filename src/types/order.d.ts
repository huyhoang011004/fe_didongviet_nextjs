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
  selectedColor?: string;
  selectedStorage?: string;
  sku?: string;
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
  orderStatus: 'Chờ xác nhận' | 'Chờ lấy hàng' | 'Đang giao' | 'Đã giao' | 'Đã hủy' | 'Trả hàng/Hoàn tiền' | string;
  createdAt?: string;
  updatedAt?: string;
}
