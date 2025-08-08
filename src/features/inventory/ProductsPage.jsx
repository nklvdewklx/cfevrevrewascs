import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Archive, Plus, Factory, ArchiveRestore } from 'lucide-react'; // NEW: Import Archive icons
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ProductForm from './ProductForm';
import { addProduct, updateProduct, archiveProduct } from './productsSlice'; // NEW: Import archiveProduct
import { executeProductionOrder } from '../production/productionOrdersSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.items);
    const components = useSelector((state) => state.components.items);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isProduceModalOpen, setIsProduceModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productionQuantity, setProductionQuantity] = useState(1);
    const [statusFilter, setStatusFilter] = useState('active'); // NEW: Default filter to active

    const handleOpenFormModal = (product = null) => {
        setEditingProduct(product);
        setIsFormModalOpen(true);
    };
    const handleCloseFormModal = () => {
        setEditingProduct(null);
        setIsFormModalOpen(false);
    };

    const handleOpenProduceModal = (product) => {
        setEditingProduct(product);
        setIsProduceModalOpen(true);
    };
    const handleCloseProduceModal = () => {
        setEditingProduct(null);
        setIsProduceModalOpen(false);
        setProductionQuantity(1);
    };

    const handleSaveProduct = (productData) => {
        if (editingProduct) {
            dispatch(updateProduct({ ...productData, id: editingProduct.id }));
        } else {
            dispatch(addProduct({ ...productData, stockBatches: [] }));
        }
        handleCloseFormModal();
    };

    // NEW: Handler for archiving/restoring a product
    const handleToggleArchive = (product) => {
        const isArchiving = product.status !== 'archived';
        if (window.confirm(isArchiving ? t('confirmArchiveProduct') : t('confirmRestoreProduct'))) {
            dispatch(archiveProduct({ id: product.id, isArchived: isArchiving }));
            showToast(isArchiving ? t('productArchived') : t('productRestored'), 'success');
        }
    };

    const handleExecuteProduction = async () => {
        try {
            await dispatch(executeProductionOrder({ productId: editingProduct.id, quantityToProduce: productionQuantity })).unwrap();
            showToast(t('productionSuccess', { quantity: productionQuantity, name: editingProduct.name }), 'success');
        } catch (error) {
            showToast(t('productionFailed', { error }), 'error');
        } finally {
            handleCloseProduceModal();
        }
    };

    const headers = [
        { key: 'name', label: t('productName'), sortable: true },
        { key: 'sku', label: t('sku'), sortable: true },
        { key: 'totalStock', label: t('totalStock'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (product) => {
        const totalStock = product.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
        const isArchived = product.status === 'archived';
        let status;
        if (isArchived) {
            status = { text: t('archived'), className: 'bg-gray-600' };
        } else {
            status = totalStock === 0 ? { text: t('outOfStock'), className: 'status-cancelled' } : { text: t('inStock'), className: 'status-completed' };
        }

        const canProduce = product.bom && product.bom.length > 0;

        return (
            <tr key={product.id} className={`border-b border-white/10 last:border-b-0 ${isArchived ? 'bg-gray-800/50 text-custom-grey' : 'hover:bg-white/5'}`}>
                <td className="p-4">
                    <Link to={`/inventory/${product.id}`} className={isArchived ? 'text-gray-500' : 'text-blue-400 hover:underline'}>
                        {product.name}
                    </Link>
                </td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4 font-semibold">{totalStock}</td>
                <td className="p-4"><span className={`status-pill ${status.className}`}>{status.text}</span></td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {!isArchived && canProduce && <Button onClick={() => handleOpenProduceModal(product)} variant="ghost-glow" size="sm" className="text-green-400" title={t('produceItem')}><Factory size={16} /></Button>}
                        {!isArchived && <Button onClick={() => handleOpenFormModal(product)} variant="ghost-glow" size="sm" className="text-custom-light-blue" title={t('edit')}><Edit size={16} /></Button>}
                        {isArchived ? (
                            <Button onClick={() => handleToggleArchive(product)} variant="ghost-glow" size="sm" className="text-green-400" title={t('restoreProduct')}><ArchiveRestore size={16} /></Button>
                        ) : (
                            <Button onClick={() => handleToggleArchive(product)} variant="ghost-glow" size="sm" className="text-yellow-400" title={t('archiveProduct')}><Archive size={16} /></Button>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const productsWithStock = products.map(p => ({
        ...p,
        totalStock: p.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0,
        stockStatus: (p.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0) > 0 ? 'in-stock' : 'out-of-stock'
    }));

    const productStatusFilters = {
        activeFilters: { status: statusFilter },
        controls: (
            <div className="relative w-full md:w-48">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select w-full"
                >
                    <option value="active">{t('activeProducts')}</option>
                    <option value="archived">{t('archivedProducts')}</option>
                    <option value="">{t('allProducts')}</option>
                </select>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageInventory')}</h1>
                <Button onClick={() => handleOpenFormModal()} variant="primary" className="flex items-center space-x-2" size="sm"><Plus size={20} /><span>{t('newProduct')}</span></Button>
            </div>

            <DataTable headers={headers} data={productsWithStock} renderRow={renderRow} filters={productStatusFilters} />

            <Modal title={editingProduct ? t('editProduct') : t('createNewProduct')} isOpen={isFormModalOpen} onClose={handleCloseFormModal} footer={<></>}>
                <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={handleCloseFormModal} components={components} />
            </Modal>

            <Modal title={t('produceItemTitle', { name: editingProduct?.name })} isOpen={isProduceModalOpen} onClose={handleCloseProduceModal}
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
        </div>
    );
};

export default ProductsPage;