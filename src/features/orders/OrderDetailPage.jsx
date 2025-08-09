import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, History, CornerUpLeft, FileMinus, Link as LinkIcon, User, Truck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { calculateOrderFinancials } from '../../lib/dataHelpers';
import { useTranslation } from 'react-i18next';

const OrderDetailPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { orderId } = useParams();

    const orders = useSelector((state) => state.orders.items);
    const customers = useSelector((state) => state.customers.items);
    const products = useSelector((state) => state.products.items);
    const agents = useSelector((state) => state.agents.items);
    const { items: ledgerEntries } = useSelector((state) => state.inventoryLedger);
    const { items: returns } = useSelector((state) => state.returns);
    const { items: creditNotes } = useSelector((state) => state.creditNotes);

    const order = orders.find(o => o.id === parseInt(orderId));

    if (!order) {
        return <div className="text-center text-red-400">{t('orderNotFound')}</div>;
    }

    const customer = customers.find(c => c.id === order.customerId);
    const agent = agents.find(a => a.id === order.agentId);
    const backorder = orders.find(o => o.id === order.backorderId);
    const originalOrder = orders.find(o => o.id === order.originalOrderId);

    const financials = calculateOrderFinancials(order.items, products);

    const getOrderActivityLog = () => {
        const activity = [];
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

        const associatedReturn = returns.find(r => r.orderId === order.id);
        if (associatedReturn) {
            activity.push({
                date: associatedReturn.date,
                type: 'return',
                description: t('returnRequestCreated'),
                details: `RMA #${associatedReturn.rmaNumber}`
            });
        }

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

        return activity.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const orderActivity = getOrderActivityLog();

    const handleEditOrder = () => {
        alert(t('editNotImplemented'));
    };

    const productHeaders = [
        { key: 'name', label: t('product'), sortable: false },
        { key: 'quantity', label: t('quantity'), sortable: false },
        { key: 'unitPrice', label: t('unitPrice'), sortable: false },
        { key: 'lineTotal', label: t('lineTotal'), sortable: false },
    ];

    const renderProductRow = (item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.pricingTiers[0]?.price || 0;
        return (
            <tr key={item.productId} className="border-b border-white/10 last:border-b-0">
                <td className="p-4">{product?.name || 'N/A'}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">${price.toFixed(2)}</td>
                <td className="p-4 font-semibold">${(price * item.quantity).toFixed(2)}</td>
            </tr>
        );
    };

    const statusColors = {
        pending: 'status-pending',
        completed: 'status-completed',
        shipped: 'status-shipped',
        cancelled: 'status-cancelled',
        'partially fulfilled': 'status-pending',
        backorder: 'status-pending'
    };

    const totalToCalculate = originalOrder ? originalOrder.items : order.items;


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
                    <span className={`status-pill ${statusColors[order.status]}`}>{t(order.status)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-custom-light-blue mb-3">{t('customer')}</h3>
                    <div className="text-sm space-y-2 text-gray-300">
                        <Link to={`/customers/${customer.id}`} className="font-bold text-white hover:underline">
                            {customer?.name || 'N/A'}
                        </Link>
                        <p className="flex items-center"><Mail size={14} className="mr-3" /> {customer?.email || 'N/A'}</p>
                        <p className="flex items-center"><Phone size={14} className="mr-3" /> {customer?.phone || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-custom-light-blue mb-3">{t('salesAndShipping')}</h3>
                    <div className="text-sm space-y-2 text-gray-300">
                        <p className="flex items-center"><User size={14} className="mr-3" />{t('assignedAgent')}: <Link to={`/agents/${agent?.id}`} className="font-bold text-white hover:underline ml-1">{agent?.name || 'N/A'}</Link></p>
                        {order.shippingCarrier && <p className="flex items-center"><Truck size={14} className="mr-3" />{t('shippingCarrier')}: <span className="font-bold text-white ml-1">{order.shippingCarrier}</span></p>}
                        {order.trackingNumber && <p className="flex items-center"><LinkIcon size={14} className="mr-3" />{t('trackingNumber')}: <a href="#" className="font-bold text-blue-400 hover:underline ml-1">{order.trackingNumber}</a></p>}
                    </div>
                </div>

                {(originalOrder || backorder) && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-custom-light-blue mb-3">{t('linkedOrders')}</h3>
                        <div className="text-sm space-y-2 text-gray-300">
                            {originalOrder && <p>{t('thisIsABackorderFor')}: <Link to={`/orders/${originalOrder.id}`} className="text-blue-400 font-bold hover:underline">#{originalOrder.id}</Link></p>}
                            {backorder && <p>{t('backorderCreated')}: <Link to={`/orders/${backorder.id}`} className="text-blue-400 font-bold hover:underline">#{backorder.id}</Link></p>}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-custom-light-blue mb-4">{t('originalOrderItems')}</h3>
                <DataTable headers={productHeaders} data={order.items} renderRow={renderProductRow} />
            </div>

            {order.fulfilledItems && order.fulfilledItems.length > 0 && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-custom-light-blue mb-4">{t('itemsFulfilled')}</h3>
                    <DataTable headers={productHeaders} data={order.fulfilledItems} renderRow={renderProductRow} />
                </div>
            )}

            <div className="flex justify-end pt-4">
                <div className="w-full md:w-1/3 glass-panel p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-custom-light-blue mb-2">{t('financialSummary')}</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-custom-grey">{t('subtotal')}</span><span>${financials.subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-custom-grey">{t('tax')} (19%)</span><span>${financials.tax.toFixed(2)}</span></div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-white/20"><span>{t('total')}</span><span>${financials.total.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;