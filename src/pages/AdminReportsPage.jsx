import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function AdminReportsPage() {
  const [activeReport, setActiveReport] = useState('usage');
  const [dateRange, setDateRange] = useState('month');

  const facilityUsageData = [
    { facility: 'Classroom A-101', bookings: 87, hours: 348, utilization: '85%' },
    { facility: 'Gymnasium D-001', bookings: 45, hours: 156, utilization: '72%' },
    { facility: 'Event Hall E-100', bookings: 23, hours: 92, utilization: '58%' },
    { facility: 'Meeting Room C-301', bookings: 156, hours: 234, utilization: '92%' },
    { facility: 'Science Lab B-205', bookings: 67, hours: 201, utilization: '78%' }
  ];

  const assetData = [
    { asset: 'Dell Laptop XPS-15', times: 45, condition: 'Good', issues: 0 },
    { asset: 'Canon Projector EX500', times: 38, condition: 'Good', issues: 1 },
    { asset: 'Sony Camera', times: 28, condition: 'Excellent', issues: 0 },
    { asset: 'Bose Sound System', times: 62, condition: 'Fair', issues: 3 },
    { asset: 'Basketball Equipment', times: 85, condition: 'Good', issues: 2 }
  ];

  const requestStats = [
    { status: 'Approved', count: 234, percentage: 72 },
    { status: 'Pending', count: 45, percentage: 14 },
    { status: 'Rejected', count: 32, percentage: 10 },
    { status: 'Cancelled', count: 8, percentage: 2 }
  ];

  const overdueData = [
    { asset: 'Laptop LAP-005', borrower: 'John Smith', dueDate: '2024-10-15', daysOverdue: 10, penalty: '$100' },
    { asset: 'Camera CAM-002', borrower: 'Sarah Lee', dueDate: '2024-10-18', daysOverdue: 7, penalty: '$70' },
    { asset: 'Projector PROJ-001', borrower: 'Mike Chen', dueDate: '2024-10-20', daysOverdue: 5, penalty: '$50' }
  ];

  const maintenanceData = [
    { asset: 'Bose Sound System', issue: 'Speaker malfunction', reportedDate: '2024-10-15', status: 'In Progress', priority: 'High' },
    { asset: 'Projector PROJ-002', issue: 'Lamp replacement', reportedDate: '2024-10-18', status: 'Pending', priority: 'Medium' },
    { asset: 'Laptop LAP-003', issue: 'Battery not charging', reportedDate: '2024-10-20', status: 'Completed', priority: 'Medium' }
  ];

  const cancellationData = [
    { requester: 'John Smith', facility: 'Classroom B-101', cancellations: 3, reason: 'Schedule conflict' },
    { requester: 'Sarah Lee', facility: 'Meeting Room C-301', cancellations: 1, reason: 'Equipment unavailable' },
    { requester: 'Mike Chen', facility: 'Gymnasium', cancellations: 4, reason: 'Personal reasons' }
  ];

  const getStatusColor = (status) => {
    if (status.includes('Approved') || status === 'Completed' || status === 'In Progress') return 'success';
    if (status.includes('Pending')) return 'warning';
    if (status.includes('Rejected') || status === 'Cancelled') return 'error';
    return 'secondary';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Admin Panel</h1>
          <Link to="/admin" className="text-neutral-600 hover:text-neutral-900">
            Back to Admin
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h2>
            <p className="text-neutral-600">View system usage, trends, and insights</p>
          </div>
          <Button variant="secondary">↓ Export Report</Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Report Selector */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
          {[
            { id: 'usage', label: 'Facility Usage' },
            { id: 'assets', label: 'Asset Borrowing' },
            { id: 'requests', label: 'Reservation Requests' },
            { id: 'overdue', label: 'Overdue Returns' },
            { id: 'maintenance', label: 'Maintenance Log' },
            { id: 'cancellations', label: 'Cancellations' }
          ].map(report => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`px-6 py-2 rounded-base font-semibold whitespace-nowrap transition ${
                activeReport === report.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-900 border-2 border-neutral-200 hover:border-primary-500'
              }`}
            >
              {report.label}
            </button>
          ))}
        </div>

        {/* Date Range Filter */}
        <div className="mb-6">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="week"
                checked={dateRange === 'week'}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <span className="text-neutral-700">This Week</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="month"
                checked={dateRange === 'month'}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <span className="text-neutral-700">This Month</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="quarter"
                checked={dateRange === 'quarter'}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <span className="text-neutral-700">This Quarter</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="year"
                checked={dateRange === 'year'}
                onChange={(e) => setDateRange(e.target.value)}
              />
              <span className="text-neutral-700">This Year</span>
            </label>
          </div>
        </div>

        {/* Facility Usage Report */}
        {activeReport === 'usage' && (
          <Card>
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Facility Usage Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Facility</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Bookings</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Total Hours</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {facilityUsageData.map((item, idx) => (
                    <tr key={idx} className="border-b border-neutral-100">
                      <td className="py-4 px-4 font-semibold text-neutral-900">{item.facility}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.bookings}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.hours}h</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: item.utilization }}
                            />
                          </div>
                          <span className="font-semibold text-neutral-900">{item.utilization}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Asset Borrowing Report */}
        {activeReport === 'assets' && (
          <Card>
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Asset Borrowing Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Asset</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Times Borrowed</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Condition</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Issues Reported</th>
                  </tr>
                </thead>
                <tbody>
                  {assetData.map((item, idx) => (
                    <tr key={idx} className="border-b border-neutral-100">
                      <td className="py-4 px-4 font-semibold text-neutral-900">{item.asset}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.times}</td>
                      <td className="py-4 px-4">
                        <Badge variant={item.condition === 'Good' ? 'secondary' : item.condition === 'Excellent' ? 'success' : 'warning'}>
                          {item.condition}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        {item.issues > 0 ? (
                          <Badge variant="warning">{item.issues}</Badge>
                        ) : (
                          <span className="text-neutral-600">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Reservation Requests Report */}
        {activeReport === 'requests' && (
          <div className="grid grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Request Status Breakdown</h3>
              <div className="space-y-4">
                {requestStats.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-neutral-900">{item.status}</span>
                      <span className="text-lg font-bold text-neutral-900">{item.count}</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.status === 'Approved' ? 'bg-success-500' :
                          item.status === 'Pending' ? 'bg-warning-500' :
                          item.status === 'Rejected' ? 'bg-error-500' :
                          'bg-neutral-400'
                        }`}
                        style={{ width: item.percentage + '%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Summary Statistics</h3>
              <div className="space-y-4">
                <div className="p-4 bg-primary-50 rounded-base border-2 border-primary-200">
                  <p className="text-sm text-neutral-600 mb-1">Total Requests</p>
                  <p className="text-3xl font-bold text-primary-500">319</p>
                </div>
                <div className="p-4 bg-success-50 rounded-base border-2 border-success-200">
                  <p className="text-sm text-neutral-600 mb-1">Approval Rate</p>
                  <p className="text-3xl font-bold text-success-500">73%</p>
                </div>
                <div className="p-4 bg-warning-50 rounded-base border-2 border-warning-200">
                  <p className="text-sm text-neutral-600 mb-1">Avg Processing Time</p>
                  <p className="text-3xl font-bold text-warning-500">18h</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Overdue Returns Report */}
        {activeReport === 'overdue' && (
          <Card>
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Overdue Asset Returns</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Asset</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Borrower</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Due Date</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Days Overdue</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Penalty</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueData.map((item, idx) => (
                    <tr key={idx} className="border-b border-neutral-100">
                      <td className="py-4 px-4 font-semibold text-neutral-900">{item.asset}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.borrower}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.dueDate}</td>
                      <td className="py-4 px-4">
                        <Badge variant="error">{item.daysOverdue}d</Badge>
                      </td>
                      <td className="py-4 px-4 font-bold text-error-600">{item.penalty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Maintenance Report */}
        {activeReport === 'maintenance' && (
          <Card>
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Maintenance Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Asset</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Issue</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Reported Date</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceData.map((item, idx) => (
                    <tr key={idx} className="border-b border-neutral-100">
                      <td className="py-4 px-4 font-semibold text-neutral-900">{item.asset}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.issue}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.reportedDate}</td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={item.priority === 'High' ? 'error' : 'warning'}>
                          {item.priority}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Cancellations Report */}
        {activeReport === 'cancellations' && (
          <Card>
            <h3 className="text-lg font-bold text-neutral-900 mb-6">Cancellation Report</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neutral-200">
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">User</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Facility/Asset</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Cancellations</th>
                    <th className="text-left py-3 px-4 font-bold text-neutral-900">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {cancellationData.map((item, idx) => (
                    <tr key={idx} className="border-b border-neutral-100">
                      <td className="py-4 px-4 font-semibold text-neutral-900">{item.requester}</td>
                      <td className="py-4 px-4 text-neutral-600">{item.facility}</td>
                      <td className="py-4 px-4">
                        {item.cancellations > 2 ? (
                          <Badge variant="warning">{item.cancellations}</Badge>
                        ) : (
                          <span className="text-neutral-600">{item.cancellations}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-neutral-600">{item.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
