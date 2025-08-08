import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { Check, X } from 'lucide-react';
import { updateStockBatch } from './productsSlice';
import { addLedgerEntry } from './inventoryLedgerSlice';
import { showToast } from '../../lib/toast';

const QualityControlPage = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { items: products } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    // Find all batches across all products that are not 'Sellable'
    const batchesForReview = products.flatMap(product =>
        (product.stockBatches || [])
            .filter(batch => batch.status && batch.status !== 'Sellable')
            .map(batch => ({
                ...batch,
                productId: product.id,
                productName: product.name,
            }))
    );

    const handleBatchInspection = (productId, lotNumber, newStatus) => {
        if (window.confirm(t('confirmBatchStatusChange', { lotNumber, status: newStatus }))) {
            const updates = { status: newStatus };
            dispatch(updateStockBatch({ productId, lotNumber, updates }));

            dispatch(addLedgerEntry({
                itemType: 'product',
                itemId: productId,
                quantityChange: 0,
                reason: `QC Inspection: Batch ${lotNumber} status changed to ${newStatus}`,
                userId: user.id
            }));

            showToast(t('batchStatusUpdated'), 'success');
        }
    };

    const headers = [
        { key: 'productName', label: t('product'), sortable: true },
        { key: 'lotNumber', label: t('lotNumber'), sortable: true },
        { key: 'quantity', label: t('quantity'), sortable: true },
        { key: 'status', label: t('status'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (batch) => {
        const isInspectionRequired = batch.status === 'Returned - Inspection Required';
        let statusPillClass = 'bg-gray-700';
        if (isInspectionRequired) statusPillClass = 'status-pending animate-pulse';
        if (batch.status === 'Quarantined') statusPillClass = 'status-cancelled';

        return (
            <tr key={`${batch.productId}-${batch.lotNumber}`} className="border-b border-white/10 last:border-b-0">
                <td className="p-4">
                    <Link to={`/inventory/${batch.productId}`} className="text-blue-400 hover:underline">
                        {batch.productName}
                    </Link>
                </td>
                <td className="p-4 font-mono">{batch.lotNumber}</td>
                <td className="p-4">{batch.quantity}</td>
                <td className="p-4"><span className={`status-pill ${statusPillClass}`}>{batch.status}</span></td>
                <td className="p-4">
                    {isInspectionRequired && (
                        <div className="flex space-x-2">
                            <Button onClick={() => handleBatchInspection(batch.productId, batch.lotNumber, 'Sellable')} variant="ghost-glow" size="sm" className="text-green-400" title={t('markAsSellable')}>
                                <Check size={16} />
                            </Button>
                            <Button onClick={() => handleBatchInspection(batch.productId, batch.lotNumber, 'Quarantined')} variant="ghost-glow" size="sm" className="text-red-400" title={t('markAsQuarantined')}>
                                <X size={16} />
                            </Button>
                        </div>
                    )}
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('qualityControl')}</h1>
            <p className="text-custom-grey">{t('qualityControlDescription')}</p>
            <DataTable headers={headers} data={batchesForReview} renderRow={renderRow} />
        </div>
    );
};

export default QualityControlPage;