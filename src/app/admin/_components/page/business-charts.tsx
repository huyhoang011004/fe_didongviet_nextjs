'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const revenueTrend = [
    { time: '08:00', rev: 50 }, { time: '10:00', rev: 200 }, { time: '12:00', rev: 350 },
    { time: '14:00', rev: 280 }, { time: '16:00', rev: 400 }, { time: '18:00', rev: 650 },
    { time: '20:00', rev: 800 }, { time: '22:00', rev: 150 },
];

const brandShare = [
    { name: 'Apple', value: 60 }, { name: 'Samsung', value: 25 },
    { name: 'Xiaomi', value: 10 }, { name: 'Oppo', value: 5 }
];

export function BusinessCharts() {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
            <Card className='lg:col-span-2 shadow-sm rounded-2xl'>
                <CardHeader>
                    <CardTitle className='text-sm font-bold'>Xu hướng doanh thu theo giờ (Triệu VNĐ)</CardTitle>
                </CardHeader>
                <CardContent className='h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(val: any) => [`${val} Triệu`, 'Doanh thu']} />
                            <Area type="monotone" dataKey="rev" stroke="#dc2626" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className='shadow-sm rounded-2xl'>
                <CardHeader>
                    <CardTitle className='text-sm font-bold'>Tỷ trọng doanh số theo Hãng (%)</CardTitle>
                </CardHeader>
                <CardContent className='h-[300px]'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={brandShare} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                            <Tooltip formatter={(val: any) => [`${val}%`, 'Thị phần']} />
                            <Bar dataKey="value" fill="#1e293b" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}