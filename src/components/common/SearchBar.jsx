import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Search } from 'lucide-react';
import { performSearch, setSearchQuery, openSearch } from '../../features/search/searchSlice';
import { useTranslation } from 'react-i18next';

const SearchBar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [localQuery, setLocalQuery] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localQuery) {
                dispatch(setSearchQuery(localQuery));
                dispatch(performSearch(localQuery));
                dispatch(openSearch());
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
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-custom-grey" />
            </div>
            <input
                type="text"
                placeholder={`${t('searchFor')}...`}
                value={localQuery}
                onChange={handleChange}
                className="form-input pl-10"
            />
        </div>
    );
};

export default SearchBar;