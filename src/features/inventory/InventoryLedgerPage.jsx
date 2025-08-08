import React from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../../components/common/DataTable';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { defaultDb } from '../../api/defaultDb'; // NEW: Import defaultDb

const InventoryLedgerPage = () => {
    const { t } = useTranslation();
    const { items: ledgerEntries } = useSelector((state) => state.inventoryLedger);
    const { items: components } = useSelector((state) => state.components);
    const { items: products } = useSelector((state) => state.products);

    // CORRECTED: Get the list of users from our default DB to prevent crash
    const users = defaultDb.users;

    const headers = [
        { key: 'date', label: t('date'), sortable: true },
        { key: 'item', label: t('item'), sortable: false },
        { key: 'change', label: t('change'), sortable: false },
        { key: 'reason', label: t('reason'), sortable: true },
        { key: 'user', label: t('user'), sortable: true },
    ];

    const renderRow = (entry) => {
        const item = entry.itemType === 'product'
            ? products.find(p => p.id === entry.itemId)
            : components.find(c => c.id === entry.itemId);

        const user = users.find(u => u.id === entry.userId);
        const changeClass = entry.quantityChange > 0 ? 'text-green-400' : 'text-red-400';
        const changeSign = entry.quantityChange > 0 ? '+' : '';

        return (
            <tr key={entry.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{new Date(entry.date).toLocaleString()}</td>
                <td className="p-4">
                    {item ? (
                        <Link
                            to={entry.itemType === 'product' ? `/inventory/${item.id}` : `/inventory/components/${item.id}`}
                            className="text-blue-400 hover:underline"
                        >
                            {item.name}
                        </Link>
                    ) : 'N/A'}
                </td>
                <td className={`p-4 font-semibold ${changeClass}`}>{changeSign}{entry.quantityChange}</td>
                <td className="p-4">{entry.reason}</td>
                <td className="p-4">{user?.name || 'System'}</td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('inventoryLedger')}</h1>
            <DataTable headers={headers} data={ledgerEntries} renderRow={renderRow} />
        </div>
    );
};

export default InventoryLedgerPage;