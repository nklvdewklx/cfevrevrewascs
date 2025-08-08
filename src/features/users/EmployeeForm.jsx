import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const EmployeeForm = ({ employee, onSave, onCancel }) => {
    const { t } = useTranslation(); // NEW: Get translation function
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: employee || {
            name: '',
            email: '',
            phone: '',
            role: 'General Staff',
            department: 'Operations',
            hireDate: new Date().toISOString().split('T')[0],
        }
    });

    const roles = ['General Staff', 'Sales Agent', 'Inventory User', 'Finance User', 'Administrator'];
    const departments = ['Operations', 'Sales', 'Warehouse', 'Finance', 'Management', 'HR'];

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('fullName')}</label>
                <input {...register('name', { required: t('fullNameRequired') })} className="form-input" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('email')}</label>
                <input type="email" {...register('email', { required: t('emailRequired') })} className="form-input" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('phone')}</label>
                    <input type="tel" {...register('phone')} className="form-input" />
                </div>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('hireDate')}</label>
                    <input type="date" {...register('hireDate')} className="form-input" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('department')}</label>
                    <select {...register('department')} className="form-select">
                        {departments.map(d => <option key={d} value={d}>{t(d)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('role')}</label>
                    <select {...register('role')} className="form-select">
                        {roles.map(r => <option key={r} value={r}>{t(r)}</option>)}
                    </select>
                </div>
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">{t('saveEmployee')}</button>
            </div>
        </form>
    );
};

export default EmployeeForm;