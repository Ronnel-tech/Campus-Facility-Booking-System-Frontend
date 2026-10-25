import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

export default function AssetDetailsPage() {
  const { id } = useParams();

  const [asset] = useState({
    id: id || 1,
    name: 'Canon EOS R5 Camera',
    assetTag: 'AST-2026-001',
    category: 'Photography',
    condition: 'Good',
    available: true,
    currentLocation: 'Equipment Room 101, Building A',
    borrowingLimit: 7,
    description: 'Professional mirrorless camera with 45MP sensor, 8K video capability, and advanced autofocus system.',
    specifications: [
      'Resolution: 45.0MP',
      'Sensor: Full-frame CMOS',
      'Video: 8K RAW recording',
      'ISO Range: 100-51200',
      'Shutter Speed: 1/8000s'
    ],
    borrowingRules: [
      'Maximum borrowing period: 7 days',
      'Must sign equipment checkout form',
      'Requires damage deposit (returnable)',
      'Late return penalty: $10/day',
      'Must return with all original accessories'
    ],
    damagePolicy: 'Users are responsible for any damage caused by negligence. Repair costs will be charged to the borrower. Normal wear and tear is covered.',
    checkoutHistory: [
      { date: 'Oct 20, 2026', returnedDate: 'Oct 22, 2026', condition: 'Good' },
      { date: 'Oct 15, 2026', returnedDate: 'Oct 18, 2026', condition: 'Good' },
      { date: 'Oct 10, 2026', returnedDate: 'Oct 12, 2026', condition: 'Good' }
    ]
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-neutral-900">Campus Facility Booking</h1>
          <Link to="/assets" className="text-primary-500 hover:text-primary-600">
            ← Back to Assets
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end gap-8">
            <div className="text-8xl">📷</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{asset.name}</h1>
              <Badge variant="approved" className="bg-white text-primary-500">
                {asset.category}
              </Badge>
              <p className="text-lg mt-2 opacity-90">Tag: {asset.assetTag}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Condition</p>
            <p className="text-2xl font-bold text-success">✓ {asset.condition}</p>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Status</p>
            <p className="text-2xl font-bold text-success">Available</p>
          </Card>

          <Card className="text-center">
            <p className="text-sm text-neutral-600 mb-2">Max Borrow</p>
            <p className="text-2xl font-bold text-neutral-900">{asset.borrowingLimit} days</p>
          </Card>
        </div>

        {/* Description */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">About This Asset</h2>
          <p className="text-neutral-600 mb-6">{asset.description}</p>

          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Current Location</h3>
          <p className="text-neutral-600 mb-6">📍 {asset.currentLocation}</p>

          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Specifications</h3>
          <ul className="space-y-2">
            {asset.specifications.map((spec, idx) => (
              <li key={idx} className="text-neutral-600">• {spec}</li>
            ))}
          </ul>
        </Card>

        {/* Borrowing Rules */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Borrowing Rules</h2>
          <ul className="space-y-3">
            {asset.borrowingRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-primary-500 font-bold mt-1">•</span>
                <span className="text-neutral-600">{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Damage Policy */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Damage & Loss Policy</h2>
          <div className="bg-warning bg-opacity-10 border-l-4 border-warning p-4">
            <p className="text-neutral-700">{asset.damagePolicy}</p>
          </div>
        </Card>

        {/* Checkout History */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Checkout History</h2>
          <div className="space-y-3">
            {asset.checkoutHistory.map((record, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-semibold text-neutral-900">Checked out: {record.date}</p>
                  <p className="text-sm text-neutral-600">Returned: {record.returnedDate}</p>
                </div>
                <Badge variant="approved">{record.condition}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Button */}
        <Link to="/new-reservation">
          <Button variant="primary" size="full" className="py-4 text-lg">
            Borrow This Asset
          </Button>
        </Link>
      </div>
    </div>
  );
}
