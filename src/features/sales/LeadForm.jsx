import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const LeadForm = ({ lead, onSave, onCancel, agents }) => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: lead || {
            name: '',
            company: '',
            email: '',
            phone: '',
            status: 'new',
            agentId: agents[0]?.id || '',
        }
    });

    const leadStatuses = ['new', 'contacted', 'qualified', 'lost'];

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('name')}</label>
                <input {...register('name', { required: t('nameRequired') })} className="form-input" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('company')}</label>
                <input {...register('company')} className="form-input" />
                {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('email')}</label>
                <input type="email" {...register('email', { pattern: { value: /^\S+@\S+$/i, message: t('invalidEmailAddress') } })} className="form-input" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('phone')}</label>
                <input type="tel" {...register('phone')} className="form-input" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('status')}</label>
                    <select {...register('status')} className="form-select">
                        {leadStatuses.map(s => <option key={s} value={s} className="capitalize">{t(s)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm text-custom-grey">{t('assignedAgent')}</label>
                    <select {...register('agentId')} className="form-select">
                        {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">{t('saveLead')}</button>
            </div>
        </form>
    );
};

export default LeadForm;