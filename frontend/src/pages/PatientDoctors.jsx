import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DoctorCard from '../components/DoctorCard';
import Loading from '../components/Loading';
import { getDoctors } from '../services/api';

const DEPARTMENTS = [
  'All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'General Medicine', 'Gynecology', 'Ophthalmology',
  'ENT', 'Psychiatry', 'Radiology', 'Emergency',
];

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (search) params.search = search;
        if (department && department !== 'All') params.department = department;
        if (availability !== '') params.availability = availability;
        const res = await getDoctors(params);
        setDoctors(res.data.data);
      } catch {
        setError('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(timer);
  }, [search, department, availability]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Find Doctors</h1>
            <p>Browse specialists and book an appointment</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d === 'All' ? '' : d}>{d}</option>
            ))}
          </select>
          <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="">All Availability</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <Loading message="Loading doctors..." />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            <span>🩺</span>
            <p>No doctors found matching your search.</p>
          </div>
        ) : (
          <>
            <p className="results-count">{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} found</p>
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PatientDoctors;
