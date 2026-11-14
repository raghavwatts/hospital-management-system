import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import {
  getAppointmentStats,
  getDoctors,
  getPatients,
  getAppointments,
} from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect — fetch all dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all stats in parallel for efficiency
        const [statsRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
          getAppointmentStats(),
          getDoctors(),
          getPatients(),
          getAppointments({ limit: 5 }),
        ]);

        setStats(statsRes.data.data);
        setDoctorCount(doctorsRes.data.count);
        setPatientCount(patientsRes.data.count);
        setRecentAppointments(appointmentsRes.data.data.slice(0, 8));
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main"><Loading message="Loading dashboard..." /></main>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Hospital overview and management</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Stats Cards — data from MongoDB, NOT hardcoded */}
        <div className="stats-grid">
          <StatCard title="Total Doctors" value={doctorCount} icon="👨‍⚕️" color="blue" />
          <StatCard title="Total Patients" value={patientCount} icon="🧑‍🤝‍🧑" color="green" />
          <StatCard title="Total Appointments" value={stats?.total || 0} icon="📅" color="purple" />
          <StatCard title="Pending" value={stats?.pending || 0} icon="⏳" color="orange" />
          <StatCard title="Confirmed" value={stats?.confirmed || 0} icon="✅" color="teal" />
          <StatCard title="Completed" value={stats?.completed || 0} icon="🏁" color="indigo" />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-row">
            <Link to="/admin/doctors" className="btn btn-primary">Manage Doctors</Link>
            <Link to="/admin/patients" className="btn btn-secondary">Manage Patients</Link>
            <Link to="/admin/appointments" className="btn btn-outline">View Appointments</Link>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="recent-section">
          <h2>Recent Appointments</h2>
          {recentAppointments.length === 0 ? (
            <p className="empty-text">No appointments yet</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt) => (
                    <tr key={apt._id}>
                      <td>{apt.patientId?.name || 'N/A'}</td>
                      <td>{apt.doctorId?.name || 'N/A'}</td>
                      <td>{new Date(apt.appointmentDate).toLocaleDateString('en-IN')}</td>
                      <td>{apt.appointmentTime}</td>
                      <td>
                        <span className={`badge badge-${apt.status.toLowerCase()}`}>
                          {apt.status}
                        </span>
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

export default AdminDashboard;
