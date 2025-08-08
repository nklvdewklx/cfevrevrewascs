import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginSuccess, loginFailure } from './authSlice';
import { defaultDb } from '../../api/defaultDb';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button'; // NEW: Import the reusable Button component

const LoginPage = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('$2a$12$fD.g9b.ExU39Y5R..2535uR4D0n6oBCDRV3b2s.2s.3b4s.5s.6b7');
    const dispatch = useDispatch();

    // Get the authentication state from the Redux store
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        const foundUser = defaultDb.users.find(u => u.username === username && u.password === password);

        if (foundUser) {
            showToast(`Welcome, ${foundUser.name}!`, 'success');
            dispatch(loginSuccess(foundUser));
        } else {
            showToast('Invalid username or password.', 'error');
            dispatch(loginFailure('Invalid credentials'));
        }
    };

    // **THE FIX IS HERE:**
    // If the user is already authenticated, redirect them away from the login page.
    if (isAuthenticated) {
        const redirectPath = user.role === 'sales' ? '/agent/home' : '/dashboard';
        return <Navigate to={redirectPath} />;
    }

    // Render the login form if the user is not authenticated
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="glass-panel rounded-lg w-full max-w-sm">
                <div className="p-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Welcome to ROCTEC</h2>
                    <p className="text-custom-grey mb-6">Please log in to continue.</p>
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block mb-1 text-sm text-custom-grey">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-custom-grey">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>
                        {/* NEW: Use the reusable Button component */}
                        <Button type="submit" className="w-full mt-4">
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;