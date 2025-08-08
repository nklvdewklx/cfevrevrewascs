import React from 'react';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import Button from '../../components/common/Button';

const StockAdjustmentModal = ({ component, onSave, onCancel }) => {
    const { register, handleSubmit, errors, t } = useFormWithValidation(
        {
            batchLotNumber: '',
            adjustmentType: 'add',
            quantity: 1,
            reason: '',
        },
        (data) => {
            // Custom validation before calling onSave
            const selectedBatch = component.stockBatches.find(b => b.supplierLotNumber === data.batchLotNumber);
            if (data.adjustmentType === 'remove' && data.quantity > selectedBatch.quantity) {
                alert(t('insufficientStock'));
                return;
            }
            onSave(data);
        }
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('selectBatch')}</label>
                <select {...register('batchLotNumber', { required: true })} className="form-input">
                    <option value="" disabled>{t('selectBatch')}</option>
                    {component.stockBatches.map(batch => (
                        <option key={batch.supplierLotNumber} value={batch.supplierLotNumber}>
                            {batch.supplierLotNumber} ({t('currentStock', { count: batch.quantity })})
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('adjustmentType')}</label>
                    <select {...register('adjustmentType')} className="form-input">
                        <option value="add">{t('add')}</option>
                        <option value="remove">{t('remove')}</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('quantity')}</label>
                    <input
                        type="number"
                        {...register('quantity', { required: true, valueAsNumber: true, min: { value: 1, message: t('quantityMustBePositive') } })}
                        className="form-input"
                    />
                    {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
                </div>
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('reason')}</label>
                <input
                    type="text"
                    {...register('reason', { required: t('reasonRequired') })}
                    className="form-input"
                    placeholder="e.g., Stock count, Spoilage, etc."
                />
                {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>}
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('saveAdjustment')}</Button>
            </div>
        </form>
    );
};

export default StockAdjustmentModal;