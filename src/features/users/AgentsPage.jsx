import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit, Trash2, Plus } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import AgentForm from './AgentForm';
import { addAgent, updateAgent, deleteAgent } from './agentsSlice';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const AgentsPage = () => {
    const { t } = useTranslation(); // NEW: Get translation function
    const dispatch = useDispatch();
    const agents = useSelector((state) => state.agents.items);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);

    const handleOpenModal = (agent = null) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingAgent(null);
        setIsModalOpen(false);
    };

    const handleSaveAgent = (data) => {
        if (editingAgent) {
            dispatch(updateAgent({ ...data, id: editingAgent.id }));
        } else {
            dispatch(addAgent({ ...data, lat: 52.370216, lng: 4.895115 }));
        }
        handleCloseModal();
    };

    const handleDelete = (agentId) => {
        if (window.confirm(t('confirmDeleteAgent'))) { // NEW: Translate confirmation message
            dispatch(deleteAgent(agentId));
        }
    };

    const headers = [
        { key: 'name', label: t('name'), sortable: true },
        { key: 'email', label: t('email'), sortable: true },
        { key: 'phone', label: t('phone'), sortable: false },
        { key: 'role', label: t('role'), sortable: true },
        { key: 'actions', label: t('actions'), sortable: false },
    ];

    const renderRow = (agent) => (
        <tr key={agent.id} className="border-b border-white/10 last:border-b-0 hover:bg-white/5">
            <td className="p-4">
                <Link to={`/agents/${agent.id}`} className="text-blue-400 hover:underline">
                    {agent.name}
                </Link>
            </td>
            <td className="p-4">{agent.email}</td>
            <td className="p-4">{agent.phone}</td>
            <td className="p-4">{t(agent.role.replace(/\s/g, ''))}</td>
            <td className="p-4">
                <div className="flex space-x-4">
                    <Button onClick={() => handleOpenModal(agent)} variant="ghost-glow" size="sm" className="text-custom-light-blue" title={t('edit')}><Edit size={16} /></Button>
                    <Button onClick={() => handleDelete(agent.id)} variant="ghost-glow" size="sm" className="text-red-400" title={t('delete')}><Trash2 size={16} /></Button>
                </div>
            </td>
        </tr>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{t('manageAgents')}</h1>
                <Button onClick={() => handleOpenModal()} variant="primary" className="flex items-center space-x-2" size="sm">
                    <Plus size={20} />
                    <span>{t('newAgent')}</span>
                </Button>
            </div>
            <DataTable headers={headers} data={agents} renderRow={renderRow} />
            <Modal title={editingAgent ? t('editAgent') : t('addAgent')} isOpen={isModalOpen} onClose={handleCloseModal} footer={<></>}>
                <AgentForm agent={editingAgent} onSave={handleSaveAgent} onCancel={handleCloseModal} />
            </Modal>
        </div>
    );
};

export default AgentsPage;