import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function FacilityDetailsPage() {
  const { id } = useParams();
  
  const [facility] = useState({
    id: id || 1,
    name: 'Computer Laboratory A',
    category: 'Laboratory',
    capacity: 40,
    rating: 4.8,
    reviews: 84,
    hours: '8:00 AM - 6:00 PM',
    amenities: ['Air Conditioning', 'WiFi', 'Projector', 'Whiteboard', 'Computers', 'Printers'],
    rules: [
      'No food or drinks allowed',
      'Keep noise levels low',
      'Equipment must be returned in original condition',
      'Maximum 2-hour sessions during peak hours'
    ],
    description: 'A fully equipped computer laboratory with 40 workstations, high-speed internet, and modern software.'
  });

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
              <Badge variant="approved" className="bg-white text-primary-500">
                {facility.category}
              </Badge>
              <p className="text-lg mt-2 opacity-90">⭐ {facility.rating} ({facility.reviews} reviews)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Capacity</p>
            <p className="text-3xl font-bold text-neutral-900">🧑‍🤝‍🧑 {facility.capacity}</p>
            <p className="text-sm text-neutral-600 mt-2">people</p>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Hours</p>
            <p className="text-lg font-bold text-neutral-900">{facility.hours}</p>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Status</p>
            <p className="text-lg font-bold text-success">✓ Available</p>
          </Card>
        </div>

        {/* Description */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Facility</h2>
          <p className="text-neutral-600 leading-relaxed">{facility.description}</p>
        </Card>

        {/* Amenities */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Amenities</h2>
          <div className="grid grid-cols-3 gap-4">
            {facility.amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <span className="text-2xl">✓</span>
                <span className="text-neutral-700">{amenity}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Rules & Guidelines */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Rules & Guidelines</h2>
          <ul className="space-y-3">
            {facility.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-500 font-bold mt-1">•</span>
                <span className="text-neutral-600">{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Availability Calendar */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Availability</h2>
          <div className="bg-neutral-50 p-8 rounded-lg text-center">
            <p className="text-neutral-600 mb-4">📅 Calendar View - October 2026</p>
            <div className="inline-flex gap-2">
              <span className="px-4 py-2 bg-primary-500 text-white rounded">Green = Available</span>
              <span className="px-4 py-2 bg-neutral-300 text-neutral-700 rounded">Gray = Booked</span>
            </div>
          </div>
        </Card>

        {/* CTA Button */}
        <Link to="/new-reservation">
          <Button variant="primary" size="full" className="py-4 text-lg">
            Reserve This Facility
          </Button>
        </Link>
      </div>
    </div>
  );
}
