import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import apiService from '../services/apiService';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [activeReport, setActiveReport] = useState('facility-usage');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const reports = [
    { id: 'facility-usage', name: 'Facility Usage', endpoint: 'facility-usage' },
    { id: 'asset-borrowing', name: 'Asset Borrowing', endpoint: 'asset-borrowing' },
    { id: 'reservation-stats', name: 'Reservation Stats', endpoint: 'reservation-stats' },
    { id: 'overdue-returns', name: 'Overdue Returns', endpoint: 'overdue-returns' },
    { id: 'maintenance-log', name: 'Maintenance Log', endpoint: 'maintenance-log' },
    { id: 'cancellations', name: 'Cancellations', endpoint: 'cancellation-report' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!['admin', 'faculty', 'staff'].includes(user?.role)) {
      navigate('/unauthorized');
      return;
    }

    fetchReport();
  }, [isAuthenticated, user, navigate, activeReport, dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get(`/admin/reports/${activeReport}?range=${dateRange}`);
      setReportData(res.data);
    } catch (err) {
      if (err.status === 401) navigate('/login');
      else if (err.status === 403) navigate('/unauthorized');
      else setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const res = await apiService.post('/admin/reports/export', {
        report: activeReport,
        range: dateRange,
      });
      if (res.data?.download_url) {
        window.open(res.data.download_url, '_blank');
      } else if (res.data?.file) {
        const blob = new Blob([JSON.stringify(res.data.file, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeReport}-${dateRange}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading && !reportData) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Admin Panel</h1>
            <Link to="/admin" className="text-neutral-600 hover:text-neutral-900">Back to Admin</Link>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading report...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Admin Panel</h1>
          <Link to="/admin" className="text-neutral-600 hover:text-neutral-900">Back to Admin</Link>
        </div>
      </nav>

      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Reports & Analytics</h2>
            <p className="text-neutral-600">View system usage, trends, and insights</p>
          </div>
          <Button variant="secondary" onClick={handleExport} disabled={loading || !reportData}>
            {loading ? 'Exporting...' : '↓ Export Report'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Report Tabs */}
        <div className="mb-6 border-b border-neutral-200">
          <nav className="flex gap-1" aria-label="Reports">
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveReport(r.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeReport === r.id
                    ? 'bg-primary-500 text-white'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {r.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-neutral-700">Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Report Content */}
        {error && (
          <Card className="mb-6 border-error">
            <div className="p-4 text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-error">{error}</p>
              <Button variant="primary" onClick={fetchReport} className="mt-2">Retry</Button>
            </div>
          </Card>
        )}

        <Card>
          {reportData && (
            <div className="space-y-6">
              {/* Summary Stats */}
              {reportData.summary && (
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(reportData.summary).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-neutral-50 rounded-lg">
                      <div className="text-3xl font-bold text-neutral-900">{value}</div>
                      <div className="text-sm text-neutral-600">{key.replace(/_/g, ' ')}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Data Table */}
              {reportData.data && reportData.data.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        {reportData.columns?.map((col) => (
                          <th key={col.key} className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                            {col.label || col.key}
                          </th>
                        )) || (
                          Object.keys(reportData.data[0]).map((key) => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            </th>
                          ))
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {reportData.data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50">
                          {Object.values(row).map((cell, cellIdx) => (
                            <td key={cellIdx} className="px-6 py-4">
                              {typeof cell === 'object' && cell !== null ? (
                                <Badge variant={cell.variant || 'pending'}>
                                  {cell.label || cell.status || JSON.stringify(cell)}
                                </Badge>
                              ) : (
                                cell
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reportData.data && reportData.data.length === 0 && (
                <div className="text-center py-12 text-neutral-600">
                  No data available for this period
                </div>
              )}
            </div>
          )}
          {!reportData && (
            <div className="text-center py-12 text-neutral-600">
              Select a report to view data
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}