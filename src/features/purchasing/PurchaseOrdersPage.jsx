import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, PackageCheck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PurchaseOrderForm from './PurchaseOrderForm';
import ReceiveStockModal from './ReceiveStockModal'; // Import the new modal
import { addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from './purchaseOrdersSlice';
import { receiveStockForPO } from '../inventory/componentsSlice'; // Import the new thunk
import { showToast } from '../../lib/toast';

const PurchaseOrdersPage = () => {
    const dispatch = useDispatch();
    const { items: purchaseOrders } = useSelector((state) => state.purchaseOrders);
    const { items: suppliers } = useSelector((state) => state.suppliers);
    const { items: components } = useSelector((state) => state.components);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isReceiveModalOpen, setReceiveModalOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState(null);

    const handleOpenFormModal = (po = null) => {
        setSelectedPO(po);
        setFormModalOpen(true);
    };
    const handleCloseFormModal = () => {
        setSelectedPO(null);
        setFormModalOpen(false);
    };

    const handleOpenReceiveModal = (po) => {
        setSelectedPO(po);
        setReceiveModalOpen(true);
    };
    const handleCloseReceiveModal = () => {
        setSelectedPO(null);
        setReceiveModalOpen(false);
    };

    const handleSavePO = (data) => { /* ... same as before */ };

    const handleReceiveStock = (data) => {
        dispatch(receiveStockForPO({ purchaseOrder: selectedPO, receivedItems: data.items }));
        showToast(`Stock for P.O. #${selectedPO.poNumber} has been received!`, 'success');
        handleCloseReceiveModal();
    };

    const handleDelete = (poId) => { /* ... same as before */ };

    const headers = ['P.O. #', 'Supplier', 'Issue Date', 'Status', 'Actions'];

    const renderRow = (po) => {
        const supplier = suppliers.find(s => s.id === po.supplierId);
        const statusColors = { fulfilled: 'status-completed', sent: 'status-pending', draft: 'bg-gray-500' };

        return (
            <tr key={po.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{po.poNumber}</td>
                <td className="p-4">{supplier?.name || 'N/A'}</td>
                <td className="p-4">{po.issueDate}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[po.status]}`}>{po.status}</span></td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {po.status === 'sent' && (
                            <button onClick={() => handleOpenReceiveModal(po)} className="text-green-400 hover:text-green-300" title="Receive Stock">
                                <PackageCheck size={16} />
                            </button>
                        )}
                        <button onClick={() => handleOpenFormModal(po)} className="text-custom-light-blue hover:text-white"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(po.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Purchase Orders</h1>
                <button onClick={() => handleOpenFormModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New P.O.</span>
                </button>
            </div>
            <DataTable headers={headers} data={purchaseOrders} renderRow={renderRow} />
            <Modal title={selectedPO ? 'Edit Purchase Order' : 'Create New P.O.'} isOpen={isFormModalOpen} onClose={handleCloseFormModal} footer={<></>}>
                <PurchaseOrderForm po={selectedPO} onSave={handleSavePO} onCancel={handleCloseFormModal} suppliers={suppliers} components={components} />
            </Modal>
            <Modal title={`Receive Stock for P.O. #${selectedPO?.poNumber}`} isOpen={isReceiveModalOpen} onClose={handleCloseReceiveModal} footer={<></>}>
                {selectedPO && <ReceiveStockModal purchaseOrder={selectedPO} components={components} onReceive={handleReceiveStock} onCancel={handleCloseReceiveModal} />}
            </Modal>
        </div>
    );
};

export default PurchaseOrdersPage;