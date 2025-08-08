import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, Users } from 'lucide-react';
import DataTable from '../../components/common/DataTable';

const AgentDetailsPage = () => {
    const navigate = useNavigate();
    const { agentId } = useParams();

    const agents = useSelector((state) => state.agents.items);
    const customers = useSelector((state) => state.customers.items);

    const agent = agents.find(a => a.id === parseInt(agentId));

    if (!agent) {
        return <div className="text-center text-red-400">Agent not found.</div>;
    }

    const agentCustomers = customers.filter(c => c.agentId === agent.id);

    // Placeholder for editing agent details
    const handleEditAgent = () => {
        alert('Edit functionality not yet implemented!');
    };

    const customerHeaders = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'company', label: 'Company', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
    ];

    const renderCustomerRow = (customer) => {
        return (
            <tr key={customer.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <td className="p-4">
                    {/* NEW: Link to customer detail page */}
                    <Link to={`/customers/${customer.id}`} className="text-blue-400 hover:underline">
                        {customer.name}
                    </Link>
                </td>
                <td className="p-4">{customer.company}</td>
                <td className="p-4">{customer.email}</td>
            </tr>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                    <ArrowLeft size={18} />
                    <span>Back to Agents</span>
                </button>
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">{agent.name}</h2>
                    <button onClick={handleEditAgent} className="text-custom-light-blue hover:text-white" title="Edit Agent">
                        <Edit size={20} />
                    </button>
                </div>
                <p className="text-gray-400">{agent.role}</p>
            </div>

            {/* Contact Info Card */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-3">Contact Info</h3>
                <div className="text-sm space-y-2 text-gray-300">
                    <p className="flex items-center"><Mail size={14} className="mr-3" /> {agent.email || 'N/A'}</p>
                    <p className="flex items-center"><Phone size={14} className="mr-3" /> {agent.phone || 'N/A'}</p>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-custom-light-blue">Assigned Customers</h3>
                    <Link to="/customers" className="flex items-center space-x-2 text-blue-400 hover:underline">
                        <Users size={16} />
                        <span>View All Customers</span>
                    </Link>
                </div>
                <DataTable headers={customerHeaders} data={agentCustomers} renderRow={renderCustomerRow} />
            </div>
        </div>
    );
};

export default AgentDetailsPage;