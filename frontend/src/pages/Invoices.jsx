import { useState, useEffect } from 'react'
import { invoiceService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, FileDown, DollarSign, Download } from 'lucide-react'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [paymentData, setPaymentData] = useState({ amount: '', payment_method: 'cash', reference_number: '' })
  const [formData, setFormData] = useState({
    invoice_number: '',
    client_name: '',
    client_address: '',
    issue_date: '',
    due_date: '',
    items: [],
    subtotal: '',
    tax: '',
    total: '',
    notes: ''
  })
  const [itemInput, setItemInput] = useState({ description: '', quantity: 1, unit_price: 0 })

  useEffect(() => {
    fetchInvoices()
  }, [search, status])

  const fetchInvoices = async () => {
    try {
      const response = await invoiceService.getAll({ search, status })
      setInvoices(response.data.data.invoices)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        subtotal: parseFloat(formData.subtotal),
        tax: parseFloat(formData.tax || 0),
        total: parseFloat(formData.total)
      }
      
      if (editData) {
        await invoiceService.update(editData.id, data)
      } else {
        await invoiceService.create(data)
      }
      setShowModal(false)
      resetForm()
      fetchInvoices()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving invoice')
    }
  }

  const handleRecordPayment = async (e) => {
    e.preventDefault()
    try {
      await invoiceService.recordPayment(selectedInvoice.id, paymentData)
      setShowPaymentModal(false)
      setPaymentData({ amount: '', payment_method: 'cash', reference_number: '' })
      fetchInvoices()
    } catch (error) {
      alert('Error recording payment')
    }
  }

  const handleEdit = (invoice) => {
    setEditData(invoice)
    setFormData(invoice)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoiceService.delete(id)
        fetchInvoices()
      } catch (error) {
        alert('Error deleting invoice')
      }
    }
  }

  const handleDownloadPDF = async (id) => {
    try {
      const response = await invoiceService.getPDF(id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Error downloading PDF')
    }
  }

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice)
    setPaymentData({ 
      amount: (invoice.total - invoice.amount_paid).toString(), 
      payment_method: 'cash', 
      reference_number: '' 
    })
    setShowPaymentModal(true)
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      invoice_number: '',
      client_name: '',
      client_address: '',
      issue_date: '',
      due_date: '',
      items: [],
      subtotal: '',
      tax: '',
      total: '',
      notes: ''
    })
    setItemInput({ description: '', quantity: 1, unit_price: 0 })
  }

  const addItem = () => {
    if (itemInput.description && itemInput.unit_price > 0) {
      const newItem = {
        ...itemInput,
        total: itemInput.quantity * itemInput.unit_price
      }
      const newItems = [...formData.items, newItem]
      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
      setFormData({
        ...formData,
        items: newItems,
        subtotal: subtotal.toString(),
        total: (subtotal + parseFloat(formData.tax || 0)).toString()
      })
      setItemInput({ description: '', quantity: 1, unit_price: 0 })
    }
  }

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
    setFormData({
      ...formData,
      items: newItems,
      subtotal: subtotal.toString(),
      total: (subtotal + parseFloat(formData.tax || 0)).toString()
    })
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      paid: 'badge-success',
      partial: 'badge-info',
      overdue: 'badge-danger',
      cancelled: 'badge-gray'
    }
    return badges[status] || 'badge-gray'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { key: 'invoice_number', label: 'Invoice No.' },
    { key: 'client_name', label: 'Client' },
    { key: 'issue_date', label: 'Issue Date' },
    { key: 'due_date', label: 'Due Date' },
    { 
      key: 'total', 
      label: 'Amount',
      render: (row) => formatCurrency(row.total)
    },
    { 
      key: 'amount_paid', 
      label: 'Paid',
      render: (row) => formatCurrency(row.amount_paid)
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
          <button onClick={() => handleDownloadPDF(row.id)} className="p-1 text-gray-600 hover:bg-gray-100 rounded" title="Download PDF">
            <Download className="w-4 h-4" />
          </button>
          {row.status !== 'paid' && (
            <button onClick={() => openPaymentModal(row)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Record Payment">
              <DollarSign className="w-4 h-4" />
            </button>
          )}
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
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-500">Create and manage invoices</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={invoices} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit Invoice' : 'Create Invoice'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number *</label>
              <input
                type="text"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="input-field"
                required
              />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Items</label>
            <div className="border rounded-lg p-4 mb-3">
              <div className="grid grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={itemInput.description}
                  onChange={(e) => setItemInput({ ...itemInput, description: e.target.value })}
                  className="input-field col-span-6"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={itemInput.quantity}
                  onChange={(e) => setItemInput({ ...itemInput, quantity: parseInt(e.target.value) || 1 })}
                  className="input-field col-span-2"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={itemInput.unit_price}
                  onChange={(e) => setItemInput({ ...itemInput, unit_price: parseFloat(e.target.value) || 0 })}
                  className="input-field col-span-3"
                />
                <button type="button" onClick={addItem} className="btn-secondary col-span-1">+</button>
              </div>
            </div>
            
            {formData.items.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Total</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="text-right">{formatCurrency(item.total)}</td>
                      <td>
                        <button type="button" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800">
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(formData.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax:</span>
                <input
                  type="number"
                  value={formData.tax || 0}
                  onChange={(e) => {
                    const tax = parseFloat(e.target.value) || 0
                    setFormData({
                      ...formData,
                      tax: tax.toString(),
                      total: (parseFloat(formData.subtotal || 0) + tax).toString()
                    })
                  }}
                  className="input-field w-32 text-right"
                />
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(formData.total || 0)}</span>
              </div>
            </div>
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
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        title="Record Payment"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              value={paymentData.amount}
              onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={paymentData.payment_method}
              onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
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
              value={paymentData.reference_number}
              onChange={(e) => setPaymentData({ ...paymentData, reference_number: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setShowPaymentModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Record Payment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
