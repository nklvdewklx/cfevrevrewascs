import React from 'react';

const InvoiceDetailsModal = ({ invoice, order, customer, products }) => {
    if (!invoice || !order) return null;

    const subtotal = order.items?.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.pricingTiers[0]?.price || 0;
        return sum + (price * item.quantity);
    }, 0) || 0;

    const tax = subtotal * 0.19; // Assuming a static 19% tax for now
    const total = subtotal + tax;

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
        </div>
    );
};

export default InvoiceDetailsModal;