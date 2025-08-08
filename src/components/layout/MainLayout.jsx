import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authentication/authSlice';
import Sidebar from './Sidebar';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const MainLayout = () => {
    const { t } = useTranslation(); // NEW: Get the translation function
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="flex h-screen text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-col flex-grow">
                {/* Header */}
                <header className="flex-shrink-0 flex justify-between items-center p-4 glass-panel border-b border-white/10 z-20">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-2xl font-bold">ROCTEC</Link>
                        <SearchBar />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => {
                                // Add navigation logic here if needed
                            }}
                            className="text-white"
                        >
                            <span>Launch POS</span>
                        </Button>
                        {/* NEW: Translate the user greeting */}
                        <span>{t('helloUser', { name: user?.name })}</span>
                        <Button
                            onClick={() => handleLogout()}
                            variant="danger"
                            className="text-white"
                        >
                            {/* NEW: Translate the button text */}
                            <span>{t('logout')}</span>
                        </Button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-grow p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;