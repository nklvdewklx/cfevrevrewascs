import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Settings } from 'lucide-react';
import { toggleTheme, setLanguage } from '../../features/settings/settingsSlice';

const SettingsMenu = () => {
    const { i18n, t } = useTranslation();
    const dispatch = useDispatch();
    const { theme, language } = useSelector((state) => state.settings.items);
    const [isOpen, setIsOpen] = useState(false);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleLanguageChange = (newLang) => {
        dispatch(setLanguage(newLang));
        i18n.changeLanguage(newLang);
    };

    const menuOptions = [
        {
            id: 'theme',
            label: t('toggleTheme'),
            icon: theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />,
            action: handleThemeToggle,
            colorClass: 'bg-gray-700/80 hover:bg-gray-600/80'
        },
        {
            id: 'en',
            label: 'English',
            icon: <span className="font-bold text-sm">EN</span>,
            action: () => handleLanguageChange('en'),
            // NEW: Enhanced active class with a background color and ring
            colorClass: `bg-gray-700/80 hover:bg-gray-600/80 ${language === 'en' ? 'bg-blue-600/50 ring-2 ring-blue-400' : ''}`
        },
        {
            id: 'ar',
            label: 'العربية',
            icon: <span className="font-bold text-sm">AR</span>,
            action: () => handleLanguageChange('ar'),
            // NEW: Enhanced active class with a background color and ring
            colorClass: `bg-gray-700/80 hover:bg-gray-600/80 ${language === 'ar' ? 'bg-blue-600/50 ring-2 ring-blue-400' : ''}`
        }
    ];

    return (
        <div className="settings-fab-container">
            {menuOptions.map((option, index) => {
                const angle = -90 - (index * 50);
                const radius = 70;
                const x = radius * Math.cos(angle * (Math.PI / 180));
                const y = radius * Math.sin(angle * (Math.PI / 180));

                const style = {
                    transform: isOpen ? `translate(${x}px, ${y}px)` : 'translate(0, 0)',
                    opacity: isOpen ? 1 : 0,
                    transitionDelay: isOpen ? `${index * 0.05}s` : '0s'
                };

                return (
                    <div key={option.id} className="settings-fab-option-wrapper" style={style}>
                        <div className="settings-tooltip">{option.label}</div>
                        <button onClick={option.action} className={`settings-fab-option ${option.colorClass}`}>
                            {option.icon}
                        </button>
                    </div>
                );
            })}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`settings-fab transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
            >
                <Settings size={24} />
            </button>
        </div>
    );
};

export default SettingsMenu;