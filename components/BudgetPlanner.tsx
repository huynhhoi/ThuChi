import React, { useState } from 'react';
import { Category, PlannedExpense, TransactionType, Language } from '../types';
import { useLanguage } from '../App';

interface BudgetPlannerProps {
    categories: Category[];
    plannedExpenses: PlannedExpense[];
    onAdd: (expense: Omit<PlannedExpense, 'id'>) => void;
    onDelete: (id: string) => void;
    onConvertToTransaction: (plan: PlannedExpense) => void;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ categories, plannedExpenses, onAdd, onDelete, onConvertToTransaction }) => {
    const { t, language } = useLanguage();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !categoryId) return;
        onAdd({ description, amount: parseFloat(amount), categoryId });
        setDescription('');
        setAmount('');
        setCategoryId('');
    };
    
    const formatter = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: 'VND',
    });

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('budgetPlanner')}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder={t('description')} className="sm:col-span-3 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={t('plannedAmount')} className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <option value="" disabled>{t('selectCategory')}</option>
                    {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name[language as Language]}</option>)}
                </select>
                <button type="submit" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm">{t('addPlannedExpense')}</button>
            </form>
            <h3 className="text-md font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-2">{t('plannedExpenses')}</h3>
             <div className="max-h-48 overflow-y-auto pr-2">
                {plannedExpenses.length > 0 ? (
                    <ul className="space-y-2">
                        {plannedExpenses.map(plan => (
                             <li key={plan.id} className="group flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium">{plan.description}</p>
                                    <p className="text-xs text-gray-500">
                                        {categories.find(c=>c.id === plan.categoryId)?.name[language as Language]}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatter.format(plan.amount)}</span>
                                     <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onConvertToTransaction(plan)} title={t('convertToTransaction')} className="text-green-500 hover:text-green-600">
                                            <ion-icon name="checkmark-circle-outline" class="text-lg"></ion-icon>
                                        </button>
                                        <button onClick={() => onDelete(plan.id)} title={t('delete')} className="text-red-500 hover:text-red-600">
                                            <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">{t('noPlannedExpenses')}</p>
                )}
             </div>
        </div>
    );
};

export default BudgetPlanner;