import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function AssetCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [assets] = useState([
    {
      id: 1,
      name: 'Canon EOS R5 Camera',
      assetTag: 'AST-2026-001',
      category: 'Photography',
      condition: 'Good',
      available: true,
      borrowingDays: 7
    },
    {
      id: 2,
      name: 'Sony A7IV Camera',
      assetTag: 'AST-2026-002',
      category: 'Photography',
      condition: 'Good',
      available: true,
      borrowingDays: 7
    },
    {
      id: 3,
      name: 'Epson Projector',
      assetTag: 'AST-2026-003',
      category: 'Audio/Visual',
      condition: 'Good',
      available: false,
      borrowingDays: 14
    },
    {
      id: 4,
      name: 'Behringer Mixer',
      assetTag: 'AST-2026-004',
      category: 'Audio/Visual',
      condition: 'Good',
      available: true,
      borrowingDays: 7
    },
    {
      id: 5,
      name: 'MacBook Pro 16"',
      assetTag: 'AST-2026-005',
      category: 'Computers',
      condition: 'Good',
      available: true,
      borrowingDays: 3
    },
    {
      id: 6,
      name: 'Microphone Set',
      assetTag: 'AST-2026-006',
      category: 'Audio/Visual',
      condition: 'Fair',
      available: true,
      borrowingDays: 7
    }
  ]);

  const categories = ['all', 'Photography', 'Audio/Visual', 'Computers', 'Sports', 'Office'];

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-neutral-600 hover:text-neutral-900">
              Dashboard
            </Link>
            <Link to="/facilities" className="text-neutral-600 hover:text-neutral-900">
              Facilities
            </Link>
            <Link to="/reservations" className="text-neutral-600 hover:text-neutral-900">
              My Reservations
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900">Asset Catalog</h2>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-neutral-200 rounded-base font-sans text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Assets Grid */}
        <div className="grid grid-cols-3 gap-8">
          {filteredAssets.map((asset) => (
            <Card key={asset.id} hoverable>
              <div className="mb-4 text-5xl text-center py-4 bg-primary-50 rounded">📦</div>
              
              <h3 className="font-semibold text-neutral-900 mb-1">{asset.name}</h3>
              <p className="text-xs text-neutral-500 mb-3">Tag: {asset.assetTag}</p>
              
              <Badge variant="primary" className="mb-3">
                {asset.category}
              </Badge>
              
              <div className="space-y-2 mb-4 text-sm text-neutral-600">
                <p>Condition: {asset.condition}</p>
                <p>Borrow up to {asset.borrowingDays} days</p>
                {asset.available ? (
                  <p className="text-success font-medium">✓ Available</p>
                ) : (
                  <p className="text-error font-medium">✗ Not Available</p>
                )}
              </div>

              <Link to={`/assets/${asset.id}`}>
                <Button
                  variant={asset.available ? 'primary' : 'secondary'}
                  size="full"
                  disabled={!asset.available}
                >
                  {asset.available ? 'Borrow' : 'Unavailable'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600">No assets found matching your search.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
