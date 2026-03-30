import { useState, useEffect } from 'react'
import { tripReportService } from '../services/api'
import DataTable from '../components/DataTable'
import { Search, Plus, Edit, Trash2, ClipboardList } from 'lucide-react'

export default function TripReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchReports()
  }, [search])

  const fetchReports = async () => {
    try {
      const response = await tripReportService.getAll({ search })
      setReports(response.data.data.reports)
    } catch (error) {
      console.error('Error fetching trip reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this trip report?')) {
      try {
        await tripReportService.delete(id)
        fetchReports()
      } catch (error) {
        alert('Error deleting trip report')
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

  const columns = [
    { key: 'trip_date', label: 'Date', render: (row) => formatDate(row.trip_date) },
    { key: 'farm_name', label: 'Farm Name' },
    { 
      key: 'driver_id', 
      label: 'Driver',
      render: (row) => row.driver?.name || 'N/A'
    },
    { 
      key: 'bus_id', 
      label: 'Bus',
      render: (row) => row.bus?.plate_number || 'N/A'
    },
    { key: 'departure_time', label: 'Departure' },
    { key: 'arrival_time', label: 'Arrival' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
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
          <h1 className="text-2xl font-bold text-gray-900">Trip Reports</h1>
          <p className="text-gray-500">View all driver trip reports</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by farm name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={reports} loading={loading} />
      </div>
    </div>
  )
}
