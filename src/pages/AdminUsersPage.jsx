import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import apiService from '../services/apiService';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const roles = ['student', 'faculty', 'staff', 'admin'];
  const statuses = ['active', 'inactive', 'suspended'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!['admin', 'faculty', 'staff'].includes(user?.role)) {
      navigate('/unauthorized');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiService.get('/admin/users');
      setUsers(res.data?.users || []);
    } catch (err) {
      if (err.status === 401) {
        navigate('/login');
      } else if (err.status === 403) {
        navigate('/unauthorized');
      } else {
        setError(formatErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email is required';
    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!roles.includes(formData.role)) errors.role = 'Invalid role';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await apiService.post('/admin/users', {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      });

      setFormData({ username: '', email: '', password: '', role: 'student' });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      if (err.details?.errors) {
        setFormErrors(err.details.errors);
      }
      setError(formatErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Suspend this user?')) return;
    try {
      await apiService.post(`/admin/users/${id}/suspend`, {});
      fetchUsers();
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  const handleUnsuspend = async (id) => {
    try {
      await apiService.post(`/admin/users/${id}/unsuspend`, {});
      fetchUsers();
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'info';
      case 'faculty': return 'approved';
      case 'staff': return 'warning';
      case 'student': return 'pending';
      default: return 'pending';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'approved';
      case 'inactive': return 'pending';
      case 'suspended': return 'error';
      default: return 'pending';
    }
  };

  if (loading) {
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
            <p className="text-neutral-600">Loading users...</p>
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
            <h2 className="text-2xl font-bold text-neutral-900">User Management</h2>
            <p className="text-neutral-600">Manage user accounts and permissions</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add User'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {showAddForm && (
          <Card className="mb-8 border-2 border-primary-500">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Add New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  error={formErrors.username}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  error={formErrors.email}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  error={formErrors.password}
                  required
                  minLength="8"
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Role<span className="text-error ml-1">*</span></label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm"
                    required
                  >
                  {roles.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                  </select>
                  {formErrors.role && <p className="text-error text-sm mt-1">{formErrors.role}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create User'}
                </Button>
                <Button variant="secondary" type="button" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500 w-full sm:w-48"
          >
            <option value="all">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500 w-full sm:w-48"
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Reservations</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">Violations</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-medium text-neutral-900">{user.name}</td>
                      <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(user.status)}>{user.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-4 text-neutral-900">{user.reservations_count || user.reservations || 0}</td>
                      <td className="px-6 py-4">
                        <Badge variant={user.violations_count > 0 ? 'error' : 'approved'}>{user.violations_count || user.violations || 0}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.status === 'suspended' ? (
                            <Button variant="secondary" size="sm" onClick={() => handleUnsuspend(user.id)}>
                              Unsuspend
                            </Button>
                          ) : (
                            <Button variant="secondary" size="sm" className="text-error hover:bg-red-50" onClick={() => handleSuspend(user.id)}>
                              Suspend
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-neutral-600">No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}