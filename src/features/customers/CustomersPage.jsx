import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import CustomerForm from './CustomerForm';
import { addCustomer, updateCustomer, deleteCustomer } from './customersSlice';

const CustomersPage = () => {
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.items);
    const agents = useSelector((state) => state.agents.items); // For the agent dropdown in the form

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const handleOpenModal = (customer = null) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingCustomer(null);
        setIsModalOpen(false);
    };

    const handleSaveCustomer = (customerData) => {
        if (editingCustomer) {
            dispatch(updateCustomer({ ...customerData, id: editingCustomer.id }));
        } else {
            dispatch(addCustomer(customerData));
        }
        handleCloseModal();
    };

    const handleDelete = (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            dispatch(deleteCustomer(customerId));
        }
    };

    const headers = ['Name', 'Company', 'Email', 'Phone', 'Agent', 'Actions'];

    const renderRow = (customer) => {
        const agent = agents.find(a => a.id === customer.agentId);
        return (
            <tr key={customer.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.company}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{agent?.name || 'N/A'}</td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        <button onClick={() => handleOpenModal(customer)} className="text-custom-light-blue hover:text-white">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Customers</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>New Customer</span>
                </button>
            </div>

            <DataTable headers={headers} data={customers} renderRow={renderRow} />

            <Modal
                title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                footer={
                    <>
                        <button onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                            Cancel
                        </button>
                        {/* The submit button is part of the form */}
                    </>
                }
            >
                <CustomerForm
                    customer={editingCustomer}
                    onSave={handleSaveCustomer}
                    onCancel={handleCloseModal}
                    agents={agents}
                />
            </Modal>
        </div>
    );
};

export default CustomersPage;