import { useState, useEffect } from 'react'
import { mechanicService } from '../services/api'
import DataTable from '../components/DataTable'
import { UserCog, CheckCircle, Clock, Wrench } from 'lucide-react'

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMechanic, setSelectedMechanic] = useState(null)
  const [performance, setPerformance] = useState(null)

  useEffect(() => {
    fetchMechanics()
  }, [])

  const fetchMechanics = async () => {
    try {
      const response = await mechanicService.getAll()
      setMechanics(response.data.data)
    } catch (error) {
      console.error('Error fetching mechanics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPerformance = async (id) => {
    try {
      const response = await mechanicService.getPerformance(id)
      setPerformance(response.data.data)
    } catch (error) {
      console.error('Error fetching performance:', error)
    }
  }

  const handleViewPerformance = (mechanic) => {
    setSelectedMechanic(mechanic)
    fetchPerformance(mechanic.id)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">{row.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'completedJobs', 
      label: 'Completed Jobs',
      render: (row) => (
        <span className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          {row.completedJobs}
        </span>
      )
    },
    { 
      key: 'pendingJobs', 
      label: 'Pending Jobs',
      render: (row) => (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-yellow-500" />
          {row.pendingJobs}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${row.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'View Details',
      render: (row) => (
        <button 
          onClick={() => handleViewPerformance(row)}
          className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg"
        >
          View Performance
        </button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mechanic Management</h1>
          <p className="text-gray-500">View mechanic performance and assignments</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={mechanics} loading={loading} />
      </div>

      {selectedMechanic && performance && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Report: {selectedMechanic.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Wrench className="w-5 h-5" />
                <span className="font-medium">Total Jobs</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{performance.totalJobs}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{performance.completedJobs}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{performance.inProgressJobs}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <span className="font-medium">Revenue Generated</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(performance.revenue)}</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Average Labor Hours per Job:</span> {performance.avgLaborHours.toFixed(2)} hours
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => setSelectedMechanic(null)}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
