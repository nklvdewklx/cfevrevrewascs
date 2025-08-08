import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PlusCircle, UserPlus } from 'lucide-react';

const AgentHomePage = () => {
    const { user } = useSelector((state) => state.auth);
    const orders = useSelector((state) => state.orders.items);

    // Filter for orders assigned to the current agent
    const myOrders = orders.filter(o => o.agentId === user.id);
    const ordersToday = myOrders.filter(o => o.date === new Date().toISOString().split('T')[0]);

    // Simplified stats for the agent
    const salesToday = ordersToday.reduce((sum, order) => {
        // A placeholder for total calculation
        return sum + (order.items?.reduce((itemSum, item) => itemSum + (item.quantity * 50), 0) || 0);
    }, 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold">Today's Goals</h2>
                <p className="text-gray-400">Here's your progress for {new Date().toLocaleDateString('en-GB')}.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
                <StatCard title="Visits Done" value="0 / 5" />
                <StatCard title="New Orders" value={ordersToday.length} />
                <StatCard title="Sales" value={`$${salesToday.toFixed(2)}`} />
            </div>

            {/* Next Visit Card (Static for now) */}
            <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-custom-light-blue mb-2">Next Scheduled Visit</h3>
                <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">Visit <span className="font-bold text-white">Amsterdam Deli</span> to discuss their needs.</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center space-x-2 text-center">
                    <PlusCircle size={20} />
                    <span>New Order</span>
                </Link>
                <Link to="/customers" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center space-x-2 text-center">
                    <UserPlus size={20} />
                    <span>Add Customer</span>
                </Link>
            </div>
        </div>
    );
};

const StatCard = ({ title, value }) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-gray-400">{title}</p>
    </div>
);

export default AgentHomePage;