import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      id: 1,
      question: 'How do I make a reservation?',
      answer: 'Click on "New Reservation" from your dashboard, select the facility or asset you want, choose your date and time, enter the purpose, and submit. You will receive a confirmation email once approved.'
    },
    {
      id: 2,
      question: 'How long does it take to get approval?',
      answer: 'Most reservations are approved within 24 hours. During busy periods, it may take up to 48 hours. You will receive an email notification once your request is approved or rejected.'
    },
    {
      id: 3,
      question: 'Can I cancel a reservation?',
      answer: 'Yes, you can cancel an approved reservation at any time. However, cancellations within 24 hours of the reservation time may result in a mark on your account.'
    },
    {
      id: 4,
      question: 'What is the maximum booking period?',
      answer: 'Facilities can be booked for up to 4 hours per session, with a maximum of 2 sessions per day. Assets can be borrowed for 3-14 days depending on the item.'
    },
    {
      id: 5,
      question: 'What happens if I damage equipment?',
      answer: 'Users are responsible for any damage caused by negligence. Repair costs will be charged to the borrower. We recommend reporting any damage immediately to the equipment manager.'
    },
    {
      id: 6,
      question: 'Can I extend my reservation?',
      answer: 'You can request an extension up to 24 hours before your reservation ends, subject to availability. Extensions are not guaranteed during peak periods.'
    },
    {
      id: 7,
      question: 'How do I know facility availability?',
      answer: 'The facility details page shows a calendar with available and booked dates. Green indicates availability, gray indicates booked times.'
    },
    {
      id: 8,
      question: 'What if I forgot to return an asset on time?',
      answer: 'Late returns incur a penalty of $10 per day. Additionally, you may be restricted from borrowing further assets until the outstanding balance is paid.'
    }
  ];

  const bookingGuidelines = [
    {
      title: 'Facility Booking Rules',
      items: [
        'No food or drinks in laboratories and computer facilities',
        'Keep noise levels low in shared spaces',
        'Return facilities in the same condition as received',
        'Clean up after use',
        'Respect quiet hours (10 PM - 8 AM)',
        'Maximum 2-hour sessions during peak hours'
      ]
    },
    {
      title: 'Asset Borrowing Rules',
      items: [
        'Sign equipment checkout form',
        'Inspection upon return (condition must match checkout)',
        'Handle equipment with care',
        'Use only for intended purpose',
        'Return with all original accessories',
        'Report damage immediately'
      ]
    },
    {
      title: 'Cancellation Policy',
      items: [
        'Free cancellation up to 24 hours before reservation',
        'Cancellations within 24 hours: Mark recorded on account',
        '3 marks within 30 days: Account suspension',
        'Deposits are refunded for cancelled bookings (minus cancellation fee if applicable)',
        'Emergency cancellations may have exceptions'
      ]
    },
    {
      title: 'Return & Damage Policy',
      items: [
        'Assets must be returned by the specified date/time',
        'Condition inspection upon return',
        'Damage caused by negligence: User responsible for repairs',
        'Normal wear and tear: Covered by the system',
        'Late fees: $10/day per item',
        'Lost items: Full replacement cost charged'
      ]
    }
  ];

  const contactInfo = [
    {
      department: 'Facility Management',
      email: 'facilities@school.edu',
      phone: '(555) 123-4567',
      hours: 'Monday - Friday, 8:00 AM - 5:00 PM'
    },
    {
      department: 'Equipment Management',
      email: 'equipment@school.edu',
      phone: '(555) 123-4568',
      hours: 'Monday - Friday, 9:00 AM - 4:00 PM'
    },
    {
      department: 'Technical Support',
      email: 'support@school.edu',
      phone: '(555) 123-4569',
      hours: '24/7 email support'
    }
  ];

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
          <h2 className="text-3xl font-bold text-neutral-900">Help & Support</h2>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-8 border-b-2 border-neutral-200 mb-8">
          {['faq', 'guidelines', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-semibold capitalize transition ${
                activeTab === tab
                  ? 'text-primary-500 border-b-3 border-primary-500'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab === 'faq' ? 'FAQs' : tab === 'guidelines' ? 'Guidelines' : 'Contact'}
            </button>
          ))}
        </div>

        {/* FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} hoverable>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <h3 className="font-semibold text-neutral-900 text-lg">{faq.question}</h3>
                  <span className="text-2xl transition-transform" style={{
                    transform: expandedFaq === faq.id ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <p className="text-neutral-600">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Guidelines */}
        {activeTab === 'guidelines' && (
          <div className="grid grid-cols-2 gap-8">
            {bookingGuidelines.map((section, idx) => (
              <Card key={idx}>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <span className="text-primary-500 font-bold mt-0.5">•</span>
                      <span className="text-neutral-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}

        {/* Contact */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 gap-8">
            {contactInfo.map((contact, idx) => (
              <Card key={idx}>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{contact.department}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Email</p>
                        <a href={`mailto:${contact.email}`} className="text-primary-500 hover:text-primary-600 font-semibold">
                          {contact.email}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Phone</p>
                        <a href={`tel:${contact.phone}`} className="text-primary-500 hover:text-primary-600 font-semibold">
                          {contact.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Hours</p>
                        <p className="font-semibold text-neutral-900">{contact.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Contact Form */}
            <Card>
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-base"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-base"
                />
                <select className="w-full px-4 py-3 border-2 border-neutral-200 rounded-base">
                  <option>Select Department...</option>
                  <option>Facility Management</option>
                  <option>Equipment Management</option>
                  <option>Technical Support</option>
                </select>
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-base"
                />
                <Button variant="primary" size="full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
