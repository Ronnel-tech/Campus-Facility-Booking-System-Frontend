import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-neutral-900">Campus Facility Booking</div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary-500 to-primary-600 text-white text-center">
        <h1 className="text-5xl font-bold mb-6">Effortless Facility & Asset Booking</h1>
        <p className="text-xl mb-8 opacity-90">Reserve classrooms, equipment, and facilities in seconds</p>
        <Link to="/login">
          <Button variant="primary" className="bg-white text-primary-500 hover:bg-neutral-50">
            Get Started
          </Button>
        </Link>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-neutral-900">How It Works</h2>
        <div className="grid grid-cols-4 gap-6">
          {[
            { num: '1', title: 'Select', desc: 'Choose facility or asset' },
            { num: '2', title: 'Reserve', desc: 'Pick date & time' },
            { num: '3', title: 'Approve', desc: 'Admin confirmation' },
            { num: '4', title: 'Enjoy', desc: 'Use your booking' }
          ].map((step) => (
            <div key={step.num} className="bg-neutral-50 p-8 rounded-lg text-center border border-neutral-200">
              <div className="text-5xl font-bold text-primary-500 mb-4">{step.num}</div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-900">{step.title}</h3>
              <p className="text-neutral-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Overview */}
      <section className="py-20 px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-neutral-900">Available Facilities</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: '🎓', name: 'Classrooms' },
              { icon: '🔬', name: 'Laboratories' },
              { icon: '🤝', name: 'Meeting Rooms' },
              { icon: '⚽', name: 'Sports Areas' },
              { icon: '🎪', name: 'Event Halls' },
              { icon: '🎬', name: 'Audio/Visual' }
            ].map((facility) => (
              <div key={facility.name} className="bg-white p-8 rounded-lg text-center border border-neutral-200 hover:border-primary-500 transition">
                <div className="text-5xl mb-4">{facility.icon}</div>
                <h3 className="font-semibold text-neutral-900">{facility.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-primary-500 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of students and faculty booking facilities and assets</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button variant="outline" className="border-white text-white hover:bg-primary-600">
                Login
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="primary" className="bg-white text-primary-500">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-8 text-center">
        <p className="text-neutral-400">© 2026 Campus Facility Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
}
