import React from 'react';
import { useSelector } from 'react-redux';
import { Edit, User, Package, ShoppingCart, Clock, TrendingUp } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import ReactApexChart from 'react-apexcharts';
import { calculateOrderTotal } from '../../lib/dataHelpers';
import LowStockWarning from './LowStockWarning'; // NEW: Import the new component
import { useTranslation } from 'react-i18next';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const customers = useSelector((state) => state.customers.items);
    const orders = useSelector((state) => state.orders.items);
    const products = useSelector((state) => state.products.items);
    const approvals = useSelector((state) => state.approvals.items);
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const newApprovals = approvals.filter(approval => approval.status === 'pending');

    const totalRevenue = orders.reduce((sum, order) => {
        return sum + calculateOrderTotal(order.items, products);
    }, 0);

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
                salesByDay[orderDate] += calculateOrderTotal(order.items, products);
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

    const chartSeries = [{ name: t('sales'), data: salesData.data }];


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('welcomeBack', { name: user?.name })}</h1>

            {/* NEW: Low stock warning will appear here */}
            <LowStockWarning />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard icon={<TrendingUp size={24} />} title={t('totalRevenue')} value={`$${(totalRevenue).toFixed(2)}`} />
                <StatCard icon={<User size={24} />} title={t('totalCustomers')} value={customers.length} />
                <StatCard icon={<Package size={24} />} title={t('totalProducts')} value={products.length} />
                <StatCard icon={<ShoppingCart size={24} />} title={t('totalOrders')} value={orders.length} />
                <StatCard icon={<Clock size={24} />} title={t('pendingApprovals')} value={newApprovals.length} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-custom-light-blue mb-4">{t('salesForLast7Days')}</h2>
                    <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={300} />
                </div>

                <div className="glass-panel rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-custom-light-blue mb-4">{t('pendingTasks')}</h2>
                    <div className="space-y-4">
                        <div className="glass-panel p-4 rounded-lg">
                            <h3 className="font-semibold">{t('pendingOrders')}: {pendingOrders.length}</h3>
                            <ul className="mt-2 text-sm text-gray-300">
                                {pendingOrders.slice(0, 3).map(order => (
                                    <li key={order.id} className="truncate">{t('orderNumberForCustomer', { id: order.id, name: customers.find(c => c.id === order.customerId)?.name || 'N/A' })}</li>
                                ))}
                                {pendingOrders.length > 3 && <li className="text-right text-xs text-blue-400">{t('andMore', { count: pendingOrders.length - 3 })}</li>}
                                {pendingOrders.length === 0 && <li>{t('noPendingOrders')}</li>}
                            </ul>
                        </div>
                        <div className="glass-panel p-4 rounded-lg">
                            <h3 className="font-semibold">{t('newApprovalRequests')}: {newApprovals.length}</h3>
                            <ul className="mt-2 text-sm text-gray-300">
                                {newApprovals.slice(0, 3).map(approval => (
                                    <li key={approval.id} className="truncate">{t('requestFrom', { id: approval.id, name: approval.requestorName })}</li>
                                ))}
                                {newApprovals.length > 3 && <li className="text-right text-xs text-blue-400">{t('andMore', { count: newApprovals.length - 3 })}</li>}
                                {newApprovals.length === 0 && <li>{t('noNewApprovalRequests')}</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-lg p-6">
                <h2 className="text-xl font-semibold text-custom-light-blue mb-4">{t('recentOrders')}</h2>
                <DataTable
                    headers={[t('orderId'), t('customer'), t('date'), t('total'), t('status'), t('actions')]}
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
                                    <span className={`status-pill ${statusColors[order.status]}`}>{t(order.status)}</span>
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