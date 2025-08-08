import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next';

const ReceiveStockModal = ({ purchaseOrder, components, onReceive, onCancel }) => {
    const { t } = useTranslation();
    const { register, control, handleSubmit } = useForm({
        defaultValues: {
            items: purchaseOrder.items.map(item => ({
                componentId: item.componentId,
                quantity: item.quantity,
                supplierLotNumber: '',
            }))
        }
    });

    const { fields } = useFieldArray({ control, name: 'items' });

    return (
        <form onSubmit={handleSubmit(onReceive)}>
            <div className="space-y-4">
                {fields.map((field, index) => {
                    const component = components.find(c => c.id === field.componentId);
                    return (
                        <div key={field.id} className="grid grid-cols-3 gap-4 items-center">
                            <div className="col-span-2">
                                <p className="font-semibold text-white">{component?.name || 'N/A'}</p>
                                <p className="text-sm text-custom-grey">{t('quantityToReceive')}: {field.quantity}</p>
                            </div>
                            <div>
                                <label className="block mb-1 text-xs text-custom-grey">{t('supplierLotNumber')}</label>
                                <input
                                    {...register(`items.${index}.supplierLotNumber`, { required: true })}
                                    className="form-input"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="pt-6 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('confirmReceipt')}</Button>
            </div>
        </form>
    );
};

export default ReceiveStockModal;