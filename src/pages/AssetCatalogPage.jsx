import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import assetsService from '../services/assetsService';

export default function AssetCatalogPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const [assetsRes, categoriesRes] = await Promise.all([
          assetsService.getAll(
            1,
            100,
            selectedCategory !== 'all' ? selectedCategory : null,
            searchTerm || null,
            'available'
          ),
          assetsService.getCategories(),
        ]);

        setAssets(assetsRes.data?.assets || []);
        if (categoriesRes.data?.categories) {
          setCategories(['all', ...categoriesRes.data.categories]);
        }
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

    fetchAssets();
  }, [isAuthenticated, navigate, selectedCategory, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
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
              className="px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {error && (
          <Card className="mb-8 p-4 bg-error bg-opacity-10 border border-error border-opacity-30">
            <p className="text-error text-sm">{error}</p>
          </Card>
        )}

        {/* Assets Grid */}
        <div className="grid grid-cols-3 gap-8">
          {assets && assets.length > 0 ? (
            assets.map((asset) => (
              <Card key={asset.id} hoverable>
                <div className="mb-4 text-5xl text-center py-4 bg-primary-50 rounded">📦</div>

                <h3 className="font-semibold text-neutral-900 mb-1">{asset.name}</h3>
                {asset.asset_tag && (
                  <p className="text-xs text-neutral-500 mb-3">Tag: {asset.asset_tag}</p>
                )}

                {asset.category && (
                  <Badge variant="primary" className="mb-3">
                    {asset.category}
                  </Badge>
                )}

                <div className="space-y-2 mb-4 text-sm text-neutral-600">
                  {asset.condition && <p>Condition: {asset.condition}</p>}
                  {asset.borrowing_days && <p>Borrow up to {asset.borrowing_days} days</p>}
                  {asset.status === 'available' ? (
                    <p className="text-success font-medium">✓ Available</p>
                  ) : (
                    <p className="text-error font-medium">✗ Not Available</p>
                  )}
                </div>

                <Link to={`/assets/${asset.id}`}>
                  <Button
                    variant={asset.status === 'available' ? 'primary' : 'secondary'}
                    size="full"
                    disabled={asset.status !== 'available'}
                  >
                    {asset.status === 'available' ? 'Borrow' : 'Unavailable'}
                  </Button>
                </Link>
              </Card>
            ))
          ) : (
            <div className="col-span-3">
              <Card className="text-center py-12">
                <p className="text-neutral-600">No assets found matching your search.</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
