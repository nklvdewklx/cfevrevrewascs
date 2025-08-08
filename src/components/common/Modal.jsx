import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, isOpen, onClose, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="glass-panel rounded-lg w-full max-w-lg transform transition-all duration-300">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-custom-grey hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                <div className="p-4 bg-black/20 flex justify-end space-x-4">
                    {footer}
                </div>
            </div>
        </div>
    );
};

export default Modal;