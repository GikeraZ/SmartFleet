import { useState, useEffect } from 'react'
import { dashboardService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { 
  Bus, 
  Users, 
  Route, 
  FileText, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Package,
  ClipboardList,
  Wrench,
  FileCheck
} from 'lucide-react'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const userRole = user?.role?.name || 'admin'

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (userRole === 'driver') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <ClipboardList className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-3xl font-bold">{stats?.overview?.activeDrivers || 0}</h3>
            <p className="opacity-80">Your Total Trips</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bus className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a href="/new-trip" className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Submit New Trip Report</p>
                    <p className="text-sm text-blue-600">Record today's trip details</p>
                  </div>
                </div>
              </a>
              <a href="/my-trips" className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">View My Trip History</p>
                    <p className="text-sm text-green-600">See all your submitted reports</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Important Information</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Always inspect your bus before starting a trip.
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Bus className="w-4 h-4 inline mr-2" />
                  Remember to log fuel levels accurately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userRole === 'mechanic') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mechanic Dashboard</h1>
          <p className="text-gray-500">Welcome, {user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <Wrench className="w-10 h-10 mb-4 opacity-80" />
            <h3 className="text-3xl font-bold">{stats?.overview?.vehiclesInService || 0}</h3>
            <p className="opacity-80">Vehicles in Service</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a href="/new-service" className="block p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="font-medium text-orange-900">Create New Service Record</p>
                    <p className="text-sm text-orange-600">Log a new service job</p>
                  </div>
                </div>
              </a>
              <a href="/my-services" className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">View My Service Records</p>
                    <p className="text-sm text-green-600">See all your completed services</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Important Information</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <Package className="w-4 h-4 inline mr-2" />
                  {stats?.alerts?.lowStockParts || 0} parts low in stock
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Wrench className="w-4 h-4 inline mr-2" />
                  {stats?.overview?.vehiclesInService || 0} vehicles awaiting service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { overview, financials, alerts, charts } = stats || {
    overview: {},
    financials: {},
    alerts: {},
    charts: {}
  }

  const statCards = [
    { label: 'Total Buses', value: overview.totalBuses || 0, icon: Bus, color: 'bg-blue-500' },
    { label: 'Active Drivers', value: overview.activeDrivers || 0, icon: Users, color: 'bg-green-500' },
    { label: 'Active Routes', value: overview.activeRoutes || 0, icon: Route, color: 'bg-purple-500' },
    { label: 'Contracts', value: overview.activeContracts || 0, icon: FileText, color: 'bg-indigo-500' },
    { label: 'In Service', value: overview.vehiclesInService || 0, icon: Wrench, color: 'bg-orange-500' },
    { label: 'Pending Invoices', value: overview.pendingInvoices || 0, icon: FileText, color: 'bg-red-500' }
  ]

  const revenueChartData = {
    labels: charts.revenueVsExpenses?.map(d => d.month) || [],
    datasets: [
      {
        label: 'Revenue',
        data: charts.revenueVsExpenses?.map(d => d.revenue) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 4
      },
      {
        label: 'Expenses',
        data: charts.revenueVsExpenses?.map(d => d.expenses) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderRadius: 4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card p-5">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses</h3>
          <div className="h-72">
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Monthly Revenue</span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                KES {financials.monthlyRevenue?.toLocaleString() || 0}
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <TrendingDown className="w-5 h-5" />
                <span className="font-medium">Monthly Expenses</span>
              </div>
              <p className="text-2xl font-bold text-red-700">
                KES {financials.monthlyExpenses?.toLocaleString() || 0}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Net Profit</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                KES {financials.netProfit?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Alerts</h3>
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            {alerts.expiringInsurances + alerts.expiringLicenses + alerts.lowStockParts} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.expiringInsurances > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {alerts.expiringInsurances} Bus Insurance Expiring
                </p>
                <p className="text-xs text-yellow-600">Within next 30 days</p>
              </div>
            </div>
          )}

          {alerts.expiringLicenses > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  {alerts.expiringLicenses} Licenses Expiring
                </p>
                <p className="text-xs text-orange-600">Within next 30 days</p>
              </div>
            </div>
          )}

          {alerts.lowStockParts > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <Package className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  {alerts.lowStockParts} Parts Low Stock
                </p>
                <p className="text-xs text-red-600">Below minimum quantity</p>
              </div>
            </div>
          )}

          {alerts.expiringInsurances === 0 && alerts.expiringLicenses === 0 && alerts.lowStockParts === 0 && (
            <div className="col-span-3 p-4 bg-green-50 rounded-lg text-center">
              <p className="text-green-700 font-medium">All Clear! No alerts at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
