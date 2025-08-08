import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation
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
    const { t } = useTranslation(); // NEW: Get the translation function
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

    // UPDATED: Use translation keys for all titles and links
    const navSections = [
        {
            title: 'sales',
            links: [
                { name: 'leads', path: '/leads', icon: <Handshake size={20} /> },
                { name: 'quotes', path: '/quotes', icon: <FileText size={20} /> },
                { name: 'customers', path: '/customers', icon: <Users size={20} /> },
                { name: 'orders', path: '/orders', icon: <ShoppingBag size={20} /> },
                { name: 'invoices', path: '/invoices', icon: <CircleDollarSign size={20} /> },
            ],
        },
        {
            title: 'inventory',
            links: [
                { name: 'finishedProducts', path: '/inventory', icon: <Boxes size={20} /> },
                { name: 'productionHistory', path: '/production-orders', icon: <HardHat size={20} /> },
            ],
        },
        {
            title: 'purchasing',
            links: [
                { name: 'suppliers', path: '/suppliers', icon: <Truck size={20} /> },
                { name: 'purchaseOrders', path: '/purchase-orders', icon: <FileText size={20} /> },
            ],
        },
        {
            title: 'reporting',
            links: [
                { name: 'reports', path: '/reports', icon: <BarChart size={20} /> },
            ],
        },
        {
            title: 'admin',
            links: [
                { name: 'agents', path: '/agents', icon: <Shield size={20} /> },
                { name: 'employees', path: '/employees', icon: <Users size={20} /> },
                { name: 'settings', path: '/settings', icon: <Settings size={20} /> },
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
                    {/* NEW: Use translation key */}
                    <span>{t('dashboard')}</span>
                </NavLink>

                {navSections.map((section, index) => (
                    <div key={index} className="space-y-1">
                        {section.title && (
                            <div
                                className="flex justify-between items-center cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                                onClick={() => toggleSection(section.title)}
                            >
                                {/* NEW: Use translation key for section title */}
                                <h3 className="text-sm font-semibold text-custom-grey uppercase">{t(section.title)}</h3>
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
                                {/* NEW: Use translation key for link name */}
                                <span>{t(link.name)}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;