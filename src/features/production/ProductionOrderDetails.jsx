import React from 'react';

const ProductionOrderDetails = ({ order, product, components }) => {
    if (!order) return null;

    return (
        <div className="space-y-4 text-white">
            <div>
                <p><span className="font-semibold text-custom-grey">Product:</span> {product?.name || 'N/A'}</p>
                <p><span className="font-semibold text-custom-grey">Quantity Produced:</span> {order.quantityProduced}</p>
                <p><span className="font-semibold text-custom-grey">Date:</span> {order.date}</p>
            </div>

            <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-2">Components Used</h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b-2 border-white/20">
                            <th className="text-left font-semibold py-2">Component</th>
                            <th className="text-left font-semibold py-2">Supplier Lot #</th>
                            <th className="text-right font-semibold py-2">Quantity Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.componentsUsed?.map((used, index) => {
                            const component = components.find(c => c.id === used.componentId);
                            return (
                                <tr key={index} className="border-b border-white/10 last:border-b-0">
                                    <td className="py-2">{component?.name || 'N/A'}</td>
                                    <td className="py-2">{used.supplierLotNumber}</td>
                                    <td className="py-2 text-right">{used.quantityUsed}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductionOrderDetails;