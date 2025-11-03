import React, { useState, useEffect } from 'react';
import { User, Category, Transaction, Wallet, TransactionType, Language } from '../types';
import { useLanguage } from '../App';
import TransactionList from './TransactionList';
import AdminReports from './AdminReports';

type AdminTab = 'reports' | 'users' | 'categories' | 'transactions';

interface AdminPanelProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    onEditCategory: (category: Category) => void;
    transactions: Transaction[];
    wallets: Wallet[];
    onDeleteTransaction: (id: string) => void;
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    onEditTransaction: (transaction: Transaction) => void;
}

const TransactionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Transaction, 'id'>) => void;
    transaction: Omit<Transaction, 'id'> | null;
    wallets: Wallet[];
    categories: Category[];
}> = ({ isOpen, onClose, onSave, transaction, wallets, categories }) => {
    const { t, language } = useLanguage();
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [walletId, setWalletId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(transaction.amount.toString());
            setDescription(transaction.description);
            setCategoryId(transaction.categoryId);
            setWalletId(transaction.walletId);
            setDate(transaction.date);
        } else {
            // Reset form for "add new"
            setType(TransactionType.EXPENSE);
            setAmount('');
            setDescription('');
            setCategoryId('');
            setWalletId(wallets.length > 0 ? wallets[0].id : '');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [transaction, isOpen, wallets]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ type, amount: parseFloat(amount), description, categoryId, walletId, date });
    };
    
    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <h2 className="text-xl font-bold mb-4">{transaction ? t('editTransaction') : t('addNewTransaction')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reusing form elements from TransactionForm, adapted for modal */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`px-4 py-2 text-sm font-semibold rounded-md transition ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>{t('expense')}</button>
                        <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`px-4 py-2 text-sm font-semibold rounded-md transition ${type === TransactionType.INCOME ? 'bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}>{t('income')}</button>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('amount')}</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('description')}</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('category')}</label>
                         <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" required>
                            <option value="" disabled>{t('selectCategory')}</option>
                            {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name[language]}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('wallet')}</label>
                             <select value={walletId} onChange={e => setWalletId(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" required>
                                 {wallets.map(w => <option key={w.id} value={w.id}>{w.name[language]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('date')}</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">{t('cancel')}</button>
                        <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">{t('save')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CategoryManager: React.FC<{
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    onEditCategory: (category: Category) => void;
}> = ({ categories, setCategories, onEditCategory }) => {
    const { t, language } = useLanguage();
    const [newCatName, setNewCatName] = useState('');
    const [newCatType, setNewCatType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [newCatIcon, setNewCatIcon] = useState('pricetag-outline');
    
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCatName.trim() === '') return;
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: { en: newCatName, vi: newCatName },
            type: newCatType,
            icon: newCatIcon,
        };
        setCategories(prev => [...prev, newCategory]);
        setNewCatName('');
        setNewCatIcon('pricetag-outline');
    };

    const handleDeleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
    
    const handleStartEdit = (category: Category) => setEditingCategory({ ...category });

    const handleCancelEdit = () => setEditingCategory(null);

    const handleSaveEdit = () => {
        if (editingCategory) {
            onEditCategory(editingCategory);
            setEditingCategory(null);
        }
    };
    
    const handleEditField = (field: keyof Category, value: any) => {
        if (editingCategory) {
            if (field === 'name') {
                 setEditingCategory({ ...editingCategory, name: { en: value, vi: value } });
            } else {
                 setEditingCategory({ ...editingCategory, [field]: value });
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 border dark:border-gray-700 rounded-lg">
                <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder={t('categoryName')} className="md:col-span-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" />
                <input type="text" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} placeholder={t('icon')} className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" />
                <select value={newCatType} onChange={e => setNewCatType(e.target.value as TransactionType)} className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md">
                    <option value={TransactionType.EXPENSE}>{t('expense')}</option>
                    <option value={TransactionType.INCOME}>{t('income')}</option>
                </select>
                <button type="submit" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">{t('addCategory')}</button>
            </form>
            <div className="space-y-2">
                {categories.map(cat => (
                    <div key={cat.id} className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                        {editingCategory?.id === cat.id ? (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                                 <input value={editingCategory.name.en} onChange={e => handleEditField('name', e.target.value)} className="md:col-span-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" />
                                 <input value={editingCategory.icon} onChange={e => handleEditField('icon', e.target.value)} className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md" />
                                 <select value={editingCategory.type} onChange={e => handleEditField('type', e.target.value as TransactionType)} className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md">
                                    <option value={TransactionType.EXPENSE}>{t('expense')}</option>
                                    <option value={TransactionType.INCOME}>{t('income')}</option>
                                </select>
                                <div className="flex space-x-2">
                                    <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-600"><ion-icon name="checkmark-outline"></ion-icon></button>
                                    <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-600"><ion-icon name="close-outline"></ion-icon></button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <ion-icon name={cat.icon} class="text-xl text-gray-500"></ion-icon>
                                    <span>{cat.name[language as Language]}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${cat.type === TransactionType.INCOME ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{t(cat.type)}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button onClick={() => handleStartEdit(cat)} className="text-gray-400 hover:text-indigo-500 transition"><ion-icon name="pencil-outline"></ion-icon></button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 transition"><ion-icon name="trash-outline"></ion-icon></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


const UserManager: React.FC<{
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}> = ({ users, setUsers }) => {
    const { t } = useLanguage();

    const toggleUserStatus = (userId: string) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, status: user.status === 'active' ? 'locked' : 'active' }
                    : user
            )
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('name')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('email')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('status')}</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                    {t(user.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => toggleUserStatus(user.id)} className={`text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200`}>
                                    {user.status === 'active' ? t('lock') : t('unlock')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const AdminPanel: React.FC<AdminPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('reports');
    const { t } = useLanguage();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleOpenEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };
    const handleOpenAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
        if (editingTransaction) {
            props.onEditTransaction({ ...editingTransaction, ...data });
        } else {
            props.onAddTransaction(data);
        }
        handleCloseModal();
    };

    const tabs: { id: AdminTab; label: string }[] = [
        { id: 'reports', label: t('reports') },
        { id: 'users', label: t('userManagement') },
        { id: 'categories', label: t('categoryManagement') },
        { id: 'transactions', label: t('allTransactions') },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg shadow-gray-200/40 dark:shadow-black/20">
             <TransactionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTransaction}
                transaction={editingTransaction}
                wallets={props.wallets}
                categories={props.categories}
            />

            <h1 className="text-2xl font-bold mb-4">{t('adminPanel')}</h1>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'reports' && <AdminReports transactions={props.transactions}/>}
                {activeTab === 'users' && <UserManager users={props.users} setUsers={props.setUsers} />}
                {activeTab === 'categories' && <CategoryManager categories={props.categories} setCategories={props.setCategories} onEditCategory={props.onEditCategory} />}
                {activeTab === 'transactions' && (
                     <div>
                        <div className="flex justify-end mb-4">
                            <button onClick={handleOpenAddModal} className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700">{t('addNewTransaction')}</button>
                        </div>
                        <TransactionList 
                            transactions={props.transactions} 
                            categories={props.categories} 
                            wallets={props.wallets} 
                            onDelete={props.onDeleteTransaction}
                            isAdmin={true}
                            onEdit={handleOpenEditModal}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;