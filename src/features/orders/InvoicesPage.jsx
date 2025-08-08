import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, CheckCircle, Trash2, Download } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import { updateInvoice, deleteInvoice } from './invoicesSlice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePdf from '../../components/documents/InvoicePdf';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const InvoicesPage = () => {
    const { t } = useTranslation(); // NEW: Get translation function
    const dispatch = useDispatch();
    const { items: invoices } = useSelector((state) => state.invoices);
    const { items: customers } = useSelector((state) => state.customers);
    const { items: orders } = useSelector((state) => state.orders);
    const { items: products } = useSelector((state) => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

    const handleOpenModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedInvoice(null);
        setIsModalOpen(false);
    };

    const handleMarkAsPaid = (invoice) => {
        if (window.confirm(t('confirmMarkAsPaid', { invoiceNumber: invoice.invoiceNumber }))) { // NEW: Translate confirmation message with variable
            dispatch(updateInvoice({ ...invoice, status: 'paid' }));
        }
    };

    const handleDelete = (invoiceId) => {
        if (window.confirm(t('confirmDeleteInvoice'))) { // NEW: Translate confirmation message
            dispatch(deleteInvoice(invoiceId));
        }
    }

    const headers = [
        { key: 'invoiceNumber', label: t('invoiceNumber'), sortable: true },
        { key: 'customerId', label: t('customer'), sortable: true },
        { key: 'orderId', label: t('orderId'), sortable: false },
        { key: 'dueDate', label: t('dueDate'), sortable: true },
        { key: 'total', label: t('total'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (invoice) => {
        const customer = customers.find(c => c.id === invoice.customerId);
        const statusColors = { paid: 'status-completed', sent: 'status-pending', overdue: 'status-cancelled' };
        const order = orders.find(o => o.id === invoice.orderId);
        const isDataReady = order && customer && products;

        return (
            <tr key={invoice.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">
                    <Link to={`/invoices/${invoice.invoiceNumber}`} className="text-blue-400 hover:underline">
                        {invoice.invoiceNumber}
                    </Link>
                </td>
                <td className="p-4">{customer?.name || 'N/A'}</td>
                <td className="p-4">#{invoice.orderId}</td>
                <td className="p-4">{invoice.dueDate}</td>
                <td className="p-4 font-semibold">${invoice.total.toFixed(2)}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[invoice.status]}`}>{t(invoice.status)}</span></td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {isDataReady && (
                            <PDFDownloadLink
                                document={<InvoicePdf invoice={invoice} order={order} customer={customer} products={products} />}
                                fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                            >
                                {({ loading }) => (
                                    <button
                                        className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                                        title={t('downloadPdf')}
                                        disabled={loading}
                                    >
                                        <Download size={16} />
                                    </button>
                                )}
                            </PDFDownloadLink>
                        )}
                        <button onClick={() => handleOpenModal(invoice)} className="text-blue-400 hover:text-blue-300" title={t('viewInvoice')}><Eye size={16} /></button>
                        {invoice.status !== 'paid' && (
                            <button onClick={() => handleMarkAsPaid(invoice)} className="text-green-400 hover:text-green-300" title={t('markAsPaid')}><CheckCircle size={16} /></button>
                        )}
                        <button onClick={() => handleDelete(invoice.id)} className="text-red-400 hover:text-red-300" title={t('deleteInvoice')}><Trash2 size={16} /></button>
                    </div>
                </td>
            </tr>
        )
    };

    const selectedOrderForModal = orders.find(o => o.id === selectedInvoice?.orderId);

    const invoiceStatusFilters = {
        activeFilters: { status: statusFilter },
        controls: (
            <div className="relative w-full md:w-48">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select w-full"
                >
                    <option value="">{t('allStatuses')}</option>
                    <option value="sent">{t('sent')}</option>
                    <option value="paid">{t('paid')}</option>
                    <option value="overdue">{t('overdue')}</option>
                </select>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('manageInvoices')}</h1>
            <DataTable headers={headers} data={invoices} renderRow={renderRow} filters={invoiceStatusFilters} />
            <Modal title={t('invoiceDetails')} isOpen={isModalOpen} onClose={handleCloseModal} footer={<button onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">{t('close')}</button>}>
                <InvoiceDetailsModal invoice={selectedInvoice} order={selectedOrderForModal} customer={customers.find(c => c.id === selectedInvoice?.customerId)} products={products} />
            </Modal>
        </div>
    );
};

export default InvoicesPage;