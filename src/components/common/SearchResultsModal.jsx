import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { X, Search, Package, ClipboardList, Users, ShoppingCart, Truck } from 'lucide-react';
import { closeSearch } from '../../features/search/searchSlice';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';

const SearchResultsModal = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isOpen, results, query } = useSelector((state) => state.search);

    const handleClose = () => {
        dispatch(closeSearch());
    };

    const hasResults = Object.values(results).some(arr => arr.length > 0);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`${t('searchResultsFor')} "${query}"`} footer={<></>}>
            <div className="space-y-4">
                {hasResults ? (
                    <>
                        <SearchResultCategory title={t('products')} items={results.products} icon={<Package size={18} />} linkPrefix="/inventory" />
                        <SearchResultCategory title={t('components')} items={results.components} icon={<ClipboardList size={18} />} linkPrefix="/inventory/components" />
                        <SearchResultCategory title={t('customers')} items={results.customers} icon={<Users size={18} />} linkPrefix="/customers" />
                        <SearchResultCategory title={t('orders')} items={results.orders} icon={<ShoppingCart size={18} />} linkPrefix="/orders" idKey="id" nameKey="id" namePrefix="#" />
                        <SearchResultCategory title={t('suppliers')} items={results.suppliers} icon={<Truck size={18} />} linkPrefix="/suppliers" />
                    </>
                ) : (
                    <div className="text-center py-8 text-custom-grey">
                        <Search size={40} className="mx-auto mb-2" />
                        <p>{t('noResultsFound')}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

const SearchResultCategory = ({ title, items, icon, linkPrefix, idKey = 'id', nameKey = 'name', namePrefix = '' }) => {
    const dispatch = useDispatch();
    if (items.length === 0) return null;

    return (
        <div>
            <h3 className="text-lg font-semibold text-custom-light-blue flex items-center space-x-2 mb-2">
                {icon}
                <span>{title}</span>
            </h3>
            <ul className="space-y-1">
                {items.slice(0, 5).map(item => (
                    <li key={item[idKey]}>
                        <Link
                            to={`${linkPrefix}/${item[idKey]}`}
                            onClick={() => dispatch(closeSearch())}
                            className="block p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            {namePrefix}{item[nameKey]}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResultsModal;