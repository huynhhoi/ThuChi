import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { useLanguage } from '../App';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSave: (updatedUser: User) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const { t } = useLanguage();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState(user.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setEmail(user.email);
            setAvatar(user.avatarUrl);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSave = () => {
        onSave({ ...user, name, email, avatarUrl: avatar });
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
        >
            <div 
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md m-4 transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 id="profile-modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('editProfile')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                    </button>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <img src={avatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-300 dark:ring-indigo-700" />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label={t('changeAvatar')}
                        >
                            <ion-icon name="camera-outline" class="text-lg"></ion-icon>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="w-full space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('name')}</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')}</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="mt-1 block w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">{t('cancel')}</button>
                    <button type="button" onClick={handleSave} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">{t('saveChanges')}</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
