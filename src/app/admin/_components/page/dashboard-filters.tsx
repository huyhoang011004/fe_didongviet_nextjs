'use client';

import { Filter, Building2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

interface DashboardFiltersProps {
    period: string;
    setPeriod: (val: string) => void;
    branchId: string;
    setBranchId: (val: string) => void;
    branches: any[];
}

export function DashboardFilters({ period, setPeriod, branchId, setBranchId, branches }: DashboardFiltersProps) {
    const periodOptions = [
        { value: 'day', label: 'Hôm nay' },
        { value: 'week', label: 'Tuần này' },
        { value: 'month', label: 'Tháng này' },
        { value: 'year', label: 'Năm nay' },
    ];

    return (
        <Card className='border-slate-200/50 shadow-sm rounded-2xl'>
            <CardContent className='p-4'>
                <div className='flex flex-wrap items-center gap-4'>
                    <div className='flex items-center gap-2'>
                        <Filter size={16} className='text-slate-400' />
                        <span className='text-sm font-semibold text-slate-600'>Bộ lọc:</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-slate-400 font-semibold'>Thời gian:</span>
                        <div className='flex gap-2'>
                            {periodOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    onClick={() => setPeriod(option.value)}
                                    variant={period === option.value ? 'default' : 'outline'}
                                    size='sm'
                                    className={`text-xs font-semibold cursor-pointer ${period === option.value
                                            ? 'bg-didongviet-red hover:bg-red-700 text-white border-none'
                                            : 'hover:text-didongviet-red'
                                        }`}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className='flex items-center gap-2 ml-auto'>
                        <Building2 size={16} className='text-slate-400' />
                        <span className='text-xs text-slate-400 font-semibold'>Chi nhánh:</span>
                        <select
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            className='text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-didongviet-red cursor-pointer'
                        >
                            <option value=''>Tất cả hệ thống</option>
                            {branches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}