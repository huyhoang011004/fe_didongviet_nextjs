'use client';

import { DollarSign, ShoppingCart, Percent, Users, Filter, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

export function DashboardHeader() {
    return (
        <div className='space-y-6'>
            {/* 1. Bộ lọc */}
            <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
                <CardContent className='p-4 flex flex-wrap gap-4 items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-slate-700'>
                            <Filter size={16} /> Lọc dữ liệu:
                        </div>
                        <div className='flex items-center gap-2 bg-slate-100 p-1 rounded-lg'>
                            <MapPin size={14} className='text-slate-500 ml-2' />
                            <select className='bg-transparent border-none text-sm focus:ring-0 cursor-pointer font-medium py-1 px-2'>
                                <option>Toàn hệ thống</option>
                                <option>Di Động Việt - Quận 1</option>
                                <option>Di Động Việt - Đống Đa</option>
                            </select>
                        </div>
                        <div className='flex items-center gap-2 bg-slate-100 p-1 rounded-lg'>
                            <Calendar size={14} className='text-slate-500 ml-2' />
                            <select className='bg-transparent border-none text-sm focus:ring-0 cursor-pointer font-medium py-1 px-2'>
                                <option>Hôm nay</option>
                                <option>Hôm qua</option>
                                <option>7 ngày qua</option>
                                <option>Tháng này</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. Chỉ số cốt lõi */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Card className='border-l-4 border-l-emerald-500 shadow-sm'>
                    <CardContent className='p-4'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-xs font-bold text-slate-500 uppercase'>Doanh thu / Lợi nhuận gộp</p>
                                <h3 className='text-xl font-black text-slate-800 mt-1'>4.250.000.000 ₫</h3>
                                <p className='text-sm text-emerald-600 font-semibold mt-1'>+ 450.500.000 ₫ lãi</p>
                            </div>
                            <div className='p-2 bg-emerald-100 rounded-lg text-emerald-600'><DollarSign size={20} /></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='border-l-4 border-l-blue-500 shadow-sm'>
                    <CardContent className='p-4'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-xs font-bold text-slate-500 uppercase'>Số lượng đơn hàng</p>
                                <h3 className='text-xl font-black text-slate-800 mt-1'>324 Đơn</h3>
                                <p className='text-xs text-red-500 font-semibold mt-1'>Tỷ lệ hủy/đổi trả: 1.5%</p>
                            </div>
                            <div className='p-2 bg-blue-100 rounded-lg text-blue-600'><ShoppingCart size={20} /></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='border-l-4 border-l-purple-500 shadow-sm'>
                    <CardContent className='p-4'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-xs font-bold text-slate-500 uppercase'>Giá trị đơn trung bình (AOV)</p>
                                <h3 className='text-xl font-black text-slate-800 mt-1'>13.117.000 ₫</h3>
                                <p className='text-xs text-purple-600 font-semibold mt-1'>↑ 5% (Tốt - Đang upsell phụ kiện)</p>
                            </div>
                            <div className='p-2 bg-purple-100 rounded-lg text-purple-600'><Percent size={20} /></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='border-l-4 border-l-orange-500 shadow-sm'>
                    <CardContent className='p-4'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <p className='text-xs font-bold text-slate-500 uppercase'>Tỷ lệ chuyển đổi (In-store)</p>
                                <h3 className='text-xl font-black text-slate-800 mt-1'>68.5%</h3>
                                <p className='text-xs text-slate-500 font-semibold mt-1'>324 Đơn / 472 Lượt khách</p>
                            </div>
                            <div className='p-2 bg-orange-100 rounded-lg text-orange-600'><Users size={20} /></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}