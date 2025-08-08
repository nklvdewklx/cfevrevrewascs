import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Sliders } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import StockAdjustmentModal from './StockAdjustmentModal';
import { manuallyAdjustComponentStock } from './componentsSlice'; // CORRECTED: Import the renamed thunk
import { showToast } from '../../lib/toast';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';

const ComponentDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { componentId } = useParams();

    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);

    const { items: components } = useSelector((state) => state.components);
    const { user } = useSelector((state) => state.auth);
    const component = components.find(c => c.id === parseInt(componentId));

    if (!component) {
        return <div className="text-center text-red-400">{t('componentNotFound')}</div>;
    }

    const handleSaveAdjustment = (data) => {
        // CORRECTED: Dispatch the renamed thunk
        dispatch(manuallyAdjustComponentStock({
            componentId: component.id,
            userId: user.id,
            ...data
        }));
        showToast(t('stockAdjusted'), 'success');
        setIsAdjustmentModalOpen(false);
    };

    const totalStock = component.stockBatches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0;

    const stockBatchesHeaders = [
        { key: 'supplierLotNumber', label: t('supplierLotNumber'), sortable: true },
        { key: 'quantity', label: t('quantity'), sortable: true },
        { key: 'receivedDate', label: t('receivedDate'), sortable: true },
    ];

    const renderStockBatchRow = (batch) => (
        <tr key={batch.supplierLotNumber} className="border-b border-white/10 last:border-b-0">
            <td className="p-4">{batch.supplierLotNumber || 'N/A'}</td>
            <td className="p-4">{batch.quantity}</td>
            <td className="p-4">{batch.receivedDate}</td>
        </tr>
    );

    const handleEdit = () => {
        alert('Edit functionality for components coming soon!');
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                        <ArrowLeft size={18} />
                        <span>{t('backToComponents')}</span>
                    </button>
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold">{component.name}</h2>
                        <Button onClick={handleEdit} variant='ghost-glow' className="text-custom-light-blue" title={t('editComponent')}>
                            <Edit size={20} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('totalStock')}</h3>
                        <p className="text-3xl font-bold">{totalStock}</p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('cost')}</h3>
                        <p className="text-3xl font-bold">${component.cost.toFixed(2)}</p>
                    </div>
                    <div className="glass-panel p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-custom-light-blue mb-2">{t('reorderPoint')}</h3>
                        <p className="text-3xl font-bold">{component.reorderPoint}</p>
                    </div>
                </div>

                <div className="glass-panel p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-custom-light-blue">{t('stockBatches')}</h3>
                        <Button onClick={() => setIsAdjustmentModalOpen(true)} variant="secondary" size="sm" className="flex items-center space-x-2">
                            <Sliders size={16} />
                            <span>{t('adjustStock')}</span>
                        </Button>
                    </div>
                    <DataTable headers={stockBatchesHeaders} data={component.stockBatches || []} renderRow={renderStockBatchRow} />
                </div>
            </div>

            <Modal title={t('manualStockAdjustment')} isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)} footer={<></>}>
                <StockAdjustmentModal component={component} onSave={handleSaveAdjustment} onCancel={() => setIsAdjustmentModalOpen(false)} />
            </Modal>
        </>
    );
};

export default ComponentDetailsPage;