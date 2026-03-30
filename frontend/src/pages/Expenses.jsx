import { useState, useEffect } from 'react'
import { expenseService, busService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, DollarSign } from 'lucide-react'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [buses, setBuses] = useState([])
  const [formData, setFormData] = useState({
    category: 'other',
    description: '',
    amount: '',
    expense_date: '',
    payment_method: 'cash',
    reference_number: '',
    bus_id: '',
    status: 'pending',
    notes: ''
  })

  useEffect(() => {
    fetchExpenses()
    fetchBuses()
  }, [search, category])

  const fetchExpenses = async () => {
    try {
      const params = { search }
      if (category) params.category = category
      const response = await expenseService.getAll(params)
      setExpenses(response.data.data.expenses)
    } catch (error) {
      console.error('Error fetching expenses:', error)
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
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      }
      
      if (editData) {
        await expenseService.update(editData.id, data)
      } else {
        await expenseService.create(data)
      }
      setShowModal(false)
      resetForm()
      fetchExpenses()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving expense')
    }
  }

  const handleEdit = (expense) => {
    setEditData(expense)
    setFormData(expense)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id)
        fetchExpenses()
      } catch (error) {
        alert('Error deleting expense')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      category: 'other',
      description: '',
      amount: '',
      expense_date: '',
      payment_method: 'cash',
      reference_number: '',
      bus_id: '',
      status: 'pending',
      notes: ''
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
      paid: 'badge-info'
    }
    return badges[status] || 'badge-gray'
  }

  const getCategoryBadge = (category) => {
    const colors = {
      fuel: 'bg-orange-100 text-orange-800',
      salary: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-purple-100 text-purple-800',
      repairs: 'bg-red-100 text-red-800',
      insurance: 'bg-cyan-100 text-cyan-800',
      supplies: 'bg-gray-100 text-gray-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.other
  }

  const columns = [
    { key: 'expense_number', label: 'Expense No.' },
    { 
      key: 'category', 
      label: 'Category',
      render: (row) => (
        <span className={`badge ${getCategoryBadge(row.category)}`}>
          {row.category?.charAt(0).toUpperCase() + row.category?.slice(1)}
        </span>
      )
    },
    { key: 'description', label: 'Description' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (row) => (
        <span className="font-medium text-red-600">{formatCurrency(row.amount)}</span>
      )
    },
    { key: 'expense_date', label: 'Date' },
    { 
      key: 'bus_id', 
      label: 'Bus',
      render: (row) => row.bus?.plate_number || '-'
    },
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
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-500">Track and manage company expenses</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select-field md:w-48"
          >
            <option value="">All Categories</option>
            <option value="fuel">Fuel</option>
            <option value="salary">Salary</option>
            <option value="maintenance">Maintenance</option>
            <option value="repairs">Repairs</option>
            <option value="insurance">Insurance</option>
            <option value="supplies">Supplies</option>
            <option value="utilities">Utilities</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={expenses} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Expense' : 'Add New Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="select-field"
                required
              >
                <option value="fuel">Fuel</option>
                <option value="salary">Salary</option>
                <option value="maintenance">Maintenance</option>
                <option value="repairs">Repairs</option>
                <option value="insurance">Insurance</option>
                <option value="supplies">Supplies</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expense Date *</label>
              <input
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="select-field"
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input
                type="text"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Related Bus</label>
              <select
                value={formData.bus_id || ''}
                onChange={(e) => setFormData({ ...formData, bus_id: e.target.value })}
                className="select-field"
              >
                <option value="">None</option>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.id}>{bus.plate_number}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-field"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
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
