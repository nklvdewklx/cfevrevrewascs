import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, Factory } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ProductForm from './ProductForm';
import { addProduct, updateProduct } from './productsSlice'; // Removed unused `deleteProduct` import
import { executeProductionOrder } from '../production/productionOrdersSlice';
import { showToast } from '../../lib/toast';

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

    const headers = ['Product Name', 'SKU', 'Total Stock', 'Status', 'Actions'];

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
                        {canProduce && <button onClick={() => handleOpenProduceModal(product)} className="text-green-400 hover:text-green-300" title="Produce Item"><Factory size={16} /></button>}
                        <button onClick={() => handleOpenFormModal(product)} className="text-custom-light-blue hover:text-white"><Edit size={16} /></button>
                        <button className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Inventory</h1>
                <button onClick={() => handleOpenFormModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><Plus size={20} /><span>New Product</span></button>
            </div>

            <DataTable headers={headers} data={products} renderRow={renderRow} />

            {/* Modal for Adding/Editing a Product */}
            <Modal title={editingProduct ? 'Edit Product' : 'Create New Product'} isOpen={isFormModalOpen} onClose={handleCloseFormModal} footer={<></>}>
                <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={handleCloseFormModal} components={components} />
            </Modal>

            {/* Modal for Executing Production */}
            <Modal title={`Produce: ${editingProduct?.name}`} isOpen={isProduceModalOpen} onClose={handleCloseProduceModal}
                footer={
                    <>
                        <button onClick={handleCloseProduceModal} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={handleExecuteProduction} className="bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded-lg">Produce</button>
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