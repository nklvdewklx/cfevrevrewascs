import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, History, CornerUpLeft, FileMinus } from 'lucide-react';
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
    const { items: returns } = useSelector((state) => state.returns); // NEW: Get returns data
    const { items: creditNotes } = useSelector((state) => state.creditNotes); // NEW: Get credit note data

    const order = orders.find(o => o.id === parseInt(orderId));

    if (!order) {
        return <div className="text-center text-red-400">{t('orderNotFound')}</div>;
    }

    const customer = customers.find(c => c.id === order.customerId);

    // UPDATED: Create a comprehensive activity log for the order
    const getOrderActivityLog = () => {
        const activity = [];

        // Add inventory movements from the ledger
        ledgerEntries
            .filter(entry => entry.reason.includes(`Order #${order.id}`))
            .forEach(entry => {
                const product = products.find(p => p.id === entry.itemId);
                activity.push({
                    date: entry.date,
                    type: 'fulfillment',
                    description: t('fulfilledItem', { productName: product?.name || 'N/A' }),
                    details: `${entry.quantityChange} from Batch ${entry.reason.match(/\(Batch: (.*?)\)/)?.[1] || 'N/A'}`
                });
            });

        // Add any returns associated with this order
        const associatedReturn = returns.find(r => r.orderId === order.id);
        if (associatedReturn) {
            activity.push({
                date: associatedReturn.date,
                type: 'return',
                description: t('returnRequestCreated'),
                details: `RMA #${associatedReturn.rmaNumber}`
            });
        }

        // Add any credit notes associated with the return
        if (associatedReturn) {
            const associatedCreditNote = creditNotes.find(cn => cn.reason.includes(associatedReturn.rmaNumber));
            if (associatedCreditNote) {
                activity.push({
                    date: associatedCreditNote.date,
                    type: 'creditNote',
                    description: t('creditNoteIssued'),
                    details: `${associatedCreditNote.creditNoteNumber} (-$${associatedCreditNote.amount.toFixed(2)})`
                });
            }
        }

        return activity.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by most recent first
    };

    const orderActivity = getOrderActivityLog();

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-custom-light-blue">{t('orderItems')}</h3>
                    </div>
                    <DataTable headers={productHeaders} data={order.items} renderRow={renderProductRow} />
                </div>

                {/* UPDATED: Full Order Activity Log */}
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center mb-4 space-x-3">
                        <History size={20} className="text-custom-light-blue" />
                        <h3 className="text-xl font-semibold text-custom-light-blue">{t('orderActivity')}</h3>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                        {orderActivity.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 pt-1">
                                    {activity.type === 'fulfillment' && <History size={16} className="text-red-400" />}
                                    {activity.type === 'return' && <CornerUpLeft size={16} className="text-yellow-400" />}
                                    {activity.type === 'creditNote' && <FileMinus size={16} className="text-green-400" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{activity.description}</p>
                                    <p className="text-xs text-custom-grey">{activity.details}</p>
                                    <p className="text-xs text-custom-grey">{new Date(activity.date).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <h3 className="text-2xl font-bold">{t('total')}: ${calculateOrderTotal(order.items, products).toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default OrderDetailPage;