import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@school.edu',
    phone: '+1 (555) 123-4567',
    studentId: 'STU-2023-12345',
    department: 'Computer Science',
    role: 'Student'
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    approvals: true,
    reminders: true,
    changes: true,
    email: true,
    sms: false
  });

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
        {/* Profile Picture & Basic Info */}
        <Card className="mb-8">
          <div className="flex items-center gap-8 pb-8 border-b border-neutral-200">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-5xl">
              👤
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-neutral-900">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-neutral-600">{formData.role}</p>
              <p className="text-neutral-500 text-sm mt-1">{formData.email}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditing ? (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div className="flex gap-4 pt-4">
                <Button variant="primary" onClick={() => setIsEditing(false)}>
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Email</p>
                <p className="font-semibold text-neutral-900">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Phone</p>
                <p className="font-semibold text-neutral-900">{formData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Student ID</p>
                <p className="font-semibold text-neutral-900">{formData.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-1">Department</p>
                <p className="font-semibold text-neutral-900">{formData.department}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Notification Preferences */}
        <Card className="mb-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6">Notification Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">Approval Notifications</p>
                <p className="text-sm text-neutral-600">Get notified when reservations are approved</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.approvals}
                onChange={(e) =>
                  setNotificationPrefs({ ...notificationPrefs, approvals: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">Booking Reminders</p>
                <p className="text-sm text-neutral-600">Reminders before your reservations</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.reminders}
                onChange={(e) =>
                  setNotificationPrefs({ ...notificationPrefs, reminders: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-semibold text-neutral-900">Change Request Notifications</p>
                <p className="text-sm text-neutral-600">When admin requests changes</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.changes}
                onChange={(e) =>
                  setNotificationPrefs({ ...notificationPrefs, changes: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="border-t border-neutral-200 pt-6 mt-6">
              <p className="font-semibold text-neutral-900 mb-4">Notification Channels</p>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg mb-3">
                <div>
                  <p className="font-semibold text-neutral-900">Email Notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs.email}
                  onChange={(e) =>
                    setNotificationPrefs({ ...notificationPrefs, email: e.target.checked })
                  }
                  className="w-5 h-5 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-semibold text-neutral-900">SMS Notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPrefs.sms}
                  onChange={(e) =>
                    setNotificationPrefs({ ...notificationPrefs, sms: e.target.checked })
                  }
                  className="w-5 h-5 rounded"
                />
              </div>
            </div>
          </div>

          <Button variant="primary" className="mt-8">
            Save Preferences
          </Button>
        </Card>

        {/* Account Actions */}
        <Card>
          <h3 className="text-2xl font-bold text-neutral-900 mb-6">Account</h3>

          <div className="space-y-3">
            <Button variant="secondary" size="full">
              Change Password
            </Button>
            <Button variant="secondary" size="full">
              Download My Data
            </Button>
            <Button variant="danger" size="full">
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
