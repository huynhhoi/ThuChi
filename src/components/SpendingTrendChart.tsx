import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { useLanguage } from '../App';

const CustomTooltip = ({ active, payload, label }: any) => {
    const { language } = useLanguage();
    if (active && payload && payload.length) {
        const formatter = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: 'VND',
        });
        return (
            <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <p className="label text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                {payload.map((pld: any, index: number) => (
                    <div key={index} style={{ color: pld.fill }} className="text-sm">
                        {pld.name}: {formatter.format(pld.value)}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// FIX: Define the props interface for the component.
interface SpendingTrendChartProps {
    transactions: Transaction[];
}

const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ transactions }) => {
    const { language, t } = useLanguage();
    const monthLocale = language === 'vi' ? 'vi-VN' : 'default';

    const dataByMonth = transactions.reduce((acc: Record<string, { name: string, income: number, expense: number }>, t) => {
        const month = new Date(t.date).toLocaleString(monthLocale, { month: 'short', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = { name: month, income: 0, expense: 0 };
        }
        if (t.type === TransactionType.INCOME) {
            acc[month].income += t.amount;
        } else {
            acc[month].expense += t.amount;
        }
        return acc;
    // FIX: Cast the initial value of reduce to ensure correct type inference for `dataByMonth`.
    }, {} as Record<string, { name: string, income: number, expense: number }>);

    const chartData = Object.values(dataByMonth).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    if (chartData.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">{t('noTrendData')}</div>;
    }

    const yAxisFormatter = (value: number) => {
        const millions = value / 1000000;
        return language === 'vi' ? `${millions} Tr` : `${millions}M`;
    };

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} tickFormatter={yAxisFormatter} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(203, 213, 225, 0.1)'}}/>
                    {/* FIX: Remove the `payload` prop which was causing a type error. The legend will be generated automatically from the `Bar` components. */}
                    <Legend iconSize={10} wrapperStyle={{fontSize: "14px"}} />
                    <Bar dataKey="income" fill="#22c55e" name={t('income')} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="#ef4444" name={t('expense')} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingTrendChart;
