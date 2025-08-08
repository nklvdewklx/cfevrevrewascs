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

    const calculateOrderTotal = (orderItems) => {
        if (!orderItems) return 0;
        return orderItems.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            const price = product?.pricingTiers[0]?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const headers = ['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'];

    const renderRow = (order) => {
        const customer = customers.find(c => c.id === order.customerId);
        const total = calculateOrderTotal(order.items);
        const statusColors = { pending: 'status-pending', completed: 'status-completed', shipped: 'status-shipped', cancelled: 'status-cancelled' };

        return (
            <tr key={order.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{customer?.name || 'N/A'}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4 font-semibold">${total.toFixed(2)}</td>
                <td className="p-4">
                    <span className={`status-pill ${statusColors[order.status] || ''}`}>{order.status}</span>
                </td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {order.status === 'pending' && <button onClick={() => handleCompleteOrder(order)} className="text-green-400 hover:text-green-300" title="Complete Order"><CheckCircle size={16} /></button>}
                        {order.status === 'completed' && <button onClick={() => handleGenerateInvoice(order)} className="text-yellow-400 hover:text-yellow-300" title="Generate Invoice"><FileText size={16} /></button>}
                        <button onClick={() => handleOpenModal(order)} className="text-custom-light-blue hover:text-white"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(order.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Order</span>
                </button>
            </div>
            <DataTable headers={headers} data={orders} renderRow={renderRow} />
            <Modal title={editingOrder ? 'Edit Order' : 'Create New Order'} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <OrderForm order={editingOrder} onSave={handleSaveOrder} onCancel={handleCloseModal} customers={customers} products={products} />
            </Modal>
        </div>
    );
};

export default OrdersPage;