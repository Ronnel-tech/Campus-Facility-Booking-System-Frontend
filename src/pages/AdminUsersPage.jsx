import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@school.edu',
      role: 'Student',
      status: 'active',
      joinDate: '2024-01-15',
      reservations: 8,
      violations: 0
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      role: 'Faculty',
      status: 'active',
      joinDate: '2023-08-01',
      reservations: 23,
      violations: 0
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@school.edu',
      role: 'Student',
      status: 'suspended',
      joinDate: '2024-02-10',
      reservations: 5,
      violations: 3
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@school.edu',
      role: 'Staff',
      status: 'active',
      joinDate: '2024-01-20',
      reservations: 12,
      violations: 0
    },
    {
      id: 5,
      name: 'David Park',
      email: 'david.park@school.edu',
      role: 'Administrator',
      status: 'active',
      joinDate: '2023-07-01',
      reservations: 0,
      violations: 0
    },
    {
      id: 6,
      name: 'Lisa Wong',
      email: 'lisa.wong@school.edu',
      role: 'Student',
      status: 'active',
      joinDate: '2024-03-05',
      reservations: 15,
      violations: 1
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const roles = ['Student', 'Faculty', 'Staff', 'Administrator'];
  const statuses = ['active', 'inactive', 'suspended'];

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch(role) {
      case 'Administrator': return 'error';
      case 'Faculty': return 'primary';
      case 'Staff': return 'secondary';
      case 'Student': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'suspended': return 'error';
      default: return 'secondary';
    }
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
            <h2 className="text-2xl font-bold text-neutral-900">User Management</h2>
            <p className="text-neutral-600">Manage roles, permissions, and user accounts</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add User'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Add User Form */}
        {showAddForm && (
          <Card className="mb-8 border-2 border-primary-500">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Add New User</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-4 py-2 border-2 border-neutral-200 rounded-base"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-2 border-2 border-neutral-200 rounded-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select className="px-4 py-2 border-2 border-neutral-200 rounded-base">
                  <option>Select Role...</option>
                  {roles.map(role => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
                <select className="px-4 py-2 border-2 border-neutral-200 rounded-base">
                  <option>Select Status...</option>
                  {statuses.map(status => (
                    <option key={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" type="submit">Create User</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-neutral-200 rounded-base"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border-2 border-neutral-200 rounded-base min-w-max"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-neutral-200 rounded-base min-w-max"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-neutral-200">
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Name</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Email</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Role</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Join Date</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Reservations</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Violations</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4 font-semibold text-neutral-900">{user.name}</td>
                    <td className="py-4 px-4 text-neutral-600 text-sm">{user.email}</td>
                    <td className="py-4 px-4">
                      <Badge variant={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-neutral-600 text-sm">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{user.reservations}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      {user.violations > 0 ? (
                        <Badge variant="warning">{user.violations}</Badge>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <Button variant="secondary" size="sm">Edit</Button>
                      {user.status !== 'suspended' && (
                        <Button variant="outline" size="sm" className="text-warning-600">Suspend</Button>
                      )}
                      {user.status === 'suspended' && (
                        <Button variant="outline" size="sm" className="text-success-600">Unsuspend</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredUsers.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 text-lg">No users found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
