import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getAlerts: () => api.get('/dashboard/alerts')
}

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  changePassword: (data) => api.post('/auth/change-password', data)
}

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getRoles: () => api.get('/users/roles')
}

export const busService = {
  getAll: (params) => api.get('/buses', { params }),
  getById: (id) => api.get(`/buses/${id}`),
  create: (data) => api.post('/buses', data),
  update: (id, data) => api.put(`/buses/${id}`, data),
  delete: (id) => api.delete(`/buses/${id}`),
  getStats: () => api.get('/buses/stats')
}

export const driverService = {
  getAll: (params) => api.get('/drivers', { params }),
  getById: (id) => api.get(`/drivers/${id}`),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`)
}

export const routeService = {
  getAll: (params) => api.get('/routes', { params }),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post('/routes', data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`)
}

export const contractService = {
  getAll: (params) => api.get('/contracts', { params }),
  getById: (id) => api.get(`/contracts/${id}`),
  create: (data) => api.post('/contracts', data),
  update: (id, data) => api.put(`/contracts/${id}`, data),
  delete: (id) => api.delete(`/contracts/${id}`),
  generateInvoice: (id) => api.post(`/contracts/${id}/generate-invoice`)
}

export const invoiceService = {
  getAll: (params) => api.get('/invoices', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  recordPayment: (id, data) => api.post(`/invoices/${id}/payment`, data),
  getPDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
}

export const vehicleService = {
  getAll: (params) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`)
}

export const serviceService = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
}

export const sparePartService = {
  getAll: (params) => api.get('/spare-parts', { params }),
  getById: (id) => api.get(`/spare-parts/${id}`),
  create: (data) => api.post('/spare-parts', data),
  update: (id, data) => api.put(`/spare-parts/${id}`, data),
  delete: (id) => api.delete(`/spare-parts/${id}`),
  getLowStockAlerts: () => api.get('/spare-parts/alerts/low-stock'),
  adjustStock: (id, data) => api.post(`/spare-parts/${id}/adjust-stock`, data)
}

export const mechanicService = {
  getAll: () => api.get('/mechanics'),
  getById: (id) => api.get(`/mechanics/${id}`),
  getPerformance: (id, params) => api.get(`/mechanics/${id}/performance`, { params })
}

export const expenseService = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getSummary: (params) => api.get('/expenses/summary', { params })
}

export const paymentService = {
  getAll: (params) => api.get('/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  delete: (id) => api.delete(`/payments/${id}`),
  getSummary: (params) => api.get('/payments/summary', { params })
}

export const reportService = {
  getFinancialReport: (params) => api.get('/reports/financial', { params }),
  getPDF: (params) => api.get('/reports/financial/pdf', { params, responseType: 'blob' }),
  exportCSV: (params) => api.get('/reports/export', { params })
}

export const tripReportService = {
  getMyReports: () => api.get('/trips/my'),
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`)
}

export const mechanicRecordService = {
  getMyRecords: () => api.get('/mechanic-services/my'),
  getAll: (params) => api.get('/mechanic-services', { params }),
  getById: (id) => api.get(`/mechanic-services/${id}`),
  create: (data) => api.post('/mechanic-services', data),
  update: (id, data) => api.put(`/mechanic-services/${id}`, data),
  delete: (id) => api.delete(`/mechanic-services/${id}`)
}
