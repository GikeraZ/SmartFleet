import { useState, useEffect } from 'react'
import { driverService, busService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, Users } from 'lucide-react'

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [buses, setBuses] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    license_number: '',
    license_expiry: '',
    license_type: 'Class D',
    bus_id: '',
    salary: '',
    hire_date: '',
    date_of_birth: '',
    emergency_contact: '',
    emergency_phone: '',
    status: 'active',
    notes: ''
  })

  useEffect(() => {
    fetchDrivers()
    fetchBuses()
  }, [search, status])

  const fetchDrivers = async () => {
    try {
      const response = await driverService.getAll({ search, status })
      setDrivers(response.data.data.drivers)
    } catch (error) {
      console.error('Error fetching drivers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBuses = async () => {
    try {
      const response = await busService.getAll({ status: 'active' })
      setBuses(response.data.data.buses)
    } catch (error) {
      console.error('Error fetching buses:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await driverService.update(editData.id, formData)
      } else {
        await driverService.create(formData)
      }
      setShowModal(false)
      resetForm()
      fetchDrivers()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving driver')
    }
  }

  const handleEdit = (driver) => {
    setEditData(driver)
    setFormData(driver)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this driver?')) {
      try {
        await driverService.delete(id)
        fetchDrivers()
      } catch (error) {
        alert('Error deleting driver')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      license_number: '',
      license_expiry: '',
      license_type: 'Class D',
      bus_id: '',
      salary: '',
      hire_date: '',
      date_of_birth: '',
      emergency_contact: '',
      emergency_phone: '',
      status: 'active',
      notes: ''
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-gray',
      on_leave: 'badge-warning'
    }
    return badges[status] || 'badge-gray'
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'license_number', label: 'License No.' },
    { key: 'license_expiry', label: 'License Expiry' },
    { 
      key: 'bus_id', 
      label: 'Assigned Bus',
      render: (row) => row.bus?.plate_number || 'Not Assigned'
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
      key: 'rating', 
      label: 'Rating',
      render: (row) => row.rating ? `${row.rating}/5` : 'N/A'
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
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-500">Manage your fleet drivers</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or license number..."
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
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={drivers} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Driver' : 'Add New Driver'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
              <input
                type="text"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry *</label>
              <input
                type="date"
                value={formData.license_expiry}
                onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
              <select
                value={formData.license_type}
                onChange={(e) => setFormData({ ...formData, license_type: e.target.value })}
                className="select-field"
              >
                <option value="Class D">Class D</option>
                <option value="Class C">Class C</option>
                <option value="Class B">Class B</option>
                <option value="Class A">Class A</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Bus</label>
              <select
                value={formData.bus_id || ''}
                onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
                className="select-field"
              >
                <option value="">Select Bus</option>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.id}>{bus.plate_number} - {bus.model}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
              <input
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              rows="2"
            />
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
