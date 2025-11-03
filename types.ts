import type React from 'react';

// Add global JSX namespace declaration to support ion-icon custom element.
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { name: string; class?: string; }, HTMLElement>;
        }
    }
}

export type Language = 'en' | 'vi';

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

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: 'active' | 'locked';
    avatarUrl: string;
}

export interface PlannedExpense {
    id: string;
    description: string;
    amount: number;
    categoryId: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    imageUrl?: string;
}