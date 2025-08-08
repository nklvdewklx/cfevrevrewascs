import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';

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
                <input type="email" {...register('email', { required: 'Email is required' })} className="form-input" />
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
                <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary">Save Agent</Button>
            </div>
        </form>
    );
};

export default AgentForm;