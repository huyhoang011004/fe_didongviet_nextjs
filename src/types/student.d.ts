import { User } from './auth';

export interface StudentProfile {
  _id: string;
  id?: string;
  userId: string | User;
  studentCardImage: string;
  studentIdCard: string;
  schoolName: string;
  isHSSVVerified: 'Chưa xác thực' | 'Đang chờ' | 'Đã xác thực' | 'Bị từ chối' | string;
  rejectedReason?: string;
  createdAt?: string;
  updatedAt?: string;
}
