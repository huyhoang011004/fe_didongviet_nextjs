import { User } from './auth';
import { Product } from './product';

export interface Blog {
  _id: string;
  id?: string;
  title: string;
  slug?: string;
  content: string;
  summary: string;
  author: string | User;
  category: 'Công nghệ' | 'Đánh giá' | 'Khuyến mãi' | 'Tư vấn' | 'Tin mới' | string;
  featuredImage: string;
  relatedProducts?: Array<string | Product>;
  status: 'Lưu nháp' | 'Đã xuất bản' | string;
  views?: number;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
