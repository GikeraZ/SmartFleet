import { useState, useEffect } from 'react'
import { mechanicRecordService } from '../services/api'
import DataTable from '../components/DataTable'
import { Search, Trash2 } from 'lucide-react'

export default function MechanicRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRecords()
  }, [search])

  const fetchRecords = async () => {
    try {
      const response = await mechanicRecordService.getAll({ search })
      setRecords(response.data.data.records)
    } catch (error) {
      console.error('Error fetching mechanic records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service record?')) {
      try {
        await mechanicRecordService.delete(id)
        fetchRecords()
      } catch (error) {
        alert('Error deleting service record')
      }
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { key: 'service_date', label: 'Service Date', render: (row) => formatDate(row.service_date) },
    { key: 'vehicle_type', label: 'Vehicle Type' },
    { key: 'number_plate', label: 'Plate Number' },
    { 
      key: 'mechanic_id', 
      label: 'Mechanic',
      render: (row) => row.mechanic?.name || 'N/A'
    },
    { key: 'problem_description', label: 'Problem', render: (row) => (
      <span className="truncate block max-w-xs">{row.problem_description}</span>
    )},
    { 
      key: 'spare_part_price', 
      label: 'Part Cost',
      render: (row) => formatCurrency(row.spare_part_price)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'completed' ? 'badge-success' : row.status === 'in_progress' ? 'badge-info' : 'badge-warning'}`}>
          {row.status?.replace('_', ' ')?.charAt(0).toUpperCase() + row.status?.replace('_', ' ')?.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button onClick={() => handleDelete(row.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mechanic Service Records</h1>
          <p className="text-gray-500">View all mechanic service records</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by plate number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={records} loading={loading} />
      </div>
    </div>
  )
}
