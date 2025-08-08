import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer'; // NEW: Import the download link component
import InvoicePdf from '../../components/documents/InvoicePdf'; // NEW: Import the PDF template

const InvoiceDetailsModal = ({ invoice, order, customer, products }) => {
    if (!invoice || !order) return null;

    const subtotal = order.items?.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.pricingTiers[0]?.price || 0;
        return sum + (price * item.quantity);
    }, 0) || 0;

    const tax = subtotal * 0.19; // Assuming a static 19% tax for now
    const total = subtotal + tax;

    // NEW: Check if all data is available before rendering the PDF link
    const isDataReady = invoice && order && customer && products;

    return (
        <div className="text-white space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-3xl font-bold">INVOICE</h3>
                    <p className="text-custom-grey">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                    <h4 className="text-2xl font-bold">ROCTEC Inc.</h4>
                    <p className="text-custom-grey">Naaldwijk, South Holland</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div>
                    <p className="text-custom-grey mb-1">BILL TO</p>
                    <p className="font-bold">{customer?.name}</p>
                    <p>{customer?.company}</p>
                </div>
                <div className="text-right">
                    <p><span className="text-custom-grey">Issue Date:</span> {invoice.issueDate}</p>
                    <p><span className="text-custom-grey">Due Date:</span> {invoice.dueDate}</p>
                </div>
            </div>

            <table className="w-full">
                <thead className="border-b-2 border-white/20">
                    <tr>
                        <th className="text-left font-semibold py-2">Description</th>
                        <th className="text-right font-semibold py-2">Quantity</th>
                        <th className="text-right font-semibold py-2">Unit Price</th>
                        <th className="text-right font-semibold py-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items?.map(item => {
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
                <div className="w-full md:w-1/2 space-y-2">
                    <div className="flex justify-between"><span className="text-custom-grey">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-custom-grey">Tax (19%)</span><span>${tax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t-2 border-white/20"><span >Total Due</span><span>${total.toFixed(2)}</span></div>
                </div>
            </div>
            {/* NEW: Download Link */}
            {isDataReady && (
                <div className="flex justify-end pt-4">
                    <PDFDownloadLink
                        document={<InvoicePdf invoice={invoice} order={order} customer={customer} products={products} />}
                        fileName={`invoice-${invoice.invoiceNumber}.pdf`}
                    >
                        {({ blob, url, loading, error }) => (
                            <button
                                className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Loading document...' : 'Download PDF'}
                            </button>
                        )}
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    );
};

export default InvoiceDetailsModal;