import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/common/Button';

const SupplierForm = ({ supplier, onSave, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: supplier || {
            name: '',
            contactPerson: '',
            email: '',
            phone: '',
        }
    });

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Company Name</label>
                <input {...register('name', { required: 'Company name is required' })} className="form-input" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Contact Person</label>
                <input {...register('contactPerson')} className="form-input" />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Email</label>
                <input type="email" {...register('email')} className="form-input" />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Phone</label>
                <input type="tel" {...register('phone')} className="form-input" />
            </div>
            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
                <Button type="submit" variant="primary">Save Supplier</Button>
            </div>
        </form>
    );
};

export default SupplierForm;