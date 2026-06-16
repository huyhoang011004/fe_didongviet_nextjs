'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Zap,
  Users,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  MapPin,
  Flame,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend } from 'recharts';
import { User } from '@/types/auth';

// --- ĐỊNH NGHĨA INTERFACES CHO DỮ LIỆU ĐỘNG ---
interface KpiStats {
  newOrdersToday: number;
  orderGrowthRate: number;
  realtimeRevenue: number;
  targetProgress: number;
  cancellationRate: number;
  cancellationGrowthRate: number;
  voucherScans: number;
  topVoucherCode: string;
}

interface ChartItem {
  name: string;
  value: number;
  color: string;
}

interface RealtimeLog {
  id: string | number;
  type: 'order' | 'alert_stock' | 'alert_voucher';
  time: string;
  text: string;
  value: string;
}

interface TopProductRevenue {
  rank: number;
  name: string;
  category: string;
  revenue: number;
  images: string[];
}

interface BranchSpeedLeaderboard {
  rank: number;
  name: string;
  time: string;
  status: string;
}

interface DashboardData {
  kpis: KpiStats;
  channels: ChartItem[];
  stockStatus: ChartItem[];
  logs: RealtimeLog[];
  topSales: TopProductRevenue[];
  topBranches: BranchSpeedLeaderboard[];
}

