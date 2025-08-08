import React from 'react';
import { useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';

// A helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const ReportsPage = () => {
    // --- 1. Select all necessary data from the Redux store ---
    const orders = useSelector((state) => state.orders.items);
    const products = useSelector((state) => state.products.items);
    const customers = useSelector((state) => state.customers.items);

    // --- 2. Process data for KPIs and charts ---

    // Calculate total revenue
    const totalRevenue = orders.reduce((total, order) => {
        const orderTotal = order.items?.reduce((itemSum, item) => {
            const product = products.find(p => p.id === item.productId);
            const price = product?.pricingTiers[0]?.price || 0;
            return itemSum + (price * item.quantity);
        }, 0) || 0;
        return total + orderTotal;
    }, 0);

    // Get top selling products by revenue
    const productRevenue = products.map(product => {
        const revenue = orders.reduce((sum, order) => {
            const itemInOrder = order.items?.find(item => item.productId === product.id);
            if (itemInOrder) {
                const price = product.pricingTiers[0]?.price || 0;
                return sum + (price * itemInOrder.quantity);
            }
            return sum;
        }, 0);
        return { name: product.name, revenue };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);


    // --- 3. Configure charts ---

    const topProductsChartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, foreColor: '#8a9cb1' },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: productRevenue.map(p => p.name), labels: { formatter: (val) => formatCurrency(val) } },
        grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
        tooltip: { theme: 'dark' }
    };

    const topProductsChartSeries = [{
        name: 'Revenue',
        data: productRevenue.map(p => p.revenue.toFixed(2))
    }];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Business Reports</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<DollarSign />} title="Total Revenue" value={formatCurrency(totalRevenue)} />
                <StatCard icon={<ShoppingCart />} title="Total Orders" value={orders.length} />
                <StatCard icon={<Users />} title="Total Customers" value={customers.length} />
                <StatCard icon={<Package />} title="Product Types" value={products.length} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
                <div className="glass-panel rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-custom-light-blue mb-4">Top 5 Selling Products by Revenue</h2>
                    <ReactApexChart options={topProductsChartOptions} series={topProductsChartSeries} type="bar" height={350} />
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value }) => (
    <div className="glass-panel p-6 rounded-lg flex items-center space-x-4">
        <div className="bg-gray-900/50 p-3 rounded-lg text-custom-light-blue">{icon}</div>
        <div>
            <p className="text-sm text-custom-grey">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default ReportsPage;