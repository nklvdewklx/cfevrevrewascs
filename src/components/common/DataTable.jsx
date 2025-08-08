import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, ListCollapse } from 'lucide-react';

const DataTable = ({ headers, data, renderRow, initialSort, searchable = true, filters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState(initialSort || { key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sortedAndFilteredData = useMemo(() => {
        if (!data) return [];

        let filteredData = [...data];

        if (filters && filters.activeFilters) {
            filteredData = filteredData.filter(item => {
                let isMatch = true;
                for (const key in filters.activeFilters) {
                    const filterValue = filters.activeFilters[key];
                    if (filterValue && String(item[key]) !== String(filterValue)) {
                        isMatch = false;
                        break;
                    }
                }
                return isMatch;
            });
        }

        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            filteredData = filteredData.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(lowercasedSearchTerm)
                )
            );
        }

        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredData;
    }, [data, searchTerm, sortConfig, filters]);

    const totalItems = sortedAndFilteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return sortedAndFilteredData.slice(indexOfFirstItem, indexOfLastItem);
    }, [currentPage, sortedAndFilteredData]);

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                {searchable && (
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search size={16} className="text-custom-grey" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="form-input pl-10"
                        />
                    </div>
                )}
                {filters && filters.controls}
            </div>

            <div className="overflow-x-auto glass-panel rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-white/5">
                        <tr className="border-b border-white/10">
                            {/* CORRECTED: This mapping is now safer and won't produce key warnings */}
                            {headers.map((header, index) => {
                                const isObjectHeader = typeof header === 'object' && header !== null;
                                const key = isObjectHeader ? header.key : `header-${index}`;
                                const label = isObjectHeader ? header.label : header;
                                const sortable = isObjectHeader && header.sortable;
                                const sortKey = isObjectHeader ? header.key : null;

                                return (
                                    <th
                                        key={key}
                                        className="p-4 text-left text-sm font-semibold text-custom-grey uppercase cursor-pointer"
                                        onClick={() => sortable && handleSort(sortKey)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>{label}</span>
                                            {sortable && (
                                                sortConfig.key === sortKey ? (
                                                    sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                                                ) : (
                                                    <ChevronUp size={16} className="text-transparent" />
                                                )
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item) => renderRow(item))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-16 text-custom-grey">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <ListCollapse size={32} />
                                        <p className="font-semibold text-white">No data available.</p>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center text-custom-grey">
                    <span className="text-sm">
                        {`Showing ${itemsPerPage * (currentPage - 1) + 1} to ${Math.min(itemsPerPage * currentPage, totalItems)} of ${totalItems} entries`}
                    </span>
                    <div className="flex space-x-2">
                        <button onClick={handlePrevPage} disabled={currentPage === 1} className="p-2 disabled:opacity-50 hover:bg-white/5 rounded-lg">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50 hover:bg-white/5 rounded-lg">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;