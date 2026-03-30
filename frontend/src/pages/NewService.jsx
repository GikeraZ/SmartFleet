import { useState } from 'react'
import { mechanicRecordService } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { Wrench, CheckCircle } from 'lucide-react'

export default function NewService() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    vehicle_type: 'Bus',
    number_plate: '',
    problem_description: '',
    spare_part_description: '',
    spare_part_price: '',
    service_date: new Date().toISOString().split('T')[0]
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await mechanicRecordService.create({
        ...formData,
        spare_part_price: parseFloat(formData.spare_part_price) || 0
      })
      alert('Service record created successfully!')
      navigate('/my-services')
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating service record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Service Record</h1>
        <p className="text-gray-500">Submit a new service record</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="select-field"
                required
              >
                <option value="Bus">Bus</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number Plate *</label>
              <input
                type="text"
                name="number_plate"
                value={formData.number_plate}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., KBU-001A"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Date *</label>
              <input
                type="date"
                name="service_date"
                value={formData.service_date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spare Part Price (KES)</label>
              <input
                type="number"
                name="spare_part_price"
                value={formData.spare_part_price}
                onChange={handleChange}
                className="input-field"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Problem Description *</label>
            <textarea
              name="problem_description"
              value={formData.problem_description}
              onChange={handleChange}
              className="input-field"
              rows="4"
              placeholder="Describe the problem and service provided..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spare Part Description</label>
            <textarea
              name="spare_part_description"
              value={formData.spare_part_description}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="List any spare parts used..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/my-services')}
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
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Create Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
