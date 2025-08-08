import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, PackageCheck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PurchaseOrderForm from './PurchaseOrderForm';
import ReceiveStockModal from './ReceiveStockModal';
import { addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from './purchaseOrdersSlice';
import { receiveStockForPO } from '../inventory/componentsSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';
import ReorderAlerts from './ReorderAlerts';

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

    const handleSavePO = (data) => {
        const poData = {
            ...data,
            supplierId: parseInt(data.supplierId),
            items: data.items.map(item => ({
                ...item,
                componentId: parseInt(item.componentId),
            })),
            issueDate: new Date().toISOString().split('T')[0],
        };

        if (selectedPO) {
            dispatch(updatePurchaseOrder({ ...poData, id: selectedPO.id }));
            showToast(`Purchase Order #${selectedPO.poNumber} updated successfully.`, 'success');
        } else {
            dispatch(addPurchaseOrder(poData));
            showToast(`New Purchase Order created!`, 'success');
        }
        handleCloseFormModal();
    };

    const handleReceiveStock = (data) => {
        dispatch(receiveStockForPO({ purchaseOrder: selectedPO, receivedItems: data.items }));
        showToast(`Stock for P.O. #${selectedPO.poNumber} has been received!`, 'success');
        handleCloseReceiveModal();
    };

    const handleDelete = (poId) => {
        if (window.confirm('Are you sure you want to delete this purchase order?')) {
            dispatch(deletePurchaseOrder(poId));
            showToast('Purchase Order deleted successfully.', 'success');
        }
    };

    const headers = [
        { key: 'poNumber', label: 'P.O. #', sortable: true },
        { key: 'supplierId', label: 'Supplier', sortable: true },
        { key: 'issueDate', label: 'Issue Date', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'actions', label: 'Actions', sortable: false },
    ];

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
                            <Button onClick={() => handleOpenReceiveModal(po)} variant="ghost-glow" size="sm" className="text-green-400" title="Receive Stock">
                                <PackageCheck size={16} />
                            </Button>
                        )}
                        <Button onClick={() => handleOpenFormModal(po)} variant="ghost-glow" size="sm" className="text-custom-light-blue"><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(po.id)} variant="ghost-glow" size="sm" className="text-red-400"><Trash2 size={16} /></Button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Purchase Orders</h1>
                <Button onClick={() => handleOpenFormModal()} variant="primary" className="flex items-center space-x-2" size="sm">
                    <Plus size={20} />
                    <span>New P.O.</span>
                </Button>
            </div>

            <ReorderAlerts />

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