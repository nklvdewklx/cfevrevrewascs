import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye, CheckCircle, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import { updateInvoice, deleteInvoice } from './invoicesSlice';

const InvoicesPage = () => {
    const dispatch = useDispatch();
    const { items: invoices } = useSelector((state) => state.invoices);
    const { items: customers } = useSelector((state) => state.customers);
    const { items: orders } = useSelector((state) => state.orders);
    const { items: products } = useSelector((state) => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const handleOpenModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedInvoice(null);
        setIsModalOpen(false);
    };

    const handleMarkAsPaid = (invoice) => {
        if (window.confirm(`Mark invoice ${invoice.invoiceNumber} as paid?`)) {
            dispatch(updateInvoice({ ...invoice, status: 'paid' }));
        }
    };

    const handleDelete = (invoiceId) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            dispatch(deleteInvoice(invoiceId));
        }
    }

    const headers = ['Invoice #', 'Customer', 'Order ID', 'Due Date', 'Total', 'Status', 'Actions'];

    const renderRow = (invoice) => {
        const customer = customers.find(c => c.id === invoice.customerId);
        const statusColors = { paid: 'status-completed', sent: 'status-pending', overdue: 'status-cancelled' };

        return (
            <tr key={invoice.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{invoice.invoiceNumber}</td>
                <td className="p-4">{customer?.name || 'N/A'}</td>
                <td className="p-4">#{invoice.orderId}</td>
                <td className="p-4">{invoice.dueDate}</td>
                <td className="p-4 font-semibold">${invoice.total.toFixed(2)}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[invoice.status]}`}>{invoice.status}</span></td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        <button onClick={() => handleOpenModal(invoice)} className="text-blue-400 hover:text-blue-300" title="View Invoice"><Eye size={16} /></button>
                        {invoice.status !== 'paid' && (
                            <button onClick={() => handleMarkAsPaid(invoice)} className="text-green-400 hover:text-green-300" title="Mark as Paid"><CheckCircle size={16} /></button>
                        )}
                        <button onClick={() => handleDelete(invoice.id)} className="text-red-400 hover:text-red-300" title="Delete Invoice"><Trash2 size={16} /></button>
                    </div>
                </td>
            </tr>
        )
    };

    const selectedOrderForModal = orders.find(o => o.id === selectedInvoice?.orderId);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Manage Invoices</h1>
            <DataTable headers={headers} data={invoices} renderRow={renderRow} />
            <Modal title="Invoice Details" isOpen={isModalOpen} onClose={handleCloseModal} footer={<button onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">Close</button>}>
                <InvoiceDetailsModal invoice={selectedInvoice} order={selectedOrderForModal} customer={customers.find(c => c.id === selectedInvoice?.customerId)} products={products} />
            </Modal>
        </div>
    );
};

export default InvoicesPage;