import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, CheckSquare } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ReturnForm from './ReturnForm';
import { addReturn, updateReturn } from './returnsSlice';
import { addProductBatch } from '../inventory/productsSlice';
import { addCreditNote } from '../credit-notes/creditNotesSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { calculateOrderTotal } from '../../lib/dataHelpers';

const ReturnsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { items: returns } = useSelector((state) => state.returns);
    const { items: orders } = useSelector((state) => state.orders);
    const { items: customers } = useSelector((state) => state.customers);
    const { items: products } = useSelector((state) => state.products);
    const { items: creditNotes } = useSelector((state) => state.creditNotes);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSaveReturn = (returnData) => {
        if (!returnData.items || returnData.items.length === 0) {
            showToast(t('mustReturnAtLeastOneItem'), 'error');
            return;
        }

        const returnCount = returns.length + 1;
        const newReturn = {
            ...returnData,
            orderId: parseInt(returnData.orderId, 10),
            rmaNumber: `RMA-${new Date().getFullYear()}-${String(returnCount).padStart(4, '0')}`,
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            processedBy: null,
        };
        dispatch(addReturn(newReturn));
        showToast(t('returnRequestCreated'), 'success');
        handleCloseModal();
    };

    const handleProcessReturn = (rma) => {
        if (window.confirm(t('confirmProcessReturn', { rmaNumber: rma.rmaNumber }))) {
            const order = orders.find(o => o.id === rma.orderId);

            if (!order) {
                showToast(t('originalOrderNotFound'), 'error');
                return;
            }

            rma.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                const newBatch = {
                    lotNumber: `RET-${rma.rmaNumber}-${item.productId}`,
                    quantity: item.quantity,
                    expiryDate: product.shelfLifeDays ? new Date(new Date().setDate(new Date().getDate() + product.shelfLifeDays)).toISOString().split('T')[0] : null,
                    status: 'Returned - Inspection Required',
                };
                dispatch(addProductBatch({ productId: item.productId, newBatch }));
            });

            const returnedValue = calculateOrderTotal(rma.items, products);
            const creditNoteCount = creditNotes.length + 1;
            const newCreditNote = {
                creditNoteNumber: `CN-${new Date().getFullYear()}-${String(creditNoteCount).padStart(4, '0')}`,
                customerId: order.customerId,
                date: new Date().toISOString().split('T')[0],
                amount: returnedValue,
                reason: `Return RMA #${rma.rmaNumber}`,
                status: 'open',
            };
            dispatch(addCreditNote(newCreditNote));

            dispatch(updateReturn({ ...rma, status: 'processed', processedBy: user.name }));
            showToast(t('returnProcessedAndCreditNoteCreated'), 'success');
        }
    };

    const headers = [
        { key: 'rmaNumber', label: t('rmaNumber'), sortable: true },
        { key: 'orderId', label: t('originalOrder'), sortable: true },
        { key: 'customer', label: t('customer'), sortable: true },
        { key: 'date', label: t('date'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (rma) => {
        const order = orders.find(o => o.id === rma.orderId);
        const customer = customers.find(c => c.id === order?.customerId);
        const statusColors = { pending: 'status-pending', processed: 'status-completed', rejected: 'status-cancelled' };
        return (
            <tr key={rma.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4 font-mono">{rma.rmaNumber}</td>
                <td className="p-4"><Link to={`/orders/${order?.id}`} className="text-blue-400 hover:underline">#{order?.id}</Link></td>
                <td className="p-4">{customer?.name || 'N/A'}</td>
                <td className="p-4">{rma.date}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[rma.status]}`}>{t(rma.status)}</span></td>
                <td className="p-4">
                    <div className="flex space-x-2">
                        {rma.status === 'pending' && (
                            <Button onClick={() => handleProcessReturn(rma)} variant="ghost-glow" size="sm" className="text-green-400" title={t('processReturn')}>
                                <CheckSquare size={16} />
                            </Button>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const returnsWithCustomerData = returns.map(rma => {
        const order = orders.find(o => o.id === rma.orderId);
        const customer = customers.find(c => c.id === order?.customerId);
        return {
            ...rma,
            customer: customer?.name || 'N/A'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageReturns')}</h1>
                <Button onClick={handleOpenModal} variant="primary" className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>{t('newReturnRequest')}</span>
                </Button>
            </div>

            <DataTable headers={headers} data={returnsWithCustomerData} renderRow={renderRow} />

            <Modal title={t('newReturnRequest')} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <ReturnForm
                    onSave={handleSaveReturn}
                    onCancel={handleCloseModal}
                    orders={orders}
                    customers={customers}
                    products={products}
                    // NEW: Pass existing returns to the form to prevent duplicates
                    returns={returns}
                />
            </Modal>
        </div>
    );
};

export default ReturnsPage;