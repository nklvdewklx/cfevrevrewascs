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
import { useTranslation } from 'react-i18next';

const PurchaseOrdersPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { items: purchaseOrders } = useSelector((state) => state.purchaseOrders);
    const { items: suppliers } = useSelector((state) => state.suppliers);
    const { items: components } = useSelector((state) => state.components);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isReceiveModalOpen, setReceiveModalOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');

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
            showToast(t('poUpdated', { poNumber: selectedPO.poNumber }), 'success');
        } else {
            dispatch(addPurchaseOrder(poData));
            showToast(t('poCreated'), 'success');
        }
        handleCloseFormModal();
    };

    const handleReceiveStock = (data) => {
        dispatch(receiveStockForPO({ purchaseOrder: selectedPO, receivedItems: data.items }));
        showToast(t('stockReceived', { poNumber: selectedPO.poNumber }), 'success');
        handleCloseReceiveModal();
    };

    const handleDelete = (poId) => {
        if (window.confirm(t('confirmDeletePo'))) {
            dispatch(deletePurchaseOrder(poId));
            showToast(t('poDeleted'), 'success');
        }
    };

    const headers = [
        { key: 'poNumber', label: t('poNumber'), sortable: true },
        { key: 'supplierId', label: t('supplier'), sortable: true },
        { key: 'issueDate', label: t('issueDate'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (po) => {
        const supplier = suppliers.find(s => s.id === po.supplierId);
        const statusColors = { fulfilled: 'status-completed', sent: 'status-pending', draft: 'bg-gray-500' };

        return (
            <tr key={po.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{po.poNumber}</td>
                <td className="p-4">{supplier?.name || 'N/A'}</td>
                <td className="p-4">{po.issueDate}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[po.status]}`}>{t(po.status)}</span></td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {po.status === 'sent' && (
                            <Button onClick={() => handleOpenReceiveModal(po)} variant="ghost-glow" size="sm" className="text-green-400" title={t('receiveStock')}>
                                <PackageCheck size={16} />
                            </Button>
                        )}
                        <Button onClick={() => handleOpenFormModal(po)} variant="ghost-glow" size="sm" className="text-custom-light-blue" title={t('edit')}><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(po.id)} variant="ghost-glow" size="sm" className="text-red-400" title={t('delete')}><Trash2 size={16} /></Button>
                    </div>
                </td>
            </tr>
        );
    };

    const poStatusFilters = {
        activeFilters: { status: statusFilter },
        controls: (
            <div className="relative w-full md:w-48">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select w-full"
                >
                    <option value="">{t('allStatuses')}</option>
                    <option value="draft">{t('draft')}</option>
                    <option value="sent">{t('sent')}</option>
                    <option value="fulfilled">{t('fulfilled')}</option>
                </select>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('managePurchaseOrders')}</h1>
                <Button onClick={() => handleOpenFormModal()} variant="primary" className="flex items-center space-x-2" size="sm">
                    <Plus size={20} />
                    <span>{t('newPo')}</span>
                </Button>
            </div>

            <ReorderAlerts />

            <DataTable headers={headers} data={purchaseOrders} renderRow={renderRow} filters={poStatusFilters} />
            <Modal title={selectedPO ? t('editPo') : t('createNewPo')} isOpen={isFormModalOpen} onClose={handleCloseFormModal} footer={<></>}>
                <PurchaseOrderForm po={selectedPO} onSave={handleSavePO} onCancel={handleCloseFormModal} suppliers={suppliers} components={components} />
            </Modal>
            <Modal title={t('receiveStockTitle', { poNumber: selectedPO?.poNumber })} isOpen={isReceiveModalOpen} onClose={handleCloseReceiveModal} footer={<></>}>
                {selectedPO && <ReceiveStockModal purchaseOrder={selectedPO} components={components} onReceive={handleReceiveStock} onCancel={handleCloseReceiveModal} />}
            </Modal>
        </div>
    );
};

export default PurchaseOrdersPage;