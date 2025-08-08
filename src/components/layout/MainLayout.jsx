import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authentication/authSlice';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';

const MainLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const navLinkClass = "block w-full text-left px-3 py-2 rounded-md hover:bg-white/10";
    const isAdmin = user?.role === 'admin';

    return (
        <div className="flex flex-col h-screen">
            <header className="flex-shrink-0 flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm border-b border-white/10 z-20">
                <div className="flex items-center space-x-8">
                    <Link to="/dashboard" className="text-2xl font-bold">ROCTEC</Link>
                    <nav className="hidden md:flex items-center space-x-6 text-custom-grey">
                        <NavLink to="/dashboard" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-text)' } : undefined}>Dashboard</NavLink>

                        <Dropdown title="Sales">
                            <NavLink to="/leads" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Leads</NavLink>
                            <NavLink to="/quotes" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Quotes</NavLink>
                            <NavLink to="/customers" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Customers</NavLink>
                            <NavLink to="/orders" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Orders</NavLink>
                            <NavLink to="/invoices" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Invoices</NavLink>
                        </Dropdown>

                        <Dropdown title="Inventory">
                            <NavLink to="/inventory" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Finished Products</NavLink>
                            <NavLink to="/production-orders" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Production History</NavLink>
                        </Dropdown>

                        <Dropdown title="Purchasing">
                            <NavLink to="/suppliers" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Suppliers</NavLink>
                            <NavLink to="/purchase-orders" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Purchase Orders</NavLink>
                        </Dropdown>

                        <NavLink to="/reports" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-text)' } : undefined}>Reports</NavLink>

                        {isAdmin && (
                            <Dropdown title="Admin">
                                <NavLink to="/agents" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Agent Management</NavLink>
                                <NavLink to="/employees" className={navLinkClass} style={({ isActive }) => isActive ? { color: 'var(--color-accent)' } : undefined}>Employee Management</NavLink>
                            </Dropdown>
                        )}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="primary" className="px-5 py-2">
                        <Link to="/pos">
                            Launch POS
                        </Link>
                    </Button>
                    <span>Hello, {user?.name}</span>
                    <Button onClick={handleLogout} variant="danger" size="md">
                        Logout
                    </Button>
                </div>
            </header>
            <main className="flex-grow p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;