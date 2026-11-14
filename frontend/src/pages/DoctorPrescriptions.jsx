import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { getPrescriptions, createPrescription, getAppointments } from '../services/api';

const emptyMed = { name: '', dosage: '', duration: '' };

const DoctorPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    patientId: '', appointmentId: '', diagnosis: '',
    medicines: [{ ...emptyMed }], instructions: '',
  });

  useEffect(() => {
    Promise.all([getPrescriptions(), getAppointments({ status: 'Confirmed' })])
      .then(([presRes, apptRes]) => {
        setPrescriptions(presRes.data.data);
        setAppointments(apptRes.data.data);
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleMedChange = (i, e) => {
    const updated = [...form.medicines];
    updated[i][e.target.name] = e.target.value;
    setForm({ ...form, medicines: updated });
  };

  const handleApptSelect = (e) => {
    const apt = appointments.find((a) => a._id === e.target.value);
    if (apt) setForm({ ...form, appointmentId: apt._id, patientId: apt.patientId._id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.appointmentId || !form.diagnosis) return setError('Please fill all required fields');
    setFormLoading(true);
    try {
      await createPrescription(form);
      setSuccess('Prescription saved successfully!');
      setShowForm(false);
      setForm({ patientId: '', appointmentId: '', diagnosis: '', medicines: [{ ...emptyMed }], instructions: '' });
      const res = await getPrescriptions();
      setPrescriptions(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save prescription');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main"><Loading /></main></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Prescriptions</h1>
            <p>Write and manage patient prescriptions</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
            {showForm ? 'Cancel' : '+ New Prescription'}
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* New Prescription Form */}
        {showForm && (
          <div className="prescription-form-card">
            <h2>Write New Prescription</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Confirmed Appointment *</label>
                <select onChange={handleApptSelect} required defaultValue="">
                  <option value="" disabled>— Select an appointment —</option>
                  {appointments.length === 0 ? (
                    <option disabled>No confirmed appointments available</option>
                  ) : appointments.map((apt) => (
                    <option key={apt._id} value={apt._id}>
                      {apt.patientId?.name} — {new Date(apt.appointmentDate).toLocaleDateString('en-IN')} at {apt.appointmentTime}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Diagnosis *</label>
                <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} rows="2" placeholder="e.g. Viral fever, common cold" required />
              </div>

              <div>
                <div className="medicines-header">
                  <h3>Medicines</h3>
                  <button type="button" className="btn btn-ghost btn-sm"
                    onClick={() => setForm({ ...form, medicines: [...form.medicines, { ...emptyMed }] })}>
                    + Add Medicine
                  </button>
                </div>
                {form.medicines.map((med, i) => (
                  <div key={i} className="medicine-row" style={{ marginBottom: '8px' }}>
                    <input placeholder="Medicine name *" name="name" value={med.name} onChange={(e) => handleMedChange(i, e)} required />
                    <input placeholder="Dosage (e.g. 1 tablet)" name="dosage" value={med.dosage} onChange={(e) => handleMedChange(i, e)} required />
                    <input placeholder="Duration (e.g. 5 days)" name="duration" value={med.duration} onChange={(e) => handleMedChange(i, e)} required />
                    {form.medicines.length > 1 && (
                      <button type="button" className="btn btn-sm btn-danger"
                        onClick={() => setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) })}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Additional Instructions</label>
                <textarea name="instructions" value={form.instructions} onChange={handleChange} rows="2" placeholder="e.g. Take after meals, avoid cold water..." />
              </div>

              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? 'Saving...' : 'Save Prescription'}
              </button>
            </form>
          </div>
        )}

        {/* Prescription List */}
        {prescriptions.length === 0 ? (
          <div className="empty-state"><span>💊</span><p>No prescriptions written yet.</p></div>
        ) : (
          <div className="prescriptions-list">
            {prescriptions.map((p) => (
              <div key={p._id} className="prescription-card">
                <div className="prescription-header">
                  <div>
                    <h3>{p.patientId?.name}</h3>
                    <p>{p.appointmentId
                      ? `Visit: ${new Date(p.appointmentId.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                      : `Issued: ${new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                    </p>
                  </div>
                  <span className="badge badge-success">Prescription</span>
                </div>
                <div className="prescription-body">
                  <p><strong>Diagnosis:</strong> {p.diagnosis}</p>
                  <div className="medicines-section">
                    <strong>Medicines Prescribed</strong>
                    <table className="medicines-table">
                      <thead><tr><th>Medicine</th><th>Dosage</th><th>Duration</th></tr></thead>
                      <tbody>
                        {p.medicines.map((m, i) => (
                          <tr key={i}><td>{m.name}</td><td>{m.dosage}</td><td>{m.duration}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {p.instructions && (
                    <p className="instructions"><strong>⚠️ Instructions:</strong> {p.instructions}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorPrescriptions;
