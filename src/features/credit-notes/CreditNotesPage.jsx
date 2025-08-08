import React from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../../components/common/DataTable';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CreditNotesPage = () => {
    const { t } = useTranslation();
    const { items: creditNotes } = useSelector((state) => state.creditNotes);
    const { items: customers } = useSelector((state) => state.customers);

    const headers = [
        { key: 'creditNoteNumber', label: t('creditNoteNumber'), sortable: true },
        { key: 'customer', label: t('customer'), sortable: true },
        { key: 'date', label: t('date'), sortable: true },
        { key: 'amount', label: t('amount'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
    ];

    const renderRow = (cn) => {
        const customer = customers.find(c => c.id === cn.customerId);
        const statusColors = { open: 'status-pending', applied: 'status-completed', void: 'status-cancelled' };
        return (
            <tr key={cn.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4 font-mono">{cn.creditNoteNumber}</td>
                <td className="p-4">
                    <Link to={`/customers/${customer?.id}`} className="text-blue-400 hover:underline">
                        {customer?.name || 'N/A'}
                    </Link>
                </td>
                <td className="p-4">{cn.date}</td>
                <td className="p-4 font-semibold">${cn.amount.toFixed(2)}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[cn.status]}`}>{t(cn.status)}</span></td>
            </tr>
        );
    };

    const creditNotesWithCustomer = creditNotes.map(cn => {
        const customer = customers.find(c => c.id === cn.customerId);
        return { ...cn, customer: customer?.name || 'N/A' };
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('manageCreditNotes')}</h1>
            <DataTable headers={headers} data={creditNotesWithCustomer} renderRow={renderRow} />
        </div>
    );
};

export default CreditNotesPage;