import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Home, ShoppingBag, Users, FileText, Boxes, Truck, BarChart, Shield,
    HardHat, CircleDollarSign, Handshake, ChevronDown, Settings, ClipboardList,
    History, SearchCode, CornerUpLeft, FileMinus, Microscope, Undo2
} from 'lucide-react';

const Sidebar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    // MODIFIED: State now holds the title of the single open section, or null.
    const [openSection, setOpenSection] = useState(null);

    const { items: products } = useSelector((state) => state.products);
    const { items: components } = useSelector((state) => state.components);

    const hasLowStockItems =
        products.some(p => (p.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0) <= (p.reorderPoint || 0)) ||
        components.some(c => (c.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0) <= c.reorderPoint);

    const navSections = [
        {
            title: 'sales',
            links: [
                { name: 'leads', path: '/leads', icon: <Handshake size={20} /> },
                { name: 'quotes', path: '/quotes', icon: <FileText size={20} /> },
                { name: 'customers', path: '/customers', icon: <Users size={20} /> },
                { name: 'orders', path: '/orders', icon: <ShoppingBag size={20} /> },
                { name: 'returns', path: '/returns', icon: <CornerUpLeft size={20} /> },
                { name: 'creditNotes', path: '/credit-notes', icon: <FileMinus size={20} /> },
                { name: 'invoices', path: '/invoices', icon: <CircleDollarSign size={20} /> },
            ],
        },
        {
            title: 'inventory',
            hasNotification: hasLowStockItems,
            links: [
                { name: 'finishedProducts', path: '/inventory', icon: <Boxes size={20} /> },
                { name: 'components', path: '/inventory/components', icon: <ClipboardList size={20} /> },
                { name: 'qualityControl', path: '/inventory/quality-control', icon: <Microscope size={20} /> },
                { name: 'inventoryLedger', path: '/inventory/ledger', icon: <History size={20} /> },
                { name: 'productionHistory', path: '/production-orders', icon: <HardHat size={20} /> },
            ],
        },
        {
            title: 'purchasing',
            links: [
                { name: 'suppliers', path: '/suppliers', icon: <Truck size={20} /> },
                { name: 'purchaseOrders', path: '/purchase-orders', icon: <FileText size={20} /> },
                { name: 'supplierReturns', path: '/supplier-returns', icon: <Undo2 size={20} /> },
            ],
        },
        {
            title: 'reporting',
            links: [
                { name: 'reports', path: '/reports', icon: <BarChart size={20} /> },
                { name: 'traceabilityReport', path: '/reports/traceability', icon: <SearchCode size={20} /> },
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

    // MODIFIED: This effect now sets the single open section based on the current URL
    useEffect(() => {
        const activeSection = navSections.find(section =>
            section.links.some(link => location.pathname.startsWith(link.path))
        );
        if (activeSection) {
            setOpenSection(activeSection.title);
        }
    }, [location.pathname]);

    // MODIFIED: Simplified toggle logic for the accordion behavior
    const toggleSection = (title) => {
        setOpenSection(prevOpenSection => prevOpenSection === title ? null : title);
    };

    const baseLinkStyle = "flex items-center space-x-3 p-2.5 rounded-lg transition-colors duration-200";

    return (
        <aside className="w-64 glass-panel p-4 h-full overflow-y-auto custom-scrollbar border-r border-white/10 flex-shrink-0">
            <nav className="space-y-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `${baseLinkStyle} ${isActive ? 'nav-link-active' : 'text-custom-grey hover:bg-white/10'}`
                    }
                >
                    <Home size={20} />
                    <span>{t('dashboard')}</span>
                </NavLink>

                {navSections.map((section, index) => {
                    const isSectionActive = section.links.some(link => location.pathname.startsWith(link.path));
                    const isOpen = openSection === section.title; // MODIFIED: Check if this section is the open one

                    return (
                        <div key={index} className="space-y-1">
                            {section.title && (
                                <div
                                    className={`flex justify-between items-center cursor-pointer p-2.5 rounded-lg hover:bg-white/10 transition-colors duration-200 ${isSectionActive ? 'text-white' : 'text-custom-grey'}`}
                                    onClick={() => toggleSection(section.title)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-sm font-semibold uppercase">{t(section.title)}</h3>
                                        {section.hasNotification && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>}
                                    </div>
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                                </div>
                            )}
                            {isOpen && (
                                <div className="pl-4 space-y-1">
                                    {section.links.map(link => (
                                        <NavLink
                                            key={link.path}
                                            to={link.path}
                                            className={({ isActive }) =>
                                                `${baseLinkStyle} ${isActive ? 'nav-link-active' : 'text-custom-grey hover:bg-white/10 hover:text-white'}`
                                            }
                                        >
                                            {link.icon}
                                            <span>{t(link.name)}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;