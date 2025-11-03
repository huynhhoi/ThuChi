import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useLanguage } from '../App';
import { Role } from '../types';

interface HeaderProps {
    onProfileClick: () => void;
}


const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
    const { role, setRole, currentUser } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleRole = () => setRole(prev => (prev === Role.USER ? Role.ADMIN : Role.USER));
    const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'vi' : 'en'));

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const dropdownItems = [
        { label: t('viewProfile'), action: onProfileClick, icon: 'person-circle-outline' },
        { label: `${t('role')}: ${role === 'user' ? t('admin') : t('user')}`, action: toggleRole, icon: 'swap-horizontal-outline' },
        { label: `${t('language')}: ${language === 'en' ? t('vietnamese') : t('english')}`, action: toggleLanguage, icon: 'language-outline' },
        { label: t('logout'), action: toggleRole, icon: 'log-out-outline' } // Simulating logout with role switch
    ];

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01M12 18v-2m0-2v-2m0-2v-2m0-2V8m0 0h.01M12 5.99M12 18v2m0 1v1m0-2.01h.01M12 18.01H12m0-12.02h.01M12 5.99H12m12 6c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11z"></path>
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('appTitle')}</h1>
                    </div>
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
                            <img
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 ring-indigo-500"
                                src={currentUser?.avatarUrl}
                                alt="User avatar"
                            />
                             <div className='text-left hidden sm:block'>
                                <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>{currentUser?.name}</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>{role === 'admin' ? t('admin') : t('user')} | {language.toUpperCase()}</p>
                            </div>
                            <ion-icon name="chevron-down-outline" class="text-gray-500"></ion-icon>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                               {dropdownItems.map(item => (
                                     <button key={item.label} onClick={item.action} className="w-full flex items-center space-x-3 text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <ion-icon name={item.icon} class="text-lg text-gray-500"></ion-icon>
                                        <span>{item.label}</span>
                                     </button>
                               ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;