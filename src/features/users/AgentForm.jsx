import React from 'react';
import { useForm } from 'react-hook-form';

const AgentForm = ({ agent, onSave, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: agent || {
            name: '',
            email: '',
            phone: '',
            role: 'Agent',
        }
    });

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Full Name</label>
                <input {...register('name', { required: 'Agent name is required' })} className="form-input" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Email Address</label>
                <input
                    type="email"
                    {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                    className="form-input"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Phone Number</label>
                <input type="tel" {...register('phone')} className="form-input" />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Role</label>
                <select {...register('role')} className="form-select">
                    <option value="Agent">Agent</option>
                    <option value="Administrator">Administrator</option>
                </select>
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">Save Agent</button>
            </div>
        </form>
    );
};

export default AgentForm;