import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { getAppointments, updateAppointment, deleteAppointment } from '../services/api';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await getAppointments(params);
      setAppointments(response.data.data);
    } catch {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      setSuccess(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch {
      setError('Failed to update appointment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      await deleteAppointment(id);
      setSuccess('Appointment deleted');
      fetchAppointments();
    } catch {
      setError('Failed to delete appointment');
    }
  };

  const STATUS_CLASSES = {
    Pending: 'badge-warning',
    Confirmed: 'badge-info',
    Completed: 'badge-success',
    Cancelled: 'badge-danger',
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Manage Appointments</h1>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="filter-bar">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No appointments found</td></tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt._id}>
                      <td>{apt.patientId?.name || 'N/A'}</td>
                      <td>{apt.doctorId?.name || 'N/A'}</td>
                      <td>{new Date(apt.appointmentDate).toLocaleDateString('en-IN')}</td>
                      <td>{apt.appointmentTime}</td>
                      <td>{apt.reason.substring(0, 30)}...</td>
                      <td>
                        <span className={`badge ${STATUS_CLASSES[apt.status]}`}>{apt.status}</span>
                      </td>
                      <td>
                        {apt.status === 'Pending' && (
                          <button className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(apt._id, 'Confirmed')}>Confirm</button>
                        )}
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(apt._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAppointments;
