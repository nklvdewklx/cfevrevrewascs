import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronRight, ChevronsRight, Package, ClipboardList } from 'lucide-react';
import Button from '../../components/common/Button';

const TraceabilityReportPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState(null);

    const { items: productionOrders } = useSelector((state) => state.productionOrders);
    const { items: products } = useSelector((state) => state.products);
    const { items: components } = useSelector((state) => state.components);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setResults(null);
            return;
        }

        let foundResult = { type: null, data: {} };

        // 1. Search for a finished product lot number
        const productLotMatch = productionOrders.find(po => po.lotNumber === searchTerm.trim());
        if (productLotMatch) {
            foundResult.type = 'product';
            foundResult.data.productionOrder = productLotMatch;
            foundResult.data.product = products.find(p => p.id === productLotMatch.productId);
            foundResult.data.componentsUsed = productLotMatch.componentsUsed.map(used => ({
                ...used,
                component: components.find(c => c.id === used.componentId)
            }));
        } else {
            // 2. If not a product lot, search for a component supplier lot number
            const componentLotMatches = productionOrders.filter(po =>
                po.componentsUsed.some(c => c.supplierLotNumber === searchTerm.trim())
            );

            if (componentLotMatches.length > 0) {
                const componentUsed = componentLotMatches[0].componentsUsed.find(c => c.supplierLotNumber === searchTerm.trim());
                foundResult.type = 'component';
                foundResult.data.component = components.find(c => c.id === componentUsed.componentId);
                foundResult.data.supplierLotNumber = searchTerm.trim();
                foundResult.data.usedIn = componentLotMatches.map(po => ({
                    ...po,
                    product: products.find(p => p.id === po.productId)
                }));
            }
        }

        setResults(foundResult.type ? foundResult : null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">{t('traceabilityReport')}</h1>

            <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search size={16} className="text-custom-grey" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('searchByLotNumber')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input pl-10"
                    />
                </div>
                <Button type="submit" variant="primary">{t('search')}</Button>
            </form>

            {results && (
                <div className="glass-panel p-6 rounded-lg animate-fade-in">
                    {results.type === 'product' && <ProductTraceResult result={results.data} />}
                    {results.type === 'component' && <ComponentTraceResult result={results.data} />}
                </div>
            )}
            {!results && searchTerm && (
                <div className="text-center py-8 text-custom-grey">
                    <p>{t('noTraceabilityResults')}</p>
                </div>
            )}
        </div>
    );
};

// Component to display trace results for a Finished Product Lot
const ProductTraceResult = ({ result }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{t('traceabilityForProductLot')}</h2>
            <div className="flex items-center space-x-4 bg-gray-900/50 p-4 rounded-lg">
                <Package size={32} className="text-custom-light-blue" />
                <div>
                    <h3 className="font-bold text-lg">{result.product.name}</h3>
                    <p className="text-sm text-custom-grey">{t('lotNumber')}: {result.productionOrder.lotNumber}</p>
                </div>
            </div>

            <div className="my-6">
                <h3 className="font-semibold text-lg mb-2">{t('upstreamTraceComponents')}</h3>
                <div className="space-y-2">
                    {result.componentsUsed.map((used, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-1/3">
                                <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md">
                                    <ClipboardList size={16} />
                                    <span className="text-sm font-semibold">{used.component.name}</span>
                                </div>
                            </div>
                            <ChevronsRight size={20} className="text-custom-grey" />
                            <div className="flex-grow">
                                <div className="bg-gray-800 p-2 rounded-md">
                                    <p className="text-sm">{t('supplierLotNumber')}: <span className="font-mono">{used.supplierLotNumber}</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Note about downstream traceability */}
            <p className="text-xs text-custom-grey mt-6">{t('downstreamTraceNote')}</p>
        </div>
    );
};

// Component to display trace results for a Component Lot
const ComponentTraceResult = ({ result }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{t('traceabilityForComponentLot')}</h2>
            <div className="flex items-center space-x-4 bg-gray-900/50 p-4 rounded-lg">
                <ClipboardList size={32} className="text-custom-light-blue" />
                <div>
                    <h3 className="font-bold text-lg">{result.component.name}</h3>
                    <p className="text-sm text-custom-grey">{t('supplierLotNumber')}: {result.supplierLotNumber}</p>
                </div>
            </div>

            <div className="my-6">
                <h3 className="font-semibold text-lg mb-2">{t('downstreamTraceProducts')}</h3>
                <div className="space-y-2">
                    {result.usedIn.map((po, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-1/3">
                                <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded-md">
                                    <Package size={16} />
                                    <span className="text-sm font-semibold">{po.product.name}</span>
                                </div>
                            </div>
                            <ChevronsRight size={20} className="text-custom-grey" />
                            <div className="flex-grow">
                                <Link to={`/production-orders/${po.id}`} className="block bg-gray-800 p-2 rounded-md hover:bg-gray-700">
                                    <p className="text-sm">{t('lotNumber')}: <span className="font-mono">{po.lotNumber}</span></p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default TraceabilityReportPage;