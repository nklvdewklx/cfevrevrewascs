import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    Home, ShoppingBag, Users, FileText, Boxes, Truck, BarChart, Shield,
    HardHat, CircleDollarSign, Handshake, ChevronDown, Settings, ClipboardList,
    History, SearchCode, CornerUpLeft, FileMinus, Microscope, Undo2 // CORRECTED: Replaced TruckOff with Undo2
} from 'lucide-react';

const Sidebar = () => {
    const { t } = useTranslation();
    const [openSections, setOpenSections] = useState({
        Sales: true,
        Inventory: true,
        Purchasing: true,
        Reporting: true,
        Admin: true,
    });

    const { items: products } = useSelector((state) => state.products);
    const { items: components } = useSelector((state) => state.components);

    const hasLowStockItems =
        products.some(p => (p.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0) <= (p.reorderPoint || 0)) ||
        components.some(c => (c.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0) <= c.reorderPoint);


    const toggleSection = (title) => {
        setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

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
                { name: 'supplierReturns', path: '/supplier-returns', icon: <Undo2 size={20} /> }, // CORRECTED
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

    const baseLinkStyle = "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200";

    return (
        <aside className="w-64 glass-panel p-4 h-full overflow-y-auto custom-scrollbar border-r border-white/10 flex-shrink-0">
            <nav className="space-y-4">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `${baseLinkStyle} ${isActive ? 'bg-white/5 text-custom-light-blue border-l-4 border-custom-light-blue pl-3' : 'text-custom-grey hover:bg-white/5'}`
                    }
                >
                    <Home size={20} />
                    <span>{t('dashboard')}</span>
                </NavLink>

                {navSections.map((section, index) => (
                    <div key={index} className="space-y-1">
                        {section.title && (
                            <div
                                className="flex justify-between items-center cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                                onClick={() => toggleSection(section.title)}
                            >
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-sm font-semibold text-custom-grey uppercase">{t(section.title)}</h3>
                                    {section.hasNotification && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>}
                                </div>
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