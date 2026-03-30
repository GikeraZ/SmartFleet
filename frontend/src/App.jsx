import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Buses from './pages/Buses'
import Drivers from './pages/Drivers'
import FleetRoutes from './pages/Routes'
import Contracts from './pages/Contracts'
import Invoices from './pages/Invoices'
import Vehicles from './pages/Vehicles'
import Services from './pages/Services'
import SpareParts from './pages/SpareParts'
import Mechanics from './pages/Mechanics'
import Expenses from './pages/Expenses'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Settings from './pages/Settings'
import MyTrips from './pages/MyTrips'
import NewTrip from './pages/NewTrip'
import MyServices from './pages/MyServices'
import NewService from './pages/NewService'
import TripReports from './pages/TripReports'
import MechanicRecords from './pages/MechanicRecords'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }
  
  if (!user) return <Navigate to="/login" />
  if (user.role?.name !== 'admin') return <Navigate to="/dashboard" />
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route path="buses" element={<AdminRoute><Buses /></AdminRoute>} />
            <Route path="drivers" element={<AdminRoute><Drivers /></AdminRoute>} />
            <Route path="fleet-routes" element={<AdminRoute><FleetRoutes /></AdminRoute>} />
            <Route path="contracts" element={<AdminRoute><Contracts /></AdminRoute>} />
            <Route path="invoices" element={<AdminRoute><Invoices /></AdminRoute>} />
            <Route path="vehicles" element={<AdminRoute><Vehicles /></AdminRoute>} />
            <Route path="services" element={<AdminRoute><Services /></AdminRoute>} />
            <Route path="spare-parts" element={<AdminRoute><SpareParts /></AdminRoute>} />
            <Route path="mechanics" element={<AdminRoute><Mechanics /></AdminRoute>} />
            <Route path="expenses" element={<AdminRoute><Expenses /></AdminRoute>} />
            <Route path="payments" element={<AdminRoute><Payments /></AdminRoute>} />
            <Route path="reports" element={<AdminRoute><Reports /></AdminRoute>} />
            <Route path="users" element={<AdminRoute><Users /></AdminRoute>} />
            
            <Route path="trip-reports" element={<AdminRoute><TripReports /></AdminRoute>} />
            <Route path="mechanic-records" element={<AdminRoute><MechanicRecords /></AdminRoute>} />
            
            <Route path="my-trips" element={<MyTrips />} />
            <Route path="new-trip" element={<NewTrip />} />
            <Route path="my-services" element={<MyServices />} />
            <Route path="new-service" element={<NewService />} />
            
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
