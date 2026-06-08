'use client';

import { AlertTriangle, TrendingDown, Flame, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function InventoryAndOps() {
    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
            {/* Quản lý kho */}
            <div className='lg:col-span-2 space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Cảnh báo tồn kho */}
                    <Card className='border-red-200 bg-red-50/50 shadow-sm'>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-bold text-red-700 flex items-center gap-2'>
                                <AlertTriangle size={16} /> Sắp cháy hàng (Low Stock)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-3 text-sm'>
                                <li className='flex justify-between items-center border-b border-red-100 pb-2'>
                                    <span className='font-medium text-slate-800'>iPhone 15 Pro Max 256GB Titan Tự nhiên</span>
                                    <span className='text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded'>Còn 3 máy</span>
                                </li>
                                <li className='flex justify-between items-center'>
                                    <span className='font-medium text-slate-800'>Củ sạc nhanh Apple 20W</span>
                                    <span className='text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded'>Còn 12 cái</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Tồn lâu ngày */}
                    <Card className='border-orange-200 bg-orange-50/50 shadow-sm'>
                        <CardHeader className='pb-2'>
                            <CardTitle className='text-sm font-bold text-orange-700 flex items-center gap-2'>
                                <TrendingDown size={16} /> Tồn lâu ngày (hơn 60 ngày)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-3 text-sm'>
                                <li className='flex justify-between items-center border-b border-orange-100 pb-2'>
                                    <span className='font-medium text-slate-800'>Samsung Galaxy Z Fold 4 512GB (Cũ)</span>
                                    <span className='text-orange-600 font-bold'>80 ngày</span>
                                </li>
                                <li className='flex justify-between items-center'>
                                    <span className='font-medium text-slate-800'>Ốp lưng iPhone 13 Pro Max Nillkin</span>
                                    <span className='text-orange-600 font-bold'>120 ngày</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Top bán chạy */}
                <Card className='shadow-sm'>
                    <CardHeader>
                        <CardTitle className='text-sm font-bold flex items-center gap-2'>
                            <Flame size={16} className='text-orange-500' /> Top 5 Sản phẩm bán chạy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className='w-full text-sm text-left'>
                            <thead className='text-xs text-slate-500 bg-slate-50'>
                                <tr><th className='px-4 py-2 rounded-l-lg'>Sản phẩm</th><th className='px-4 py-2'>Đã bán</th><th className='px-4 py-2 rounded-r-lg'>Doanh thu</th></tr>
                            </thead>
                            <tbody>
                                <tr className='border-b border-slate-100'><td className='px-4 py-3 font-semibold'>iPhone 15 Pro Max 256GB</td><td className='px-4 py-3'>142</td><td className='px-4 py-3 font-bold text-emerald-600'>~4.2 Tỷ</td></tr>
                                <tr><td className='px-4 py-3 font-semibold'>Samsung Galaxy S24 Ultra</td><td className='px-4 py-3'>85</td><td className='px-4 py-3 font-bold text-emerald-600'>~2.5 Tỷ</td></tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* Vận hành Online & Dòng tiền */}
            <div className='space-y-6'>
                <Card className='shadow-sm'>
                    <CardHeader>
                        <CardTitle className='text-sm font-bold flex items-center gap-2'>
                            <Package size={16} /> Trạng thái đơn Online
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <div className='flex justify-between text-xs font-semibold mb-1'><span>Chờ xác nhận</span><span className='text-blue-600'>24 đơn</span></div>
                            <div className='w-full bg-slate-100 rounded-full h-2'><div className='bg-blue-500 h-2 rounded-full w-1/4'></div></div>
                        </div>
                        <div>
                            <div className='flex justify-between text-xs font-semibold mb-1'><span>Đang đóng gói</span><span className='text-orange-600'>45 đơn</span></div>
                            <div className='w-full bg-slate-100 rounded-full h-2'><div className='bg-orange-500 h-2 rounded-full w-1/2'></div></div>
                        </div>
                        <div>
                            <div className='flex justify-between text-xs font-semibold mb-1'><span>Đang giao (Đơn vị vận chuyển)</span><span className='text-purple-600'>112 đơn</span></div>
                            <div className='w-full bg-slate-100 rounded-full h-2'><div className='bg-purple-500 h-2 rounded-full w-3/4'></div></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Phương thức thanh toán (Dòng tiền) */}
                <Card className='shadow-sm bg-slate-800 text-white'>
                    <CardHeader>
                        <CardTitle className='text-sm font-bold text-slate-100'>Dòng tiền - Thanh toán</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className='space-y-3 text-sm'>
                            <li className='flex justify-between'><span className='text-slate-300'>Trả góp (Thẻ/Công ty TC)</span><span className='font-bold'>45%</span></li>
                            <li className='flex justify-between'><span className='text-slate-300'>Chuyển khoản (Vietcombank/MB)</span><span className='font-bold'>35%</span></li>
                            <li className='flex justify-between'><span className='text-slate-300'>Quẹt thẻ POS</span><span className='font-bold'>15%</span></li>
                            <li className='flex justify-between'><span className='text-slate-300'>Tiền mặt</span><span className='font-bold'>5%</span></li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}