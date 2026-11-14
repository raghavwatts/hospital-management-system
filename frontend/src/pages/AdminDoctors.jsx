import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../services/api';

const DEPARTMENTS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'General Medicine', 'Gynecology', 'Ophthalmology',
  'ENT', 'Psychiatry', 'Radiology', 'Emergency',
];

const emptyForm = {
  name: '', email: '', password: '', phone: '',
  specialization: '', qualification: '', experience: '',
  department: 'Cardiology', fee: 500, availability: true,
};

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch doctors whenever search changes
  useEffect(() => {
    fetchDoctors();
  }, [search]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const response = await getDoctors(params);
      setDoctors(response.data.data);
    } catch {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const openEditModal = (doctor) => {
    setForm({
      name: doctor.name, email: doctor.email, password: '',
      phone: doctor.phone, specialization: doctor.specialization,
      qualification: doctor.qualification, experience: doctor.experience,
      department: doctor.department, fee: doctor.fee,
      availability: doctor.availability,
    });
    setEditingId(doctor._id);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    try {
      if (editingId) {
        // UPDATE
        const updateData = { ...form };
        if (!updateData.password) delete updateData.password;
        await updateDoctor(editingId, updateData);
        setSuccess('Doctor updated successfully');
      } else {
        // CREATE
        await createDoctor(form);
        setSuccess('Doctor added successfully');
      }
      setShowModal(false);
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await deleteDoctor(id);
      setSuccess('Doctor deleted successfully');
      fetchDoctors();
    } catch {
      setError('Failed to delete doctor');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Manage Doctors</h1>
          <button className="btn btn-primary" onClick={openAddModal}>+ Add Doctor</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Search */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Fee</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No doctors found</td></tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.department}</td>
                      <td>{doctor.experience} yrs</td>
                      <td>₹{doctor.fee}</td>
                      <td>
                        <span className={`badge ${doctor.availability ? 'badge-success' : 'badge-danger'}`}>
                          {doctor.availability ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => openEditModal(doctor)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(doctor._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{editingId ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required={!editingId} />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Specialization *</label>
                    <input type="text" name="specialization" value={form.specialization} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Qualification *</label>
                    <input type="text" name="qualification" value={form.qualification} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department *</label>
                    <select name="department" value={form.department} onChange={handleChange}>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Experience (years) *</label>
                    <input type="number" name="experience" value={form.experience} onChange={handleChange} min="0" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Consultation Fee (₹)</label>
                    <input type="number" name="fee" value={form.fee} onChange={handleChange} min="0" />
                  </div>
                  <div className="form-group form-check">
                    <label>
                      <input type="checkbox" name="availability" checked={form.availability} onChange={handleChange} />
                      &nbsp; Available
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Saving...' : editingId ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDoctors;
