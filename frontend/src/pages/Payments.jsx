import { useState, useEffect } from 'react'
import { paymentService } from '../services/api'
import DataTable from '../components/DataTable'
import { Search, Trash2, CreditCard } from 'lucide-react'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [search])

  const fetchPayments = async () => {
    try {
      const params = {}
      if (search) params.search = search
      const response = await paymentService.getAll(params)
      setPayments(response.data.data.payments)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this payment record?')) {
      try {
        await paymentService.delete(id)
        fetchPayments()
      } catch (error) {
        alert('Error deleting payment')
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  const columns = [
    { key: 'payment_number', label: 'Payment No.' },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (row) => (
        <span className="font-medium text-green-600">{formatCurrency(row.amount)}</span>
      )
    },
    { key: 'payment_date', label: 'Payment Date' },
    { 
      key: 'payment_method', 
      label: 'Method',
      render: (row) => (
        <span className="capitalize">{row.payment_method?.replace('_', ' ')}</span>
      )
    },
    { key: 'reference_number', label: 'Reference' },
    { key: 'payer_name', label: 'Payer' },
    { 
      key: 'invoice_id', 
      label: 'Invoice',
      render: (row) => row.invoice?.invoice_number || '-'
    },
    { 
      key: 'contract_id', 
      label: 'Contract',
      render: (row) => row.contract?.contract_number || '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button onClick={() => handleDelete(row.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-500">Track all received payments</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={payments} loading={loading} />
      </div>
    </div>
  )
}
