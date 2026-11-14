import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isDoctor, isPatient } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isDoctor) return '/doctor/dashboard';
    if (isPatient) return '/patient/dashboard';
    return '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <div className="brand-icon">+</div>
          <span className="brand-name">MediCare</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/doctors">Find Doctors</Link>

        {user ? (
          <>
            <Link to={getDashboardLink()}>Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <span className="user-role-badge">{user.role}</span>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
