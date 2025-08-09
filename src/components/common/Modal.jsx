import React, { useEffect } from 'react'; // NEW: Import useEffect
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ title, isOpen, onClose, children, footer }) => {
    // NEW: Add a useEffect hook to handle the Escape key press
    useEffect(() => {
        // Define the function to be called on key down
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose(); // Call the onClose function passed via props
            }
        };

        // Add the event listener to the document if the modal is open
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup function: Remove the event listener when the modal closes or the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]); // Dependencies: The effect re-runs if isOpen or onClose changes

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="glass-panel rounded-lg w-full max-w-lg transform transition-all duration-300">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <Button onClick={onClose} variant="ghost" size="sm">
                        <X size={24} />
                    </Button>
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