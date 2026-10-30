import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import apiService from '../services/apiService';

export default function AdminFacilitiesPage() {
  const navigate = useNavigate();
  const { params } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [facilities, setFacilities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    capacity: '',
    location: '',
    description: '',
    amenities: '',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Check if we're editing an existing facility
  const isEditing = !!editingId;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!['admin', 'faculty', 'staff'].includes(user?.role)) {
      navigate('/unauthorized');
      return;
    }

    // If there's an ID in params, we're editing
    if (params?.id) {
      setEditingId(params.id);
      setShowForm(true);
    }

    fetchData();
  }, [isAuthenticated, user, navigate, params?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [facilitiesRes, categoriesRes] = await Promise.all([
        apiService.get('/facilities?limit=100'),
        apiService.get('/facilities/categories'),
      ]);

      setFacilities(facilitiesRes.data?.facilities || []);
      setCategories(categoriesRes.data?.categories || []);
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

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.capacity || parseInt(formData.capacity) < 1) {
      errors.capacity = 'Valid capacity is required';
    }
    if (!formData.location.trim()) errors.location = 'Location is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = {
        name: formData.name.trim(),
        category: formData.category,
        capacity: parseInt(formData.capacity),
        location: formData.location.trim(),
        description: formData.description.trim(),
        amenities: formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        status: formData.status,
      };

      if (isEditing) {
        await apiService.put(`/admin/facilities/${editingId}`, data);
      } else {
        await apiService.post('/admin/facilities', data);
      }

      // Reset form and refresh
      setFormData({
        name: '',
        category: '',
        capacity: '',
        location: '',
        description: '',
        amenities: '',
        status: 'active',
      });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      if (err.details?.errors) {
        setFormErrors(err.details.errors);
      }
      setError(formatErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      category: facility.category,
      capacity: facility.capacity,
      location: facility.location,
      description: facility.description || '',
      amenities: facility.amenities?.join(', ') || '',
      status: facility.status,
    });
    setEditingId(facility.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;

    try {
      await apiService.delete(`/admin/facilities/${id}`);
      fetchData();
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      category: '',
      capacity: '',
      location: '',
      description: '',
      amenities: '',
      status: 'active',
    });
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
    if (params?.id) navigate('/admin/facilities');
  };

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
            <p className="text-neutral-600">Loading facilities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Admin Panel</h1>
          <Link to="/admin" className="text-neutral-600 hover:text-neutral-900">Back to Admin</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Facility Management</h2>
            <p className="text-neutral-600">Manage facilities, amenities, and availability</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingId(null); handleCancel(); setShowForm(true); }}>
            {showForm ? 'Cancel' : '+ Add Facility'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Add/Edit Facility Form */}
        {showForm && (
          <Card className="mb-8 border-2 border-primary-500">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {isEditing ? 'Edit Facility' : 'Add New Facility'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Facility Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  error={formErrors.name}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Category<span className="text-error ml-1">*</span></label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm"
                    required
                  >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  </select>
                  {formErrors.category && <p className="text-error text-sm mt-1">{formErrors.category}</p>}
                </div>
                <Input
                  label="Capacity"
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  error={formErrors.capacity}
                  required
                  min="1"
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  error={formErrors.location}
                  required
                  placeholder="Building A, Room 101"
                />
              </div>
              <Input
                label="Amenities (comma separated)"
                name="amenities"
                value={formData.amenities}
                onChange={handleFormChange}
                placeholder="Projector, Whiteboard, WiFi, AC"
              />
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-4">
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </Button>
                <Button variant="secondary" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500 w-full sm:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Facilities Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredFacilities.length > 0 ? (
                  filteredFacilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{facility.name}</div>
                        {facility.description && (
                          <div className="text-sm text-neutral-500 mt-1 line-clamp-1">{facility.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="info">{facility.category}</Badge>
                      </td>
                      <td className="px-6 py-4 text-neutral-900">{facility.capacity}</td>
                      <td className="px-6 py-4 text-neutral-600">{facility.location}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            facility.status === 'active'
                              ? 'approved'
                              : facility.status === 'maintenance'
                              ? 'warning'
                              : 'pending'
                          }
                        >
                          {facility.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(facility)}>
                            Edit
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(facility.id)} className="text-error hover:bg-red-50">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-600">
                      No facilities found
                    </td>
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
