import React from 'react';
import { useFormWithValidation } from '../../hooks/useFormWithValidation';
import Button from '../../components/common/Button';

const ComponentForm = ({ component, onSave, onCancel }) => {
    const { register, handleSubmit, errors, t } = useFormWithValidation(
        component || {
            name: '',
            cost: 0,
            reorderPoint: 10,
        },
        onSave
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('componentName')}</label>
                <input {...register('name', { required: t('componentNameRequired') })} className="form-input" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('cost')}</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('cost', { required: t('costRequired'), valueAsNumber: true, min: 0 })}
                        className="form-input"
                    />
                    {errors.cost && <p className="text-red-400 text-xs mt-1">{errors.cost.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('reorderPoint')}</label>
                    <input
                        type="number"
                        {...register('reorderPoint', { required: t('reorderPointRequired'), valueAsNumber: true, min: 0 })}
                        className="form-input"
                    />
                    {errors.reorderPoint && <p className="text-red-400 text-xs mt-1">{errors.reorderPoint.message}</p>}
                </div>
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('saveComponent')}</Button>
            </div>
        </form>
    );
};

export default ComponentForm;