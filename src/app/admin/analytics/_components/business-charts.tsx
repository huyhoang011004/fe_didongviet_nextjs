'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
    label: string;
    date: string;
    totalRevenue: number;
    totalProfit: number;
    totalOrders: number;
    totalProductsSold: number;
    avgOrderValue: number;
}

interface MetricConfig {
    label: string;
    color: string;
    unit: string;
}

interface BusinessChartsProps {
    chartData: ChartDataPoint[];
    visibleMetrics: string[];
    metricConfig: Record<string, MetricConfig>;
    formatVND: (num: number) => string;
}

export function BusinessCharts({ chartData, visibleMetrics, metricConfig, formatVND }: BusinessChartsProps) {
    if (chartData.length === 0) {
        return (
            <div className='flex items-center justify-center h-[300px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/20 text-slate-400'>
                <p className='text-sm font-semibold'>Chưa có dữ liệu biểu đồ.</p>
            </div>
        );
    }

    const formatValue = (value: number, unit: string) => {
        if (unit === 'vnd') return formatVND(value);
        return value.toLocaleString('vi-VN');
    };

    return (
        <div className='h-[350px]'>
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e2e8f0' />
                    <XAxis
                        dataKey='label'
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        interval='preserveStartEnd'
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '12px',
                        }}
                        formatter={(value: any, name: any) => {
                            const metricKey = Object.keys(metricConfig).find(
                                (k) => metricConfig[k]?.label === name
                            );
                            const unit = metricKey ? metricConfig[metricKey].unit : 'number';
                            return [formatValue(value, unit), name];
                        }}
                    />
                    {visibleMetrics.map((metricKey) => {
                        const config = metricConfig[metricKey];
                        if (!config) return null;
                        return (
                            <Line
                                key={metricKey}
                                type='monotone'
                                dataKey={metricKey}
                                name={config.label}
                                stroke={config.color}
                                strokeWidth={2.5}
                                dot={{ r: 3, strokeWidth: 1 }}
                                activeDot={{ r: 5 }}
                            />
                        );
                    })}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}