import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const AgentCustomersPage = () => {
    const { user } = useSelector((state) => state.auth);
    const customers = useSelector((state) => state.customers.items);

    // Filter for customers assigned to the current agent
    const myCustomers = customers.filter(c => c.agentId === user.id);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">My Customers</h2>
                {/* We can add a "New Customer" page for agents later */}
                {/* <Link to="/agent/new-customer" className="bg-green-600 hover:bg-green-700 text-white font-bold p-2 rounded-lg"><UserPlus size={20} /></Link> */}
            </div>
            <div className="space-y-3">
                {myCustomers.length > 0 ? (
                    myCustomers.map(customer => (
                        <Link key={customer.id} to={`/agent/customer/${customer.id}`} className="block bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-lg text-white">{customer.name}</h3>
                                    <p className="text-sm text-gray-400">{customer.company}</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-500" />
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-400 text-center pt-8">You have no customers assigned.</p>
                )}
            </div>
        </div>
    );
};

export default AgentCustomersPage;