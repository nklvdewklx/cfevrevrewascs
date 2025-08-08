import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginSuccess, loginFailure } from './authSlice';
import { defaultDb } from '../../api/defaultDb';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const LoginPage = () => {
    const { t } = useTranslation(); // NEW: Get the translation function
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('$2a$12$fD.g9b.ExU39Y5R..2535uR4D0n6oBCDRV3b2s.2s.3b4s.5s.6b7');
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        const foundUser = defaultDb.users.find(u => u.username === username && u.password === password);

        if (foundUser) {
            // NEW: Translate the toast message
            showToast(t('welcomeUser', { name: foundUser.name }), 'success');
            dispatch(loginSuccess(foundUser));
        } else {
            // NEW: Translate the toast message
            showToast(t('invalidCredentials'), 'error');
            dispatch(loginFailure('Invalid credentials'));
        }
    };

    if (isAuthenticated) {
        const redirectPath = user.role === 'sales' ? '/agent/home' : '/dashboard';
        return <Navigate to={redirectPath} />;
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="glass-panel rounded-lg w-full max-w-sm">
                <div className="p-6 text-center">
                    {/* NEW: Translate these strings */}
                    <h2 className="text-3xl font-bold text-white mb-4">ROCTEC ERP</h2>
                    <p className="text-custom-grey mb-6">{t('loginMessage')}</p>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block mb-1 text-sm text-custom-grey">{t('username')}</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-custom-grey">{t('password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full mt-4">
                            {t('login')}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;