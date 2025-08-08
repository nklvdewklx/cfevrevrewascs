import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus, UserCheck } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LeadForm from './LeadForm';
import { addLead, updateLead, deleteLead } from './leadsSlice';
import { addCustomer } from '../customers/customersSlice'; // To add the new customer
import { showToast } from '../../lib/toast';

const LeadsPage = () => {
    const dispatch = useDispatch();
    const leads = useSelector((state) => state.leads.items);
    const agents = useSelector((state) => state.agents.items);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);

    const handleOpenModal = (lead = null) => {
        setEditingLead(lead);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingLead(null);
        setIsModalOpen(false);
    };

    const handleSaveLead = (data) => {
        const leadData = { ...data, agentId: parseInt(data.agentId) };
        if (editingLead) {
            dispatch(updateLead({ ...leadData, id: editingLead.id }));
        } else {
            dispatch(addLead(leadData));
        }
        handleCloseModal();
    };

    const handleDelete = (leadId) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            dispatch(deleteLead(leadId));
        }
    };

    // --- NEW: Business Logic for Lead Conversion ---
    const handleConvertLead = (lead) => {
        if (window.confirm(`Convert "${lead.name}" to a new customer? The original lead will be deleted.`)) {
            const newCustomerData = {
                name: lead.name,
                company: lead.company,
                email: lead.email,
                phone: lead.phone,
                agentId: lead.agentId,
                // Add default properties for a new customer
                lat: 52.3676,
                lng: 4.9041,
                notes: [],
                visitSchedule: { day: 'Monday', frequency: 'weekly' }
            };
            dispatch(addCustomer(newCustomerData));
            dispatch(deleteLead(lead.id));
            showToast('Lead successfully converted to customer!', 'success');
        }
    };

    const headers = ['Name', 'Company', 'Status', 'Assigned Agent', 'Actions'];

    const renderRow = (lead) => {
        const agent = agents.find(a => a.id === lead.agentId);
        const statusColors = { new: 'status-pending', contacted: 'bg-blue-500', qualified: 'status-completed', lost: 'status-cancelled' };
        return (
            <tr key={lead.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.company}</td>
                <td className="p-4"><span className={`status-pill ${statusColors[lead.status]}`}>{lead.status}</span></td>
                <td className="p-4">{agent?.name || 'N/A'}</td>
                <td className="p-4">
                    <div className="flex space-x-4">
                        {lead.status === 'qualified' && (
                            <button onClick={() => handleConvertLead(lead)} className="text-green-400 hover:text-green-300" title="Convert to Customer">
                                <UserCheck size={16} />
                            </button>
                        )}
                        <button onClick={() => handleOpenModal(lead)} className="text-custom-light-blue hover:text-white"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(lead.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Leads</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                    <Plus size={20} />
                    <span>New Lead</span>
                </button>
            </div>
            <DataTable headers={headers} data={leads} renderRow={renderRow} />
            <Modal title={editingLead ? 'Edit Lead' : 'Add New Lead'} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <LeadForm lead={editingLead} onSave={handleSaveLead} onCancel={handleCloseModal} agents={agents} />
            </Modal>
        </div>
    );
};

export default LeadsPage;