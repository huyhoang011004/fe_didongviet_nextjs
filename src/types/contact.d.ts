import { User } from './auth';

export interface Contact {
  _id: string;
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  subject: 'Tư vấn mua hàng' | 'Khiếu nại dịch vụ' | 'Hỗ trợ kỹ thuật' | 'Bảo hành sản phẩm' | 'Thu cũ đổi mới' | 'Khác' | string;
  message: string;
  status: 'Chưa xử lý' | 'Đang xử lý' | 'Đã xử lý' | 'Đã hủy' | string;
  notes?: string;
  processedBy?: any;
  createdAt?: string;
  updatedAt?: string;
}
