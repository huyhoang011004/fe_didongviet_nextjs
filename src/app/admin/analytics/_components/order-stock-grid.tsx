'use client';

import { Clock, TrendingUp, Package, AlertTriangle, Warehouse } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface OrderStockGridProps {
    orderStatus: any;
    lowStockProducts: any[];
    oldStockProducts: any[];
    branchRanking: any[];
    loading: boolean;
}

const orderStatusList = [
    { key: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { key: 'Chờ lấy hàng', label: 'Đang đóng gói', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { key: 'Đang giao', label: 'Đang giao (Đơn vị vận chuyển)', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function OrderStockGrid({
    orderStatus,
    lowStockProducts,
    oldStockProducts,
    branchRanking,
    loading,
}: OrderStockGridProps) {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Trạng thái đơn Online */}
            <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                <CardHeader>
                    <CardTitle className='text-sm font-bold text-slate-800 dark:text-white'>
                        Trạng thái đơn Online
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    {loading ? (
                        <div className='space-y-3 animate-pulse'>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className='h-16 bg-slate-100 rounded-xl'></div>
                            ))}
                        </div>
                    ) : (
                        orderStatusList.map((item) => {
                            const count = orderStatus?.[item.key] || 0;
                            return (
                                <div
                                    key={item.key}
                                    className={`flex items-center justify-between p-3 rounded-xl ${item.bg} border border-slate-100`}
                                >
                                    <div className='flex items-center gap-3'>
                                        <item.icon size={20} className={item.color} />
                                        <span className='text-xs font-semibold text-slate-600'>{item.label}</span>
                                    </div>
                                    <span className='text-lg font-black text-slate-800'>{count}</span>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            {/* Low Stock + Old Stock */}
            <div className='space-y-6'>
                {/* Sắp cháy hàng */}
                <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2'>
                            <AlertTriangle size={16} className='text-red-500' />
                            Sắp cháy hàng (Low Stock)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        {loading ? (
                            <div className='h-16 bg-slate-100 rounded-xl animate-pulse'></div>
                        ) : lowStockProducts.length === 0 ? (
                            <p className='text-xs text-slate-400 text-center py-4'>Không có sản phẩm nào sắp hết hàng</p>
                        ) : (
                            lowStockProducts.slice(0, 3).map((item: any, i: number) => (
                                <div key={i} className='flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-100'>
                                    <span className='text-xs font-semibold text-slate-700 truncate max-w-[180px]'>
                                        {item.productName}
                                    </span>
                                    <span className='text-xs font-bold text-red-600 whitespace-nowrap'>
                                        Còn {item.stock} {item.stock === 1 ? 'cái' : 'cái'}
                                    </span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Tồn lâu ngày */}
                <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2'>
                            <Warehouse size={16} className='text-orange-500' />
                            Tồn lâu ngày (hơn 60 ngày)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        {loading ? (
                            <div className='h-16 bg-slate-100 rounded-xl animate-pulse'></div>
                        ) : oldStockProducts.length === 0 ? (
                            <p className='text-xs text-slate-400 text-center py-4'>Không có sản phẩm tồn lâu ngày</p>
                        ) : (
                            oldStockProducts.slice(0, 3).map((item: any, i: number) => (
                                <div key={i} className='flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-orange-100'>
                                    <span className='text-xs font-semibold text-slate-700 truncate max-w-[180px]'>
                                        {item.productName}
                                    </span>
                                    <span className='text-xs font-bold text-orange-600 whitespace-nowrap'>
                                        {item.daysInStock} ngày
                                    </span>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bảng xếp hạng Chi nhánh */}
            <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                <CardHeader>
                    <CardTitle className='text-sm font-bold text-slate-800 dark:text-white'>
                        Bảng xếp hạng Chi nhánh (Đạt KPI)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className='space-y-3 animate-pulse'>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className='h-10 bg-slate-100 rounded-lg'></div>
                            ))}
                        </div>
                    ) : branchRanking.length === 0 ? (
                        <p className='text-xs text-slate-400 text-center py-4'>Chưa có dữ liệu xếp hạng</p>
                    ) : (
                        <div className='space-y-2'>
                            {branchRanking.slice(0, 5).map((branch: any, i: number) => (
                                <div
                                    key={branch._id || i}
                                    className='flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100'
                                >
                                    <div className='flex items-center gap-2'>
                                        <span
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'
                                                }`}
                                        >
                                            {i + 1}
                                        </span>
                                        <span className='text-xs font-semibold text-slate-700'>{branch.branchName}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='h-2 w-16 bg-slate-200 rounded-full overflow-hidden'>
                                            <div
                                                className='h-full bg-didongviet-red rounded-full'
                                                style={{ width: `${Math.min(100, branch.kpiPercent)}%` }}
                                            />
                                        </div>
                                        <span className='text-[10px] font-bold text-slate-600'>{branch.kpiPercent}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}