import React from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../../components/common/DataTable';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { defaultDb } from '../../api/defaultDb';

const AdjustmentHistoryPage = () => {
    const { t } = useTranslation();
    const { items: adjustments } = useSelector((state) => state.adjustments);
    const { items: components } = useSelector((state) => state.components);

    // CORRECTED: Get the list of all possible users directly.
    // In a production app, this might come from a dedicated 'users' slice.
    const users = defaultDb.users;

    const headers = [
        { key: 'date', label: t('date'), sortable: true },
        { key: 'componentId', label: t('component'), sortable: true },
        { key: 'type', label: t('adjustmentType'), sortable: true },
        { key: 'quantity', label: t('quantity'), sortable: true },
        { key: 'user', label: t('user'), sortable: true },
        { key: 'reason', label: t('reason'), sortable: false },
    ];

    const renderRow = (adjustment) => {
        const component = components.find(c => c.id === adjustment.componentId);
        const user = users.find(u => u.id === adjustment.userId);
        const typeClass = adjustment.type === 'add' ? 'text-green-400' : 'text-red-400';

        return (
            <tr key={adjustment.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{new Date(adjustment.date).toLocaleString()}</td>
                <td className="p-4">
                    <Link to={`/inventory/components/${component?.id}`} className="text-blue-400 hover:underline">
                        {component?.name || 'N/A'}
                    </Link>
                </td>
                <td className={`p-4 font-semibold ${typeClass}`}>{t(adjustment.type)}</td>
                <td className={`p-4 font-semibold ${typeClass}`}>
                    {adjustment.type === 'add' ? '+' : '-'}{adjustment.quantity}
                </td>
                <td className="p-4">{user?.name || 'System'}</td>
                <td className="p-4">{adjustment.reason}</td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('adjustmentHistory')}</h1>
            <DataTable headers={headers} data={adjustments} renderRow={renderRow} />
        </div>
    );
};

export default AdjustmentHistoryPage;