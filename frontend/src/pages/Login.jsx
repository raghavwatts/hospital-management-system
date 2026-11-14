import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return setError('Please fill in all fields');

    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-wrap">🔐</div>
          <h2>Welcome back</h2>
          <p>Sign in to your MediCare account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-hints">
          <p className="demo-title">Demo Credentials</p>
          <p>Admin &nbsp;&nbsp;→ admin@hospital.com / Admin@123</p>
          <p style={{marginTop:'6px', fontWeight:'600', color:'var(--gray-600)'}}>Doctors (all use Doctor@123)</p>
          <p>Dr. Arjun Sharma &nbsp;→ doctor@hospital.com</p>
          <p>Dr. Priya Mehta &nbsp;&nbsp;→ priya.mehta@hospital.com</p>
          <p>Dr. Rohit Verma &nbsp;&nbsp;→ rohit.verma@hospital.com</p>
          <p>Dr. Sneha Patel &nbsp;&nbsp;→ sneha.patel@hospital.com</p>
          <p style={{marginTop:'6px'}}>Patient → patient@hospital.com / Patient@123</p>
        </div>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
