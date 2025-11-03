export enum Role {
    USER = 'user',
    ADMIN = 'admin',
}

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

interface LocalizedName {
    en: string;
    vi: string;
}

export interface Wallet {
    id: string;
    name: LocalizedName;
    currency: string;
}

export interface Category {
    id: string;
    name: LocalizedName;
    type: TransactionType;
    icon: string;
}

export interface Transaction {
    id: string;
    walletId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    date: string; // YYYY-MM-DD
    description: string;
    note?: string;
}