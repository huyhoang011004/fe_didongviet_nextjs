'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

import { QuickRange } from '../useAnalytics';

export interface DateRangePickerProps {
    period: string;
    setPeriod: (period: string) => void;
    dateType: 'preset' | 'custom';
    setDateType: (type: 'preset' | 'custom') => void;
    quickRange: QuickRange;
    setQuickRange: (range: QuickRange) => void;
    customDate: string;
    setCustomDate: (date: string) => void;
    customMonth: number;
    setCustomMonth: (month: number) => void;
    customYear: number;
    setCustomYear: (year: number) => void;
}

// Format date: DD-MM-YYYY
const formatDate = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

export default function DateRangePicker({
    period,
    setPeriod,
    dateType,
    setDateType,
    quickRange,
    setQuickRange,
    customDate,
    setCustomDate,
    customMonth,
    setCustomMonth,
    customYear,
    setCustomYear,
}: DateRangePickerProps) {
    const [open, setOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<string>('today');
    const containerRef = useRef<HTMLDivElement>(null);

    // Đóng khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Xử lý chọn Quick Range
    const handleQuickRange = (range: string) => {
        setSelectedMenu(range);
        setDateType('preset');
        setQuickRange(range as QuickRange);
        switch (range) {
            case 'today':
                setPeriod('day');
                break;
            case 'yesterday':
                setPeriod('day');
                break;
            case 'last7':
                setPeriod('week');
                break;
            case 'last30':
                setPeriod('month');
                break;
        }
    };

    // Xử lý chọn Granularity
    const handleGranularity = (gran: string) => {
        setSelectedMenu(gran);
        setDateType('custom');
        setQuickRange('custom');
        setPeriod('custom');
        switch (gran) {
            case 'day':
                // Nếu chưa có customDate, set mặc định hôm nay
                if (!customDate) {
                    const today = new Date().toISOString().split('T')[0];
                    setCustomDate(today);
                }
                break;
            case 'week':
                break;
            case 'month':
                break;
            case 'year':
                break;
        }
    };

    // Lấy label hiển thị ở header
    const getHeaderLabel = (): string => {
        if (dateType === 'custom') {
            if (customDate) return `Theo ngày  ${formatDate(new Date(customDate))}`;
            if (customMonth && customYear) return `Theo tháng  Tháng ${customMonth}/${customYear}`;
            return `Theo năm  ${customYear}`;
        }
        switch (period) {
            case 'day':
                if (quickRange === 'yesterday') {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return 'Theo ngày ' + formatDate(yesterday);
                }
                return 'Theo ngày ' + formatDate(new Date());
            case 'week': return 'Theo tuần';
            case 'month': return 'Theo tháng';
            case 'year': return 'Theo năm';
            default: return 'Theo ngày';
        }
    };

    // Quick range items
    const quickRanges = [
        { id: 'today', label: 'Hôm nay' },
        { id: 'yesterday', label: 'Hôm qua' },
        { id: 'last7', label: 'Trong 7 ngày qua' },
        { id: 'last30', label: 'Trong 30 ngày qua' },
    ];

    // Granularity items
    const granularities = [
        { id: 'day', label: 'Theo ngày' },
        { id: 'week', label: 'Theo tuần' },
        { id: 'month', label: 'Theo tháng' },
        { id: 'year', label: 'Theo năm' },
    ];

    return (
        <div className='relative' ref={containerRef}>
            {/* Trigger Button */}
            <Button
                onClick={() => setOpen(!open)}
                variant='outline'
                size='sm'
                className='flex items-center gap-2 text-xs font-semibold border-slate-200 hover:border-didongviet-red/30 hover:text-didongviet-red px-3 py-2'
            >
                <Calendar size={16} className='text-slate-400' />
                <span className='text-slate-700'>{getHeaderLabel()}</span>
            </Button>

            {/* Dropdown */}
            {open && (
                <div className='absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl min-w-[520px] overflow-hidden'>
                    {/* Header */}
                    <div className='flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50'>
                        <div className='flex items-center gap-2'>
                            <span className='text-xs font-bold text-slate-700'>Khung Thời Gian</span>
                        </div>
                        <div className='flex items-center gap-2 text-xs text-slate-500'>
                            <span>{getHeaderLabel()}</span>
                            <span className='text-[10px] text-slate-400'>(GMT+07)</span>
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='p-1 h-auto'
                            onClick={() => {
                                // Mở date picker native
                                const input = document.createElement('input');
                                input.type = 'date';
                                input.onchange = (e: any) => {
                                    setCustomDate(e.target.value);
                                    setDateType('custom');
                                    setPeriod('custom');
                                    setSelectedMenu('day');
                                };
                                input.click();
                            }}
                        >
                            <Calendar size={16} className='text-slate-400 hover:text-didongviet-red' />
                        </Button>
                    </div>

                    {/* Body: 2 cột */}
                    <div className='flex'>
                        {/* Cột trái - Menu */}
                        <div className='w-[180px] border-r border-slate-100 p-2 space-y-1'>
                            {/* Quick Ranges */}
                            <div className='text-[10px] font-bold text-slate-400 uppercase px-2 py-1'>Mốc thời gian</div>
                            {quickRanges.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleQuickRange(item.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedMenu === item.id && dateType === 'preset'
                                        ? 'bg-red-50 text-didongviet-red'
                                        : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            <div className='border-t border-slate-100 my-1' />

                            {/* Granularity */}
                            <div className='text-[10px] font-bold text-slate-400 uppercase px-2 py-1'>Theo chu kỳ</div>
                            {granularities.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleGranularity(item.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedMenu === item.id && dateType === 'custom'
                                        ? 'bg-red-50 text-didongviet-red'
                                        : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    <ChevronRight size={14} className='text-slate-300' />
                                </button>
                            ))}
                        </div>

                        {/* Cột phải - Detail Panel */}
                        <div className='flex-1 p-4'>
                            {dateType === 'custom' && selectedMenu === 'day' && (
                                <div className='space-y-3'>
                                    <div className='text-lg font-bold text-didongviet-red'>
                                        {customDate ? formatDate(new Date(customDate)) : 'Chọn ngày'}
                                    </div>
                                    <input
                                        type='date'
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className='w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-didongviet-red'
                                    />
                                </div>
                            )}
                            {dateType === 'custom' && selectedMenu === 'month' && (
                                <div className='space-y-3'>
                                    <div className='text-lg font-bold text-didongviet-red'>
                                        Tháng {customMonth}/{customYear}
                                    </div>
                                    <div className='flex gap-2'>
                                        <select
                                            value={customMonth}
                                            onChange={(e) => setCustomMonth(parseInt(e.target.value))}
                                            className='flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-didongviet-red'
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                                <option key={m} value={m}>Tháng {m}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={customYear}
                                            onChange={(e) => setCustomYear(parseInt(e.target.value))}
                                            className='flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-didongviet-red'
                                        >
                                            {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                                                <option key={y} value={y}>Năm {y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                            {dateType === 'custom' && selectedMenu === 'year' && (
                                <div className='space-y-3'>
                                    <div className='text-lg font-bold text-didongviet-red'>Năm {customYear}</div>
                                    <select
                                        value={customYear}
                                        onChange={(e) => setCustomYear(parseInt(e.target.value))}
                                        className='w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-didongviet-red'
                                    >
                                        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                                            <option key={y} value={y}>Năm {y}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {dateType === 'custom' && selectedMenu === 'week' && (
                                <div className='space-y-3'>
                                    <div className='text-lg font-bold text-didongviet-red'>Chọn tuần</div>
                                    <input
                                        type='date'
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className='w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-didongviet-red'
                                    />
                                    <p className='text-[10px] text-slate-400'>
                                        Chọn ngày bắt đầu tuần (Thứ 2)
                                    </p>
                                </div>
                            )}
                            {dateType === 'preset' && selectedMenu === 'yesterday' && (
                                <div className='space-y-2'>
                                    <div className='text-lg font-bold text-didongviet-red'>
                                        {(() => {
                                            const d = new Date();
                                            d.setDate(d.getDate() - 1);
                                            return formatDate(d);
                                        })()}
                                    </div>
                                    <div className='text-[10px] text-slate-300'>
                                        {(() => {
                                            const d = new Date();
                                            d.setDate(d.getDate() - 1);
                                            return formatDate(d);
                                        })()} - {formatDate(new Date())}
                                    </div>
                                </div>
                            )}
                            {dateType === 'preset' && selectedMenu === 'today' && (
                                <div className='space-y-2'>
                                    <div className='text-lg font-bold text-didongviet-red'>
                                        {formatDate(new Date())}
                                    </div>
                                    <div className='text-[10px] text-slate-300'>
                                        {formatDate(new Date())}
                                    </div>
                                </div>
                            )}
                            {dateType === 'preset' && (selectedMenu === 'last7' || selectedMenu === 'last30') && (
                                <div className='space-y-2'>
                                    <div className='text-lg font-bold text-didongviet-red'>
                                        {selectedMenu === 'last7' ? '7 ngày qua' : '30 ngày qua'}
                                    </div>
                                    <div className='text-[10px] text-slate-300'>
                                        {(() => {
                                            const start = new Date();
                                            start.setDate(start.getDate() - (selectedMenu === 'last7' ? 6 : 29));
                                            const end = new Date();
                                            return `${formatDate(start)} - ${formatDate(end)}`;
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}