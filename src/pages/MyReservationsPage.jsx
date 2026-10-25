import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function MyReservationsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const [reservations] = useState({
    upcoming: [
      {
        id: 1,
        name: 'Computer Lab A',
        type: 'Facility',
        date: 'Oct 25, 2026',
        time: '2:00 PM - 4:00 PM',
        status: 'approved',
        attendees: 25
      },
      {
        id: 2,
        name: 'Meeting Room B',
        type: 'Facility',
        date: 'Oct 26, 2026',
        time: '10:00 AM - 11:30 AM',
        status: 'approved',
        attendees: 8
      }
    ],
    pending: [
      {
        id: 3,
        name: 'Lab Equipment Set',
        type: 'Asset',
        date: 'Oct 27, 2026',
        status: 'pending'
      }
    ],
    past: [
      {
        id: 4,
        name: 'Classroom A101',
        type: 'Facility',
        date: 'Oct 20, 2026',
        time: '1:00 PM - 2:00 PM',
        status: 'completed',
        attendees: 30
      }
    ]
  });

  const tabs = ['upcoming', 'pending', 'past'];

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
            <Link to="/new-reservation" className="text-neutral-600 hover:text-neutral-900">
              New Booking
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900">My Reservations</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b-2 border-neutral-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold capitalize transition ${
                activeTab === tab
                  ? 'text-primary-500 border-b-3 border-primary-500'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'upcoming' ? 'Upcoming' : tab === 'pending' ? 'Pending' : 'Past'}
            </button>
          ))}
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {reservations[activeTab].length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-neutral-600 mb-4">No {activeTab} reservations</p>
              <Link to="/new-reservation">
                <Button variant="primary">Create New Reservation</Button>
              </Link>
            </Card>
          ) : (
            reservations[activeTab].map((res) => (
              <Card key={res.id} hoverable>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">
                      {res.type === 'Facility' ? '🏛️' : '📦'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 text-lg">{res.name}</h3>
                      <p className="text-sm text-neutral-600">Type: {res.type}</p>
                      {res.time && <p className="text-sm text-neutral-600">{res.date} | {res.time}</p>}
                      {!res.time && <p className="text-sm text-neutral-600">{res.date}</p>}
                      {res.attendees && <p className="text-xs text-neutral-500 mt-1">Attendees: {res.attendees}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        res.status === 'approved'
                          ? 'approved'
                          : res.status === 'pending'
                            ? 'pending'
                            : 'neutral'
                      }
                    >
                      {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                    </Badge>

                    <div className="flex gap-2">
                      <Link to={`/reservations/${res.id}`}>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
                      {activeTab !== 'past' && (
                        <Button variant="danger" size="sm">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
