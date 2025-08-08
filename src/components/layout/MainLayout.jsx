import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authentication/authSlice';
import Dropdown from '../common/Dropdown';
import Button from '../common/Button';
import { Home, ClipboardList, Package, ShoppingBag, Truck, FileText, BarChart, User, Users } from 'lucide-react'; // NEW: Added icons

const MainLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const navLinkClass = "block w-full text-left px-3 py-2 rounded-md hover:bg-white/10 flex items-center space-x-2";
    const navLinkActiveClass = "bg-white/10 font-bold text-white";
    const isAdmin = user?.role === 'admin';

    const activeStyle = {
        color: 'var(--color-accent)',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    };

    return (
        <div className="flex flex-col h-screen">
            <header className="flex-shrink-0 flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm border-b border-white/10 z-20">
                <div className="flex items-center space-x-8">
                    <Link to="/dashboard" className="text-2xl font-bold">ROCTEC</Link>
                    <nav className="hidden md:flex items-center space-x-6 text-custom-grey">
                        <NavLink to="/dashboard" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <Home size={18} />
                            <span>Dashboard</span>
                        </NavLink>

                        <Dropdown title="Sales">
                            <NavLink to="/leads" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <ClipboardList size={18} />
                                <span>Leads</span>
                            </NavLink>
                            <NavLink to="/quotes" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <FileText size={18} />
                                <span>Quotes</span>
                            </NavLink>
                            <NavLink to="/customers" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <User size={18} />
                                <span>Customers</span>
                            </NavLink>
                            <NavLink to="/orders" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <ShoppingBag size={18} />
                                <span>Orders</span>
                            </NavLink>
                            <NavLink to="/invoices" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <FileText size={18} />
                                <span>Invoices</span>
                            </NavLink>
                        </Dropdown>

                        <Dropdown title="Inventory">
                            <NavLink to="/inventory" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <Package size={18} />
                                <span>Finished Products</span>
                            </NavLink>
                            <NavLink to="/production-orders" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <Truck size={18} />
                                <span>Production History</span>
                            </NavLink>
                        </Dropdown>

                        <Dropdown title="Purchasing">
                            <NavLink to="/suppliers" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <Users size={18} />
                                <span>Suppliers</span>
                            </NavLink>
                            <NavLink to="/purchase-orders" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                <ShoppingBag size={18} />
                                <span>Purchase Orders</span>
                            </NavLink>
                        </Dropdown>

                        <NavLink to="/reports" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                            <BarChart size={18} />
                            <span>Reports</span>
                        </NavLink>

                        {isAdmin && (
                            <Dropdown title="Admin">
                                <NavLink to="/agents" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                    <User size={18} />
                                    <span>Agent Management</span>
                                </NavLink>
                                <NavLink to="/employees" className={navLinkClass} style={({ isActive }) => isActive ? activeStyle : undefined}>
                                    <Users size={18} />
                                    <span>Employee Management</span>
                                </NavLink>
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