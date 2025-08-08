import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'sm', disabled = false, className = '' }) => {
    // Determine base styles for all buttons
    let buttonClasses = `
        btn-base relative inline-flex items-center justify-center 
        rounded-full transition-all duration-300 transform 
        active:scale-95 group focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-opacity-50 overflow-hidden
    `;

    // Apply variant-specific styles
    if (variant === 'primary') {
        buttonClasses += ` btn-primary`;
    } else if (variant === 'danger') {
        buttonClasses += ` btn-danger`;
    } else if (variant === 'secondary') {
        buttonClasses += ` btn-secondary`;
    } else if (variant === 'glass') {
        buttonClasses += ` btn-glass`;
    }

    // Apply size-specific styles
    if (size === 'sm') {
        buttonClasses += ` text-sm px-4 py-1`;
    } else if (size === 'md') {
        buttonClasses += ` text-base px-5 py-2`;
    } else if (size === 'lg') {
        buttonClasses += ` text-lg px-6 py-3`;
    }

    // Add disabled styling
    if (disabled) {
        buttonClasses = buttonClasses.replace(/hover:.*?(?=\s|$)/g, ''); // Remove all hover effects
        buttonClasses += ` opacity-50 cursor-not-allowed`;
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${buttonClasses} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;