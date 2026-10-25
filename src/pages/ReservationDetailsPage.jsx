import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function ReservationDetailsPage() {
  const { id } = useParams();

  const [reservation] = useState({
    id: id || 1,
    confirmationId: 'RES-2026-10-25-001',
    facility: 'Computer Laboratory A',
    facilityType: 'Facility',
    requester: 'John Doe',
    email: 'john@school.edu',
    date: 'October 25, 2026',
    time: '2:00 PM - 4:00 PM',
    purpose: 'Class project presentation',
    attendees: 25,
    status: 'approved',
    requestedOn: 'October 23, 2026',
    approvedOn: 'October 23, 2026',
    approvedBy: 'Admin User',
    pickupInfo: 'Available for pickup 30 minutes before reservation time',
    returnInfo: 'Must be returned within 30 minutes after reservation ends',
    notes: 'Equipment will be set up by staff',
    timeline: [
      { status: 'Requested', date: 'Oct 23, 10:30 AM', icon: '📝' },
      { status: 'Approved', date: 'Oct 23, 2:45 PM', icon: '✅' },
      { status: 'Scheduled', date: 'Oct 25, 2:00 PM', icon: '📅' }
    ]
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <Link to="/reservations" className="text-primary-500 hover:text-primary-600">
            ← Back to Reservations
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{reservation.facility}</h1>
              <p className="text-neutral-600">Confirmation ID: {reservation.confirmationId}</p>
            </div>
            <Badge variant="approved" className="text-lg px-6 py-2">
              {reservation.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Reservation Details */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Reservation Details</h2>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Facility</p>
              <p className="font-semibold text-neutral-900 text-lg">{reservation.facility}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Type</p>
              <p className="font-semibold text-neutral-900 text-lg">{reservation.facilityType}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Date & Time</p>
              <p className="font-semibold text-neutral-900 text-lg">{reservation.date}</p>
              <p className="text-neutral-600">{reservation.time}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Expected Attendees</p>
              <p className="font-semibold text-neutral-900 text-lg">{reservation.attendees} people</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Purpose</p>
              <p className="font-semibold text-neutral-900 text-lg">{reservation.purpose}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600 mb-1">Status</p>
              <Badge variant="approved">{reservation.status}</Badge>
            </div>
          </div>
        </Card>

        {/* Requester Information */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Requester Information</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-600">Name</p>
              <p className="font-semibold text-neutral-900">{reservation.requester}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-600">Email</p>
              <p className="font-semibold text-neutral-900">{reservation.email}</p>
            </div>
          </div>
        </Card>

        {/* Approval Timeline */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Approval Timeline</h2>
          
          <div className="space-y-4">
            {reservation.timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-neutral-200 last:border-b-0">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <p className="font-semibold text-neutral-900">{item.status}</p>
                  <p className="text-sm text-neutral-600">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pickup & Return Information */}
        {(reservation.status === 'approved' || reservation.status === 'scheduled') && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Pickup & Return Information</h2>
            
            <div className="space-y-6">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <p className="text-sm font-semibold text-primary-700 mb-2">📍 Pickup</p>
                <p className="text-neutral-700">{reservation.pickupInfo}</p>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <p className="text-sm font-semibold text-primary-700 mb-2">📍 Return</p>
                <p className="text-neutral-700">{reservation.returnInfo}</p>
              </div>
              
              {reservation.notes && (
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <p className="text-sm font-semibold text-neutral-700 mb-2">📝 Admin Notes</p>
                  <p className="text-neutral-700">{reservation.notes}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {reservation.status === 'pending' && (
            <>
              <Button variant="danger" size="full">
                Cancel Request
              </Button>
              <Button variant="secondary" size="full">
                Request Changes
              </Button>
            </>
          )}
          
          {reservation.status === 'approved' && (
            <>
              <Button variant="primary" size="full">
                Download Confirmation
              </Button>
              <Button variant="danger" size="full">
                Cancel Reservation
              </Button>
            </>
          )}
          
          {reservation.status === 'scheduled' && (
            <Button variant="primary" size="full">
              Mark as Completed
            </Button>
          )}
          
          <Link to="/reservations" className="flex-1">
            <Button variant="secondary" size="full">
              Back to Reservations
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
