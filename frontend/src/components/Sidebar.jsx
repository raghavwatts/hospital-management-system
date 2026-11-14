import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/doctors', icon: '🩺', label: 'Doctors' },
  { to: '/admin/patients', icon: '👥', label: 'Patients' },
  { to: '/admin/appointments', icon: '📅', label: 'Appointments' },
];

const doctorLinks = [
  { to: '/doctor/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/doctor/appointments', icon: '📅', label: 'Appointments' },
  { to: '/doctor/prescriptions', icon: '💊', label: 'Prescriptions' },
];

const patientLinks = [
  { to: '/patient/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/patient/doctors', icon: '🩺', label: 'Find Doctors' },
  { to: '/patient/appointments', icon: '📅', label: 'My Appointments' },
  { to: '/patient/prescriptions', icon: '💊', label: 'Prescriptions' },
];

const Sidebar = () => {
  const { isAdmin, isDoctor, isPatient } = useAuth();

  const links = isAdmin ? adminLinks : isDoctor ? doctorLinks : isPatient ? patientLinks : [];

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {links.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''}>
              <span className="sidebar-icon">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
