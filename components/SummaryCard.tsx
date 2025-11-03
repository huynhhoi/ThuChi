import React from 'react';
import { useLanguage } from '../App';
import { locales } from '../constants';

interface SummaryCardProps {
    titleKey: keyof typeof locales.en;
    amount: number;
    type: 'income' | 'expense' | 'balance' | 'transactions';
}

const typeClasses = {
    income: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-100 dark:bg-green-900',
        icon: 'trending-up-outline',
    },
    expense: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-900',
        icon: 'trending-down-outline',
    },
    balance: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        text: 'text-indigo-600 dark:text-indigo-400',
        iconBg: 'bg-indigo-100 dark:bg-indigo-900',
        icon: 'wallet-outline',
    },
    transactions: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-900',
        icon: 'list-outline',
    },
};

const SummaryCard: React.FC<SummaryCardProps> = ({ titleKey, amount, type }) => {
    const classes = typeClasses[type];
    const { language, t } = useLanguage();

    const formatter = type === 'transactions'
        ? new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US')
        : new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: 'VND',
        });


    return (
        <div className={`p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20 flex items-center space-x-4 transition-all duration-300 ${classes.bg}`}>
            <div className={`p-3 rounded-full ${classes.iconBg}`}>
                <ion-icon name={classes.icon} class={`text-2xl ${classes.text}`}></ion-icon>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t(titleKey)}</p>
                <p className={`text-2xl font-bold ${classes.text}`}>{formatter.format(amount)}</p>
            </div>
        </div>
    );
};

export default SummaryCard;