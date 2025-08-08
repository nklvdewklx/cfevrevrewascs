import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-1">
                <span>{title}</span>
                <ChevronDown size={16} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-48 bg-gray-800 border border-white/10 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;