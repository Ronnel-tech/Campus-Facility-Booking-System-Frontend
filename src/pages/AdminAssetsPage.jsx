import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState([
    {
      id: 1,
      name: 'Dell Laptop XPS-15',
      category: 'Laptop',
      assetTag: 'LAP-001',
      condition: 'good',
      status: 'available',
      currentLocation: 'Equipment Room A',
      borrowCount: 23,
      totalAssets: 5
    },
    {
      id: 2,
      name: 'Canon Projector EX500',
      category: 'Projector',
      assetTag: 'PROJ-001',
      condition: 'good',
      status: 'checked-out',
      currentLocation: 'Classroom B-205',
      borrowCount: 18,
      totalAssets: 3
    },
    {
      id: 3,
      name: 'Sony Mirrorless Camera',
      category: 'Camera',
      assetTag: 'CAM-001',
      condition: 'excellent',
      status: 'available',
      currentLocation: 'Media Lab',
      borrowCount: 12,
      totalAssets: 2
    },
    {
      id: 4,
      name: 'Bose Sound System',
      category: 'Audio Equipment',
      assetTag: 'AUDIO-001',
      condition: 'fair',
      status: 'maintenance',
      currentLocation: 'Service Center',
      borrowCount: 31,
      totalAssets: 2
    },
    {
      id: 5,
      name: 'Basketball Equipment Set',
      category: 'Sports Equipment',
      assetTag: 'SPORT-001',
      condition: 'good',
      status: 'available',
      currentLocation: 'Gymnasium Storage',
      borrowCount: 45,
      totalAssets: 10
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = ['Laptop', 'Projector', 'Camera', 'Audio Equipment', 'Sports Equipment', 'Other'];
  const statuses = ['available', 'checked-out', 'maintenance', 'damaged'];
  const conditions = ['excellent', 'good', 'fair', 'damaged'];

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.assetTag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'excellent': return 'success';
      case 'good': return 'secondary';
      case 'fair': return 'warning';
      case 'damaged': return 'error';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'success';
      case 'checked-out': return 'secondary';
      case 'maintenance': return 'warning';
      case 'damaged': return 'error';
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
            <h2 className="text-2xl font-bold text-neutral-900">Asset Management</h2>
            <p className="text-neutral-600">Manage equipment, inventory, and maintenance</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Asset'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Add Asset Form */}
        {showAddForm && (
          <Card className="mb-8 border-2 border-primary-500">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Add New Asset</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Asset Name"
                  className="px-4 py-2 border-2 border-neutral-200 rounded-base"
                />
                <input
                  type="text"
                  placeholder="Asset Tag (e.g., LAP-001)"
                  className="px-4 py-2 border-2 border-neutral-200 rounded-base"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <select className="px-4 py-2 border-2 border-neutral-200 rounded-base">
                  <option>Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
                <select className="px-4 py-2 border-2 border-neutral-200 rounded-base">
                  <option>Select Condition...</option>
                  {conditions.map(cond => (
                    <option key={cond}>{cond.charAt(0).toUpperCase() + cond.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  className="px-4 py-2 border-2 border-neutral-200 rounded-base"
                />
              </div>
              <input
                type="text"
                placeholder="Current Location"
                className="w-full px-4 py-2 border-2 border-neutral-200 rounded-base"
              />
              <textarea
                placeholder="Description/Notes"
                rows="2"
                className="w-full px-4 py-2 border-2 border-neutral-200 rounded-base"
              />
              <div className="flex gap-3">
                <Button variant="primary" type="submit">Save Asset</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or asset tag..."
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
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-neutral-200 rounded-base min-w-max"
          >
            <option value="all">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Assets Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-neutral-200">
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Asset Name</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Tag</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Category</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Condition</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Location</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Borrow Count</th>
                  <th className="text-left py-3 px-4 font-bold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4 font-semibold text-neutral-900">{asset.name}</td>
                    <td className="py-4 px-4 text-neutral-600 font-mono text-sm">{asset.assetTag}</td>
                    <td className="py-4 px-4 text-neutral-600">{asset.category}</td>
                    <td className="py-4 px-4">
                      <Badge variant={getConditionColor(asset.condition)}>
                        {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusColor(asset.status)}>
                        {asset.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-neutral-600 text-sm">{asset.currentLocation}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{asset.borrowCount}</Badge>
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <Link to={`/admin/assets/${asset.id}`}>
                        <Button variant="secondary" size="sm">View</Button>
                      </Link>
                      <Button variant="outline" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {filteredAssets.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600 text-lg">No assets found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
