import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Factory } from 'lucide-react';
import DataTable from '../../components/common/DataTable';

const ProductionOrderDetailsPage = () => {
    const navigate = useNavigate();
    const { productionOrderId } = useParams();

    const productionOrders = useSelector((state) => state.productionOrders.items);
    const products = useSelector((state) => state.products.items);
    const components = useSelector((state) => state.components.items);

    const order = productionOrders.find(o => o.id === parseInt(productionOrderId));

    if (!order) {
        return <div className="text-center text-red-400">Production order not found.</div>;
    }

    const product = products.find(p => p.id === order.productId);

    const componentHeaders = [
        { key: 'componentId', label: 'Component', sortable: false },
        { key: 'supplierLotNumber', label: 'Supplier Lot #', sortable: false },
        { key: 'quantityUsed', label: 'Quantity Used', sortable: false },
    ];

    const renderComponentRow = (componentUsed) => {
        const component = components.find(c => c.id === componentUsed.componentId);
        return (
            <tr key={componentUsed.componentId} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{component?.name || 'N/A'}</td>
                <td className="p-4">{componentUsed.supplierLotNumber}</td>
                <td className="p-4">{componentUsed.quantityUsed}</td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                    <ArrowLeft size={18} />
                    <span>Back to Production Orders</span>
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">Production Order #{order.id}</h2>
                </div>
                <div className="flex justify-between items-center text-gray-400 mt-2">
                    <p className="text-sm">Lot Number: {order.lotNumber}</p>
                    <span className="text-sm">Date: {order.date}</span>
                </div>
            </div>

            {/* Production Details Card */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-3">Product Produced</h3>
                <div className="text-sm space-y-2 text-gray-300">
                    <p className="flex items-center">
                        <Factory size={14} className="mr-3" />
                        {/* UPDATED: Link to product detail page */}
                        <Link to={`/inventory/${product?.id}`} className="font-bold text-white hover:underline">
                            {product?.name || 'N/A'}
                        </Link>
                    </p>
                    <p>Quantity Produced: {order.quantityProduced}</p>
                </div>
            </div>

            {/* Components Used Table */}
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-custom-light-blue">Components Used</h3>
                </div>
                <DataTable headers={componentHeaders} data={order.componentsUsed} renderRow={renderComponentRow} />
            </div>
        </div>
    );
};

export default ProductionOrderDetailsPage;