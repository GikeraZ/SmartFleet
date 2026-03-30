import { useState, useEffect } from 'react'
import { mechanicRecordService } from '../services/api'
import DataTable from '../components/DataTable'

export default function MyServices() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyRecords()
  }, [])

  const fetchMyRecords = async () => {
    try {
      const response = await mechanicRecordService.getMyRecords()
      setRecords(response.data.data)
    } catch (error) {
      console.error('Error fetching service records:', error)
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { key: 'service_date', label: 'Service Date', render: (row) => formatDate(row.service_date) },
    { key: 'vehicle_type', label: 'Vehicle Type' },
    { key: 'number_plate', label: 'Plate Number' },
    { key: 'problem_description', label: 'Problem' },
    { 
      key: 'spare_part_price', 
      label: 'Spare Part Cost',
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
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Service Records</h1>
          <p className="text-gray-500">View your submitted service records</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={records} loading={loading} />
      </div>
    </div>
  )
}