function AdminContent() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // State quản lý dữ liệu thực tế từ API và trạng thái Loading
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Kiểm tra quyền truy cập hệ thống
  useEffect(() => {
    async function checkRole() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data?.user) {
            setCurrentUser(resData.data.user);
          }
        }
      } catch (err) {
        console.error('Lỗi xác thực người dùng:', err);
      }
    }
    checkRole();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role === 'staff') {
      router.replace('/admin?tab=overview');
    }
  }, [currentUser, router]);

  // 2. Fetch dữ liệu tổng quan từ API (Polling mỗi 10 giây để tạo cảm giác Real-time)
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/dashboard-overview');
        if (!res.ok) throw new Error('Không thể kết nối đến máy chủ dữ liệu.');
        const result = await res.json();

        if (result.success) {
          setData(result.data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Lỗi tải dữ liệu Dashboard:', err);
        setError(err.message || 'Có lỗi xảy ra khi đồng bộ hệ thống.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
    // Cơ chế Polling tự động làm tươi dữ liệu
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Trạng thái Loading ban đầu khi chưa lấy được cấu trúc Data
  if (loading && !data) {
    return (
      <div className='flex flex-col items-center justify-center p-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 shadow-xs h-[500px]'>
        <Loader2 className='h-10 w-10 animate-spin text-didongviet-red' />
        <span className='text-sm text-slate-400 mt-4 font-medium'>Đang nạp luồng dữ liệu vận hành thời gian thực...</span>
      </div>
    );
  }

  // Kháng lỗi kết nối API
  if (error || !data) {
    return (
      <div className='p-6 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800'>
        <AlertCircle className='text-red-600 shrink-0' />
        <div>
          <h3 className='font-bold text-sm'>Lỗi đồng bộ trung tâm vận hành</h3>
          <p className='text-xs mt-0.5'>{error || 'Dữ liệu không phản hồi. Vui lòng kiểm tra lại Node.js API Service.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 relative pb-10'>
      {/* 1. TIÊU ĐỀ CHÍNH */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/50 pb-5'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight dark:text-white flex items-center gap-2'>
            Bảng Điều Phối Vận Hành <span className='text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-didongviet-red animate-pulse'>Live API</span>
          </h1>
          <p className='text-sm text-slate-400 mt-1'>
            Trung tâm giám sát tốc độ xử lý, cảnh báo kho bãi và dòng chảy Omnichannel thời gian thực.
          </p>
        </div>
      </div>

      {/* 2. HỆ THỐNG THẺ CHỈ SỐ CỐT LÕI (DỮ LIỆU ĐỘNG) */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Đơn hàng mới */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Đơn Hàng Mới (Hôm Nay)</CardTitle>
            <div className='p-2 bg-rose-50 text-didongviet-red rounded-xl'><ShoppingBag size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-black text-slate-800 dark:text-white'>{data.kpis.newOrdersToday} đơn</div>
            <p className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${data.kpis.orderGrowthRate >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {data.kpis.orderGrowthRate >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {data.kpis.orderGrowthRate >= 0 ? `+${data.kpis.orderGrowthRate}%` : `${data.kpis.orderGrowthRate}%`}
              <span className='text-slate-400 font-normal'>so với hôm qua</span>
            </p>
          </CardContent>
        </Card>

        {/* Doanh thu Real-time */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Doanh Thu Real-time</CardTitle>
            <div className='p-2 bg-blue-50 text-blue-500 rounded-xl'><TrendingUp size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-black text-slate-800 dark:text-white'>{formatVND(data.kpis.realtimeRevenue)}</div>
            <p className='text-xs text-slate-400 mt-1.5'>Tiến độ mục tiêu ngày đạt <span className='font-bold text-slate-700 dark:text-slate-200'>{data.kpis.targetProgress}%</span></p>
          </CardContent>
        </Card>

        {/* Tỷ lệ hủy đơn */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Tỷ Lệ Hủy Đơn</CardTitle>
            <div className='p-2 bg-amber-50 text-amber-500 rounded-xl'><AlertTriangle size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-black ${data.kpis.cancellationRate > 5 ? 'text-red-600' : 'text-amber-600'}`}>{data.kpis.cancellationRate}%</div>
            <p className='text-xs text-slate-400 mt-1.5 flex items-center gap-1'>
              Ngưỡng kiểm soát an toàn toàn hệ thống (&lt;5%)
            </p>
          </CardContent>
        </Card>

        {/* Hiệu suất Marketing */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Hiệu Suất Voucher</CardTitle>
            <div className='p-2 bg-purple-50 text-purple-500 rounded-xl'><Users size={16} /></div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-black text-slate-800 dark:text-white'>{data.kpis.voucherScans.toLocaleString()} lượt</div>
            <p className='text-xs text-slate-400 mt-1.5'>Mã hot nhất: <span className='font-bold text-purple-600'>{data.kpis.topVoucherCode}</span></p>
          </CardContent>
        </Card>
      </div>

      {/* 3. KHU VỰC BIỂU ĐỒ PHÂN PHỐI & KÊNH BÁN HÀNG */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Tỷ lệ đơn hàng theo Kênh Omnichannel */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-slate-800 dark:text-white'>Tỷ Lệ Đơn Hàng Theo Kênh</CardTitle>
            <CardDescription className='text-xs'>Phân phối sản lượng đơn hàng trên toàn bộ điểm chạm độc lập</CardDescription>
          </CardHeader>
          <CardContent className='h-[260px] flex items-center justify-center'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={data.channels} cx='50%' cy='50%' innerRadius={60} outerRadius={85} paddingAngle={3} dataKey='value'>
                  {data.channels.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <ChartTooltip formatter={(value) => `${value}%`} />
                <Legend layout='vertical' align='right' verticalAlign='middle' iconType='circle' wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ trạng thái kho nhanh */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-slate-800 dark:text-white'>Trạng Thái Kho Tổng</CardTitle>
            <CardDescription className='text-xs'>Giám sát tỷ lệ SKU sẵn sàng đáp ứng vận chuyển và hàng lỗi hoàn trả</CardDescription>
          </CardHeader>
          <CardContent className='h-[260px] flex items-center justify-center'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={data.stockStatus} cx='50%' cy='50%' outerRadius={85} paddingAngle={2} dataKey='value'>
                  {data.stockStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <ChartTooltip formatter={(value) => `${value}%`} />
                <Legend layout='vertical' align='right' verticalAlign='middle' iconType='rect' wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. HOẠT ĐỘNG THỜI GIAN THỰC & CẢNH BÁO VẬN HÀNH */}
      <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-base font-bold text-slate-800 dark:text-white flex items-center gap-2'>
              <Flame size={16} className='text-didongviet-red animate-bounce' /> Dòng Chảy Vận Hành Real-time Feed
            </CardTitle>
            <CardDescription className='text-xs'>Bao gồm các giao dịch giá trị cao đột biến và các xung đột hệ thống cần xử lý gấp</CardDescription>
          </div>
          <span className='h-2 w-2 rounded-full bg-emerald-500 animate-ping' />
        </CardHeader>
        <CardContent>
          <div className='space-y-3.5'>
            {data.logs.map((log) => (
              <div key={log.id} className='flex items-start justify-between p-3 rounded-xl border border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/10 text-xs gap-4 hover:border-slate-200 dark:hover:border-slate-700 transition-all'>
                <div className='flex items-start gap-3'>
                  <div className={`mt-0.5 p-1.5 rounded-lg ${log.type === 'order' ? 'bg-emerald-50 text-emerald-600' : log.type === 'alert_stock' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                    {log.type === 'order' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  </div>
                  <div>
                    <p className='font-medium text-slate-700 dark:text-slate-300'>{log.text}</p>
                    <span className='text-[10px] text-slate-400 mt-1 block flex items-center gap-1'><Clock size={10} /> {log.time}</span>
                  </div>
                </div>
                <span className={`font-mono font-bold shrink-0 text-right ${log.type === 'order' ? 'text-slate-800 dark:text-white' : 'text-red-500'}`}>{log.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. BẢNG XẾP HẠNG ĐUA TOP TỐC ĐỘ (LEADERBOARDS) */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Top Sales */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-slate-800 dark:text-white flex items-center gap-2'>
              <Award size={18} className='text-amber-500' /> Top Sản Phẩm Có Doanh Thu Cao Nhất Tháng
            </CardTitle>
            <CardDescription className='text-xs'>Xếp hạng các mặt hàng chủ lực đóng góp tỷ trọng doanh thu lớn nhất trong kỳ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data.topSales.map((product) => (
                <div key={product.rank} className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 last:border-none last:pb-0'>
                  <div className='flex items-center gap-3'>
                    <div className={`h-6 w-6 font-black text-xs flex items-center justify-center rounded-full ${product.rank === 1 ? 'bg-amber-100 text-amber-700' : product.rank === 2 ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'}`}>
                      {product.rank}
                    </div>
                    <div className='h-12 w-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200'>
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className='rounded-lg object-cover'
                          style={{ width: 48, height: 48 }}
                          unoptimized
                        />
                      ) : (
                        <Package size={14} className="text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className='font-bold text-xs text-slate-800 dark:text-white'>{product.name}</h4>
                      <p className='text-[10px] text-slate-400'>{product.category}</p>
                    </div>
                  </div>
                  <span className='text-xs font-black text-slate-800 dark:text-slate-200'>{formatVND(product.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Chi nhánh siêu tốc */}
        <Card className='border-slate-200/50 shadow-xs rounded-2xl'>
          <CardHeader>
            <CardTitle className='text-base font-bold text-slate-800 dark:text-white flex items-center gap-2'>
              <Zap size={16} className='text-didongviet-red' /> Chi Nhánh Xử Lý Đơn Siêu Tốc
            </CardTitle>
            <CardDescription className='text-xs'>Đo lường thời gian trung bình từ lúc khách đặt đến khi giao shipper</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data.topBranches.map((branch) => (
                <div key={branch.rank} className='flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 last:border-none last:pb-0'>
                  <div className='flex items-center gap-3'>
                    <div className='h-5 w-5 font-bold text-xs flex items-center justify-center bg-slate-50 rounded-md text-slate-400'>{branch.rank}</div>
                    <div className='p-1.5 bg-red-50 text-didongviet-red rounded-lg'><MapPin size={14} /></div>
                    <div>
                      <h4 className='font-bold text-xs text-slate-800 dark:text-white'>{branch.name}</h4>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='text-xs font-mono font-black text-emerald-600 block'>{branch.time}</span>
                    <span className='text-[9px] bg-emerald-50 text-emerald-600 px-1 py-0.2 rounded font-bold uppercase tracking-wide'>{branch.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className='flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200/50 shadow-xs'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-didongviet-red border-t-transparent' />
        <span className='text-xs text-slate-400 mt-2 font-medium'>Đang cấu trúc lại trung tâm vận hành...</span>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}