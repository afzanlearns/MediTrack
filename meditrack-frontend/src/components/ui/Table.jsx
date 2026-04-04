import React from 'react';
import { Database } from 'lucide-react';

const Table = ({ columns, data, loading, emptyMessage = 'No data available' }) => {
  return (
    <div className="w-full overflow-x-auto border border-border rounded-xl bg-card shadow-soft">
      <table className="w-full text-left border-collapse">
        <thead className="bg-page-bg/85">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-[0.08em]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-4 bg-bg-elevated rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12">
                <div className="flex flex-col items-center justify-center text-text-secondary gap-2">
                  <Database className="w-8 h-8 opacity-20" />
                  <span className="text-sm font-medium">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr 
                key={row.id || i} 
                className="bg-bg-surface hover:bg-page-bg/70 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4 text-sm text-text-primary align-middle">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
