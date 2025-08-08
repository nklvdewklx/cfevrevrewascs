import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setLanguage } from './settingsSlice';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { theme, language } = useSelector((state) => state.settings.items);
    const { t } = useTranslation();

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        dispatch(setLanguage(newLang));
        i18n.changeLanguage(newLang);
    };

    return (
        <div className="space-y-6">
            {/* CORRECTED: Removed the extra curly braces */}
            <h1 className="text-3xl font-bold text-white">{t('siteSettings')}</h1>
            <div className="glass-panel rounded-lg p-6 space-y-4">
                {/* CORRECTED: Removed the extra curly braces */}
                <h2 className="text-xl font-semibold text-custom-light-blue mb-4">{t('appearance')}</h2>
                <div className="flex items-center justify-between">
                    {/* CORRECTED: Removed the extra curly braces */}
                    <p className="text-custom-grey">{t('theme')}</p>
                    <button
                        onClick={handleThemeToggle}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        {/* CORRECTED: Removed the extra curly braces */}
                        {t('switchTo')} {theme === 'dark' ? t('light') : t('dark')}
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    {/* CORRECTED: Removed the extra curly braces */}
                    <p className="text-custom-grey">{t('language')}</p>
                    <select value={language} onChange={handleLanguageChange} className="form-select w-48">
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;