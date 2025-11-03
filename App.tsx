import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { Transaction, Wallet, Category, Role, User, Language, SavingsGoal } from './types';
import Header from './components/Header';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import ProfileModal from './components/ProfileModal';
import { initialTransactions, initialWallets, initialCategories, locales, initialUsers, initialSavingsGoals } from './constants';

// --- CONTEXTS & HOOKS ---

// Auth Context for Role Management
interface AuthContextType {
    role: Role;
    setRole: React.Dispatch<React.SetStateAction<Role>>;
    currentUser: User | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode; currentUser: User | null }> = ({ children, currentUser }) => {
    const [role, setRole] = useState<Role>(currentUser?.role || Role.USER);
    const value = { role, setRole, currentUser };
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
interface LanguageContextType {
    language: Language;
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
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const { role } = useAuth();
    
    const handleAddTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [
            { ...newTransaction, id: Date.now().toString() },
            ...prev
        ]);
    }, []);
    
    const handleDeleteTransaction = useCallback((id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    const handleEditTransaction = useCallback((updatedTransaction: Transaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    }, []);
    
    const handleEditCategory = useCallback((updatedCategory: Category) => {
        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    }, []);
    
    const handleUpdateUser = (updatedUser: User) => {
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const handleAddSavingsGoal = useCallback((newGoal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
        setSavingsGoals(prev => [
            { ...newGoal, id: `goal-${Date.now()}`, currentAmount: 0 },
            ...prev
        ]);
    }, []);

    const handleDeleteSavingsGoal = useCallback((id: string) => {
        setSavingsGoals(prev => prev.filter(g => g.id !== id));
    }, []);

    const handleAddContribution = useCallback((id: string, amount: number) => {
        setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g));
    }, []);

    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
            <Header onProfileClick={() => setIsProfileModalOpen(true)} />
            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                {role === Role.ADMIN ? (
                    <AdminPanel
                        users={users}
                        setUsers={setUsers}
                        categories={categories}
                        setCategories={setCategories}
                        transactions={transactions}
                        wallets={wallets}
                        onDeleteTransaction={handleDeleteTransaction}
                        onAddTransaction={handleAddTransaction}
                        onEditTransaction={handleEditTransaction}
                        onEditCategory={handleEditCategory}
                    />
                ) : (
                    <UserDashboard
                        transactions={transactions}
                        wallets={wallets}
                        categories={categories}
                        onAddTransaction={handleAddTransaction}
                        onDeleteTransaction={handleDeleteTransaction}
                        savingsGoals={savingsGoals}
                        onAddSavingsGoal={handleAddSavingsGoal}
                        onDeleteSavingsGoal={handleDeleteSavingsGoal}
                        onAddContribution={handleAddContribution}
                    />
                )}
            </main>
             {currentUser && (
                <ProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    user={currentUser}
                    onSave={handleUpdateUser}
                />
            )}
        </div>
    );
};


// --- APP WRAPPER WITH PROVIDERS ---

const App: React.FC = () => {
    // In a real app, this would come from an auth service
    const currentUser = initialUsers.find(u => u.id === 'user-1')!;
    
    return (
        <AuthProvider currentUser={currentUser}>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App;