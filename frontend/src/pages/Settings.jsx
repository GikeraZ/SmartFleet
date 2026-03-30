import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/api'
import { User, Lock, Bell, Shield } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setMessage('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'permissions', label: 'Permissions', icon: Shield }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account settings</p>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex-1 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={user?.role?.display_name || 'N/A'}
                      className="input-field"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={user?.phone || 'Not set'}
                      className="input-field"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Change Password</h3>
                
                {message && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <div className="space-y-4">
                  {['Email Notifications', 'SMS Notifications', 'Push Notifications'].map(item => (
                    <label key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                      <span>{item}</span>
                      <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" defaultChecked />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Your Permissions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(user?.permissions || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
