import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({ columns, data, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg">No data found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="table-header">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="table-cell">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
