import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// AuthProvider wraps the app and provides auth state to all components
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // Current user data
  const [loading, setLoading] = useState(true); // Initial loading state

  // On app start, check if user is already logged in (token in localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function — calls API, stores token and user
  const login = async (email, password) => {
    const response = await loginUser({ email, password });
    const { data } = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Register function
  const register = async (formData) => {
    const response = await registerUser(formData);
    const { data } = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // Logout — clear token and user state
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor',
    isPatient: user?.role === 'patient',
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
