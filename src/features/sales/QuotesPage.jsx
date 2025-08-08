import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, FilePlus2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import QuoteForm from './QuoteForm';
import { addQuote, updateQuote } from '../orders/quotesSlice';
import { addOrder } from '../orders/ordersSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';

const QuotesPage = () => {
    const dispatch = useDispatch();
    const { items: quotes } = useSelector((state) => state.quotes);
    const { items: customers } = useSelector((state) => state.customers);
    const { items: leads } = useSelector((state) => state.leads);
    const { items: products } = useSelector((state) => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuote, setEditingQuote] = useState(null);

    const handleOpenModal = (quote = null) => {
        setEditingQuote(quote);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingQuote(null);
        setIsModalOpen(false);
    };

    const handleSaveQuote = (data) => {
        const quoteData = {
            ...data,
            customerId: data.customerId ? parseInt(data.customerId) : null,
            leadId: data.leadId ? parseInt(data.leadId) : null,
        };
        if (editingQuote) {
            dispatch(updateQuote({ ...quoteData, id: editingQuote.id }));
        } else {
            const quoteCount = quotes.length + 1;
            dispatch(addQuote({ ...quoteData, quoteNumber: `Q-2025-${String(quoteCount).padStart(3, '0')}` }));
        }
        handleCloseModal();
    };

    // --- NEW: Business Logic for Quote to Order Conversion ---
    const handleConvertToOrder = (quote) => {
        if (quote.status !== 'accepted') {
            showToast('Only accepted quotes can be converted.', 'error');
            return;
        }
        if (window.confirm(`Create a new order from Quote #${quote.quoteNumber}? The quote will be marked as 'Converted'.`)) {
            const newOrderData = {
                customerId: quote.customerId,
                agentId: 1, // Placeholder
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                items: quote.items,
                signature: null
            };
            dispatch(addOrder(newOrderData));
            dispatch(updateQuote({ ...quote, status: 'converted' }));
            showToast(`Quote converted to new Order!`, 'success');
        }
    };

    const headers = ['Quote #', 'Recipient', 'Date', 'Status', 'Actions'];

    const renderRow = (quote) => {
        const recipient = quote.customerId ? customers.find(c => c.id === quote.customerId) : leads.find(l => l.id === quote.leadId);
        const statusColors = { draft: 'bg-gray-500', sent: 'bg-blue-500', accepted: 'status-completed', rejected: 'status-cancelled', converted: 'bg-purple-600' };

        return (
            <tr key={quote.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{quote.quoteNumber}</td>
                <td className="p-4">{recipient?.name || 'N/A'}</td>
                <td className="p-4">{quote.date}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[quote.status]}`}>{quote.status}</span></td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {quote.status === 'accepted' && (
                            <button onClick={() => handleConvertToOrder(quote)} className="text-green-400 hover:text-green-300" title="Create Order from Quote">
                                <FilePlus2 size={16} />
                            </button>
                        )}
                        <button onClick={() => handleOpenModal(quote)} className="text-custom-light-blue hover:text-white"><Edit size={16} /></button>
                        <button onClick={() => { }} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Quotes</h1>
                <Button onClick={() => handleOpenModal()} variant="primary" className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Quote</span>
                </Button>
            </div>
            <DataTable headers={headers} data={quotes} renderRow={renderRow} />
            <Modal title={editingQuote ? 'Edit Quote' : 'New Quote'} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <QuoteForm quote={editingQuote} onSave={handleSaveQuote} onCancel={handleCloseModal} customers={customers} leads={leads} products={products} />
            </Modal>
        </div>
    );
};

export default QuotesPage;