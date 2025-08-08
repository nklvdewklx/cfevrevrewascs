import React from 'react';

const DataTable = ({ headers, data, renderRow }) => {
    return (
        <div className="overflow-x-auto glass-panel rounded-lg">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/10">
                        {headers.map((header) => (
                            <th key={header} className="p-4 text-left text-sm font-semibold text-custom-grey uppercase">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item) => renderRow(item))
                    ) : (
                        <tr>
                            <td colSpan={headers.length} className="text-center py-8 text-custom-grey">
                                No data available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;