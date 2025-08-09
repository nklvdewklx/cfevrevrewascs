import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomToast = ({ message, type, id }) => {
    let icon;
    let colorClass;
    let bgClass; // NEW: Variable for the background class

    switch (type) {
        case 'success':
            icon = <CheckCircle className="text-green-400" />;
            colorClass = 'border-green-600';
            bgClass = 'toast-success'; // NEW
            break;
        case 'error':
            icon = <XCircle className="text-red-400" />;
            colorClass = 'border-red-600';
            bgClass = 'toast-error'; // NEW
            break;
        case 'info':
            icon = <Info className="text-blue-400" />;
            colorClass = 'border-blue-600';
            bgClass = 'toast-info'; // NEW
            break;
        default:
            icon = <Info className="text-gray-400" />;
            colorClass = 'border-gray-600';
            bgClass = 'bg-gray-800/50'; // NEW: Default background
    }

    return (
        // MODIFIED: Added the new bgClass
        <div className={`glass-panel p-4 rounded-lg flex items-center space-x-3 w-80 border ${colorClass} ${bgClass}`}>
            {icon}
            <span className="flex-grow">{message}</span>
            <button onClick={() => toast.dismiss(id)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <XCircle size={16} />
            </button>
        </div>
    );
};

export default CustomToast;