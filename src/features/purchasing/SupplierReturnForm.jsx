import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';

const SupplierReturnForm = ({ onSave, onCancel, suppliers, components }) => {
    const { t } = useTranslation();
    const [availableBatches, setAvailableBatches] = useState([]);

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            supplierId: '',
            items: [],
            reason: '',
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const watchedSupplierId = watch('supplierId');
    const watchedItems = watch('items');

    useEffect(() => {
        if (watchedSupplierId) {
            // This logic is a placeholder. In a real system, you'd likely have a direct link
            // between a supplier and the batches they supplied.
            const supplierComponents = components.filter(c =>
                c.stockBatches.some(b => b.supplierLotNumber)
            );
            const batches = supplierComponents.flatMap(c =>
                c.stockBatches.map(b => ({
                    ...b,
                    componentId: c.id,
                    componentName: c.name,
                    maxQuantity: b.quantity,
                    // Create a unique ID for each option in the dropdown
                    uniqueBatchId: `${c.id}-${b.supplierLotNumber}`
                }))
            );
            setAvailableBatches(batches);
        } else {
            setAvailableBatches([]);
        }
        setValue('items', []); // Reset items when supplier changes
    }, [watchedSupplierId, components, suppliers, setValue]);

    // MODIFIED: This logic is now smarter about adding a new, unselected batch.
    const handleAddComponent = () => {
        const selectedLotNumbers = new Set(watchedItems.map(item => item.supplierLotNumber));
        const nextAvailableBatch = availableBatches.find(batch => !selectedLotNumbers.has(batch.supplierLotNumber));

        if (nextAvailableBatch) {
            append({
                componentId: nextAvailableBatch.componentId,
                supplierLotNumber: nextAvailableBatch.supplierLotNumber,
                quantity: 1,
                maxQuantity: nextAvailableBatch.maxQuantity,
                componentName: nextAvailableBatch.componentName
            });
        } else {
            alert(t('noMoreBatchesAvailable'));
        }
    };


    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('supplier')}</label>
                <select
                    {...register('supplierId', { required: t('supplierRequired') })}
                    className="form-input"
                >
                    <option value="">{t('selectSupplier')}</option>
                    {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
                {errors.supplierId && <p className="text-red-400 text-xs mt-1">{errors.supplierId.message}</p>}
            </div>

            {watchedSupplierId && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                        <label className="block text-md font-semibold text-custom-light-blue">{t('itemsToReturn')}</label>
                        <Button type="button" onClick={handleAddComponent} variant="secondary" size="sm" className="flex items-center space-x-2">
                            <Plus size={16} />
                            <span>{t('addComponent')}</span>
                        </Button>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-3 gap-x-4 items-center p-2 bg-gray-900/50 rounded-lg">
                            <select
                                {...register(`items.${index}.supplierLotNumber`, { required: true })}
                                className="form-select col-span-2"
                                onChange={(e) => {
                                    const selectedBatch = availableBatches.find(b => b.supplierLotNumber === e.target.value);
                                    if (selectedBatch) {
                                        setValue(`items.${index}.componentId`, selectedBatch.componentId);
                                        setValue(`items.${index}.maxQuantity`, selectedBatch.maxQuantity);
                                        setValue(`items.${index}.componentName`, selectedBatch.componentName);
                                        setValue(`items.${index}.quantity`, 1); // Reset quantity on change
                                    }
                                }}
                            >
                                <option value="">{t('selectBatch')}</option>
                                {availableBatches.map(b => (
                                    <option key={b.uniqueBatchId} value={b.supplierLotNumber} disabled={watchedItems.some((item, i) => i !== index && item.supplierLotNumber === b.supplierLotNumber)}>
                                        {b.componentName} ({b.supplierLotNumber}) - {t('available')}: {b.quantity}
                                    </option>
                                ))}
                            </select>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    {...register(`items.${index}.quantity`, {
                                        required: t('quantityRequired'),
                                        valueAsNumber: true,
                                        min: { value: 1, message: t('quantityAtLeastOne') },
                                        max: { value: watch(`items.${index}.maxQuantity`), message: t('cannotReturnMoreThanAvailable') }
                                    })}
                                    className="form-input"
                                />
                                <Button type="button" onClick={() => remove(index)} variant="ghost" size="sm" className="text-red-400">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {errors.items && <p className="text-red-400 text-xs mt-1">{t('checkReturnedItems')}</p>}
                </div>
            )}

            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('reasonForReturn')}</label>
                <textarea
                    {...register('reason', { required: t('reasonIsRequired') })}
                    className="form-input"
                    rows="3"
                    placeholder={t('e.g., Damaged goods, excess stock, etc.')}
                ></textarea>
                {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>}
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('createReturnRequest')}</Button>
            </div>
        </form>
    );
};

export default SupplierReturnForm;