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

    const isRtl = i18n.language === 'ar';

    const flags = {
        en: '🇺🇸',
        ar: '🇪🇬',
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all duration-300 ${isOpen ? 'space-y-2' : ''}`}>
            {isOpen && (
                <div className={`glass-panel p-3 rounded-xl flex ${isRtl ? 'flex-row-reverse space-x-2' : 'space-x-2'}`}>
                    {/* Theme Toggle */}
                    <button
                        onClick={handleThemeToggle}
                        className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200"
                        title={theme === 'dark' ? t('switchToLight') : t('switchToDark')}
                    >
                        {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-200" />}
                    </button>

                    {/* Language Flags */}
                    {Object.entries(flags).map(([langCode, flag]) => (
                        <button
                            key={langCode}
                            onClick={() => handleLanguageChange(langCode)}
                            className={`p-2 rounded-lg text-2xl transition-all duration-200 ${language === langCode ? 'bg-blue-600/50' : 'hover:bg-gray-600/50'}`}
                            title={t('languageName', { lng: langCode })}
                        >
                            {flag}
                        </button>
                    ))}
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg ${isOpen ? 'rotate-45' : ''}`}
            >
                <Settings size={24} />
            </button>
        </div>
    );
};

export default SettingsMenu;