export interface Address {
  _id?: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  id?: string; // Có thể BE hoặc FE tự map `_id` thành `id`
  name: string;
  email: string;
  password?: string;
  phone?: string;
  googleId?: string;
  address?: any;
  role: 'user' | 'admin' | 'staff' | string;
  membershipLevel?: 'Tiêu chuẩn' | 'Bạc' | 'Vàng' | 'Kim cương' | string;
  wishlist?: string[] | any[];
  orderHistory?: string[] | any[];
  isVerified?: boolean;
  otpCode?: string | null;
  otpExpires?: string | Date | null;
  isDeleted?: boolean;
  deletedAt?: string | Date | null;
  createdAt?: string;
  updatedAt?: string;
}
