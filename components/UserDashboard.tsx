import React, { useState, useCallback } from 'react';
import { Transaction, Wallet, Category, PlannedExpense, TransactionType, SavingsGoal } from '../types';
import SummaryCard from './SummaryCard';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import CategoryChart from './CategoryChart';
import SpendingTrendChart from './SpendingTrendChart';
import { useLanguage } from '../App';
import BudgetPlanner from './BudgetPlanner';
import SavingsGoals from './SavingsGoals';

interface UserDashboardProps {
    transactions: Transaction[];
    wallets: Wallet[];
    categories: Category[];
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    onDeleteTransaction: (id: string) => void;
    savingsGoals: SavingsGoal[];
    onAddSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
    onDeleteSavingsGoal: (id: string) => void;
    onAddContribution: (id: string, amount: number) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = (props) => {
    const {
        transactions,
        wallets,
        categories,
        onAddTransaction,
        onDeleteTransaction,
        savingsGoals,
        onAddSavingsGoal,
        onDeleteSavingsGoal,
        onAddContribution,
    } = props;
    const { t } = useLanguage();
    const [plannedExpenses, setPlannedExpenses] = useState<PlannedExpense[]>([]);

    const handleAddPlannedExpense = useCallback((expense: Omit<PlannedExpense, 'id'>) => {
        setPlannedExpenses(prev => [...prev, { ...expense, id: `plan-${Date.now()}` }]);
    }, []);

    const handleDeletePlannedExpense = useCallback((id: string) => {
        setPlannedExpenses(prev => prev.filter(p => p.id !== id));
    }, []);

    const handleConvertToTransaction = useCallback((plan: PlannedExpense) => {
        onAddTransaction({
            amount: plan.amount,
            categoryId: plan.categoryId,
            date: new Date().toISOString().split('T')[0],
            description: plan.description,
            type: categories.find(c => c.id === plan.categoryId)?.type || TransactionType.EXPENSE,
            walletId: wallets[0]?.id || '', // Default to first wallet
        });
        handleDeletePlannedExpense(plan.id);
    }, [onAddTransaction, handleDeletePlannedExpense, categories, wallets]);


    const { totalIncome, totalExpense, balance } = React.useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpense: expense, balance: income - expense };
    }, [transactions]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <SummaryCard titleKey="totalIncome" amount={totalIncome} type="income" />
                <SummaryCard titleKey="totalExpense" amount={totalExpense} type="expense" />
                <SummaryCard titleKey="balance" amount={balance} type="balance" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('addTransaction')}</h2>
                    <TransactionForm
                        wallets={wallets}
                        categories={categories}
                        onAddTransaction={onAddTransaction}
                    />
                </div>
                <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                     <BudgetPlanner 
                        categories={categories}
                        plannedExpenses={plannedExpenses}
                        onAdd={handleAddPlannedExpense}
                        onDelete={handleDeletePlannedExpense}
                        onConvertToTransaction={handleConvertToTransaction}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20 mb-8">
                <SavingsGoals
                    goals={savingsGoals}
                    onAddGoal={onAddSavingsGoal}
                    onDeleteGoal={onDeleteSavingsGoal}
                    onAddContribution={onAddContribution}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('spendingByCategory')}</h2>
                    <CategoryChart transactions={transactions} categories={categories} />
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('incomeVsExpense')}</h2>
                    <SpendingTrendChart transactions={transactions} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                <TransactionList transactions={transactions} categories={categories} wallets={wallets} onDelete={onDeleteTransaction} />
            </div>
        </>
    );
};

export default UserDashboard;