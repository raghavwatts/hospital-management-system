import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => (
  <div className="doctor-card">
    <div className="doctor-card-header">
      <div className="doctor-avatar">👨‍⚕️</div>
      <div className="doctor-card-info">
        <h3>{doctor.name}</h3>
        <p className="specialization">{doctor.specialization}</p>
      </div>
    </div>

    <div className="doctor-card-meta">
      <div className="doctor-meta-row">
        <span>🏥</span>
        <span>{doctor.department}</span>
      </div>
      <div className="doctor-meta-row">
        <span>🎓</span>
        <span>{doctor.qualification}</span>
      </div>
      <div className="doctor-meta-row">
        <span>⏱</span>
        <span>{doctor.experience} years experience</span>
      </div>
      <div className="doctor-meta-row">
        <span>💰</span>
        <span className="doctor-fee">₹{doctor.fee} consultation fee</span>
      </div>
    </div>

    <div className="doctor-card-footer">
      <span className={`badge ${doctor.availability ? 'badge-success' : 'badge-danger'}`}>
        {doctor.availability ? '● Available' : '● Unavailable'}
      </span>
      <Link to={`/doctors/${doctor._id}`} className="btn btn-primary btn-sm">
        View Profile
      </Link>
    </div>
  </div>
);

export default DoctorCard;
