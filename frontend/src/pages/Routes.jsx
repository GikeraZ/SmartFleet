import { useState, useEffect } from 'react'
import { routeService, driverService, busService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, Route as RouteIcon } from 'lucide-react'

export default function Routes() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [shift, setShift] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [buses, setBuses] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    pickup_points: [],
    distance: '',
    estimated_duration: '',
    shift: 'morning',
    departure_time: '',
    return_time: '',
    driver_id: '',
    bus_id: '',
    worker_count: '',
    status: 'active',
    fare_per_trip: '',
    notes: ''
  })
  const [pickupInput, setPickupInput] = useState('')

  useEffect(() => {
    fetchRoutes()
    fetchDrivers()
    fetchBuses()
  }, [search, shift, status])

  const fetchRoutes = async () => {
    try {
      const response = await routeService.getAll({ search, shift, status })
      setRoutes(response.data.data.routes)
    } catch (error) {
      console.error('Error fetching routes:', error)
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
      const data = { ...formData }
      if (data.driver_id === '') data.driver_id = null
      if (data.bus_id === '') data.bus_id = null
      
      if (editData) {
        await routeService.update(editData.id, data)
      } else {
        await routeService.create(data)
      }
      setShowModal(false)
      resetForm()
      fetchRoutes()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving route')
    }
  }

  const handleEdit = (route) => {
    setEditData(route)
    setFormData(route)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this route?')) {
      try {
        await routeService.delete(id)
        fetchRoutes()
      } catch (error) {
        alert('Error deleting route')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setPickupInput('')
    setFormData({
      name: '',
      origin: '',
      destination: '',
      pickup_points: [],
      distance: '',
      estimated_duration: '',
      shift: 'morning',
      departure_time: '',
      return_time: '',
      driver_id: '',
      bus_id: '',
      worker_count: '',
      status: 'active',
      fare_per_trip: '',
      notes: ''
    })
  }

  const addPickupPoint = () => {
    if (pickupInput.trim()) {
      setFormData({
        ...formData,
        pickup_points: [...formData.pickup_points, pickupInput.trim()]
      })
      setPickupInput('')
    }
  }

  const removePickupPoint = (index) => {
    setFormData({
      ...formData,
      pickup_points: formData.pickup_points.filter((_, i) => i !== index)
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      inactive: 'badge-gray'
    }
    return badges[status] || 'badge-gray'
  }

  const getShiftBadge = (shift) => {
    const badges = {
      morning: 'badge-warning',
      evening: 'badge-info',
      night: 'badge-gray'
    }
    return badges[shift] || 'badge-gray'
  }

  const columns = [
    { key: 'name', label: 'Route Name' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { 
      key: 'shift', 
      label: 'Shift',
      render: (row) => (
        <span className={`badge ${getShiftBadge(row.shift)}`}>
          {row.shift?.charAt(0).toUpperCase() + row.shift?.slice(1)}
        </span>
      )
    },
    { 
      key: 'driver_id', 
      label: 'Driver',
      render: (row) => row.driver?.name || 'Not Assigned'
    },
    { 
      key: 'bus_id', 
      label: 'Bus',
      render: (row) => row.bus?.plate_number || 'Not Assigned'
    },
    { key: 'worker_count', label: 'Workers' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`badge ${getStatusBadge(row.status)}`}>
          {row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
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
          <h1 className="text-2xl font-bold text-gray-900">Route Management</h1>
          <p className="text-gray-500">Manage transport routes and schedules</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Route
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search routes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="select-field md:w-40"
          >
            <option value="">All Shifts</option>
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select-field md:w-40"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={routes} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Route' : 'Add New Route'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="select-field"
              >
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (min)</label>
              <input
                type="number"
                value={formData.estimated_duration}
                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
              <input
                type="time"
                value={formData.departure_time}
                onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
              <input
                type="time"
                value={formData.return_time}
                onChange={(e) => setFormData({ ...formData, return_time: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Driver</label>
              <select
                value={formData.driver_id || ''}
                onChange={(e) => setFormData({ ...formData, driver_id: e.target.value })}
                className="select-field"
              >
                <option value="">Select Driver</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>{driver.name}</option>
                ))}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Worker Count</label>
              <input
                type="number"
                value={formData.worker_count}
                onChange={(e) => setFormData({ ...formData, worker_count: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fare per Trip</label>
              <input
                type="number"
                value={formData.fare_per_trip}
                onChange={(e) => setFormData({ ...formData, fare_per_trip: e.target.value })}
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
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Points</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={pickupInput}
                onChange={(e) => setPickupInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPickupPoint())}
                placeholder="Add pickup point..."
                className="input-field flex-1"
              />
              <button type="button" onClick={addPickupPoint} className="btn-secondary">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.pickup_points.map((point, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {point}
                  <button type="button" onClick={() => removePickupPoint(index)} className="text-gray-500 hover:text-red-600">
                    ×
                  </button>
                </span>
              ))}
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
