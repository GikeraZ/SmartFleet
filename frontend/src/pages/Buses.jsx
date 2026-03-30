import { useState, useEffect } from 'react'
import { busService, driverService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, Bus } from 'lucide-react'

export default function Buses() {
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [formData, setFormData] = useState({
    plate_number: '',
    model: '',
    brand: '',
    year: '',
    capacity: '',
    status: 'active',
    fuel_type: 'diesel',
    mileage: '',
    insurance_expiry: '',
    inspection_date: '',
    next_service_date: '',
    color: '',
    vin: '',
    notes: ''
  })

  useEffect(() => {
    fetchBuses()
    fetchDrivers()
  }, [search, status])

  const fetchBuses = async () => {
    try {
      const response = await busService.getAll({ search, status })
      setBuses(response.data.data.buses)
    } catch (error) {
      console.error('Error fetching buses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDrivers = async () => {
    try {
      const response = await driverService.getAll({ status: 'active' })
      setDrivers(response.data.data.drivers)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await busService.update(editData.id, formData)
      } else {
        await busService.create(formData)
      }
      setShowModal(false)
      resetForm()
      fetchBuses()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving bus')
    }
  }

  const handleEdit = (bus) => {
    setEditData(bus)
    setFormData(bus)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this bus?')) {
      try {
        await busService.delete(id)
        fetchBuses()
      } catch (error) {
        alert('Error deleting bus')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      plate_number: '',
      model: '',
      brand: '',
      year: '',
      capacity: '',
      status: 'active',
      fuel_type: 'diesel',
      mileage: '',
      insurance_expiry: '',
      inspection_date: '',
      next_service_date: '',
      color: '',
      vin: '',
      notes: ''
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      maintenance: 'badge-warning',
      inactive: 'badge-gray'
    }
    return badges[status] || 'badge-gray'
  }

  const columns = [
    { key: 'plate_number', label: 'Plate Number' },
    { key: 'model', label: 'Model' },
    { key: 'brand', label: 'Brand' },
    { key: 'capacity', label: 'Capacity' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${getStatusBadge(row.status)}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
        </span>
      )
    },
    { key: 'insurance_expiry', label: 'Insurance Expiry' },
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
          <h1 className="text-2xl font-bold text-gray-900">Bus Management</h1>
          <p className="text-gray-500">Manage your fleet of buses</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Bus
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by plate number or model..."
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
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={buses} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Bus' : 'Add New Bus'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
              <input
                type="text"
                value={formData.plate_number}
                onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={formData.fuel_type}
                onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                className="select-field"
              >
                <option value="diesel">Diesel</option>
                <option value="petrol">Petrol</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Expiry</label>
              <input
                type="date"
                value={formData.insurance_expiry}
                onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Date</label>
              <input
                type="date"
                value={formData.inspection_date}
                onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Date</label>
              <input
                type="date"
                value={formData.next_service_date}
                onChange={(e) => setFormData({ ...formData, next_service_date: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="input-field"
              />
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
