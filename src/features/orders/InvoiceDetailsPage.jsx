import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Trash2, Download } from 'lucide-react';
import { updateInvoice, deleteInvoice } from './invoicesSlice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePdf from '../../components/documents/InvoicePdf';
import { showToast } from '../../lib/toast';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';

const InvoiceDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { invoiceNumber } = useParams();

    const invoices = useSelector((state) => state.invoices.items);
    const orders = useSelector((state) => state.orders.items);
    const customers = useSelector((state) => state.customers.items);
    const products = useSelector((state) => state.products.items);

    const invoice = invoices.find(inv => inv.invoiceNumber === invoiceNumber);

    if (!invoice) {
        return <div className="text-center text-red-400">{t('invoiceNotFound')}</div>;
    }

    const order = orders.find(o => o.id === invoice.orderId);
    const customer = customers.find(c => c.id === invoice.customerId);

    const subtotal = order?.items?.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.pricingTiers[0]?.price || 0;
        return sum + (price * item.quantity);
    }, 0) || 0;

    const handleMarkAsPaid = () => {
        if (window.confirm(t('confirmMarkAsPaid', { invoiceNumber: invoice.invoiceNumber }))) {
            dispatch(updateInvoice({ ...invoice, status: 'paid' }));
            showToast(t('invoiceMarkedAsPaid'), 'success');
        }
    };

    const handleDelete = () => {
        if (window.confirm(t('confirmDeleteInvoice'))) {
            dispatch(deleteInvoice(invoice.id));
            showToast(t('invoiceDeleted'), 'success');
            navigate('/invoices');
        }
    };

    const isDataReady = order && customer && products;

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                    <ArrowLeft size={18} />
                    <span>{t('backToInvoices')}</span>
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">{t('invoiceNumberHeading', { invoiceNumber: invoice.invoiceNumber })}</h2>
                    <span className={`status-pill ${invoice.status === 'paid' ? 'status-completed' : 'status-pending'}`}>{t(invoice.status)}</span>
                </div>
            </div>

            <div className="flex space-x-4">
                {isDataReady && (
                    <PDFDownloadLink
                        document={<InvoicePdf invoice={invoice} order={order} customer={customer} products={products} />}
                        fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                    >
                        {({ loading }) => (
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg disabled:opacity-50 flex items-center space-x-2"
                                disabled={loading}
                            >
                                <Download size={16} />
                                <span>{loading ? t('generating') : t('downloadPdf')}</span>
                            </Button>
                        )}
                    </PDFDownloadLink>
                )}
                {invoice.status !== 'paid' && (
                    <Button onClick={handleMarkAsPaid} className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                        <CheckCircle size={16} />
                        <span>{t('markAsPaid')}</span>
                    </Button>
                )}
                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                    <Trash2 size={16} />
                    <span>{t('delete')}</span>
                </Button>
            </div>

            <div className="glass-panel p-6 rounded-lg">
                <div className="text-white space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-custom-grey mb-1">{t('billTo')}</p>
                            {customer && (
                                <p className="font-bold">
                                    <Link to={`/customers/${customer.id}`} className="text-blue-400 hover:underline">
                                        {customer.name}
                                    </Link>
                                </p>
                            )}
                            <p>{customer?.company}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-2xl font-bold">ROCTEC Inc.</h4>
                            <p className="text-custom-grey">{t('companyLocation')}</p>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <p><span className="text-custom-grey">{t('order')}:</span> <Link to={`/orders/${order?.id}`} className="text-blue-400 hover:underline">#{order?.id}</Link></p>
                        </div>
                        <div className="text-right">
                            <p><span className="text-custom-grey">{t('issueDate')}:</span> {invoice.issueDate}</p>
                            <p><span className="text-custom-grey">{t('dueDate')}:</span> {invoice.dueDate}</p>
                        </div>
                    </div>

                    <table className="w-full">
                        <thead className="border-b-2 border-white/20">
                            <tr>
                                <th className="text-left font-semibold py-2">{t('description')}</th>
                                <th className="text-right font-semibold py-2">{t('quantity')}</th>
                                <th className="text-right font-semibold py-2">{t('unitPrice')}</th>
                                <th className="text-right font-semibold py-2">{t('amount')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items?.map(item => {
                                const product = products.find(p => p.id === item.productId);
                                const price = product?.pricingTiers[0]?.price || 0;
                                return (
                                    <tr key={item.productId} className="border-b border-white/10">
                                        <td className="py-2">{product?.name}</td>
                                        <td className="py-2 text-right">{item.quantity}</td>
                                        <td className="py-2 text-right">${price.toFixed(2)}</td>
                                        <td className="py-2 text-right">${(price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-full md:w-1/2 lg:w-1/3 space-y-2">
                            <div className="flex justify-between"><span className="text-custom-grey">{t('subtotal')}</span><span>${subtotal.toFixed(2)}</span></div>
                            {invoice.appliedCredits?.map((credit, index) => (
                                <div key={index} className="flex justify-between text-green-400">
                                    <span className="text-custom-grey">{t('creditApplied')} (<Link to={`/credit-notes/${credit.creditNoteNumber}`} className="hover:underline">{credit.creditNoteNumber}</Link>)</span>
                                    <span>-${credit.amount.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-white/20"><span>{t('totalDue')}</span><span>${invoice.total.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailsPage;