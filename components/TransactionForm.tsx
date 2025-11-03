import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, Wallet, Category, TransactionType } from '../types';
import { suggestCategory } from '../services/geminiService';
import { useLanguage } from '../App';

interface TransactionFormProps {
    wallets: Wallet[];
    categories: Category[];
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ wallets, categories, onAddTransaction }) => {
    const { language, t } = useLanguage();
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState(wallets.length > 0 ? wallets[0].id : '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [error, setError] = useState('');

    const filteredCategories = categories.filter(c => c.type === type);

    useEffect(() => {
        setCategoryId(''); // Reset category when type changes
    }, [type]);

    const handleDescriptionBlur = useCallback(async () => {
        if (description.length > 3) {
            setIsSuggesting(true);
            const categoriesForAI = filteredCategories.map(c => ({ id: c.id, name: c.name.en }));
            const suggestedId = await suggestCategory(description, categoriesForAI);
            if (suggestedId) {
                setCategoryId(suggestedId);
            }
            setIsSuggesting(false);
        }
    }, [description, filteredCategories]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !categoryId || !walletId || !date) {
            setError(t('formError'));
            return;
        }
        setError('');
        onAddTransaction({
            type,
            amount: parseFloat(amount),
            description,
            categoryId,
            walletId,
            date,
        });
        // Reset form
        setAmount('');
        setDescription('');
        setCategoryId('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">{error}</div>}
            
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`px-4 py-2 text-sm font-semibold rounded-md transition ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                    {t('expense')}
                </button>
                <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`px-4 py-2 text-sm font-semibold rounded-md transition ${type === TransactionType.INCOME ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                    {t('income')}
                </button>
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('amount')}</label>
                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} onBlur={handleDescriptionBlur} placeholder={t('descriptionPlaceholder')} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>

            <div className="relative">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category')}</label>
                <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                    <option value="" disabled>{t('selectCategory')}</option>
                    {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name[language]}</option>)}
                </select>
                {isSuggesting && <div className="absolute top-1/2 right-3 mt-1 text-xs text-indigo-500">{t('aiSuggesting')}</div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('wallet')}</label>
                    <select id="wallet" value={walletId} onChange={e => setWalletId(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                        {wallets.map(w => <option key={w.id} value={w.id}>{w.name[language]}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('date')}</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                {t('add')}
            </button>
        </form>
    );
};

export default TransactionForm;