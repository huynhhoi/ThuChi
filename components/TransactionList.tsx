import React from 'react';
import { Transaction, Category, Wallet, TransactionType } from '../types';
import { useLanguage } from '../App';

interface TransactionListProps {
    transactions: Transaction[];
    categories: Category[];
    wallets: Wallet[];
    onDelete: (id: string) => void;
    isAdmin?: boolean;
    onEdit?: (transaction: Transaction) => void;
}

const TransactionListItem: React.FC<{
    transaction: Transaction;
    category?: Category;
    wallet?: Wallet;
    onDelete: (id: string) => void;
    isAdmin?: boolean;
    onEdit?: (transaction: Transaction) => void;
}> = ({ transaction, category, wallet, onDelete, isAdmin, onEdit }) => {
    const { language, t } = useLanguage();
    const isIncome = transaction.type === TransactionType.INCOME;
    const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
    const amountPrefix = isIncome ? '+' : '-';

    const formatter = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: 'VND',
    });

    const dateLocale = language === 'vi' ? 'vi-VN' : 'en-GB';

    return (
        <li className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg group">
            <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${isIncome ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                    <ion-icon name={category?.icon || 'help-outline'} class={`text-xl ${isIncome ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}></ion-icon>
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{transaction.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString(dateLocale)} • {category?.name[language]} • {wallet?.name[language]}
                    </p>
                </div>
            </div>
            <div className="text-right flex items-center space-x-2">
                <p className={`text-sm font-bold ${amountColor}`}>{amountPrefix}{formatter.format(transaction.amount)}</p>
                <div className={`flex items-center space-x-1 transition-opacity ${isAdmin ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isAdmin && onEdit && (
                         <button onClick={() => onEdit(transaction)} title={t('edit')} className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition">
                            <ion-icon name="pencil-outline" class="text-lg"></ion-icon>
                         </button>
                    )}
                    <button onClick={() => onDelete(transaction.id)} title={t('delete')} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition">
                        <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                    </button>
                </div>
            </div>
        </li>
    );
};


const TransactionList: React.FC<TransactionListProps> = ({ transactions, categories, wallets, onDelete, isAdmin, onEdit }) => {
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const walletMap = new Map(wallets.map(w => [w.id, w]));
    const { t } = useLanguage();

    return (
        <div>
            {!isAdmin && <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('recentTransactions')}</h2>}
            {transactions.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map(t => (
                        <TransactionListItem
                            key={t.id}
                            transaction={t}
                            category={categoryMap.get(t.categoryId)}
                            wallet={walletMap.get(t.walletId)}
                            onDelete={onDelete}
                            isAdmin={isAdmin}
                            onEdit={onEdit}
                        />
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t('noTransactions')}</p>
            )}
        </div>
    );
};

export default TransactionList;