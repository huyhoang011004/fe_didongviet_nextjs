'use client';

import { DashboardHeader } from './_components/page/dashboard-header';
import { BusinessCharts } from './_components/page/business-charts';
import { InventoryAndOps } from './_components/page/inventory-ops';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Trophy, Medal } from 'lucide-react';

export default function RetailDashboard() {
  return (
    <div className='min-h-screen bg-slate-50/50 p-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-extrabold text-slate-800'>Trung Tâm Điều Hành Cấp Cao</h1>
        <p className='text-sm text-slate-500 mt-1'>Hệ thống quản trị bán lẻ và dòng tiền theo thời gian thực.</p>
      </div>

      {/* Khối 1 & 2 */}
      <DashboardHeader />

      {/* Khối 3 */}
      <BusinessCharts />

      {/* Khối 4 & 6 */}
      <InventoryAndOps />

      {/* Khối 5: Hiệu suất con người & Chi nhánh */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-sm font-bold flex items-center gap-2'>
              <Trophy size={16} className='text-yellow-500' /> Bảng xếp hạng Chi nhánh (Đạt KPI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'><span className='font-black text-slate-300 text-lg'>1</span><span className='text-sm font-bold'>Di Động Việt Quận 1</span></div>
                <span className='text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded'>125% KPI</span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'><span className='font-black text-slate-300 text-lg'>2</span><span className='text-sm font-bold'>Di Động Việt Đống Đa</span></div>
                <span className='text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded'>110% KPI</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-sm font-bold flex items-center gap-2'>
              <Medal size={16} className='text-blue-500' /> Top Sales Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between border-b border-slate-100 pb-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-full bg-slate-200'></div>
                  <div><p className='text-sm font-bold'>Nguyễn Văn A</p><p className='text-[10px] text-slate-500'>CN Quận 1</p></div>
                </div>
                <div className='text-right'><p className='text-sm font-bold text-slate-800'>1.2 Tỷ</p><p className='text-[10px] text-slate-500'>45 máy xuất</p></div>
              </div>
              {/* Lặp thêm nhân sự tại đây */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}