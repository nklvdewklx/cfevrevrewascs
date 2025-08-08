import React from 'react';
import { useSelector } from 'react-redux';
import { Edit, User, Package, ShoppingCart } from 'lucide-react';

const DashboardPage = () => {
    // Select the data you need from the Redux store
    const { user } = useSelector((state) => state.auth);
    const customers = useSelector((state) => state.customers.items);
    const orders = useSelector((state) => state.orders.items);
    const products = useSelector((state) => state.products.items);

    // Basic stats calculation
    const totalRevenue = orders.reduce((sum, order) => {
        // NOTE: This is a simplified calculation.
        // In a real scenario, we'd have a more complex `calculateOrderTotal` function.
        return sum + (order.items.reduce((itemSum, item) => itemSum + (item.quantity * 50), 0) || 0);
    }, 0);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<ShoppingCart size={24} />} title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}k`} />
                <StatCard icon={<User size={24} />} title="Total Customers" value={customers.length} />
                <StatCard icon={<Package size={24} />} title="Total Products" value={products.length} />
                <StatCard icon={<ShoppingCart size={24} />} title="Total Orders" value={orders.length} />
            </div>

            {/* Recent Activity Section */}
            <div className="glass-panel rounded-lg p-6">
                <h2 className="text-xl font-semibold text-custom-light-blue mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-3 text-sm font-semibold text-custom-grey">Order ID</th>
                                <th className="text-left p-3 text-sm font-semibold text-custom-grey">Customer</th>
                                <th className="text-left p-3 text-sm font-semibold text-custom-grey">Status</th>
                                <th className="text-left p-3 text-sm font-semibold text-custom-grey">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(0, 5).map(order => {
                                const customer = customers.find(c => c.id === order.customerId);
                                return (
                                    <tr key={order.id} className="border-b border-white/10 last:border-b-0">
                                        <td className="p-3">#{order.id}</td>
                                        <td className="p-3">{customer?.name || 'N/A'}</td>
                                        <td className="p-3">
                                            <span className={`status-pill status-${order.status}`}>{order.status}</span>
                                        </td>
                                        <td className="p-3">
                                            <button className="text-custom-light-blue hover:text-white">
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// A simple reusable component for stat cards
const StatCard = ({ icon, title, value }) => {
    return (
        <div className="glass-panel p-6 rounded-lg flex items-center space-x-4">
            <div className="bg-gray-900/50 p-3 rounded-lg text-custom-light-blue">
                {icon}
            </div>
            <div>
                <p className="text-sm text-custom-grey">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};


export default DashboardPage;