import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { getAppointments, updateAppointment, getDoctors } from '../services/api';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, doctorsRes] = await Promise.all([
          getAppointments(),
          getDoctors({ search: user.email }),
        ]);
        setAppointments(apptRes.data.data);
        // Find this doctor's profile
        const myProfile = doctorsRes.data.data.find(d => d.email === user.email);
        setDoctorProfile(myProfile);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.email]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      setSuccess(`Appointment ${status}`);
      // Update state locally
      setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
    } catch {
      setError('Failed to update appointment');
    }
  };

  const today = new Date().toDateString();
  const todayAppts = appointments.filter(a => new Date(a.appointmentDate).toDateString() === today);
  const pendingAppts = appointments.filter(a => a.status === 'Pending');
  const completedAppts = appointments.filter(a => a.status === 'Completed');

  const STATUS_CLASSES = { Pending: 'badge-warning', Confirmed: 'badge-info', Completed: 'badge-success', Cancelled: 'badge-danger' };

  if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main"><Loading /></main></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user.name}</h1>
            {doctorProfile && <p>{doctorProfile.specialization} — {doctorProfile.department}</p>}
          </div>
          <Link to="/doctor/prescriptions" className="btn btn-primary">+ Write Prescription</Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Stats */}
        <div className="stats-grid">
          <StatCard title="Total Appointments" value={appointments.length} icon="📅" color="blue" />
          <StatCard title="Today's Appointments" value={todayAppts.length} icon="📆" color="green" />
          <StatCard title="Pending" value={pendingAppts.length} icon="⏳" color="orange" />
          <StatCard title="Completed" value={completedAppts.length} icon="✅" color="teal" />
        </div>

        {/* Appointments List */}
        <div className="recent-section">
          <h2>My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="empty-text">No appointments yet</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt._id}>
                      <td>{apt.patientId?.name || 'N/A'}</td>
                      <td>{new Date(apt.appointmentDate).toLocaleDateString('en-IN')}</td>
                      <td>{apt.appointmentTime}</td>
                      <td>{apt.reason.substring(0, 25)}...</td>
                      <td><span className={`badge ${STATUS_CLASSES[apt.status]}`}>{apt.status}</span></td>
                      <td>
                        {apt.status === 'Pending' && (
                          <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(apt._id, 'Confirmed')}>Confirm</button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStatus(apt._id, 'Completed')}>Complete</button>
                        )}
                        {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                          <button className="btn btn-sm btn-danger" onClick={() => handleUpdateStatus(apt._id, 'Cancelled')}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
