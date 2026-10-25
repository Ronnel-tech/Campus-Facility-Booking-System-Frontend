import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function FacilitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [facilities] = useState([
    {
      id: 1,
      name: 'Computer Laboratory A',
      category: 'Laboratory',
      capacity: 40,
      rating: 4.8,
      reviews: 84,
      available: true
    },
    {
      id: 2,
      name: 'Classroom A101',
      category: 'Classroom',
      capacity: 50,
      rating: 4.6,
      reviews: 62,
      available: true
    },
    {
      id: 3,
      name: 'Meeting Room B',
      category: 'Meeting',
      capacity: 20,
      rating: 4.9,
      reviews: 45,
      available: true
    },
    {
      id: 4,
      name: 'Event Hall',
      category: 'Event',
      capacity: 200,
      rating: 4.7,
      reviews: 28,
      available: true
    },
    {
      id: 5,
      name: 'Sports Court',
      category: 'Sports',
      capacity: 100,
      rating: 4.5,
      reviews: 32,
      available: true
    },
    {
      id: 6,
      name: 'Research Lab',
      category: 'Laboratory',
      capacity: 30,
      rating: 4.8,
      reviews: 21,
      available: true
    }
  ]);

  const categories = ['all', 'Laboratory', 'Classroom', 'Meeting', 'Event', 'Sports'];

  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
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

        {/* Facilities Grid */}
        <div className="grid grid-cols-3 gap-8">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} hoverable>
              <div className="mb-4 text-5xl text-center py-4 bg-primary-50 rounded">🏛️</div>
              
              <h3 className="font-semibold text-neutral-900 mb-2">{facility.name}</h3>
              
              <Badge variant="primary" className="mb-3">
                {facility.category}
              </Badge>
              
              <div className="space-y-2 mb-4 text-sm text-neutral-600">
                <p>🧑‍🤝‍🧑 {facility.capacity} people capacity</p>
                <p>⭐ {facility.rating} ({facility.reviews} reviews)</p>
              </div>

              <Link to={`/facilities/${facility.id}`}>
                <Button variant="primary" size="full">
                  View Details
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-neutral-600">No facilities found matching your search.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
