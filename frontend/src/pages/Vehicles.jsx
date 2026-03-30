import { useState, useEffect } from 'react'
import { vehicleService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, Truck } from 'lucide-react'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [formData, setFormData] = useState({
    registration_number: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    vehicle_type: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    fuel_type: '',
    color: '',
    status: 'active',
    notes: ''
  })

  useEffect(() => {
    fetchVehicles()
  }, [search, status])

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getAll({ search, status })
      setVehicles(response.data.data.vehicles)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await vehicleService.update(editData.id, formData)
      } else {
        await vehicleService.create(formData)
      }
      setShowModal(false)
      resetForm()
      fetchVehicles()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving vehicle')
    }
  }

  const handleEdit = (vehicle) => {
    setEditData(vehicle)
    setFormData(vehicle)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.delete(id)
        fetchVehicles()
      } catch (error) {
        alert('Error deleting vehicle')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      registration_number: '',
      client_name: '',
      client_phone: '',
      client_email: '',
      vehicle_type: '',
      make: '',
      model: '',
      year: '',
      vin: '',
      mileage: '',
      fuel_type: '',
      color: '',
      status: 'active',
      notes: ''
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      under_service: 'badge-warning',
      completed: 'badge-info',
      delivered: 'badge-gray'
    }
    return badges[status] || 'badge-gray'
  }

  const formatStatus = (status) => {
    return status?.replace('_', ' ')?.charAt(0).toUpperCase() + status?.replace('_', ' ')?.slice(1)
  }

  const columns = [
    { key: 'registration_number', label: 'Reg. Number' },
    { key: 'client_name', label: 'Client' },
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { 
      key: 'mileage', 
      label: 'Mileage',
      render: (row) => row.mileage ? `${row.mileage.toLocaleString()} km` : 'N/A'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${getStatusBadge(row.status)}`}>
          {formatStatus(row.status)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Vehicle Management</h1>
          <p className="text-gray-500">Manage vehicles under garage service</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select-field md:w-48"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="under_service">Under Service</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={vehicles} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Vehicle' : 'Add New Vehicle'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
              <input
                type="text"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Phone</label>
              <input
                type="text"
                value={formData.client_phone}
                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
              <input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <input
                type="text"
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                className="input-field"
                placeholder="e.g., Sedan, SUV, Truck"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={formData.fuel_type}
                onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                className="select-field"
              >
                <option value="">Select</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                <option value="active">Active</option>
                <option value="under_service">Under Service</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
