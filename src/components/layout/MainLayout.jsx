import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/authentication/authSlice';
import Dropdown from '../common/Dropdown';

const MainLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const activeLinkStyle = { color: 'white', fontWeight: '600' };
    const navLinkClass = "block w-full text-left px-3 py-2 rounded-md hover:bg-white/10";
    const isAdmin = user?.role === 'admin';

    return (
        <div className="flex flex-col h-screen">
            <header className="flex-shrink-0 flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm border-b border-white/10 z-20">
                <div className="flex items-center space-x-8">
                    <Link to="/dashboard" className="text-2xl font-bold">ROCTEC</Link>
                    <nav className="hidden md:flex items-center space-x-6 text-custom-grey">
                        <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>

                        <Dropdown title="Sales">
                            <NavLink to="/leads" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Leads</NavLink>
                            <NavLink to="/quotes" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Quotes</NavLink>
                            <NavLink to="/customers" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Customers</NavLink>
                            <NavLink to="/orders" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Orders</NavLink>
                            <NavLink to="/invoices" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Invoices</NavLink>
                        </Dropdown>

                        <Dropdown title="Inventory">
                            <NavLink to="/inventory" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Finished Products</NavLink>
                            <NavLink to="/production-orders" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Production History</NavLink>
                        </Dropdown>

                        <Dropdown title="Purchasing">
                            <NavLink to="/suppliers" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Suppliers</NavLink>
                            <NavLink to="/purchase-orders" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Purchase Orders</NavLink>
                        </Dropdown>

                        <NavLink to="/reports" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Reports</NavLink>

                        {isAdmin && (
                            <Dropdown title="Admin">
                                <NavLink to="/agents" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Agent Management</NavLink>
                                <NavLink to="/employees" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Employee Management</NavLink>
                            </Dropdown>
                        )}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/pos" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Launch POS
                    </Link>
                    <span>Hello, {user?.name}</span>
                    <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                        Logout
                    </button>
                </div>
            </header>
            <main className="flex-grow p-6 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;