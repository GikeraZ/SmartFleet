import { useState, useEffect } from 'react'
import { userService } from '../services/api'
import Modal from '../components/Modal'
import DataTable from '../components/DataTable'
import { Plus, Search, Edit, Trash2, UserCircle } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 2,
    phone: '',
    address: '',
    status: 'active'
  })

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [search])

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll({ search })
      setUsers(response.data.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await userService.getRoles()
      setRoles(response.data.data)
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editData) {
        await userService.update(editData.id, formData)
      } else {
        await userService.create(formData)
      }
      setShowModal(false)
      resetForm()
      fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving user')
    }
  }

  const handleEdit = (user) => {
    setEditData(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role_id: user.role_id,
      phone: user.phone || '',
      address: user.address || '',
      status: user.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id)
        fetchUsers()
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user')
      }
    }
  }

  const resetForm = () => {
    setEditData(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      role_id: 2,
      phone: '',
      address: '',
      status: 'active'
    })
  }

  const getStatusBadge = (status) => {
    return status === 'active' ? 'badge-success' : 'badge-gray'
  }

  const columns = [
    { 
      key: 'name', 
      label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-medium">{row.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      key: 'role_id', 
      label: 'Role',
      render: (row) => row.role?.display_name || 'N/A'
    },
    { key: 'phone', label: 'Phone' },
    { key: 'last_login', label: 'Last Login' },
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage system users and roles</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true) }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <DataTable columns={columns} data={users} loading={loading} />
      </div>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title={editData ? 'Edit User' : 'Add New User'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {editData ? '(Leave blank to keep current)' : '*'}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required={!editData}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                className="select-field"
                required
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.display_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
