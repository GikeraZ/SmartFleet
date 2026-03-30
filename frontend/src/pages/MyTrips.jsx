import { useState, useEffect } from 'react'
import { tripReportService } from '../services/api'
import DataTable from '../components/DataTable'
import { ClipboardList, Search } from 'lucide-react'

export default function MyTrips() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyReports()
  }, [])

  const fetchMyReports = async () => {
    try {
      const response = await tripReportService.getMyReports()
      setReports(response.data.data)
    } catch (error) {
      console.error('Error fetching trip reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const columns = [
    { key: 'trip_date', label: 'Date', render: (row) => formatDate(row.trip_date) },
    { key: 'farm_name', label: 'Farm Name' },
    { key: 'departure_time', label: 'Departure' },
    { key: 'arrival_time', label: 'Arrival' },
    { 
      key: 'bus_id', 
      label: 'Bus',
      render: (row) => row.bus?.plate_number || 'N/A'
    },
    { 
      key: 'fuel_before', 
      label: 'Fuel Before',
      render: (row) => row.fuel_before ? `${row.fuel_before}%` : '-'
    },
    { 
      key: 'fuel_after', 
      label: 'Fuel After',
      render: (row) => row.fuel_after ? `${row.fuel_after}%` : '-'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Trip Reports</h1>
          <p className="text-gray-500">View your submitted trip reports</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={reports} loading={loading} />
      </div>
    </div>
  )
}
