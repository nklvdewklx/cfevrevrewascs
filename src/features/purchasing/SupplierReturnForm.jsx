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

    useEffect(() => {
        if (watchedSupplierId) {
            const supplierComponents = components.filter(c =>
                c.stockBatches.some(b => b.supplierLotNumber?.startsWith(`PO-${suppliers.find(s => s.id === parseInt(watchedSupplierId))?.name.substring(0, 3).toUpperCase()}`)) // A bit of a guess, but could be improved with better data
            );
            const batches = supplierComponents.flatMap(c =>
                c.stockBatches.map(b => ({
                    ...b,
                    componentId: c.id,
                    componentName: c.name,
                    maxQuantity: b.quantity,
                }))
            );
            setAvailableBatches(batches);
        } else {
            setAvailableBatches([]);
        }
        setValue('items', []);
    }, [watchedSupplierId, components, suppliers, setValue]);

    const handleAddComponent = () => {
        if (availableBatches.length > 0) {
            const firstBatch = availableBatches[0];
            append({
                componentId: firstBatch.componentId,
                supplierLotNumber: firstBatch.supplierLotNumber,
                quantity: 1,
                maxQuantity: firstBatch.maxQuantity,
                componentName: firstBatch.componentName
            });
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
                    <label className="block text-md font-semibold text-custom-light-blue">{t('itemsToReturn')}</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2 p-2 bg-gray-900/50 rounded-lg">
                            <select
                                {...register(`items.${index}.supplierLotNumber`, { required: true })}
                                className="form-select flex-grow"
                                onChange={(e) => {
                                    const selectedBatch = availableBatches.find(b => b.supplierLotNumber === e.target.value);
                                    if (selectedBatch) {
                                        setValue(`items.${index}.componentId`, selectedBatch.componentId);
                                        setValue(`items.${index}.maxQuantity`, selectedBatch.maxQuantity);
                                        setValue(`items.${index}.componentName`, selectedBatch.componentName);
                                    }
                                }}
                            >
                                <option value="">{t('selectBatch')}</option>
                                {availableBatches.map(b => (
                                    <option key={b.supplierLotNumber} value={b.supplierLotNumber}>
                                        {b.componentName} ({b.supplierLotNumber}) - {t('available')}: {b.quantity}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                {...register(`items.${index}.quantity`, {
                                    required: t('quantityRequired'),
                                    valueAsNumber: true,
                                    min: { value: 1, message: t('quantityAtLeastOne') },
                                    max: { value: watch(`items.${index}.maxQuantity`), message: t('cannotReturnMoreThanAvailable') }
                                })}
                                className="form-input w-24"
                            />
                            <Button type="button" onClick={() => remove(index)} variant="ghost" size="sm" className="text-red-400">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={handleAddComponent} variant="secondary" size="sm" className="flex items-center space-x-2">
                        <Plus size={16} />
                        <span>{t('addComponent')}</span>
                    </Button>
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