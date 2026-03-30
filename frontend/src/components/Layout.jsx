import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Bus, 
  Users, 
  Route, 
  FileText, 
  Truck, 
  Wrench, 
  Package, 
  UserCog,
  DollarSign,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ClipboardList,
  FileCheck
} from 'lucide-react'
import { useState, useMemo } from 'react'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const userRole = user?.role?.name || 'admin'

  const menuItems = useMemo(() => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'driver', 'mechanic'] }
    ]

    const adminItems = [
      { path: '/buses', label: 'Buses', icon: Bus },
      { path: '/drivers', label: 'Drivers', icon: Users },
      { path: '/fleet-routes', label: 'Routes', icon: Route },
      { path: '/contracts', label: 'Contracts', icon: FileText },
      { path: '/invoices', label: 'Invoices', icon: FileText },
      { path: '/vehicles', label: 'Client Vehicles', icon: Truck },
      { path: '/services', label: 'Services', icon: Wrench },
      { path: '/spare-parts', label: 'Spare Parts', icon: Package },
      { path: '/mechanics', label: 'Mechanics', icon: UserCog },
      { path: '/trip-reports', label: 'Trip Reports', icon: ClipboardList },
      { path: '/mechanic-records', label: 'Mechanic Records', icon: FileCheck },
      { path: '/expenses', label: 'Expenses', icon: DollarSign },
      { path: '/payments', label: 'Payments', icon: CreditCard },
      { path: '/reports', label: 'Reports', icon: BarChart3 },
      { path: '/users', label: 'Users', icon: Users }
    ]

    const driverItems = [
      { path: '/my-trips', label: 'My Trip Reports', icon: ClipboardList },
      { path: '/new-trip', label: 'New Trip Report', icon: Bus }
    ]

    const mechanicItems = [
      { path: '/my-services', label: 'My Service Records', icon: Wrench },
      { path: '/new-service', label: 'New Service Record', icon: FileCheck }
    ]

    if (userRole === 'admin') {
      return [...commonItems, ...adminItems, { path: '/settings', label: 'Settings', icon: Settings }]
    } else if (userRole === 'driver') {
      return [...commonItems, ...driverItems, { path: '/settings', label: 'Settings', icon: Settings }]
    } else if (userRole === 'mechanic') {
      return [...commonItems, ...mechanicItems, { path: '/settings', label: 'Settings', icon: Settings }]
    }

    return commonItems
  }, [userRole])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname)
    return currentItem?.label || 'SmartFleet Pro'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen bg-gray-900 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SmartFleet</span>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {getPageTitle()}
              </h2>
              {userRole !== 'admin' && (
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  userRole === 'driver' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button 
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role?.display_name || userRole}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <button 
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => { navigate('/settings'); setUserMenuOpen(false) }}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button 
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
