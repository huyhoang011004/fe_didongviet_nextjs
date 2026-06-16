
import { User } from './auth';

export type HSSVStatus = 'Chưa xác thực' | 'Đang chờ' | 'Đã xác thực' | 'Bị từ chối';

export interface StudentProfile {
  _id: string;
  userId: string | User;
  studentCardImage?: string;
  studentIdCard?: string;
  schoolName?: string;
  isHSSVVerified: HSSVStatus;
  rejectedReason?: string;
  createdAt?: string;
  updatedAt?: string;
}