import { useState, useEffect } from 'react'
import { sparePartService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, PlusCircle, MinusCircle } from 'lucide-react'

export default function SpareParts() {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [lowStock, setLowStock] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [selectedPart, setSelectedPart] = useState(null)
  const [adjustment, setAdjustment] = useState(0)
  const [formData, setFormData] = useState({
    part_number: '',
    name: '',
    category: '',
    description: '',
    quantity: 0,
    min_quantity: 5,
    unit: 'piece',
    cost_price: 0,
    selling_price: 0,
    supplier_name: '',
    supplier_contact: '',
    location: '',
    status: 'active',
    notes: ''
  })

  useEffect(() => {
    fetchParts()
  }, [search, category, lowStock])

  const fetchParts = async () => {
    try {
      const params = { search, lowStock: lowStock ? 'true' : '' }
      if (category) params.category = category
      const response = await sparePartService.getAll(params)
      setParts(response.data.data.spareParts)
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        quantity: parseInt(formData.quantity),
        min_quantity: parseInt(formData.min_quantity),
        cost_price: parseFloat(formData.cost_price),
        selling_price: parseFloat(formData.selling_price)
      }
      
      if (editData) {
        await sparePartService.update(editData.id, data)
      } else {
        await sparePartService.create(data)
      }
      setShowModal(false)
      resetForm()
      fetchParts()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving part')
    }
  }

  const handleAdjustStock = async (e) => {
    e.preventDefault()
    try {
      await sparePartService.adjustStock(selectedPart.id, { adjustment: parseInt(adjustment) })
      setShowAdjustModal(false)
      setSelectedPart(null)
      setAdjustment(0)
      fetchParts()
    } catch (error) {
      alert('Error adjusting stock')
    }
  }

  const handleEdit = (part) => {
    setEditData(part)
    setFormData(part)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this spare part?')) {
      try {
        await sparePartService.delete(id)
        fetchParts()
      } catch (error) {
        alert('Error deleting part')
      }
    }
  }

  const openAdjustModal = (part) => {
    setSelectedPart(part)
    setAdjustment(0)
    setShowAdjustModal(true)
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      part_number: '',
      name: '',
      category: '',
      description: '',
      quantity: 0,
      min_quantity: 5,
      unit: 'piece',
      cost_price: 0,
      selling_price: 0,
      supplier_name: '',
      supplier_contact: '',
      location: '',
      status: 'active',
      notes: ''
    })
  }

  const getStatusBadge = (part) => {
    if (part.quantity <= part.min_quantity) return 'badge-danger'
    const badges = {
      active: 'badge-success',
      discontinued: 'badge-gray',
      out_of_stock: 'badge-danger'
    }
    return badges[part.status] || 'badge-gray'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { key: 'part_number', label: 'Part No.' },
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { 
      key: 'quantity', 
      label: 'Quantity',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className={row.quantity <= row.min_quantity ? 'text-red-600 font-medium' : ''}>
            {row.quantity} {row.unit}
          </span>
          {row.quantity <= row.min_quantity && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
      )
    },
    { 
      key: 'cost_price', 
      label: 'Cost Price',
      render: (row) => formatCurrency(row.cost_price)
    },
    { 
      key: 'selling_price', 
      label: 'Selling Price',
      render: (row) => formatCurrency(row.selling_price)
    },
    { key: 'supplier_name', label: 'Supplier' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openAdjustModal(row)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Adjust Stock">
            <Package className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Spare Parts Inventory</h1>
          <p className="text-gray-500">Manage spare parts stock</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Part
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field md:w-40"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => setLowStock(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-700">Low Stock Only</span>
          </label>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={parts} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Spare Part' : 'Add New Spare Part'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Number *</label>
              <input
                type="text"
                value={formData.part_number}
                onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                className="input-field"
                required
              />
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
                placeholder="e.g., Brakes, Filters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity</label>
              <input
                type="number"
                value={formData.min_quantity}
                onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="select-field"
              >
                <option value="piece">Piece</option>
                <option value="set">Set</option>
                <option value="liter">Liter</option>
                <option value="kg">Kg</option>
                <option value="pair">Pair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
              <input
                type="text"
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Contact</label>
              <input
                type="text"
                value={formData.supplier_contact}
                onChange={(e) => setFormData({ ...formData, supplier_contact: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
                placeholder="e.g., Shelf A1"
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
                <option value="discontinued">Discontinued</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
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

      <Modal 
        isOpen={showAdjustModal} 
        onClose={() => setShowAdjustModal(false)} 
        title="Adjust Stock"
      >
        <form onSubmit={handleAdjustStock} className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">{selectedPart?.name}</p>
            <p className="text-sm text-gray-500">Current Stock: {selectedPart?.quantity} {selectedPart?.unit}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setAdjustment(adjustment - 1)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                <MinusCircle className="w-6 h-6" />
              </button>
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                className="input-field text-center text-xl font-bold w-32"
              />
              <button
                type="button"
                onClick={() => setAdjustment(adjustment + 1)}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              New Stock: {Math.max(0, (selectedPart?.quantity || 0) + adjustment)} {selectedPart?.unit}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowAdjustModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Adjust Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
