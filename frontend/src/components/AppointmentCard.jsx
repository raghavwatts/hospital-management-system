const STATUS_COLORS = {
  Pending: 'badge-warning',
  Confirmed: 'badge-info',
  Completed: 'badge-success',
  Cancelled: 'badge-danger',
};

const AppointmentCard = ({ appointment, onUpdateStatus, onDelete, userRole }) => {
  const { patientId, doctorId, appointmentDate, appointmentTime, reason, status } = appointment;

  const formattedDate = new Date(appointmentDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card appointment-card">
      <div className="appointment-header">
        <span className={`badge ${STATUS_COLORS[status]}`}>{status}</span>
        <span className="appointment-date">{formattedDate} at {appointmentTime}</span>
      </div>

      <div className="appointment-body">
        {patientId && (
          <p><strong>Patient:</strong> {patientId.name} ({patientId.email})</p>
        )}
        {doctorId && (
          <p><strong>Doctor:</strong> {doctorId.name} — {doctorId.specialization}</p>
        )}
        <p><strong>Reason:</strong> {reason}</p>
      </div>

      {/* Doctor can update status */}
      {userRole === 'doctor' && status !== 'Completed' && status !== 'Cancelled' && (
        <div className="appointment-actions">
          {status === 'Pending' && (
            <button
              className="btn btn-success"
              onClick={() => onUpdateStatus(appointment._id, 'Confirmed')}
            >
              Confirm
            </button>
          )}
          {status === 'Confirmed' && (
            <button
              className="btn btn-primary"
              onClick={() => onUpdateStatus(appointment._id, 'Completed')}
            >
              Mark Complete
            </button>
          )}
          <button
            className="btn btn-danger"
            onClick={() => onUpdateStatus(appointment._id, 'Cancelled')}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Patient can cancel pending appointments */}
      {userRole === 'patient' && status === 'Pending' && (
        <div className="appointment-actions">
          <button className="btn btn-danger" onClick={() => onDelete(appointment._id)}>
            Cancel Appointment
          </button>
        </div>
      )}

      {/* Admin can delete */}
      {userRole === 'admin' && (
        <div className="appointment-actions">
          <button className="btn btn-danger" onClick={() => onDelete(appointment._id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
