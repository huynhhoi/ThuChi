
import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { Transaction, Wallet, Category, TransactionType, Role } from './types';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryChart from './components/CategoryChart';
import SpendingTrendChart from './components/SpendingTrendChart';
import { initialTransactions, initialWallets, initialCategories, locales } from './constants';

// --- CONTEXTS & HOOKS ---

// Auth Context for Role Management
interface AuthContextType {
    role: Role;
    setRole: React.Dispatch<React.SetStateAction<Role>>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<Role>(Role.USER);
    const value = { role, setRole };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Language Context for i18n
export type Language = 'en' | 'vi';
interface LanguageContextType {
    language: Language;
    // FIX: Correctly type `setLanguage` to allow functional updates.
    setLanguage: React.Dispatch<React.SetStateAction<Language>>;
    t: (key: keyof typeof locales.en) => string;
}
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('vi');
    
    const t = useCallback((key: keyof typeof locales.en): string => {
        return locales[language][key] || locales['en'][key];
    }, [language]);

    const value = { language, setLanguage, t };
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// --- MAIN APP CONTENT ---

const AppContent: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [wallets] = useState<Wallet[]>(initialWallets);
    const [categories] = useState<Category[]>(initialCategories);

    const { totalIncome, totalExpense, balance } = useMemo(() => {
        const income = transactions
            .filter(t => t.type === TransactionType.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
            .filter(t => t.type === TransactionType.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);
        return { totalIncome: income, totalExpense: expense, balance: income - expense };
    }, [transactions]);

    const handleAddTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [
            { ...newTransaction, id: Date.now().toString() },
            ...prev
        ]);
    }, []);
    
    const handleDeleteTransaction = useCallback((id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <SummaryCard titleKey="totalIncome" amount={totalIncome} type="income" />
                    <SummaryCard titleKey="totalExpense" amount={totalExpense} type="expense" />
                    <SummaryCard titleKey="balance" amount={balance} type="balance" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                         <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('addTransaction')}</h2>
                        <TransactionForm
                            wallets={wallets}
                            categories={categories}
                            onAddTransaction={handleAddTransaction}
                        />
                    </div>
                     <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('spendingByCategory')}</h2>
                            <CategoryChart transactions={transactions} categories={categories} />
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('incomeVsExpense')}</h2>
                            <SpendingTrendChart transactions={transactions} />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
                    <TransactionList transactions={transactions} categories={categories} wallets={wallets} onDelete={handleDeleteTransaction} />
                </div>
            </main>
        </div>
    );
};


// --- APP WRAPPER WITH PROVIDERS ---

const App: React.FC = () => (
    <AuthProvider>
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    </AuthProvider>
);

export default App;
