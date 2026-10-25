import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function NewReservationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: null,
    facilityId: null,
    assetId: null,
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendeeCount: '',
    notes: ''
  });

  const handleTypeSelect = (type) => {
    setFormData({ ...formData, type });
    setStep(2);
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Submitting reservation:', formData);
    // Submit to backend
    navigate('/reservations');
  };

  // Step 1: Select Request Type
  if (step === 1) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-16 text-neutral-900">
            What would you like to book?
          </h1>

          <div className="grid grid-cols-3 gap-8">
            <Card
              hoverable
              className="cursor-pointer text-center py-12"
              onClick={() => handleTypeSelect('facility')}
            >
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Reserve a Facility</h3>
              <p className="text-neutral-600">Book classrooms, labs, meeting rooms, and event spaces</p>
            </Card>

            <Card
              hoverable
              className="cursor-pointer text-center py-12"
              onClick={() => handleTypeSelect('asset')}
            >
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Borrow an Asset</h3>
              <p className="text-neutral-600">Borrow equipment and school items</p>
            </Card>

            <Card
              hoverable
              className="cursor-pointer text-center py-12"
              onClick={() => handleTypeSelect('both')}
            >
              <div className="text-6xl mb-4">🏛️📦</div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">Both</h3>
              <p className="text-neutral-600">Book a facility and equipment together</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select Date & Time
  if (step === 2) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-2xl mx-auto px-8">
          <h1 className="text-3xl font-bold mb-8 text-neutral-900">Select Date & Time</h1>

          <Card className="mb-8">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <Input
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
              <Input
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </Card>

          <div className="flex gap-4 justify-between">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Enter Details
  if (step === 3) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-2xl mx-auto px-8">
          <h1 className="text-3xl font-bold mb-8 text-neutral-900">Reservation Details</h1>

          <Card className="mb-8">
            <Input
              label="Purpose/Reason"
              placeholder="e.g., Class project presentation"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
            />

            {(formData.type === 'facility' || formData.type === 'both') && (
              <Input
                label="Expected Number of Attendees"
                type="number"
                placeholder="e.g., 25"
                value={formData.attendeeCount}
                onChange={(e) => setFormData({ ...formData, attendeeCount: e.target.value })}
                className="mt-4"
              />
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Additional Notes (Optional)</label>
              <textarea
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-base font-sans text-sm focus:outline-none focus:border-primary-500"
                rows="4"
                placeholder="Any special requests..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </Card>

          <div className="flex gap-4 justify-between">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Review
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Review
  if (step === 4) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-2xl mx-auto px-8">
          <h1 className="text-3xl font-bold mb-8 text-neutral-900">Review Your Reservation</h1>

          <Card className="mb-8">
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Booking Type</p>
                <p className="font-semibold text-neutral-900 capitalize">{formData.type}</p>
              </div>

              <div className="pb-4 border-b border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Date & Time</p>
                <p className="font-semibold text-neutral-900">{formData.date} | {formData.startTime} - {formData.endTime}</p>
              </div>

              <div className="pb-4 border-b border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Purpose</p>
                <p className="font-semibold text-neutral-900">{formData.purpose}</p>
              </div>

              {formData.attendeeCount && (
                <div className="pb-4 border-b border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Attendees</p>
                  <p className="font-semibold text-neutral-900">{formData.attendeeCount} people</p>
                </div>
              )}

              {formData.notes && (
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Additional Notes</p>
                  <p className="font-semibold text-neutral-900">{formData.notes}</p>
                </div>
              )}
            </div>
          </Card>

          <div className="flex gap-4 justify-between">
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit Reservation
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
