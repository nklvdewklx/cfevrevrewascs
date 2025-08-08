import React, { useState, useEffect } from 'react';

const CustomerForm = ({ customer, onSave, onCancel, agents }) => {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        agentId: '',
    });

    useEffect(() => {
        // If we are editing, populate the form with the customer's data
        if (customer) {
            setFormData({
                name: customer.name || '',
                company: customer.company || '',
                email: customer.email || '',
                phone: customer.phone || '',
                agentId: customer.agentId || '',
            });
        } else {
            // If adding new, reset to blank (or default)
            setFormData({ name: '', company: '', email: '', phone: '', agentId: agents[0]?.id || '' });
        }
    }, [customer, agents]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Company</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-input" />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">Assigned Agent</label>
                <select name="agentId" value={formData.agentId} onChange={handleChange} className="form-select" required>
                    {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                    ))}
                </select>
            </div>
            {/* Form submission is handled by the Modal footer */}
            <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                    Save Customer
                </button>
            </div>
        </form>
    );
};

export default CustomerForm;