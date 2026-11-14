import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🩺', title: 'Expert Doctors', desc: 'Browse specialists across multiple departments and book appointments easily.' },
  { icon: '📅', title: 'Easy Appointments', desc: 'Book, track, and manage appointments from your personal dashboard.' },
  { icon: '💊', title: 'Digital Prescriptions', desc: 'Doctors issue digital prescriptions. Patients access them anytime.' },
  { icon: '📊', title: 'Admin Dashboard', desc: 'Complete hospital management with statistics, reports, and controls.' },
];

const Home = () => {
  const { user, isAdmin, isDoctor, isPatient } = useAuth();

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isDoctor) return '/doctor/dashboard';
    if (isPatient) return '/patient/dashboard';
    return '/login';
  };

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Modern Healthcare<br />
            <span className="brand-highlight">Made Simple</span>
          </h1>
          <p>
            MediCare connects patients with expert doctors. Book appointments,
            manage prescriptions, and take control of your health — all in one place.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to={getDashboardLink()} className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/doctors" className="btn btn-outline btn-lg">Browse Doctors</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-icon-wrap">🏥</div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Everything you need</h2>
        <p>A complete platform for patients, doctors, and hospital administrators</p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon-wrap">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta">
          <h2>Ready to get started?</h2>
          <p>Create your account and manage your health better today.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
