import React from 'react';
import { useForm } from 'react-hook-form';

const CustomerForm = ({ customer, onSave, onCancel, agents }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: customer ? {
            ...customer,
            agentId: customer.agentId || agents[0]?.id || '',
        } : {
            name: '',
            company: '',
            email: '',
            phone: '',
            agentId: agents[0]?.id || '',
        }
    });

    const onSubmit = (data) => {
        onSave({ ...data, agentId: parseInt(data.agentId) });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Name</label>
                <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="form-input"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Company</label>
                <input
                    type="text"
                    {...register('company')}
                    className="form-input"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Email</label>
                <input
                    type="email"
                    {...register('email', {
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                        }
                    })}
                    className="form-input"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Phone</label>
                <input
                    type="tel"
                    {...register('phone')}
                    className="form-input"
                />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Assigned Agent</label>
                <select
                    {...register('agentId', { required: 'An agent must be selected' })}
                    className="form-select"
                >
                    {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                </select>
                {errors.agentId && <p className="text-red-400 text-xs mt-1">{errors.agentId.message}</p>}
            </div>
            <div className="pt-4 flex justify-end">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                    Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Save Customer
                </button>
            </div>
        </form>
    );
};

export default CustomerForm;