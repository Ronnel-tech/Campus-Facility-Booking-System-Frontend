import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import facilitiesService from '../services/facilitiesService';

export default function FacilityDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) {
      setError('Facility ID is required');
      setLoading(false);
      return;
    }

    const fetchFacility = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await facilitiesService.getById(id);
        setFacility(response.data);
      } catch (err) {
        if (err.status === 401) {
          navigate('/login');
        } else if (err.status === 403) {
          navigate('/unauthorized');
        } else if (err.status === 404) {
          setError('Facility not found');
        } else {
          setError(formatErrorMessage(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
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
            <p className="text-neutral-600">Loading facility details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
            <Link to="/facilities" className="text-primary-500 hover:text-primary-600">
              ← Back to Facilities
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <Card className="p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-neutral-600 mb-4">{error || 'Facility not found'}</p>
              <Link to="/facilities">
                <Button variant="primary">Back to Facilities</Button>
              </Link>
            </div>
          </Card>
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
          <Link to="/facilities" className="text-primary-500 hover:text-primary-600">
            ← Back to Facilities
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end gap-8">
            <div className="text-8xl">🏛️</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{facility.name}</h1>
              {facility.category && (
                <Badge variant="approved" className="bg-white text-primary-500">
                  {facility.category}
                </Badge>
              )}
              {facility.rating && (
                <p className="text-lg mt-2 opacity-90">⭐ {facility.rating} ({facility.reviews || 0} reviews)</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {facility.capacity && (
            <Card className="text-center">
              <p className="text-sm text-neutral-600 mb-2">Capacity</p>
              <p className="text-3xl font-bold text-neutral-900">🧑‍🤝‍🧑 {facility.capacity}</p>
              <p className="text-sm text-neutral-600 mt-2">people</p>
            </Card>
          )}

          {facility.hours && (
            <Card className="text-center">
              <p className="text-sm text-neutral-600 mb-2">Hours</p>
              <p className="text-lg font-bold text-neutral-900">{facility.hours}</p>
            </Card>
          )}

          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Status</p>
            <p className="text-lg font-bold text-success">✓ Available</p>
          </Card>
        </div>

        {/* Description */}
        {facility.description && (
          <Card className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Facility</h2>
            <p className="text-neutral-600 leading-relaxed">{facility.description}</p>
          </Card>
        )}

        {/* Amenities */}
        {facility.amenities && facility.amenities.length > 0 && (
          <Card className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Amenities</h2>
            <div className="grid grid-cols-3 gap-4">
              {facility.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <span className="text-2xl">✓</span>
                  <span className="text-neutral-700">{typeof amenity === 'string' ? amenity : amenity.name}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Rules & Guidelines */}
        {facility.rules && facility.rules.length > 0 && (
          <Card className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Rules & Guidelines</h2>
            <ul className="space-y-3">
              {facility.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary-500 font-bold mt-1">•</span>
                  <span className="text-neutral-600">{typeof rule === 'string' ? rule : rule.name}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* CTA Button */}
        <Link to={`/new-reservation?facility=${facility.id}`}>
          <Button variant="primary" size="full" className="py-4 text-lg">
            Reserve This Facility
          </Button>
        </Link>
      </div>
    </div>
  );
}
