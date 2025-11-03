import React from 'react';
import { Transaction, TransactionType } from '../types';
import SummaryCard from './SummaryCard';
import { useLanguage } from '../App';
import SpendingTrendChart from './SpendingTrendChart';

interface AdminReportsProps {
    transactions: Transaction[];
}

const AdminReports: React.FC<AdminReportsProps> = ({ transactions }) => {
    const { t } = useLanguage();

    const { totalIncome, totalExpense } = React.useMemo(() => {
        const income = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpense: expense };
    }, [transactions]);

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('systemFinancialSummary')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <SummaryCard titleKey="totalIncome" amount={totalIncome} type="income" />
                <SummaryCard titleKey="totalExpense" amount={totalExpense} type="expense" />
                <SummaryCard titleKey="totalTransactionsCount" amount={transactions.length} type="transactions" />
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('incomeVsExpense')}</h2>
                <SpendingTrendChart transactions={transactions} />
            </div>
        </div>
    );
};

export default AdminReports;
