import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="flex items-center space-x-2 glass-panel rounded-lg py-2 px-4 transition-all duration-200 focus-within:border-custom-light-blue">
            <Search size={20} className="text-custom-grey" />
            <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white w-64 outline-none placeholder-custom-grey"
            />
        </div>
    );
};

export default SearchBar;