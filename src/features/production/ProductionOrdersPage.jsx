import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Info } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ProductionOrderDetails from './ProductionOrderDetails';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const ProductionOrdersPage = () => {
    const { t } = useTranslation(); // NEW: Get translation function
    // Select data from the Redux store
    const { items: productionOrders } = useSelector((state) => state.productionOrders);
    const { items: products } = useSelector((state) => state.products);
    const { items: components } = useSelector((state) => state.components);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    // NEW: Translate table headers
    const headers = [
        t('poId'),
        t('lotNumber'),
        t('date'),
        t('productProduced'),
        t('quantity'),
        t('actions')
    ];

    const renderRow = (order) => {
        const product = products.find(p => p.id === order.productId);
        return (
            <tr key={order.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">{order.lotNumber}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">{product?.name || 'N/A'}</td>
                <td className="p-4 font-semibold">{order.quantityProduced}</td>
                <td className="p-4">
                    <button onClick={() => handleOpenModal(order)} className="text-custom-light-blue hover:text-white" title={t('viewDetails')}>
                        <Info size={16} />
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('productionOrderHistory')}</h1>
            </div>

            <DataTable headers={headers} data={productionOrders} renderRow={renderRow} />

            <Modal
                title={t('lotDetails', { lotNumber: selectedOrder?.lotNumber })}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                footer={
                    <button onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">
                        {t('close')}
                    </button>
                }
            >
                <ProductionOrderDetails order={selectedOrder} product={products.find(p => p.id === selectedOrder?.productId)} components={components} />
            </Modal>
        </div>
    );
};

export default ProductionOrdersPage;