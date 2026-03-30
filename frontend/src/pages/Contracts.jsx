import { useState, useEffect } from 'react'
import { contractService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, FileText, FileDown } from 'lucide-react'

export default function Contracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [formData, setFormData] = useState({
    contract_number: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    service_type: 'transport',
    description: '',
    start_date: '',
    end_date: '',
    monthly_payment: '',
    total_value: '',
    status: 'active',
    terms: '',
    notes: ''
  })

  useEffect(() => {
    fetchContracts()
  }, [search, status])

  const fetchContracts = async () => {
    try {
      const response = await contractService.getAll({ search, status })
      setContracts(response.data.data.contracts)
    } catch (error) {
      console.error('Error fetching contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await contractService.update(editData.id, formData)
      } else {
        await contractService.create(formData)
      }
      setShowModal(false)
      resetForm()
      fetchContracts()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving contract')
    }
  }

  const handleEdit = (contract) => {
    setEditData(contract)
    setFormData(contract)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      try {
        await contractService.delete(id)
        fetchContracts()
      } catch (error) {
        alert('Error deleting contract')
      }
    }
  }

  const handleGenerateInvoice = async (id) => {
    if (confirm('Generate invoice for this contract?')) {
      try {
        await contractService.generateInvoice(id)
        alert('Invoice generated successfully!')
      } catch (error) {
        alert('Error generating invoice')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      contract_number: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      client_address: '',
      service_type: 'transport',
      description: '',
      start_date: '',
      end_date: '',
      monthly_payment: '',
      total_value: '',
      status: 'active',
      terms: '',
      notes: ''
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-success',
      expired: 'badge-danger',
      terminated: 'badge-gray',
      pending: 'badge-warning'
    }
    return badges[status] || 'badge-gray'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { key: 'contract_number', label: 'Contract No.' },
    { key: 'client_name', label: 'Client' },
    { 
      key: 'service_type', 
      label: 'Service Type',
      render: (row) => row.service_type?.charAt(0).toUpperCase() + row.service_type?.slice(1)
    },
    { 
      key: 'monthly_payment', 
      label: 'Monthly Payment',
      render: (row) => formatCurrency(row.monthly_payment)
    },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
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
          <button onClick={() => handleGenerateInvoice(row.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Generate Invoice">
            <FileDown className="w-4 h-4" />
          </button>
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
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-500">Manage client contracts and agreements</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Contract
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select-field md:w-40"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={contracts} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Contract' : 'New Contract'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Number *</label>
              <input
                type="text"
                value={formData.contract_number}
                onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
              <input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                className="input-field"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <select
                value={formData.service_type}
                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                className="select-field"
              >
                <option value="transport">Transport</option>
                <option value="garage">Garage</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment *</label>
              <input
                type="number"
                value={formData.monthly_payment}
                onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
            <textarea
              value={formData.client_address}
              onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
              className="input-field"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terms</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
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
