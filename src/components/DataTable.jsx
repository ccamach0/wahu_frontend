import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente de tabla de datos mejorado
 * Soporta: sorting, highlighting, actions, responsive
 */
export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  sortable = true,
  onSort,
  highlighted = [],
  actions,
  onAction,
  emptyMessage = 'No hay datos',
  striped = true,
  hoverable = true,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, order: 'asc' });

  const handleSort = (columnKey) => {
    if (!sortable) return;

    let newOrder = 'asc';
    if (sortConfig.key === columnKey && sortConfig.order === 'asc') {
      newOrder = 'desc';
    }

    setSortConfig({ key: columnKey, order: newOrder });
    onSort?.(columnKey, newOrder);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  px-4 py-3 text-left font-semibold text-gray-700
                  ${col.width ? `w-${col.width}` : ''}
                  ${sortable && col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {sortable && col.sortable !== false && (
                    <div className="inline-block text-gray-400">
                      {sortConfig.key === col.key ? (
                        sortConfig.order === 'asc' ? (
                          <ChevronUp size={14} />
                        ) : (
                          <ChevronDown size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} />
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-left font-semibold text-gray-700">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className={`
                border-b border-gray-200 transition-colors
                ${striped && idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                ${hoverable ? 'hover:bg-wahu-50' : ''}
                ${highlighted.includes(row.id) ? 'bg-wahu-100' : ''}
              `}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.key}
                        onClick={() => onAction?.(action.key, row)}
                        className={`
                          text-xs font-medium px-2.5 py-1.5 rounded transition-colors
                          ${action.className || 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
                        `}
                        title={action.title}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
