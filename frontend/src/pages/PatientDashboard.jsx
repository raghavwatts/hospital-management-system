import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { getAppointments, deleteAppointment } from '../services/api';

const STATUS_CLASSES = {
  Pending: 'badge-warning', Confirmed: 'badge-info',
  Completed: 'badge-success', Cancelled: 'badge-danger',
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAppointments()
      .then((res) => setAppointments(res.data.data))
      .catch(() => setError('Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await deleteAppointment(id);
      setSuccess('Appointment cancelled');
      setAppointments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      setError('Failed to cancel appointment');
    }
  };

  const upcoming = appointments.filter(
    (a) => (a.status === 'Pending' || a.status === 'Confirmed') && new Date(a.appointmentDate) >= new Date()
  );
  const past = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled' || new Date(a.appointmentDate) < new Date()
  );

  if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main"><Loading /></main></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user.name.split(' ')[0]}</h1>
            <p>Manage your health appointments and records</p>
          </div>
          <Link to="/patient/doctors" className="btn btn-primary">+ Book Appointment</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="stats-grid">
          <StatCard title="Total Appointments" value={appointments.length} icon="📅" color="blue" />
          <StatCard title="Upcoming" value={upcoming.length} icon="⏳" color="orange" />
          <StatCard title="Completed" value={appointments.filter((a) => a.status === 'Completed').length} icon="✅" color="green" />
        </div>

        {/* Upcoming */}
        <div className="recent-section">
          <div className="section-header">
            <h2>Upcoming Appointments</h2>
            <Link to="/patient/appointments" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>No upcoming appointments. <Link to="/patient/doctors">Book one now</Link></p>
            </div>
          ) : (
            <div className="appointments-list">
              {upcoming.map((apt) => (
                <div key={apt._id} className="appointment-item">
                  <div className="appointment-info">
                    <h3>{apt.doctorId?.name || 'Doctor'}</h3>
                    <p>{apt.doctorId?.specialization}</p>
                    <div className="appt-meta">
                      <span>📅 {new Date(apt.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>🕐 {apt.appointmentTime}</span>
                      <span>📝 {apt.reason}</span>
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span className={`badge ${STATUS_CLASSES[apt.status]}`}>{apt.status}</span>
                    {apt.status === 'Pending' && (
                      <button className="btn btn-sm btn-danger" onClick={() => handleCancel(apt._id)}>Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div className="recent-section">
            <h2>Past Appointments</h2>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>Doctor</th><th>Specialization</th><th>Date</th><th>Reason</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {past.slice(0, 6).map((apt) => (
                    <tr key={apt._id}>
                      <td>{apt.doctorId?.name}</td>
                      <td>{apt.doctorId?.specialization}</td>
                      <td>{new Date(apt.appointmentDate).toLocaleDateString('en-IN')}</td>
                      <td>{apt.reason?.substring(0, 35)}{apt.reason?.length > 35 ? '…' : ''}</td>
                      <td><span className={`badge ${STATUS_CLASSES[apt.status]}`}>{apt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
