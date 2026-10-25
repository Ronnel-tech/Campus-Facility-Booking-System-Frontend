import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import apiService from '../services/apiService';

export default function AdminAssetsPage() {
  const navigate = useNavigate();
  const { params } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    asset_tag: '',
    total_quantity: '1',
    condition: 'good',
    status: 'available',
    location: '',
    description: '',
    specifications: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const conditions = ['excellent', 'good', 'fair', 'damaged'];
  const statuses = ['available', 'checked-out', 'maintenance', 'damaged'];
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

      const [assetsRes, categoriesRes] = await Promise.all([
        apiService.get('/assets?limit=100'),
        apiService.get('/assets/categories'),
      ]);

      setAssets(assetsRes.data?.assets || []);
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
    if (!formData.asset_tag.trim()) errors.asset_tag = 'Asset tag is required';
    if (!formData.total_quantity || parseInt(formData.total_quantity) < 1) {
      errors.total_quantity = 'Valid quantity is required';
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
        asset_tag: formData.asset_tag.trim(),
        total_quantity: parseInt(formData.total_quantity),
        condition: formData.condition,
        status: formData.status,
        location: formData.location.trim(),
        description: formData.description.trim(),
        specifications: formData.specifications.trim(),
      };

      if (isEditing) {
        await apiService.put(`/admin/assets/${editingId}`, data);
      } else {
        await apiService.post('/admin/assets', data);
      }

      setFormData({
        name: '',
        category: '',
        asset_tag: '',
        total_quantity: '1',
        condition: 'good',
        status: 'available',
        location: '',
        description: '',
        specifications: '',
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

  const handleEdit = (asset) => {
    setFormData({
      name: asset.name,
      category: asset.category,
      asset_tag: asset.asset_tag,
      total_quantity: asset.total_quantity || asset.quantity || '1',
      condition: asset.condition,
      status: asset.status,
      location: asset.location || asset.current_location || '',
      description: asset.description || '',
      specifications: asset.specifications || '',
    });
    setEditingId(asset.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;

    try {
      await apiService.delete(`/admin/assets/${id}`);
      fetchData();
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      category: '',
      asset_tag: '',
      total_quantity: '1',
      condition: 'good',
      status: 'available',
      location: '',
      description: '',
      specifications: '',
    });
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
    if (params?.id) navigate('/admin/assets');
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.asset_tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'available': return 'approved';
      case 'checked-out': return 'info';
      case 'maintenance': return 'warning';
      case 'damaged': return 'error';
      default: return 'pending';
    }
  };

  const getConditionBadgeVariant = (condition) => {
    switch (condition) {
      case 'excellent': return 'approved';
      case 'good': return 'info';
      case 'fair': return 'warning';
      case 'damaged': return 'error';
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
            <p className="text-neutral-600">Loading assets...</p>
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
            <h2 className="text-2xl font-bold text-neutral-900">Asset Management</h2>
            <p className="text-neutral-600">Manage equipment inventory and availability</p>
          </div>
          <Button variant="primary" onClick={() => { setEditingId(null); handleCancel(); setShowForm(true); }}>
            {showForm ? 'Cancel' : '+ Add Asset'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Add/Edit Asset Form */}
        {showForm && (
          <Card className="mb-8 border-2 border-primary-500">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {isEditing ? 'Edit Asset' : 'Add New Asset'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Asset Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  error={formErrors.name}
                  required
                />
                <Input
                  label="Asset Tag"
                  name="asset_tag"
                  value={formData.asset_tag}
                  onChange={handleFormChange}
                  error={formErrors.asset_tag}
                  required
                  placeholder="LAP-001, PROJ-002, etc."
                />
                <Input
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  error={formErrors.category}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Input>
                <Input
                  label="Total Quantity"
                  type="number"
                  name="total_quantity"
                  value={formData.total_quantity}
                  onChange={handleFormChange}
                  error={formErrors.total_quantity}
                  required
                  min="1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleFormChange}
                  required
                >
                  {conditions.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </Input>
                <Input
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  required
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                  ))}
                </Input>
              </div>
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                error={formErrors.location}
                required
                placeholder="Equipment Room A, Media Lab, etc."
              />
              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="2"
                type="textarea"
              />
              <Input
                label="Specifications (JSON or text)"
                name="specifications"
                value={formData.specifications}
                onChange={handleFormChange}
                rows="2"
                type="textarea"
                placeholder='{"brand": "Dell", "model": "XPS 15", "ram": "16GB"}'
              />
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
            placeholder="Search assets by name or tag..."
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500 w-full sm:w-48"
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Assets Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Asset Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{asset.name}</div>
                        {asset.description && (
                          <div className="text-sm text-neutral-500 mt-1 line-clamp-1">{asset.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="info">{asset.category}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-neutral-900">{asset.asset_tag}</td>
                      <td className="px-6 py-4 text-neutral-900">{asset.total_quantity || asset.quantity || 1}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getConditionBadgeVariant(asset.condition)}>
                          {asset.condition}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeVariant(asset.status)}>
                          {asset.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">{asset.location || asset.current_location || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(asset)}>
                            Edit
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => handleDelete(asset.id)} className="text-error hover:bg-red-50">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-neutral-600">
                      No assets found
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