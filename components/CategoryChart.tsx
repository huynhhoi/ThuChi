import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction, Category, TransactionType } from '../types';
import { useLanguage } from '../App';

interface CategoryChartProps {
    transactions: Transaction[];
    categories: Category[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943', '#19D1FF', '#FFD119'];

const CustomTooltip = ({ active, payload }: any) => {
    const { language } = useLanguage();
    if (active && payload && payload.length) {
        const formatter = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: 'VND',
        });
        return (
            <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <p className="label text-sm text-gray-800 dark:text-gray-200">{`${payload[0].name} : ${formatter.format(payload[0].value)}`}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{`(${(payload[0].percent * 100).toFixed(2)}%)`}</p>
            </div>
        );
    }
    return null;
};

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions, categories }) => {
    const { language, t } = useLanguage();
    const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);

    const data = categories
        .filter(c => c.type === TransactionType.EXPENSE)
        .map(category => {
            const total = expenseTransactions
                .filter(t => t.categoryId === category.id)
                .reduce((sum, t) => sum + t.amount, 0);
            return { name: category.name[language], value: total };
        })
        .filter(item => item.value > 0);

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500">{t('noExpenseData')}</div>;
    }

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryChart;