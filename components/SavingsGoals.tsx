import React, { useState } from 'react';
import { SavingsGoal } from '../types';
import { useLanguage } from '../App';

interface SavingsGoalsProps {
    goals: SavingsGoal[];
    onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
    onDeleteGoal: (id: string) => void;
    onAddContribution: (id: string, amount: number) => void;
}

const SavingsGoalItem: React.FC<{
    goal: SavingsGoal;
    onDelete: (id: string) => void;
    onContribute: (id: string, amount: number) => void;
}> = ({ goal, onDelete, onContribute }) => {
    const { t, language } = useLanguage();
    const [contribution, setContribution] = useState('');
    const [showContributeInput, setShowContributeInput] = useState(false);

    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

    const formatter = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: 'VND',
    });

    const handleContribute = () => {
        const amount = parseFloat(contribution);
        if (!isNaN(amount) && amount > 0) {
            onContribute(goal.id, amount);
            setContribution('');
            setShowContributeInput(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {goal.imageUrl && <img src={goal.imageUrl} alt={goal.name} className="w-full sm:w-20 h-20 object-cover rounded-lg flex-shrink-0" />}
            <div className="flex-grow w-full">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-800 dark:text-gray-100">{goal.name}</h4>
                    <button onClick={() => onDelete(goal.id)} className="text-gray-400 hover:text-red-500">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatter.format(goal.currentAmount)} {t('of')} {formatter.format(goal.targetAmount)} ({progress.toFixed(1)}%)
                </p>
                {showContributeInput ? (
                    <div className="flex space-x-2 mt-2">
                        <input
                            type="number"
                            value={contribution}
                            onChange={(e) => setContribution(e.target.value)}
                            placeholder={t('contributionAmount')}
                            className="flex-grow bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-sm p-1"
                        />
                        <button onClick={handleContribute} className="bg-green-500 text-white px-2 py-1 text-sm rounded-md hover:bg-green-600">{t('add')}</button>
                        <button onClick={() => setShowContributeInput(false)} className="text-gray-500 hover:text-gray-700"><ion-icon name="close-outline"></ion-icon></button>
                    </div>
                ) : (
                    <button onClick={() => setShowContributeInput(true)} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                        {t('addContribution')}
                    </button>
                )}
            </div>
        </div>
    );
};


const SavingsGoals: React.FC<SavingsGoalsProps> = ({ goals, onAddGoal, onDeleteGoal, onAddContribution }) => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const targetAmount = parseFloat(target);
        if (name.trim() && !isNaN(targetAmount) && targetAmount > 0) {
            onAddGoal({ name, targetAmount });
            setName('');
            setTarget('');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('savingsGoals')}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('goalName')}
                    className="md:col-span-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                />
                <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder={t('targetAmount')}
                    className="md:col-span-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                />
                <button type="submit" className="md:col-span-1 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700">{t('addGoal')}</button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {goals.length > 0 ? (
                    goals.map(goal => (
                        <SavingsGoalItem 
                            key={goal.id} 
                            goal={goal} 
                            onDelete={onDeleteGoal}
                            onContribute={onAddContribution} 
                        />
                    ))
                ) : (
                    <p className="lg:col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">{t('noSavingsGoals')}</p>
                )}
            </div>
        </div>
    );
};

export default SavingsGoals;
