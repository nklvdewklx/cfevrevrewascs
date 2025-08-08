import React from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CustomToast = ({ message, type, id }) => {
    let icon;
    let color;

    switch (type) {
        case 'success':
            icon = <CheckCircle className="text-green-400" />;
            color = 'border-green-600';
            break;
        case 'error':
            icon = <XCircle className="text-red-400" />;
            color = 'border-red-600';
            break;
        case 'info':
            icon = <Info className="text-blue-400" />;
            color = 'border-blue-600';
            break;
        default:
            icon = <Info className="text-gray-400" />;
            color = 'border-gray-600';
    }

    return (
        <div className={`glass-panel p-4 rounded-lg flex items-center space-x-3 w-80 ${color} border`}>
            {icon}
            <span className="flex-grow">{message}</span>
            <button onClick={() => toast.dismiss(id)} className="text-gray-400 hover:text-white transition-colors duration-200">
                <XCircle size={16} />
            </button>
        </div>
    );
};

export default CustomToast;