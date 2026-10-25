import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: 'Classroom A-101',
      category: 'Classroom',
      capacity: 30,
      status: 'active',
      bookingsThisWeek: 12,
      amenities: ['Projector', 'Whiteboard', 'WiFi']
    },
    {
      id: 2,
      name: 'Science Lab B-205',
      category: 'Laboratory',
      capacity: 25,
      status: 'active',
      bookingsThisWeek: 8,
      amenities: ['Benches', 'Equipment', 'Sink']
    },
    {
      id: 3,
      name: 'Meeting Room C-301',
      category: 'Meeting Room',
      capacity: 15,
      status: 'maintenance',
      bookingsThisWeek: 0,
      amenities: ['Conference Table', 'Video Call', 'WiFi']
    },
    {
      id: 4,
      name: 'Gymnasium D-001',
      category: 'Sports Area',
      capacity: 150,
      status: 'active',
      bookingsThisWeek: 5,
      amenities: ['Bleachers', 'Equipment Storage', 'Scoreboard']
    },
    {
      id: 5,
      name: 'Event Hall E-100',
      category: 'Event Hall',
      capacity: 200,
      status: 'active',
      bookingsThisWeek: 3,
      amenities: ['Stage', 'Sound System', 'Lighting']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['Classroom', 'Laboratory', 'Meeting Room', 'Sports Area', 'Event Hall'];

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h2 className="text-2xl font-bold text-neutral-900">Facility Management</h2>
            <p className="text-neutral-600">Manage facilities, amenities, and availability</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Facility'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Add Facility Form */}
        {showAddForm && (
          <Card className="mb-8 border-2 border-primary-500">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Add New Facility</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Facility Name"
                  className="px-4 py-2 border-2 border-neutral-200 rounded-base"
                />
                <select className="px-4 py-2 border-2 border-neutral-200 rounded-base">
                  <option>Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Capacity"
                  className="px-4 py-2 border-2 border-neutral-200 rounded-base"
                />
                <select className="px-4 py-2 border-2 border-neutral-200 rounded-base">
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <textarea
                placeholder="Amenities (comma-separated)"
                rows="2"
                className="w-full px-4 py-2 border-2 border-neutral-200 rounded-base"
              />
              <div className="flex gap-3">
                <Button variant="primary" type="submit">Save Facility</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-neutral-200 rounded-base"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border-2 border-neutral-200 rounded-base min-w-max"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Facilities Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-neutral-200">
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Facility Name</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Category</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Capacity</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Bookings</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((facility) => (
                  <tr key={facility.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4 font-semibold text-neutral-900">{facility.name}</td>
                    <td className="py-4 px-4 text-neutral-600">{facility.category}</td>
                    <td className="py-4 px-4 text-neutral-600">{facility.capacity} people</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{facility.bookingsThisWeek} this week</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={
                        facility.status === 'active' ? 'success' :
                        facility.status === 'maintenance' ? 'warning' : 'error'
                      }>
                        {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <Link to={`/admin/facilities/${facility.id}`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Button variant="outline" size="sm">Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredFacilities.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 text-lg">No facilities found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
