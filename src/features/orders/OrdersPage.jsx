import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, CheckCircle, FileText } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import OrderForm from './OrderForm';
import { addOrder, updateOrder, deleteOrder } from './ordersSlice';
import { adjustStockForOrder } from '../inventory/productsSlice';
import { generateInvoiceForOrder } from './invoicesSlice';
import { showToast } from '../../lib/toast';
import { Link } from 'react-router-dom';
import { calculateOrderTotal } from '../../lib/dataHelpers';
import Button from '../../components/common/Button';

const OrdersPage = () => {
    const dispatch = useDispatch();

    const orders = useSelector((state) => state.orders.items);
    const customers = useSelector((state) => state.customers.items);
    const products = useSelector((state) => state.products.items);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    const handleOpenModal = (order = null) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingOrder(null);
        setIsModalOpen(false);
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
        handleCloseModal();
    };

    const handleDelete = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            dispatch(deleteOrder(orderId));
        }
    };

    const handleCompleteOrder = async (order) => {
        if (order.status !== 'pending') {
            showToast('This order has already been processed.', 'info');
            return;
        }

        try {
            await dispatch(adjustStockForOrder(order)).unwrap();
            dispatch(updateOrder({ ...order, status: 'completed' }));
            showToast('Order completed and stock adjusted!', 'success');
        } catch (error) {
            showToast(`Failed to complete order: ${error}`, 'error');
        }
    };

    const handleGenerateInvoice = async (order) => {
        try {
            await dispatch(generateInvoiceForOrder(order)).unwrap();
            showToast('Invoice generated successfully!', 'success');
        } catch (error) {
            showToast(`Failed to generate invoice: ${error}`, 'error');
        }
    };

    const headers = [
        { key: 'id', label: 'Order ID', sortable: true },
        { key: 'customerId', label: 'Customer', sortable: true },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'total', label: 'Total', sortable: false },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false },
    ];

    const renderRow = (order) => {
        const customer = customers.find(c => c.id === order.customerId);
        const total = calculateOrderTotal(order.items, products);
        const statusColors = { pending: 'status-pending', completed: 'status-completed', shipped: 'status-shipped', cancelled: 'status-cancelled' };

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
                    <span className={`status-pill ${statusColors[order.status] || ''}`}>{order.status}</span>
                </td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {order.status === 'pending' && <Button onClick={() => handleCompleteOrder(order)} variant="ghost-glow" className="text-green-400" title="Complete Order"><CheckCircle size={16} /></Button>}
                        {order.status === 'completed' && <Button onClick={() => handleGenerateInvoice(order)} variant="ghost-glow" className="text-yellow-400" title="Generate Invoice"><FileText size={16} /></Button>}
                        <Button onClick={() => handleOpenModal(order)} variant="ghost-glow" className="text-custom-light-blue" title="Edit"><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(order.id)} variant="ghost-glow" className="text-red-400" title="Delete"><Trash2 size={16} /></Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
                <Button onClick={() => handleOpenModal()} variant="primary" className="flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Order</span>
                </Button>
            </div>
            <DataTable headers={headers} data={orders} renderRow={renderRow} />
            <Modal title={editingOrder ? 'Edit Order' : 'Create New Order'} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <OrderForm order={editingOrder} onSave={handleSaveOrder} onCancel={handleCloseModal} customers={customers} products={products} />
            </Modal>
        </div>
    );
};

export default OrdersPage;