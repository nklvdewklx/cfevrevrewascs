import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Home, MapPinned, Users, Package, LogOut } from 'lucide-react';
import { logout } from '../../features/authentication/authSlice';
import Button from '../common/Button';

const AgentLayout = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    const navLinks = [
        { to: '/agent/home', icon: <Home size={24} />, label: 'Home' },
        { to: '/agent/route', icon: <MapPinned size={24} />, label: 'Route' },
        { to: '/agent/customers', icon: <Users size={24} />, label: 'Customers' },
        { to: '/agent/products', icon: <Package size={24} />, label: 'Products' },
    ];

    const activeLinkStyle = { color: 'var(--color-accent)' };

    return (
        <div className="flex flex-col h-screen font-sans bg-gray-900">
            {/* Header */}
            <header className="flex-shrink-0 flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">ROCTEC Agent</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-300">{user?.name}</span>
                    <Button onClick={handleLogout} variant="ghost" title="Logout">
                        <LogOut size={20} className="text-red-400" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto p-4">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="flex-shrink-0 flex justify-around items-center p-2 bg-gray-800 border-t border-gray-700">
                {navLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                        className="flex flex-col items-center justify-center text-gray-400 w-full py-1"
                    >
                        {link.icon}
                        <span className="text-xs">{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AgentLayout;