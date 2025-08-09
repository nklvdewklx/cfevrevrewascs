import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Search } from 'lucide-react';
import { performSearch, setSearchQuery, openSearch, closeSearch } from '../../features/search/searchSlice';
import { useTranslation } from 'react-i18next';

const SearchBar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [localQuery, setLocalQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false); // NEW: State to track focus for animation

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localQuery) {
                dispatch(setSearchQuery(localQuery));
                dispatch(performSearch(localQuery));
                dispatch(openSearch());
            } else {
                // NEW: Close search if query is cleared
                dispatch(closeSearch());
            }
        }, 500); // Debounce search

        return () => {
            clearTimeout(handler);
        };
    }, [localQuery, dispatch]);

    const handleChange = (e) => {
        setLocalQuery(e.target.value);
    };

    return (
        // MODIFIED: Restored glass-panel and added animation class conditionally
        <div
            className={`flex items-center space-x-2 glass-panel rounded-full py-2 px-4 transition-all duration-300 ${isFocused ? 'search-glow' : ''}`}
        >
            <Search size={20} className="text-custom-grey" />
            <input
                type="text"
                placeholder={`${t('searchFor')}...`}
                className="bg-transparent text-white w-64 outline-none placeholder-custom-grey"
                value={localQuery}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </div>
    );
};

export default SearchBar;