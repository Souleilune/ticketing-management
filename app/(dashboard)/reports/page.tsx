import { FileText, Download } from 'lucide-react'

export default function ReportsPage() {
  const reportTypes = [
    {
      title: 'Weekly Maintenance Summary',
      description: 'Summary of all maintenance activities for the past week',
      icon: FileText,
    },
    {
      title: 'Ticket Status Report',
      description: 'Current status of all tickets with resolution times',
      icon: FileText,
    },
    {
      title: 'Inventory Summary',
      description: 'Complete inventory of devices and accessories',
      icon: FileText,
    },
    {
      title: 'Device Maintenance History',
      description: 'Historical maintenance records for all devices',
      icon: FileText,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="mt-2 text-gray-600">Generate and download PDF reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <report.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button className="btn btn-primary flex items-center gap-2">
                <Download className="h-4 w-4" />
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">PDF Report Generation</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Reports will be generated as PDF files with structured tables and timestamps.
                Click "Generate Report" to download the latest data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
