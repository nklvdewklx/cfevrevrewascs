import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, Factory } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ProductForm from './ProductForm';
import { addProduct, updateProduct } from './productsSlice';
import { executeProductionOrder } from '../production/productionOrdersSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';

const ProductsPage = () => {
    const dispatch = useDispatch();

    const products = useSelector((state) => state.products.items);
    const components = useSelector((state) => state.components.items);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isProduceModalOpen, setIsProduceModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productionQuantity, setProductionQuantity] = useState(1);

    // --- Form Modal Handlers ---
    const handleOpenFormModal = (product = null) => {
        setEditingProduct(product);
        setIsFormModalOpen(true);
    };
    const handleCloseFormModal = () => {
        setEditingProduct(null);
        setIsFormModalOpen(false);
    };

    // --- Produce Modal Handlers ---
    const handleOpenProduceModal = (product) => {
        setEditingProduct(product);
        setIsProduceModalOpen(true);
    };
    const handleCloseProduceModal = () => {
        setEditingProduct(null);
        setIsProduceModalOpen(false);
        setProductionQuantity(1);
    };

    // --- Business Logic Handlers ---
    const handleSaveProduct = (productData) => {
        if (editingProduct) {
            dispatch(updateProduct({ ...productData, id: editingProduct.id }));
        } else {
            dispatch(addProduct({ ...productData, stockBatches: [] }));
        }
        handleCloseFormModal();
    };

    const handleExecuteProduction = async () => {
        try {
            await dispatch(executeProductionOrder({ productId: editingProduct.id, quantityToProduce: productionQuantity })).unwrap();
            showToast(`${productionQuantity} units of "${editingProduct.name}" produced!`, 'success');
        } catch (error) {
            showToast(`Production failed: ${error}`, 'error');
        } finally {
            handleCloseProduceModal();
        }
    };

    // NOTE: The delete logic is commented out in this component, so we remove the unused import.
    // const handleDelete = (productId) => { ... }

    const headers = [
        { key: 'name', label: 'Product Name', sortable: true },
        { key: 'sku', label: 'SKU', sortable: true },
        { key: 'totalStock', label: 'Total Stock', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false },
    ];

    const renderRow = (product) => {
        const totalStock = product.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;
        const status = totalStock === 0 ? { text: 'Out of Stock', className: 'status-cancelled' } : { text: 'In Stock', className: 'status-completed' };
        const canProduce = product.bom && product.bom.length > 0;

        return (
            <tr key={product.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4 font-semibold">{totalStock}</td>
                <td className="p-4"><span className={`status-pill ${status.className}`}>{status.text}</span></td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {canProduce && <Button onClick={() => handleOpenProduceModal(product)} variant="ghost-glow" size="sm" className="text-green-400" title="Produce Item"><Factory size={16} /></Button>}
                        <Button onClick={() => handleOpenFormModal(product)} variant="ghost-glow" size="sm" className="text-custom-light-blue"><Edit size={16} /></Button>
                        <Button className="text-red-400" variant="ghost-glow" size="sm"><Trash2 size={16} /></Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Inventory</h1>
                <Button onClick={() => handleOpenFormModal()} variant="primary" className="flex items-center space-x-2" size="sm"><Plus size={20} /><span>New Product</span></Button>
            </div>

            <DataTable headers={headers} data={products} renderRow={renderRow} />

            <Modal title={editingProduct ? 'Edit Product' : 'Create New Product'} isOpen={isFormModalOpen} onClose={handleCloseFormModal} footer={<></>}>
                <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={handleCloseFormModal} components={components} />
            </Modal>

            <Modal title={`Produce: ${editingProduct?.name}`} isOpen={isProduceModalOpen} onClose={handleCloseProduceModal}
                footer={
                    <>
                        <Button onClick={handleCloseProduceModal} variant="secondary" size="sm">Cancel</Button>
                        <Button onClick={handleExecuteProduction} variant="primary" size="sm">Produce</Button>
                    </>
                }
            >
                <div className="text-white">
                    <label className="block mb-1 text-sm text-custom-grey">Quantity to Produce</label>
                    <input type="number" value={productionQuantity} onChange={(e) => setProductionQuantity(parseInt(e.target.value, 10))} className="form-input" min="1" />
                </div>
            </Modal>
        </div>
    );
};

export default ProductsPage;