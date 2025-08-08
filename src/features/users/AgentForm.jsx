import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const AgentForm = ({ agent, onSave, onCancel }) => {
    const { t } = useTranslation(); // NEW: Get translation function
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: agent || {
            name: '',
            email: '',
            phone: '',
            role: 'Agent',
        }
    });

    const roles = ['Agent', 'Administrator'];

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('fullName')}</label>
                <input {...register('name', { required: t('agentNameRequired') })} className="form-input" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('emailAddress')}</label>
                <input
                    type="email"
                    {...register('email', { required: t('emailRequired'), pattern: { value: /^\S+@\S+$/i, message: t('invalidEmailAddress') } })}
                    className="form-input"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('phoneNumber')}</label>
                <input type="tel" {...register('phone')} className="form-input" />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('role')}</label>
                <select {...register('role')} className="form-select">
                    {roles.map(r => <option key={r} value={r}>{t(r)}</option>)}
                </select>
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">{t('saveAgent')}</button>
            </div>
        </form>
    );
};

export default AgentForm;