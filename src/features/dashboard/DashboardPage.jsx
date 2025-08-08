import React from 'react';
import { useSelector } from 'react-redux';
import { Edit, User, Package, ShoppingCart, Clock, TrendingUp } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import ReactApexChart from 'react-apexcharts';

const DashboardPage = () => {
    // Select the data you need from the Redux store
    const { user } = useSelector((state) => state.auth);
    const customers = useSelector((state) => state.customers.items);
    const orders = useSelector((state) => state.orders.items);
    const products = useSelector((state) => state.products.items);
    const approvals = useSelector((state) => state.approvals.items);
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const newApprovals = approvals.filter(approval => approval.status === 'pending');

    // --- New: Accurate Revenue Calculation ---
    const calculateOrderTotal = (orderItems) => {
        return orderItems.reduce((total, item) => {
            const product = products.find(p => p.id === item.productId);
            const price = product?.pricingTiers[0]?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const totalRevenue = orders.reduce((sum, order) => {
        return sum + calculateOrderTotal(order.items);
    }, 0);

    // --- New: Data for the Sales Chart ---
    const getSalesDataForLast7Days = () => {
        const salesByDay = {};
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            salesByDay[dateString] = 0;
        }

        orders.forEach(order => {
            const orderDate = order.date;
            if (salesByDay.hasOwnProperty(orderDate)) {
                salesByDay[orderDate] += calculateOrderTotal(order.items);
            }
        });

        const sortedDates = Object.keys(salesByDay).sort();
        return {
            categories: sortedDates,
            data: sortedDates.map(date => salesByDay[date])
        };
    };

    const salesData = getSalesDataForLast7Days();

    const chartOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            foreColor: 'var(--color-text-faded)'
        },
        plotOptions: {
            bar: { borderRadius: 4 }
        },
        xaxis: { categories: salesData.categories },
        grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
        tooltip: { theme: 'dark' },
        colors: ['var(--color-primary-dark)']
    };

    const chartSeries = [{ name: 'Sales', data: salesData.data }];


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name}!</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard icon={<TrendingUp size={24} />} title="Total Revenue" value={`$${(totalRevenue).toFixed(2)}`} />
                <StatCard icon={<User size={24} />} title="Total Customers" value={customers.length} />
                <StatCard icon={<Package size={24} />} title="Total Products" value={products.length} />
                <StatCard icon={<ShoppingCart size={24} />} title="Total Orders" value={orders.length} />
                <StatCard icon={<Clock size={24} />} title="Pending Approvals" value={newApprovals.length} />
            </div>

            {/* Main Content: Chart and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="glass-panel rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-custom-light-blue mb-4">Sales for Last 7 Days</h2>
                    <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
                </div>

                {/* Pending Tasks */}
                <div className="glass-panel rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-custom-light-blue mb-4">Pending Tasks</h2>
                    <div className="space-y-4">
                        <div className="glass-panel p-4 rounded-lg">
                            <h3 className="font-semibold">Pending Orders: {pendingOrders.length}</h3>
                            <ul className="mt-2 text-sm text-gray-300">
                                {pendingOrders.slice(0, 3).map(order => (
                                    <li key={order.id} className="truncate">Order #{order.id} for Customer {customers.find(c => c.id === order.customerId)?.name || 'N/A'}</li>
                                ))}
                                {pendingOrders.length > 3 && <li className="text-right text-xs text-blue-400">... and {pendingOrders.length - 3} more</li>}
                                {pendingOrders.length === 0 && <li>No pending orders.</li>}
                            </ul>
                        </div>
                        <div className="glass-panel p-4 rounded-lg">
                            <h3 className="font-semibold">New Approval Requests: {newApprovals.length}</h3>
                            <ul className="mt-2 text-sm text-gray-300">
                                {newApprovals.slice(0, 3).map(approval => (
                                    <li key={approval.id} className="truncate">Request #{approval.id} from {approval.requestorName}</li>
                                ))}
                                {newApprovals.length > 3 && <li className="text-right text-xs text-blue-400">... and {newApprovals.length - 3} more</li>}
                                {newApprovals.length === 0 && <li>No new approval requests.</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="glass-panel rounded-lg p-6">
                <h2 className="text-xl font-semibold text-custom-light-blue mb-4">Recent Orders</h2>
                <DataTable
                    headers={['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions']}
                    data={orders.slice(0, 5)}
                    renderRow={(order) => {
                        const customer = customers.find(c => c.id === order.customerId);
                        const total = calculateOrderTotal(order.items, products);
                        const statusColors = { pending: 'status-pending', completed: 'status-completed', shipped: 'status-shipped', cancelled: 'status-cancelled' };
                        return (
                            <tr key={order.id} className="border-b border-white/10 last:border-b-0">
                                <td className="p-3">#{order.id}</td>
                                <td className="p-3">{customer?.name || 'N/A'}</td>
                                <td className="p-3">{order.date}</td>
                                <td className="p-3 font-semibold">${total.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`status-pill ${statusColors[order.status]}`}>{order.status}</span>
                                </td>
                                <td className="p-3">
                                    <button className="text-custom-light-blue hover:text-white">
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        )
                    }}
                />
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