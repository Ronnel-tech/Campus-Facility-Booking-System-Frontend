import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import assetsService from '../services/assetsService';

export default function AssetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      setError('Asset ID is required');
      setLoading(false);
      return;
    }

    const fetchAsset = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await assetsService.getById(id);
        setAsset(response.data);
      } catch (err) {
        if (err.status === 401) {
          navigate('/login');
        } else if (err.status === 403) {
          navigate('/unauthorized');
        } else if (err.status === 404) {
          setError('Asset not found');
        } else {
          setError(formatErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id, isAuthenticated, navigate]);

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
            <p className="text-neutral-600">Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
            <Link to="/assets" className="text-primary-500 hover:text-primary-600">
              ← Back to Assets
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Card className="p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-neutral-600 mb-4">{error || 'Asset not found'}</p>
              <Link to="/assets">
                <Button variant="primary">Back to Assets</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const statusVariant = asset.status === 'available' ? 'approved' : 
                       asset.status === 'checked-out' ? 'info' : 
                       asset.status === 'maintenance' ? 'warning' : 'error';

  const conditionVariant = asset.condition === 'excellent' ? 'approved' :
                          asset.condition === 'good' ? 'info' :
                          asset.condition === 'fair' ? 'warning' : 'error';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <Link to="/assets" className="text-primary-500 hover:text-primary-600">
            ← Back to Assets
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end gap-8">
            <div className="text-8xl">📦</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{asset.name}</h1>
              <Badge variant="info" className="bg-white text-primary-500">
                {asset.category}
              </Badge>
              <p className="text-lg mt-2 opacity-90">Tag: {asset.asset_tag}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Condition</p>
            <Badge variant={conditionVariant} className="text-lg">{asset.condition}</Badge>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Status</p>
            <Badge variant={statusVariant} className="text-lg">{asset.status.replace('-', ' ')}</Badge>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Max Borrow</p>
            <p className="text-2xl font-bold text-neutral-900">{asset.borrowing_limit || asset.borrowingLimit || 7} days</p>
          </Card>
        </div>

        {/* Description */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Asset</h2>
          <p className="text-neutral-600 mb-6">{asset.description || 'No description available'}</p>

          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Current Location</h3>
          <p className="text-neutral-600 mb-6">📍 {asset.location || asset.current_location || 'Not specified'}</p>

          {asset.specifications && asset.specifications.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Specifications</h3>
              <ul className="space-y-2 mb-6">
                {asset.specifications.map((spec, idx) => (
                  <li key={idx} className="text-neutral-600 flex items-center gap-2">
                    <span className="text-primary-500">•</span> {spec}
                  </li>
                ))}
              </ul>
            </>
          )}

          {asset.damage_policy && (
            <div className="bg-warning bg-opacity-10 border border-warning border-opacity-30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Damage Policy</h3>
              <p className="text-neutral-600">{asset.damage_policy}</p>
            </div>
          )}
        </Card>

        {/* Borrowing Rules */}
        {asset.borrowing_rules && asset.borrowing_rules.length > 0 && (
          <Card className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Borrowing Rules</h2>
            <ul className="space-y-3">
              {asset.borrowing_rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary-500 font-bold mt-1">•</span>
                  <span className="text-neutral-600">{rule}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Checkout History */}
        {asset.checkout_history && asset.checkout_history.length > 0 && (
          <Card className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Checkout History</h2>
            <div className="space-y-3">
              {asset.checkout_history.map((record, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-neutral-900">Checked out: {record.checkout_date || record.date}</p>
                    <p className="text-sm text-neutral-600">Returned: {record.returned_date || record.returnedDate}</p>
                  </div>
                  <Badge variant={record.condition === 'Good' ? 'approved' : 'warning'}>
                    {record.condition}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          {asset.status === 'available' && (
            <Link to={`/new-reservation?asset=${asset.id}`}>
              <Button variant="primary" size="lg">Borrow This Asset</Button>
            </Link>
          )}
          <Link to="/assets">
            <Button variant="secondary" size="lg">Back to Assets</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}