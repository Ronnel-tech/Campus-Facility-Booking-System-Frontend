import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../lib/validation';
import apiService from '../services/apiService';

const handleChangePassword = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  try {
    await apiService.post('/users/change-password', {
      current_password: formData.get('current_password'),
      new_password: formData.get('new_password'),
      confirm_password: formData.get('confirm_password'),
    });
    e.target.reset();
    alert('Password changed successfully');
  } catch (err) {
    console.error('Password change failed:', err);
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    student_id: '',
    department: '',
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    approvals: true,
    reminders: true,
    changes: true,
    email: true,
    sms: false,
  });
  const [prefsLoading, setPrefsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, prefsRes] = await Promise.all([
        apiService.get('/users/profile'),
        apiService.get('/users/notification-preferences'),
      ]);

      const profile = profileRes.data || {};
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        student_id: profile.student_id || '',
        department: profile.department || '',
      });

      const prefs = prefsRes.data || {};
      setNotificationPrefs({
        approvals: prefs.approvals !== false,
        reminders: prefs.reminders !== false,
        changes: prefs.changes !== false,
        email: prefs.email !== false,
        sms: prefs.sms === true,
      });
    } catch (err) {
      if (err.status === 401) navigate('/login');
      else if (err.status === 403) navigate('/unauthorized');
      else setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrefChange = (key, value) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await apiService.put('/users/profile', formData);
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  };

  const handleSavePrefs = async () => {
    setPrefsLoading(true);
    try {
      await apiService.put('/users/notification-preferences', notificationPrefs);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setPrefsLoading(false);
    }
  };

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
            <p className="text-neutral-600">Loading profile...</p>
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
          <Link to="/dashboard" className="text-neutral-600 hover:text-neutral-900">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900">My Profile</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {error && (
          <Card className="mb-8 border-error">
            <p className="text-error p-4">{error}</p>
          </Card>
        )}

        {/* Profile Picture & Basic Info */}
        <Card className="mb-8">
          <div className="flex items-center gap-8 pb-8 border-b border-neutral-200">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-5xl">
              👤
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-neutral-900">
                {formData.first_name || user?.name || 'User'} {formData.last_name || ''}
              </h3>
              <p className="text-neutral-600 capitalize">{user?.role || 'User'}</p>
              <p className="text-neutral-500 text-sm mt-1">{formData.email || user?.email || ''}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleFormChange}
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleFormChange}
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
                <Input
                  label="Student/Staff ID"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleFormChange}
                />
              </div>

              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleFormChange}
              />

              <div className="flex gap-4 pt-4">
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
                <Button variant="secondary" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-neutral-500">Phone</p>
                <p className="text-neutral-900 font-medium">{formData.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-neutral-500">Student/Staff ID</p>
                <p className="text-neutral-900 font-medium">{formData.student_id || 'Not set'}</p>
              </div>
              <div>
                <p className="text-neutral-500">Department</p>
                <p className="text-neutral-900 font-medium">{formData.department || 'Not set'}</p>
              </div>
              <div>
                <p className="text-neutral-500">Role</p>
                <p className="text-neutral-900 font-medium capitalize">{user?.role || 'User'}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-neutral-900 mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { key: 'approvals', label: 'Booking Approvals', desc: 'Get notified when your bookings are approved or rejected' },
              { key: 'reminders', label: 'Upcoming Reminders', desc: 'Receive reminders before your scheduled reservations' },
              { key: 'changes', label: 'Booking Changes', desc: 'Get notified of any changes to your existing bookings' },
              { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via SMS (if configured)' },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-neutral-900">{pref.label}</p>
                  <p className="text-sm text-neutral-500">{pref.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationPrefs[pref.key]}
                    onChange={(e) => handlePrefChange(pref.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <Button variant="primary" onClick={handleSavePrefs} disabled={prefsLoading}>
              {prefsLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="mt-8">
          <h3 className="text-xl font-bold text-neutral-900 mb-6">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              name="current_password"
              placeholder="Enter current password"
              required
            />
            <Input
              label="New Password"
              type="password"
              name="new_password"
              placeholder="Min 8 chars, uppercase, lowercase, number"
              required
              minLength="8"
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              required
            />
            <Button variant="primary" type="submit">Change Password</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}