'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface DashboardChartsProps {
  analyticsData: any; // Dữ liệu thật từ API trả về array theo ngày
}

// Dữ liệu giả lập nếu API chưa trả về dạng timeseries
const mockRevenueData = [
  { name: 'T2', revenue: 120000000 }, { name: 'T3', revenue: 150000000 },
  { name: 'T4', revenue: 180000000 }, { name: 'T5', revenue: 140000000 },
  { name: 'T6', revenue: 210000000 }, { name: 'T7', revenue: 320000000 },
  { name: 'CN', revenue: 350000000 },
];

export function DashboardCharts({ analyticsData }: DashboardChartsProps) {
  const formatCompactVND = (tickItem: number) => {
    return `${(tickItem / 1000000).toFixed(0)}Tr`;
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='text-sm font-bold text-slate-800'>Biểu đồ doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.trend || mockRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={formatCompactVND} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any) => {
                    const numericValue = typeof value === 'number' ? value : Number(value) || 0;
                    return new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(numericValue);
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: '#dc2626' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
        <CardHeader>
          <CardTitle className='text-sm font-bold text-slate-800'>Cơ cấu ngành hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Điện thoại', sales: 450 }, { name: 'Phụ kiện', sales: 850 },
                { name: 'Tablet', sales: 120 }, { name: 'Macbook', sales: 80 }
              ]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                <Tooltip />
                <Bar dataKey="sales" fill="#1d4ed8" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}