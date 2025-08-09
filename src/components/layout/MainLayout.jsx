import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authentication/authSlice';
import Sidebar from './Sidebar';
import Button from '../common/Button';
import SearchBar from '../common/SearchBar';
import SearchResultsModal from '../common/SearchResultsModal';
import { useTranslation } from 'react-i18next';

const MainLayout = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleLaunchPos = () => {
        navigate('/pos');
    };

    return (
        <div className="flex h-screen text-white">
            <Sidebar />

            <div className="flex flex-col flex-grow">
                <header className="flex-shrink-0 flex justify-between items-center p-4 glass-panel border-b border-white/10 z-20">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="text-2xl font-bold">ROCTEC</Link>
                        <SearchBar />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={handleLaunchPos}
                            className="text-white"
                        >
                            <span>Launch POS</span>
                        </Button>
                        <span>{t('helloUser', { name: user?.name })}</span>
                        <Button
                            onClick={() => handleLogout()}
                            variant="danger"
                            className="text-white"
                        >
                            <span>{t('logout')}</span>
                        </Button>
                    </div>
                </header>

                {/* MODIFIED: Added the custom-scrollbar class */}
                <main className="flex-grow p-6 overflow-y-auto custom-scrollbar">
                    <Outlet />
                </main>
            </div>

            <SearchResultsModal />
        </div>
    );
};

export default MainLayout;