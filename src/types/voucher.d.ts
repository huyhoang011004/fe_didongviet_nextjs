export interface HSSVTier {
  _id?: string;
  minOrderValue: number;
  discountAmount: number;
}

export interface Voucher {
  _id: string;
  id?: string;
  code: string;
  description?: string;
  discountType: 'fixed' | 'percentage' | 'hssv_tiered' | string;
  discountValue?: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  isHSSVOnly?: boolean;
  hssvTiers?: HSSVTier[];
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount?: number;
  maxUsagePerUser?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
