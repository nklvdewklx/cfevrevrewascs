import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Mail, Phone } from 'lucide-react';

const AgentCustomerDetailPage = () => {
    const navigate = useNavigate();
    const { customerId } = useParams(); // Get customer ID from the URL

    const customers = useSelector((state) => state.customers.items);
    const orders = useSelector((state) => state.orders.items);

    const customer = customers.find(c => c.id === parseInt(customerId));

    if (!customer) {
        return <div className="text-center text-red-400">Customer not found.</div>;
    }

    const customerOrders = orders.filter(o => o.customerId === customer.id).sort((a, b) => b.id - a.id);

    const handleNewOrder = () => {
        // Navigate to the order form, passing the customerId in the state
        navigate('/agent/new-order', { state: { customerId: customer.id } });
    };

    return (
        <div className="space-y-6">
            <div>
                <Link to="/agent/customers" className="flex items-center space-x-2 text-custom-light-blue mb-4">
                    <ArrowLeft size={18} />
                    <span>Back to Customers</span>
                </Link>
                <h2 className="text-3xl font-bold">{customer.name}</h2>
                <p className="text-gray-400">{customer.company}</p>
            </div>

            <button onClick={handleNewOrder} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 text-center">
                <PlusCircle size={20} />
                <span>New Order for {customer.name}</span>
            </button>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-3">Contact Info</h3>
                <div className="text-sm space-y-2 text-gray-300">
                    <p className="flex items-center"><Mail size={14} className="mr-3" /> {customer.email || 'N/A'}</p>
                    <p className="flex items-center"><Phone size={14} className="mr-3" /> {customer.phone || 'N/A'}</p>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-2">Recent Orders</h3>
                <ul className="divide-y divide-gray-700">
                    {customerOrders.length > 0 ? customerOrders.slice(0, 5).map(order => (
                        <li key={order.id} className="flex justify-between items-center py-3">
                            <div>
                                <span className="font-semibold">Order #{order.id}</span>
                                <span className="text-sm text-gray-400 ml-2">({order.date})</span>
                            </div>
                            <span className={`text-sm font-semibold capitalize ${order.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>{order.status}</span>
                        </li>
                    )) : (
                        <p className="text-sm text-gray-400 py-4 text-center">No orders found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AgentCustomerDetailPage;