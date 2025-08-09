import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, FileText, Truck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import OrderForm from './OrderForm';
import FulfillmentModal from './FulfillmentModal';
import { addOrder, updateOrder, deleteOrder, updateFulfilledItems, createBackorder } from './ordersSlice';
import { fulfillOrderWithSpecificBatches } from '../inventory/productsSlice';
import { generateInvoiceForOrder } from './invoicesSlice';
import { showToast } from '../../lib/toast';
import { Link } from 'react-router-dom';
import { calculateOrderTotal } from '../../lib/dataHelpers';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const OrdersPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const orders = useSelector((state) => state.orders.items);
    const customers = useSelector((state) => state.customers.items);
    const products = useSelector((state) => state.products.items);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isFulfillmentModalOpen, setIsFulfillmentModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

    const handleOpenFormModal = (order = null) => {
        setEditingOrder(order);
        setIsFormModalOpen(true);
    };
    const handleCloseFormModal = () => {
        setEditingOrder(null);
        setIsFormModalOpen(false);
    };

    const handleOpenFulfillmentModal = (order) => {
        setEditingOrder(order);
        setIsFulfillmentModalOpen(true);
    };
    const handleCloseFulfillmentModal = () => {
        setEditingOrder(null);
        setIsFulfillmentModalOpen(false);
    };

    const handleSaveOrder = (orderData) => {
        if (editingOrder) {
            dispatch(updateOrder({ ...orderData, id: editingOrder.id }));
        } else {
            const newOrderData = {
                ...orderData,
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                agentId: 1
            };
            dispatch(addOrder(newOrderData));
        }
        handleCloseFormModal();
    };

    const handleDelete = (orderId) => {
        if (window.confirm(t('confirmDeleteOrder'))) {
            dispatch(deleteOrder(orderId));
        }
    };

    const handleConfirmFulfillment = async (fulfillmentData) => {
        const itemsBeingFulfilled = fulfillmentData.items.map(item => ({
            productId: item.productId,
            quantity: item.allocations.reduce((sum, alloc) => sum + (alloc.allocated || 0), 0)
        })).filter(item => item.quantity > 0);

        if (itemsBeingFulfilled.length === 0) {
            handleCloseFulfillmentModal();
            return;
        }

        try {
            await dispatch(fulfillOrderWithSpecificBatches({ order: editingOrder, fulfillmentData })).unwrap();

            if (fulfillmentData.strategy === 'backorder') {
                dispatch(createBackorder({ orderId: editingOrder.id, fulfilledItems: itemsBeingFulfilled }));
                showToast(t('backorderCreatedSuccessfully'), 'success');
            } else {
                dispatch(updateFulfilledItems({ orderId: editingOrder.id, fulfilledItems: itemsBeingFulfilled }));

                const originalItemsMap = new Map(editingOrder.items.map(i => [i.productId, i.quantity]));
                const fulfilledItemsMap = new Map();
                (editingOrder.fulfilledItems || []).forEach(item => {
                    fulfilledItemsMap.set(item.productId, (fulfilledItemsMap.get(item.productId) || 0) + item.quantity);
                });
                itemsBeingFulfilled.forEach(item => {
                    fulfilledItemsMap.set(item.productId, (fulfilledItemsMap.get(item.productId) || 0) + item.quantity);
                });

                let isFullyFulfilled = true;
                for (const [productId, quantity] of originalItemsMap) {
                    if ((fulfilledItemsMap.get(productId) || 0) < quantity) {
                        isFullyFulfilled = false;
                        break;
                    }
                }

                const newStatus = isFullyFulfilled ? 'completed' : 'partially fulfilled';
                dispatch(updateOrder({ ...editingOrder, status: newStatus }));

                showToast(t('orderFulfilledSuccessfully'), 'success');
            }
        } catch (error) {
            showToast(t('orderFailed', { error: error.message }), 'error');
        } finally {
            handleCloseFulfillmentModal();
        }
    };

    const handleGenerateInvoice = async (order) => {
        try {
            await dispatch(generateInvoiceForOrder(order)).unwrap();
            showToast(t('invoiceGenerated'), 'success');
        } catch (error) {
            showToast(t('invoiceFailed', { error: error.message }), 'error');
        }
    };

    const headers = [
        { key: 'id', label: t('orderId'), sortable: true },
        { key: 'customerId', label: t('customer'), sortable: true },
        { key: 'date', label: t('date'), sortable: true },
        { key: 'total', label: t('total'), sortable: false },
        { key: 'status', label: t('status'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (order) => {
        const customer = customers.find(c => c.id === order.customerId);
        const total = calculateOrderTotal(order.items, products);
        const statusColors = {
            pending: 'status-pending',
            completed: 'status-completed',
            shipped: 'status-shipped',
            cancelled: 'status-cancelled',
            'partially fulfilled': 'status-pending',
            backorder: 'status-pending'
        };

        return (
            <tr key={order.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">
                    <Link to={`/orders/${order.id}`} className="text-blue-400 hover:underline">
                        #{order.id}
                    </Link>
                </td>
                <td className="p-4">{customer?.name || 'N/A'}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4 font-semibold">${total.toFixed(2)}</td>
                <td className="p-4">
                    <span className={`status-pill ${statusColors[order.status] || ''}`}>{t(order.status)}</span>
                </td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {(order.status === 'pending' || order.status === 'partially fulfilled' || order.status === 'backorder') && <Button onClick={() => handleOpenFulfillmentModal(order)} variant="ghost-glow" className="text-green-400" title={t('fulfillOrder')}><Truck size={16} /></Button>}
                        {(order.status === 'completed' || order.status === 'partially fulfilled') && <Button onClick={() => handleGenerateInvoice(order)} variant="ghost-glow" className="text-yellow-400" title={t('generateInvoice')}><FileText size={16} /></Button>}
                        <Button onClick={() => handleOpenFormModal(order)} variant="ghost-glow" className="text-custom-light-blue" title={t('edit')}><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(order.id)} variant="ghost-glow" className="text-red-400" title={t('delete')}><Trash2 size={16} /></Button>
                    </div>
                </td>
            </tr>
        );
    };

    const orderStatusFilters = {
        activeFilters: { status: statusFilter },
        controls: (
            <div className="relative w-full md:w-48">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select w-full"
                >
                    <option value="">{t('allStatuses')}</option>
                    <option value="pending">{t('pending')}</option>
                    <option value="backorder">{t('backorder')}</option>
                    <option value="partially fulfilled">{t('partiallyFulfilled')}</option>
                    <option value="completed">{t('completed')}</option>
                    <option value="shipped">{t('shipped')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                </select>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageOrders')}</h1>
                <Button onClick={() => handleOpenFormModal()} variant="primary" className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>{t('newOrder')}</span>
                </Button>
            </div>
            <DataTable headers={headers} data={orders} renderRow={renderRow} filters={orderStatusFilters} />
            <Modal title={editingOrder ? t('editOrder') : t('createNewOrder')} isOpen={isFormModalOpen} onClose={handleCloseFormModal} footer={<></>}>
                <OrderForm order={editingOrder} onSave={handleSaveOrder} onCancel={handleCloseFormModal} customers={customers} products={products} />
            </Modal>
            <Modal title={`${t('fulfillOrder')} #${editingOrder?.id}`} isOpen={isFulfillmentModalOpen} onClose={handleCloseFulfillmentModal} footer={<></>}>
                {editingOrder && <FulfillmentModal order={editingOrder} onCancel={handleCloseFulfillmentModal} onConfirm={handleConfirmFulfillment} />}
            </Modal>
        </div>
    );
};

export default OrdersPage;