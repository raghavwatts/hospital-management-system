import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { getPrescriptions } from '../services/api';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPrescriptions()
      .then((res) => setPrescriptions(res.data.data))
      .catch(() => setError('Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main"><Loading /></main></div>;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>My Prescriptions</h1>
            <p>Prescriptions issued by your doctors</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {prescriptions.length === 0 ? (
          <div className="empty-state">
            <span>💊</span>
            <p>No prescriptions yet. They will appear here after your doctor visits.</p>
          </div>
        ) : (
          <div className="prescriptions-list">
            {prescriptions.map((p) => (
              <div key={p._id} className="prescription-card">
                <div className="prescription-header">
                  <div>
                    <h3>Dr. {p.doctorId?.name}</h3>
                    <p>{p.doctorId?.specialization}</p>
                    <p className="prescription-date">
                      {p.appointmentId
                        ? `Visit: ${new Date(p.appointmentId.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                        : `Issued: ${new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                    </p>
                  </div>
                  <span className="badge badge-success">Prescription</span>
                </div>

                <div className="prescription-body">
                  <p><strong>Diagnosis:</strong> {p.diagnosis}</p>

                  <div className="medicines-section">
                    <strong>Prescribed Medicines</strong>
                    <table className="medicines-table">
                      <thead>
                        <tr><th>Medicine</th><th>Dosage</th><th>Duration</th></tr>
                      </thead>
                      <tbody>
                        {p.medicines.map((m, i) => (
                          <tr key={i}>
                            <td>{m.name}</td>
                            <td>{m.dosage}</td>
                            <td>{m.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {p.instructions && (
                    <p className="instructions">
                      <strong>⚠️ Instructions:</strong> {p.instructions}
                    </p>
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

export default PatientPrescriptions;
