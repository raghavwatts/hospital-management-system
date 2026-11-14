import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDoctorById, createAppointment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM',
];

const DoctorDetails = () => {
  const { id } = useParams();
  const { user, isPatient } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ appointmentDate: '', appointmentTime: '', reason: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    getDoctorById(id)
      .then((res) => setDoctor(res.data.data))
      .catch(() => setError('Doctor not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setBookingError('');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!form.appointmentDate || !form.appointmentTime || !form.reason)
      return setBookingError('Please fill in all fields');

    setBookingLoading(true);
    try {
      await createAppointment({ doctorId: id, ...form });
      setBookingSuccess('Appointment booked successfully!');
      setForm({ appointmentDate: '', appointmentTime: '', reason: '' });
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="page"><Loading message="Loading doctor details..." /></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page">
      <div className="doctor-details-container">
        {/* Doctor Profile Card */}
        <div className="doctor-profile-card">
          <div className="doctor-profile-header">
            <div className="doctor-large-avatar">👨‍⚕️</div>
            <div>
              <h1>{doctor.name}</h1>
              <p className="specialization">{doctor.specialization}</p>
              <span className={`badge ${doctor.availability ? 'badge-success' : 'badge-danger'}`}>
                {doctor.availability ? '● Available' : '● Not Available'}
              </span>
            </div>
          </div>

          <div className="doctor-profile-details">
            <div className="detail-item">
              <span className="detail-label">Department</span>
              <span>{doctor.department}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Qualification</span>
              <span>{doctor.qualification}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Experience</span>
              <span>{doctor.experience} years</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span>{doctor.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span>{doctor.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Consultation Fee</span>
              <span className="fee-amount">₹{doctor.fee}</span>
            </div>
          </div>
        </div>

        {/* Booking / Login prompt */}
        {isPatient && doctor.availability ? (
          <div className="booking-card">
            <h2>Book Appointment</h2>
            {bookingSuccess && <div className="alert alert-success">{bookingSuccess}</div>}
            {bookingError && <div className="alert alert-error">{bookingError}</div>}
            <form onSubmit={handleBook} className="booking-form">
              <div className="form-group">
                <label>Appointment Date *</label>
                <input
                  type="date" name="appointmentDate" value={form.appointmentDate}
                  onChange={handleChange} min={new Date().toISOString().split('T')[0]} required
                />
              </div>
              <div className="form-group">
                <label>Time Slot *</label>
                <select name="appointmentTime" value={form.appointmentTime} onChange={handleChange} required>
                  <option value="">Select a time slot</option>
                  {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Reason for Visit *</label>
                <textarea
                  name="reason" value={form.reason} onChange={handleChange}
                  placeholder="Describe your symptoms or reason for the visit"
                  rows="3" required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={bookingLoading}>
                {bookingLoading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        ) : !user ? (
          <div className="booking-card">
            <div className="empty-state">
              <span>🔐</span>
              <p>Please <Link to="/login">sign in</Link> to book an appointment with this doctor.</p>
            </div>
          </div>
        ) : !doctor.availability ? (
          <div className="booking-card">
            <div className="empty-state">
              <span>📅</span>
              <p>This doctor is currently not available for appointments.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DoctorDetails;
