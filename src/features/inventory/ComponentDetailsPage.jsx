import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';

const ComponentDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { componentId } = useParams();

    const { items: components } = useSelector((state) => state.components);
    const component = components.find(c => c.id === parseInt(componentId));

    if (!component) {
        return <div className="text-center text-red-400">{t('componentNotFound')}</div>;
    }

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
        // This would typically open a modal. For now, we'll alert.
        alert('Edit functionality for components coming soon!');
    };

    return (
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
                <h3 className="text-xl font-semibold text-custom-light-blue mb-4">{t('stockBatches')}</h3>
                <DataTable headers={stockBatchesHeaders} data={component.stockBatches || []} renderRow={renderStockBatchRow} />
            </div>
        </div>
    );
};

export default ComponentDetailsPage;