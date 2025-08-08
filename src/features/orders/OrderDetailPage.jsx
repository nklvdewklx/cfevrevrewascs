import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, History } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { calculateOrderTotal } from '../../lib/dataHelpers';
import { useTranslation } from 'react-i18next';

const OrderDetailPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { orderId } = useParams();

    const orders = useSelector((state) => state.orders.items);
    const customers = useSelector((state) => state.customers.items);
    const products = useSelector((state) => state.products.items);
    const { items: ledgerEntries } = useSelector((state) => state.inventoryLedger);

    const order = orders.find(o => o.id === parseInt(orderId));

    if (!order) {
        return <div className="text-center text-red-400">{t('orderNotFound')}</div>;
    }

    const customer = customers.find(c => c.id === order.customerId);

    const orderHistory = ledgerEntries.filter(entry => entry.reason.includes(`Order #${order.id}`));


    const handleEditOrder = () => {
        alert(t('editNotImplemented'));
    };

    const productHeaders = [
        { key: 'name', label: t('product'), sortable: true },
        { key: 'quantity', label: t('quantity'), sortable: true },
    ];

    const renderProductRow = (item) => {
        const product = products.find(p => p.id === item.productId);
        return (
            <tr key={item.productId} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{product?.name || 'N/A'}</td>
                <td className="p-4">{item.quantity}</td>
            </tr>
        );
    };

    const historyHeaders = [
        { key: 'date', label: t('date'), sortable: true },
        { key: 'product', label: t('product'), sortable: false },
        { key: 'change', label: t('change'), sortable: false },
        { key: 'batch', label: t('batch'), sortable: false },
    ];

    const renderHistoryRow = (entry) => {
        const product = products.find(p => p.id === entry.itemId);
        const batchNumber = entry.reason.match(/\(Batch: (.*?)\)/)?.[1] || 'N/A';
        return (
            <tr key={entry.id} className="border-b border-white/10 last:border-b-0">
                <td className="p-4">{new Date(entry.date).toLocaleString()}</td>
                <td className="p-4">{product?.name || 'N/A'}</td>
                <td className="p-4 font-semibold text-red-400">{entry.quantityChange}</td>
                <td className="p-4 font-mono">{batchNumber}</td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                    <ArrowLeft size={18} />
                    <span>{t('backToOrders')}</span>
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">{t('orderNumber', { id: order.id })}</h2>
                    <button onClick={handleEditOrder} className="text-custom-light-blue hover:text-white" title={t('editOrder')}>
                        <Edit size={20} />
                    </button>
                </div>
                <div className="flex justify-between items-center text-gray-400 mt-2">
                    <p className="text-sm">{t('date')}: {order.date}</p>
                    <span className={`status-pill status-${order.status}`}>{t(order.status)}</span>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-3">{t('customer')}</h3>
                <div className="text-sm space-y-2 text-gray-300">
                    <Link to={`/customers/${customer.id}`} className="font-bold text-white hover:underline">
                        {customer?.name || 'N/A'}
                    </Link>
                    <p>{customer?.company || 'N/A'}</p>
                    <p className="flex items-center"><Mail size={14} className="mr-3" /> {customer?.email || 'N/A'}</p>
                    <p className="flex items-center"><Phone size={14} className="mr-3" /> {customer?.phone || 'N/A'}</p>
                </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-custom-light-blue">{t('orderItems')}</h3>
                </div>
                <DataTable headers={productHeaders} data={order.items} renderRow={renderProductRow} />
            </div>

            {orderHistory.length > 0 && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-4 space-x-3">
                        <History size={20} className="text-custom-light-blue" />
                        <h3 className="text-xl font-semibold text-custom-light-blue">{t('orderHistory')}</h3>
                    </div>
                    <DataTable headers={historyHeaders} data={orderHistory} renderRow={renderHistoryRow} />
                </div>
            )}

            <div className="flex justify-end pt-4">
                <h3 className="text-2xl font-bold">{t('total')}: ${calculateOrderTotal(order.items, products).toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default OrderDetailPage;