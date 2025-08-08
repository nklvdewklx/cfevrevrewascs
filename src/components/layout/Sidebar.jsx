import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    ShoppingBag,
    Users,
    FileText,
    Boxes,
    Truck,
    BarChart,
    Shield,
    HardHat,
    CircleDollarSign,
    Handshake,
    ChevronDown,
    Settings,
} from 'lucide-react';

const Sidebar = () => {
    const [openSections, setOpenSections] = useState({
        Sales: true,
        Inventory: true,
        Purchasing: true,
        Reporting: true,
        Admin: true,
    });

    const toggleSection = (title) => {
        setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const navSections = [
        {
            title: 'Sales',
            links: [
                { name: 'Leads', path: '/leads', icon: <Handshake size={20} /> },
                { name: 'Quotes', path: '/quotes', icon: <FileText size={20} /> },
                { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
                { name: 'Orders', path: '/orders', icon: <ShoppingBag size={20} /> },
                { name: 'Invoices', path: '/invoices', icon: <CircleDollarSign size={20} /> },
            ],
        },
        {
            title: 'Inventory',
            links: [
                { name: 'Finished Products', path: '/inventory', icon: <Boxes size={20} /> },
                { name: 'Production History', path: '/production-orders', icon: <HardHat size={20} /> },
            ],
        },
        {
            title: 'Purchasing',
            links: [
                { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} /> },
                { name: 'Purchase Orders', path: '/purchase-orders', icon: <FileText size={20} /> },
            ],
        },
        {
            title: 'Reporting',
            links: [
                { name: 'Reports', path: '/reports', icon: <BarChart size={20} /> },
            ],
        },
        {
            title: 'Admin',
            links: [
                { name: 'Agents', path: '/agents', icon: <Shield size={20} /> },
                { name: 'Employees', path: '/employees', icon: <Users size={20} /> },
                { name: 'Settings', path: '/settings', icon: <Settings size={20} /> }, // New link for settings
            ],
            adminOnly: true
        },
    ];

    const baseLinkStyle = "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200";

    return (
        <aside className="w-64 glass-panel p-4 h-full overflow-y-auto custom-scrollbar border-r border-white/10 flex-shrink-0">
            <nav className="space-y-4">
                {/* Dashboard Link - Pinned to the top */}
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `${baseLinkStyle} ${isActive ? 'bg-white/5 text-custom-light-blue border-l-4 border-custom-light-blue pl-3' : 'text-custom-grey hover:bg-white/5'}`
                    }
                >
                    <Home size={20} />
                    <span>Dashboard</span>
                </NavLink>

                {navSections.map((section, index) => (
                    <div key={index} className="space-y-1">
                        {section.title && (
                            <div
                                className="flex justify-between items-center cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                                onClick={() => toggleSection(section.title)}
                            >
                                <h3 className="text-sm font-semibold text-custom-grey uppercase">{section.title}</h3>
                                <ChevronDown size={16} className={`text-custom-grey transition-transform duration-200 ${openSections[section.title] ? '' : '-rotate-90'}`} />
                            </div>
                        )}
                        {openSections[section.title] && section.links.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `${baseLinkStyle} ${isActive ? 'bg-white/5 text-custom-light-blue border-l-4 border-custom-light-blue pl-3' : 'text-custom-grey hover:bg-white/5'}`
                                }
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;