import { useState } from 'react'
import { reportService } from '../services/api'
import { BarChart3, Download, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export default function Reports() {
  const [reportType, setReportType] = useState('profit')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateReport = async () => {
    setLoading(true)
    try {
      const params = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      params.type = reportType

      const response = await reportService.getFinancialReport(params)
      setReport(response.data.data)
    } catch (error) {
      alert('Error generating report')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      const params = {}
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await reportService.getPDF(params)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `financial-report-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Error downloading PDF')
    }
  }

  const exportCSV = async (type) => {
    try {
      const params = { type }
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await reportService.exportCSV(params)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}-${Date.now()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Error exporting data')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-500">Generate and view financial reports</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="select-field lg:w-48"
          >
            <option value="profit">Profit & Loss</option>
            <option value="income">Income Report</option>
            <option value="expense">Expense Report</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field lg:w-48"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field lg:w-48"
            placeholder="End Date"
          />
          <button
            onClick={generateReport}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button onClick={() => exportCSV('expenses')} className="btn-secondary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Expenses CSV
          </button>
          <button onClick={() => exportCSV('payments')} className="btn-secondary flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Payments CSV
          </button>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          {report.profitLoss && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Income</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(report.profitLoss.totalIncome)}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(report.profitLoss.totalExpenses)}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Net Profit</p>
                    <p className={`text-2xl font-bold ${report.profitLoss.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatCurrency(report.profitLoss.netProfit)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Profit Margin: {report.profitLoss.profitMargin}%</p>
              </div>
            </div>
          )}

          {report.income && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Income Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">Transport Income</p>
                  <p className="text-2xl font-bold text-green-700">{formatCurrency(report.income.transport.total)}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Garage Income</p>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(report.income.garage.total)}</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="font-medium">Grand Total</p>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(report.income.grandTotal)}</p>
              </div>
            </div>
          )}

          {report.expenses && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Breakdown by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {report.expenses.byCategory.map((item, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    <p className="text-xl font-bold text-red-700">{formatCurrency(parseFloat(item.dataValues.total))}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-red-100 rounded-lg">
                <p className="font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-red-800">{formatCurrency(report.expenses.total)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
