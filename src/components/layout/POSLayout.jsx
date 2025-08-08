import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Clock, Wifi, Battery } from 'lucide-react';

const POSLayout = () => {
    // This is a simplified layout specifically for the POS screen.
    // It has no main navigation to maximize screen real estate.
    return (
        <div className="flex flex-col h-screen font-sans bg-gray-900 text-white">
            <header className="flex-shrink-0 flex justify-between items-center p-3 bg-black/30">
                <Link to="/dashboard" className="text-lg font-bold">ROCTEC</Link>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center space-x-2">
                        <Wifi size={16} />
                        <Battery size={16} />
                    </div>
                </div>
            </header>
            <main className="flex-grow p-4 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default POSLayout;