import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import {
  formatErrorMessage,
  validateDate,
  validateTimeSlot,
  validateNumber,
} from '../lib/validation';
import reservationsService from '../services/reservationsService';
import facilitiesService from '../services/facilitiesService';
import assetsService from '../services/assetsService';

export default function NewReservationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: null,
    facility_id: searchParams.get('facility') || null,
    asset_id: null,
    start_date: '',
    start_time: '',
    end_time: '',
    purpose: '',
    attendee_count: '',
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [facilitiesRes, assetsRes] = await Promise.all([
          facilitiesService.getAll(1, 100),
          assetsService.getAll(1, 100),
        ]);

        setFacilities(facilitiesRes.data?.facilities || []);
        setAssets(assetsRes.data?.assets || []);
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

    fetchData();
  }, [isAuthenticated, navigate]);

  const validateStep = () => {
    const errors = {};

    if (step === 1) {
      if (!formData.type) {
        errors.type = 'Please select a reservation type';
      }
    } else if (step === 2) {
      if (formData.type === 'facility' && !formData.facility_id) {
        errors.facility_id = 'Please select a facility';
      }
      if (formData.type === 'asset' && !formData.asset_id) {
        errors.asset_id = 'Please select an asset';
      }
    } else if (step === 3) {
      if (!formData.start_date) {
        errors.start_date = 'Date is required';
      } else if (!validateDate(formData.start_date)) {
        errors.start_date = 'Invalid date format';
      }

      if (formData.type === 'facility') {
        if (!formData.start_time) {
          errors.start_time = 'Start time is required';
        } else if (!validateTimeSlot(formData.start_time)) {
          errors.start_time = 'Invalid time format (HH:MM)';
        }

        if (!formData.end_time) {
          errors.end_time = 'End time is required';
        } else if (!validateTimeSlot(formData.end_time)) {
          errors.end_time = 'Invalid time format (HH:MM)';
        }
      }
    } else if (step === 4) {
      if (!formData.purpose) {
        errors.purpose = 'Purpose is required';
      }

      if (formData.type === 'facility') {
        if (!formData.attendee_count) {
          errors.attendee_count = 'Attendee count is required';
        } else if (!validateNumber(formData.attendee_count, 1, 1000)) {
          errors.attendee_count = 'Please enter a valid number';
        }
      }
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    setFieldErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    const errors = validateStep();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      setError(null);

      const payload = {
        type: formData.type,
        start_date: formData.start_date,
        purpose: formData.purpose,
        notes: formData.notes,
      };

      if (formData.type === 'facility') {
        payload.facility_id = formData.facility_id;
        payload.start_time = formData.start_time;
        payload.end_time = formData.end_time;
        payload.attendee_count = parseInt(formData.attendee_count);
      } else {
        payload.asset_id = formData.asset_id;
      }

      await reservationsService.create(payload);
      navigate('/reservations');
    } catch (err) {
      setError(formatErrorMessage(err));
      if (err.details?.errors) {
        if (Array.isArray(err.details.errors)) {
          setError(err.details.errors[0] || err.message);
        } else if (typeof err.details.errors === 'object') {
          setFieldErrors(err.details.errors);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Select Request Type
  if (step === 1) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-16 text-neutral-900">
            What would you like to book?
          </h1>

          <div className="grid grid-cols-2 gap-8">
            <Card
              hoverable
              className="cursor-pointer p-8"
              onClick={() => setFormData({ ...formData, type: 'facility' })}
            >
              <div className="text-6xl text-center mb-4">🏛️</div>
              <h2 className="text-2xl font-bold text-center text-neutral-900">Facility</h2>
              <p className="text-center text-neutral-600 mt-2">Book a room or space</p>
            </Card>

            <Card
              hoverable
              className="cursor-pointer p-8"
              onClick={() => setFormData({ ...formData, type: 'asset' })}
            >
              <div className="text-6xl text-center mb-4">📦</div>
              <h2 className="text-2xl font-bold text-center text-neutral-900">Asset</h2>
              <p className="text-center text-neutral-600 mt-2">Borrow equipment</p>
            </Card>
          </div>

          {fieldErrors.type && (
            <div className="mt-8 p-4 bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg">
              <p className="text-error text-sm">{fieldErrors.type}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-12">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!formData.type}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Select Facility/Asset
  if (step === 2) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-16 text-neutral-900">
            Select {formData.type === 'facility' ? 'Facility' : 'Asset'}
          </h1>

          <div className="grid grid-cols-2 gap-6">
            {(formData.type === 'facility' ? facilities : assets).map((item) => (
              <Card
                key={item.id}
                hoverable
                className="cursor-pointer p-6"
                onClick={() => {
                  const key = formData.type === 'facility' ? 'facility_id' : 'asset_id';
                  setFormData({ ...formData, [key]: item.id });
                  handleNext();
                }}
              >
                <div className="text-4xl text-center mb-3">
                  {formData.type === 'facility' ? '🏛️' : '📦'}
                </div>
                <h3 className="font-bold text-neutral-900">{item.name}</h3>
                {item.category && (
                  <p className="text-sm text-neutral-600">{item.category}</p>
                )}
                {item.capacity && (
                  <p className="text-sm text-neutral-600">Capacity: {item.capacity}</p>
                )}
              </Card>
            ))}
          </div>

          {fieldErrors.facility_id && (
            <div className="mt-8 p-4 bg-error bg-opacity-10 border border-error border-opacity-30 rounded-lg">
              <p className="text-error text-sm">{fieldErrors.facility_id}</p>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-12">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Select Date & Time
  if (step === 3) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-2xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-16 text-neutral-900">
            When do you need it?
          </h1>

          <Card className="p-8 space-y-6">
            <div>
              <Input
                label="Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => {
                  setFormData({ ...formData, start_date: e.target.value });
                  setFieldErrors({ ...fieldErrors, start_date: '' });
                }}
                error={fieldErrors.start_date}
              />
            </div>

            {formData.type === 'facility' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => {
                      setFormData({ ...formData, start_time: e.target.value });
                      setFieldErrors({ ...fieldErrors, start_time: '' });
                    }}
                    error={fieldErrors.start_time}
                  />
                  <Input
                    label="End Time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => {
                      setFormData({ ...formData, end_time: e.target.value });
                      setFieldErrors({ ...fieldErrors, end_time: '' });
                    }}
                    error={fieldErrors.end_time}
                  />
                </div>
              </>
            )}
          </Card>

          <div className="flex justify-center gap-4 mt-12">
            <Button variant="outline" onClick={handleBack}>
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

  // Step 4: Additional Details
  if (step === 4) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-2xl mx-auto px-8">
          <h1 className="text-4xl font-bold text-center mb-16 text-neutral-900">
            Tell us more
          </h1>

          <Card className="p-8 space-y-6">
            <Input
              label="Purpose"
              type="text"
              placeholder="Why do you need this facility/asset?"
              value={formData.purpose}
              onChange={(e) => {
                setFormData({ ...formData, purpose: e.target.value });
                setFieldErrors({ ...fieldErrors, purpose: '' });
              }}
              error={fieldErrors.purpose}
            />

            {formData.type === 'facility' && (
              <Input
                label="Number of Attendees"
                type="number"
                min="1"
                placeholder="How many people will attend?"
                value={formData.attendee_count}
                onChange={(e) => {
                  setFormData({ ...formData, attendee_count: e.target.value });
                  setFieldErrors({ ...fieldErrors, attendee_count: '' });
                }}
                error={fieldErrors.attendee_count}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg font-sans text-sm focus:outline-none focus:border-primary-500"
                rows="4"
                placeholder="Any special requirements or notes?"
              />
            </div>
          </Card>

          <div className="flex justify-center gap-4 mt-12">
            <Button variant="outline" onClick={handleBack}>
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

  // Step 5: Review & Submit
  if (step === 5) {
    const selectedFacility = facilities.find((f) => f.id === formData.facility_id);
    const selectedAsset = assets.find((a) => a.id === formData.asset_id);

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
                <p className="text-sm text-neutral-600 mb-1">
                  {formData.type === 'facility' ? 'Facility' : 'Asset'}
                </p>
                <p className="font-semibold text-neutral-900">
                  {formData.type === 'facility'
                    ? selectedFacility?.name
                    : selectedAsset?.name}
                </p>
              </div>

              <div className="pb-4 border-b border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Date & Time</p>
                <p className="font-semibold text-neutral-900">
                  {new Date(formData.start_date).toLocaleDateString()}{' '}
                  {formData.type === 'facility'
                    ? `| ${formData.start_time} - ${formData.end_time}`
                    : ''}
                </p>
              </div>

              <div className="pb-4 border-b border-neutral-200">
                <p className="text-sm text-neutral-600 mb-1">Purpose</p>
                <p className="font-semibold text-neutral-900">{formData.purpose}</p>
              </div>

              {formData.type === 'facility' && formData.attendee_count && (
                <div className="pb-4 border-b border-neutral-200">
                  <p className="text-sm text-neutral-600 mb-1">Attendees</p>
                  <p className="font-semibold text-neutral-900">
                    {formData.attendee_count} people
                  </p>
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

          {error && (
            <Card className="mb-8 p-4 bg-error bg-opacity-10 border border-error border-opacity-30">
              <p className="text-error text-sm">{error}</p>
            </Card>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleBack} disabled={submitting}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Reservation'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}