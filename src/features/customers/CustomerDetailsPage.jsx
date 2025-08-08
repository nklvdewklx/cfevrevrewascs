import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, ShoppingCart } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const CustomerDetailsPage = () => {
    const { t } = useTranslation(); // NEW: Get translation function
    const navigate = useNavigate();
    const { customerId } = useParams();

    const customers = useSelector((state) => state.customers.items);
    const orders = useSelector((state) => state.orders.items);

    const customer = customers.find(c => c.id === parseInt(customerId));

    if (!customer) {
        return <div className="text-center text-red-400">{t('customerNotFound')}</div>;
    }

    const customerOrders = orders.filter(o => o.customerId === customer.id).sort((a, b) => b.id - a.id);

    // Placeholder for editing customer details
    const handleEditCustomer = () => {
        alert(t('editNotImplemented'));
    };

    const orderHeaders = [
        { key: 'id', label: t('orderId'), sortable: true },
        { key: 'date', label: t('date'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
    ];

    const renderOrderRow = (order) => {
        const statusColors = { pending: 'status-pending', completed: 'status-completed', shipped: 'status-shipped', cancelled: 'status-cancelled' };

        return (
            <tr key={order.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">
                    <Link to={`/orders/${order.id}`} className="text-blue-400 hover:underline">
                        #{order.id}
                    </Link>
                </td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">
                    <span className={`status-pill ${statusColors[order.status] || ''}`}>{t(order.status)}</span>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                    <ArrowLeft size={18} />
                    <span>{t('backToCustomers')}</span>
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">{customer.name}</h2>
                    <button onClick={handleEditCustomer} className="text-custom-light-blue hover:text-white" title={t('editCustomer')}>
                        <Edit size={20} />
                    </button>
                </div>
                <p className="text-gray-400">{customer.company}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-3">{t('contactInfo')}</h3>
                <div className="text-sm space-y-2 text-gray-300">
                    <p className="flex items-center"><Mail size={14} className="mr-3" /> {customer.email || 'N/A'}</p>
                    <p className="flex items-center"><Phone size={14} className="mr-3" /> {customer.phone || 'N/A'}</p>
                </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-custom-light-blue">{t('recentOrders')}</h3>
                    <Link to="/orders" className="flex items-center space-x-2 text-blue-400 hover:underline">
                        <ShoppingCart size={16} />
                        <span>{t('viewAllOrders')}</span>
                    </Link>
                </div>
                <DataTable headers={orderHeaders} data={customerOrders} renderRow={renderOrderRow} />
            </div>
        </div>
    );
};

export default CustomerDetailsPage;