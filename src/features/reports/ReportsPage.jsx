import React from 'react';
import { useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { calculateOrderTotal } from '../../lib/dataHelpers';
import { useTranslation } from 'react-i18next';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const ReportsPage = () => {
    const { t } = useTranslation();
    const orders = useSelector((state) => state.orders.items);
    const products = useSelector((state) => state.products.items);
    const customers = useSelector((state) => state.customers.items);
    const { items: creditNotes } = useSelector((state) => state.creditNotes);

    const totalRevenue = orders.reduce((total, order) => {
        const orderTotal = order.items?.reduce((itemSum, item) => {
            const product = products.find(p => p.id === item.productId);
            const price = product?.pricingTiers[0]?.price || 0;
            return itemSum + (price * item.quantity);
        }, 0) || 0;
        return total + orderTotal;
    }, 0);
    const totalCredits = creditNotes.reduce((sum, cn) => sum + cn.amount, 0);
    const netRevenue = totalRevenue - totalCredits;

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

    const chartColors = ['var(--color-primary-dark)'];

    const topProductsChartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, foreColor: 'var(--color-text-faded)' },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        dataLabels: { enabled: false },
        xaxis: { categories: productRevenue.map(p => p.name), labels: { formatter: (val) => formatCurrency(val) } },
        grid: { borderColor: 'rgba(255, 255, 255, 0.1)' },
        tooltip: { theme: 'dark' },
        colors: chartColors
    };

    const topProductsChartSeries = [{
        name: t('revenue'),
        data: productRevenue.map(p => p.revenue.toFixed(2))
    }];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('businessReports')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<DollarSign />} title={t('netRevenue')} value={formatCurrency(netRevenue)} />
                <StatCard icon={<ShoppingCart />} title={t('totalOrders')} value={orders.length} />
                <StatCard icon={<Users />} title={t('totalCustomers')} value={customers.length} />
                <StatCard icon={<Package />} title={t('productTypes')} value={products.length} />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="glass-panel rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-custom-light-blue mb-4">{t('top5SellingProducts')}</h2>
                    <ReactApexChart options={topProductsChartOptions} series={topProductsChartSeries} type="bar" height={350} />
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }) => (
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

export default ReportsPage;