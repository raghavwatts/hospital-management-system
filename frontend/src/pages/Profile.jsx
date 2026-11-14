import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, getPatientByUserId } from '../services/api';

const ROLE_ICON = { doctor: '👨‍⚕️', admin: '🛡️', patient: '🧑' };

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const u = res.data.data.user;
        setProfile(u);
        setForm({ name: u.name, email: u.email });
        if (user.role === 'patient') {
          try {
            const patRes = await getPatientByUserId(user._id);
            setPatientProfile(patRes.data.data);
          } catch { /* patient profile may not exist yet */ }
        }
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully');
      setError('');
      setEditMode(false);
      setProfile({ ...profile, ...form });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSuccess('');
    }
  };

  if (loading) return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main"><Loading /></main>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>My Profile</h1>
            <p>View and manage your account information</p>
          </div>
          {!editMode && (
            <button className="btn btn-outline" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar-circle">
              {ROLE_ICON[user.role] || '👤'}
            </div>
            <div className="profile-header-info">
              <h2>{profile?.name}</h2>
              <p style={{ textTransform: 'capitalize' }}>{user.role} Account</p>
            </div>
          </div>

          {/* Body */}
          {editMode ? (
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="profile-form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setEditMode(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="profile-body">
              <div className="profile-details">
                {/* Account Info */}
                <div className="profile-section-title">Account Information</div>

                <div className="detail-row">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{profile?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{profile?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role</span>
                  <span className="detail-value">
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{profile?.role}</span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'N/A'}
                  </span>
                </div>

                {/* Patient-specific info */}
                {patientProfile && (
                  <>
                    <div className="profile-section-title" style={{ paddingTop: '20px' }}>Health Information</div>
                    <div className="detail-row">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{patientProfile.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Age</span>
                      <span className="detail-value">{patientProfile.age} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Gender</span>
                      <span className="detail-value">{patientProfile.gender}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Blood Group</span>
                      <span className="detail-value">
                        <span className="badge badge-danger">{patientProfile.bloodGroup}</span>
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{patientProfile.address}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
