import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Factory, Check, X } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ProductForm from './ProductForm';
import { updateProduct, updateStockBatch } from './productsSlice'; // UPDATED: Import updateStockBatch
import { addLedgerEntry } from './inventoryLedgerSlice'; // NEW: Import for logging
import { executeProductionOrder } from '../production/productionOrdersSlice';
import { showToast } from '../../lib/toast';
import { useTranslation } from 'react-i18next';

const ProductDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { productId } = useParams();

    const { items: products } = useSelector((state) => state.products);
    const { items: components } = useSelector((state) => state.components);
    const { user } = useSelector((state) => state.auth); // NEW: Get user for logging

    const product = products.find(p => p.id === parseInt(productId));

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isProduceModalOpen, setIsProduceModalOpen] = useState(false);
    const [productionQuantity, setProductionQuantity] = useState(1);

    if (!product) {
        return <div className="text-center text-red-400">{t('productNotFound')}</div>;
    }

    const handleOpenFormModal = () => setIsFormModalOpen(true);
    const handleCloseFormModal = () => setIsFormModalOpen(false);
    const handleOpenProduceModal = () => setIsProduceModalOpen(true);
    const handleCloseProduceModal = () => {
        setIsProduceModalOpen(false);
        setProductionQuantity(1);
    };

    const handleSaveProduct = (productData) => {
        dispatch(updateProduct({ ...productData, id: product.id }));
        handleCloseFormModal();
        showToast(t('productUpdated'), 'success');
    };

    const handleExecuteProduction = async () => {
        try {
            await dispatch(executeProductionOrder({ productId: product.id, quantityToProduce: productionQuantity })).unwrap();
            showToast(t('productionSuccess', { quantity: productionQuantity, name: product.name }), 'success');
        } catch (error) {
            showToast(t('productionFailed', { error }), 'error');
        } finally {
            handleCloseProduceModal();
        }
    };

    // NEW: Handler for inspecting and updating a batch status
    const handleBatchInspection = (lotNumber, newStatus) => {
        if (window.confirm(t('confirmBatchStatusChange', { lotNumber, status: newStatus }))) {
            const updates = { status: newStatus };
            dispatch(updateStockBatch({ productId: product.id, lotNumber, updates }));

            // Log this action to the inventory ledger
            dispatch(addLedgerEntry({
                itemType: 'product',
                itemId: product.id,
                quantityChange: 0, // No quantity change, just a status update
                reason: `Inspection: Batch ${lotNumber} status changed to ${newStatus}`,
                userId: user.id
            }));

            showToast(t('batchStatusUpdated'), 'success');
        }
    };

    const totalStock = product.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;

    const stockBatchesHeaders = [
        { key: 'lotNumber', label: t('lotNumber'), sortable: true },
        { key: 'quantity', label: t('quantity'), sortable: true },
        { key: 'expiryDate', label: t('expiryDate'), sortable: true },
        { key: 'status', label: t('status'), sortable: true }, // NEW: Status column
        { key: 'actions', label: t('actions'), sortable: false }, // NEW: Actions column
    ];

    const pricingTiersHeaders = [ /* ... no changes ... */];
    const bomHeaders = [ /* ... no changes ... */];
    const renderBomRow = (bomItem) => { /* ... no changes ... */ };
    const renderPricingRow = (tier) => { /* ... no changes ... */ };

    // UPDATED: Render function for stock batches to include status and actions
    const renderStockBatchRow = (batch) => {
        const isInspectionRequired = batch.status === 'Returned - Inspection Required';
        let statusPillClass = 'bg-gray-700';
        if (isInspectionRequired) statusPillClass = 'status-pending animate-pulse';
        if (batch.status === 'Quarantined') statusPillClass = 'status-cancelled';
        if (batch.status === 'Sellable') statusPillClass = 'status-completed';

        return (
            <tr key={batch.lotNumber} className="border-b border-white/10 last:border-b-0">
                <td className="p-4 font-mono">{batch.lotNumber}</td>
                <td className="p-4">{batch.quantity}</td>
                <td className="p-4">{batch.expiryDate || 'N/A'}</td>
                <td className="p-4">
                    <span className={`status-pill ${statusPillClass}`}>{batch.status || t('sellable')}</span>
                </td>
                <td className="p-4">
                    {isInspectionRequired && (
                        <div className="flex space-x-2">
                            <Button onClick={() => handleBatchInspection(batch.lotNumber, 'Sellable')} variant="ghost-glow" size="sm" className="text-green-400" title={t('markAsSellable')}>
                                <Check size={16} />
                            </Button>
                            <Button onClick={() => handleBatchInspection(batch.lotNumber, 'Quarantined')} variant="ghost-glow" size="sm" className="text-red-400" title={t('markAsQuarantined')}>
                                <X size={16} />
                            </Button>
                        </div>
                    )}
                </td>
            </tr>
        );
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                        <ArrowLeft size={18} />
                        <span>{t('backToInventory')}</span>
                    </button>
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">{product.name}</h2>
                        <Button onClick={handleOpenFormModal} variant='ghost-glow' className="text-custom-light-blue" title={t('editProduct')}>
                            <Edit size={20} />
                        </Button>
                    </div>
                    <p className="text-gray-400">SKU: {product.sku}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('totalStock')}</h3>
                        <p className="text-3xl font-bold">{totalStock}</p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('cost')}</h3>
                        <p className="text-3xl font-bold">${product.cost.toFixed(2)}</p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('shelfLife')}</h3>
                        <p className="text-3xl font-bold">{product.shelfLifeDays} {t('days')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-custom-light-blue mb-4">{t('stockBatches')}</h3>
                        <DataTable headers={stockBatchesHeaders} data={product.stockBatches} renderRow={renderStockBatchRow} />
                    </div>
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-custom-light-blue mb-4">{t('pricingTiers')}</h3>
                        <DataTable headers={pricingTiersHeaders} data={product.pricingTiers} renderRow={renderPricingRow} />
                    </div>
                </div>

                <div className="glass-panel p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-custom-light-blue">{t('billOfMaterials')}</h3>
                        {product.bom && product.bom.length > 0 && (
                            <Button onClick={handleOpenProduceModal} variant='primary' size="sm" className="flex items-center space-x-2">
                                <Factory size={16} />
                                <span>{t('produce')}</span>
                            </Button>
                        )}
                    </div>
                    <DataTable headers={bomHeaders} data={product.bom} renderRow={renderBomRow} />
                </div>
            </div>

            {/* Modals */}
            <Modal title={t('editProduct')} isOpen={isFormModalOpen} onClose={handleCloseFormModal} footer={<></>}>
                <ProductForm product={product} onSave={handleSaveProduct} onCancel={handleCloseFormModal} components={components} />
            </Modal>

            <Modal title={t('produceItemTitle', { name: product?.name })} isOpen={isProduceModalOpen} onClose={handleCloseProduceModal}
                footer={
                    <>
                        <Button onClick={handleCloseProduceModal} variant="secondary" size="sm">{t('cancel')}</Button>
                        <Button onClick={handleExecuteProduction} variant="primary" size="sm">{t('produce')}</Button>
                    </>
                }
            >
                <div className="text-white">
                    <label className="block mb-1 text-sm text-custom-grey">{t('quantityToProduce')}</label>
                    <input type="number" value={productionQuantity} onChange={(e) => setProductionQuantity(parseInt(e.target.value, 10))} className="form-input" min="1" />
                </div>
            </Modal>
        </>
    );
};

export default ProductDetailsPage;