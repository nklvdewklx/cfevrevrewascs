import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './settingsSlice';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const { theme } = useSelector((state) => state.settings.items);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Site Settings</h1>
            <div className="glass-panel rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-custom-light-blue mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                    <p className="text-custom-grey">Theme</p>
                    <button
                        onClick={handleThemeToggle}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;