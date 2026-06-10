'use client';

import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface StatsCardsProps {
    analyticsData: any;
    visibleMetrics: string[];
    toggleMetric: (metric: string) => void;
    formatVND: (num: number) => string;
    loading: boolean;
}

export default function StatsCards({ analyticsData, visibleMetrics, toggleMetric, formatVND, loading }: StatsCardsProps) {
    if (loading) {
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-pulse'>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className='h-32 bg-white dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-6 space-y-4'
                    >
                        <div className='h-4 bg-slate-200 rounded w-2/3'></div>
                        <div className='h-8 bg-slate-200 rounded w-1/2'></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            key: 'totalRevenue',
            title: 'Doanh thu',
            value: formatVND(analyticsData?.totalRevenue || 0),
            icon: DollarSign,
            iconColor: 'text-blue-600',
            ringColor: 'ring-blue-600',
            subText: 'Click để ẩn/hiện biểu đồ',
            subTextColor: 'text-blue-600',
        },
        {
            key: 'totalProfit',
            title: 'Lợi nhuận',
            value: formatVND(analyticsData?.totalProfit || 0),
            icon: TrendingUp,
            iconColor: 'text-emerald-500',
            ringColor: 'ring-emerald-500',
            subText: 'Lợi nhuận ước tính',
            subTextColor: 'text-emerald-600',
        },
        {
            key: 'totalOrders',
            title: 'Số đơn hàng',
            value: analyticsData?.totalOrders || 0,
            icon: ShoppingBag,
            iconColor: 'text-amber-500',
            ringColor: 'ring-amber-500',
            subText: 'Đơn hàng thành công',
            subTextColor: 'text-amber-600',
        },
        {
            key: 'totalProductsSold',
            title: 'Sản phẩm bán ra',
            value: analyticsData?.totalProductsSold || 0,
            icon: Package,
            iconColor: 'text-red-500',
            ringColor: 'ring-red-500',
            subText: 'Tổng số lượng sản phẩm',
            subTextColor: 'text-red-600',
        },
        {
            key: 'avgOrderValue',
            title: 'Giá trị trung bình',
            value: formatVND(
                analyticsData?.totalOrders > 0
                    ? analyticsData.totalRevenue / analyticsData.totalOrders
                    : 0
            ),
            icon: TrendingUp,
            iconColor: 'text-violet-500',
            ringColor: 'ring-violet-500',
            subText: 'Giá trị trung bình/đơn',
            subTextColor: 'text-violet-600',
        },
    ];

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6'>
            {cards.map((card) => (
                <Card
                    key={card.key}
                    className={`border-slate-200/50 shadow-sm rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-md ${visibleMetrics.includes(card.key) ? card.ringColor : 'opacity-70'}`}
                    onClick={() => toggleMetric(card.key)}
                >
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-xs font-bold text-slate-400 uppercase'>{card.title}</CardTitle>
                        <card.icon className={`${card.iconColor} h-4 w-4`} />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-black text-slate-800 dark:text-white'>
                            {card.value}
                        </div>
                        <p className={`text-[10px] ${card.subTextColor} mt-1 font-semibold flex items-center gap-1`}>
                            {card.key === 'totalRevenue' && <TrendingUp size={10} />}
                            <span>{card.subText}</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}