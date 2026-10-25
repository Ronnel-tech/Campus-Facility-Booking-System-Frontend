import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import facilitiesService from '../services/facilitiesService';

export default function FacilitiesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [facilities, setFacilities] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const [facilitiesRes, categoriesRes] = await Promise.all([
          facilitiesService.getAll(1, 100, selectedCategory !== 'all' ? selectedCategory : null, searchTerm || null),
          facilitiesService.getCategories(),
        ]);

        setFacilities(facilitiesRes.data?.facilities || []);
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

    fetchFacilities();
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
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-neutral-600 hover:text-neutral-900">
              Dashboard
            </Link>
            <Link to="/assets" className="text-neutral-600 hover:text-neutral-900">
              Assets
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
          <h2 className="text-3xl font-bold text-neutral-900">Available Facilities</h2>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Card className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search facilities..."
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

        {/* Facilities Grid */}
        <div className="grid grid-cols-3 gap-8">
          {facilities && facilities.length > 0 ? (
            facilities.map((facility) => (
              <Card key={facility.id} hoverable>
                <div className="mb-4 text-5xl text-center py-4 bg-primary-50 rounded">🏛️</div>

                <h3 className="font-semibold text-neutral-900 mb-2">{facility.name}</h3>

                {facility.category && (
                  <Badge variant="primary" className="mb-3">
                    {facility.category}
                  </Badge>
                )}

                <div className="space-y-2 mb-4 text-sm text-neutral-600">
                  {facility.capacity && <p>🧑‍🤝‍🧑 {facility.capacity} people capacity</p>}
                  {facility.rating && (
                    <p>⭐ {facility.rating} ({facility.reviews || 0} reviews)</p>
                  )}
                </div>

                <Link to={`/facilities/${facility.id}`}>
                  <Button variant="primary" size="full">
                    View Details
                  </Button>
                </Link>
              </Card>
            ))
          ) : (
            <div className="col-span-3">
              <Card className="text-center py-12">
                <p className="text-neutral-600">No facilities found matching your search.</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
