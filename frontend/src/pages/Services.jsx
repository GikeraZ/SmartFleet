import { useState, useEffect } from 'react'
import { serviceService, vehicleService, mechanicService, sparePartService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, Wrench } from 'lucide-react'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [mechanics, setMechanics] = useState([])
  const [spareParts, setSpareParts] = useState([])
  const [formData, setFormData] = useState({
    vehicle_id: '',
    service_type: '',
    description: '',
    mechanic_id: '',
    labor_hours: '',
    labor_cost: '',
    parts_cost: '',
    total_cost: '',
    service_date: '',
    completion_date: '',
    status: 'pending',
    warranty: '',
    notes: ''
  })

  useEffect(() => {
    fetchServices()
    fetchVehicles()
    fetchMechanics()
    fetchSpareParts()
  }, [search, status])

  const fetchServices = async () => {
    try {
      const response = await serviceService.getAll({ search, status })
      setServices(response.data.data.services)
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getAll({ status: 'active' })
      setVehicles(response.data.data.vehicles)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const fetchMechanics = async () => {
    try {
      const response = await mechanicService.getAll()
      setMechanics(response.data.data)
    } catch (error) {
      console.error('Error fetching mechanics:', error)
    }
  }

  const fetchSpareParts = async () => {
    try {
      const response = await sparePartService.getAll()
      setSpareParts(response.data.data.spareParts)
    } catch (error) {
      console.error('Error fetching spare parts:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        labor_hours: parseFloat(formData.labor_hours) || 0,
        labor_cost: parseFloat(formData.labor_cost) || 0,
        parts_cost: parseFloat(formData.parts_cost) || 0,
        total_cost: parseFloat(formData.total_cost) || 0
      }
      
      if (editData) {
        await serviceService.update(editData.id, data)
      } else {
        await serviceService.create(data)
      }
      setShowModal(false)
      resetForm()
      fetchServices()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving service')
    }
  }

  const handleEdit = (service) => {
    setEditData(service)
    setFormData(service)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service record?')) {
      try {
        await serviceService.delete(id)
        fetchServices()
      } catch (error) {
        alert('Error deleting service')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      vehicle_id: '',
      service_type: '',
      description: '',
      mechanic_id: '',
      labor_hours: '',
      labor_cost: '',
      parts_cost: '',
      total_cost: '',
      service_date: '',
      completion_date: '',
      status: 'pending',
      warranty: '',
      notes: ''
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      in_progress: 'badge-info',
      completed: 'badge-success',
      delivered: 'badge-gray'
    }
    return badges[status] || 'badge-gray'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { key: 'service_number', label: 'Service No.' },
    { key: 'service_type', label: 'Service Type' },
    { 
      key: 'vehicle_id', 
      label: 'Vehicle',
      render: (row) => row.vehicle?.registration_number || 'N/A'
    },
    { 
      key: 'mechanic_id', 
      label: 'Mechanic',
      render: (row) => row.mechanic?.name || 'Not Assigned'
    },
    { 
      key: 'service_date', 
      label: 'Service Date'
    },
    { 
      key: 'total_cost', 
      label: 'Cost',
      render: (row) => formatCurrency(row.total_cost)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${getStatusBadge(row.status)}`}>
          {row.status?.replace('_', ' ')?.charAt(0).toUpperCase() + row.status?.replace('_', ' ')?.slice(1)}
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
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-500">Track vehicle service records</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Service
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
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
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={services} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Service' : 'New Service Record'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle *</label>
              <select
                value={formData.vehicle_id}
                onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                className="select-field"
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.registration_number} - {v.make} {v.model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
              <input
                type="text"
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="input-field"
                placeholder="e.g., Full Service, Repair"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Mechanic</label>
              <select
                value={formData.mechanic_id || ''}
                onChange={(e) => setFormData({ ...formData, mechanic_id: e.target.value })}
                className="select-field"
              >
                <option value="">Select Mechanic</option>
                {mechanics.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Date *</label>
              <input
                type="date"
                value={formData.service_date}
                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labor Hours</label>
              <input
                type="number"
                step="0.5"
                value={formData.labor_hours}
                onChange={(e) => setFormData({ ...formData, labor_hours: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Labor Cost</label>
              <input
                type="number"
                value={formData.labor_cost}
                onChange={(e) => setFormData({ ...formData, labor_cost: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parts Cost</label>
              <input
                type="number"
                value={formData.parts_cost}
                onChange={(e) => setFormData({ ...formData, parts_cost: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
              <input
                type="number"
                value={formData.total_cost}
                onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty</label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="input-field"
                placeholder="e.g., 3 months"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="2"
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
