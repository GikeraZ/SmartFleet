import { useState } from 'react'
import { tripReportService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Bus, CheckCircle } from 'lucide-react'

export default function NewTrip() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    farm_name: '',
    trip_date: new Date().toISOString().split('T')[0],
    departure_time: '',
    arrival_time: '',
    bus_condition_before: '',
    bus_condition_after: '',
    fuel_before: '',
    fuel_after: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await tripReportService.create(formData)
      alert('Trip report submitted successfully!')
      navigate('/my-trips')
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting trip report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Trip Report</h1>
        <p className="text-gray-500">Submit a new trip report</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name *</label>
              <input
                type="text"
                name="farm_name"
                value={formData.farm_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter farm name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trip Date *</label>
              <input
                type="date"
                name="trip_date"
                value={formData.trip_date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time *</label>
              <input
                type="time"
                name="departure_time"
                value={formData.departure_time}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
              <input
                type="time"
                name="arrival_time"
                value={formData.arrival_time}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Before Trip (%)</label>
              <input
                type="number"
                name="fuel_before"
                value={formData.fuel_before}
                onChange={handleChange}
                className="input-field"
                min="0"
                max="100"
                placeholder="e.g., 80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel After Trip (%)</label>
              <input
                type="number"
                name="fuel_after"
                value={formData.fuel_after}
                onChange={handleChange}
                className="input-field"
                min="0"
                max="100"
                placeholder="e.g., 60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bus Condition BEFORE Trip</label>
            <textarea
              name="bus_condition_before"
              value={formData.bus_condition_before}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Describe bus condition before starting the trip..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bus Condition AFTER Trip</label>
            <textarea
              name="bus_condition_after"
              value={formData.bus_condition_after}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Describe bus condition after completing the trip..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/my-trips')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
